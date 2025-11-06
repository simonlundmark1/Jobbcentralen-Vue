/**
 * Advanced TeamTailor Company Crawler
 * 
 * Multi-strategy approach to discover TeamTailor companies:
 * 1. Certificate Transparency logs (
 * ) - Find all *.teamtailor.com subdomains
 * 2. HTML Fingerprinting - Detect TeamTailor on custom domains
 * 3. Pattern testing - Test common career page patterns
 * 4. URL list verification - Verify provided URLs
 * 
 * Based on best practices from web scraping and discovery techniques
 */

import * as cheerio from 'cheerio'
import pLimit from 'p-limit'
import { readFileSync, writeFileSync, existsSync } from 'fs'

// Concurrency limit for requests
const limit = pLimit(10)

// TeamTailor detection markers
const ttMarkers = [
  /<meta[^>]+name=["']generator["'][^>]+content=["']Teamtailor["']/i,
  /teamtailor\.com/i,
  /static\.teamtailor\.com/i,
  /careers-page-assets\.teamtailor\.com/i,
  /window\.__TT__/i,
  /"@type":\s*"JobPosting"[^}]*teamtailor/i
]

/**
 * Fetch all TeamTailor subdomains from Certificate Transparency logs
 */
async function fetchFromCertificateTransparency() {
  console.log('\n🔍 Fetching from Certificate Transparency logs (crt.sh)...')
  
  try {
    const url = 'https://crt.sh/?q=%.teamtailor.com&output=json'
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; JobAggregator/1.0)'
      }
    })
    
    if (!response.ok) {
      console.log('❌ Failed to fetch from crt.sh:', response.status)
      return []
    }
    
    const data = await response.json()
    
    // Extract unique subdomains
    const subdomains = new Set()
    data.forEach(cert => {
      if (cert.name_value) {
        const names = cert.name_value.split('\n')
        names.forEach(name => {
          // Remove wildcard and clean up
          name = name.replace('*.', '').trim().toLowerCase()
          
          // Only include direct teamtailor.com subdomains
          if (name.endsWith('.teamtailor.com') && !name.includes('*')) {
            // Extract company name (first part before .teamtailor.com or .career.teamtailor.com)
            const parts = name.split('.')
            if (parts.length >= 3) {
              // Could be company.teamtailor.com or company.career.teamtailor.com
              const subdomain = parts[0]
              if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
                subdomains.add(name)
              }
            }
          }
        })
      }
    })
    
    const urls = Array.from(subdomains).map(domain => `https://${domain}`)
    console.log(`✅ Found ${urls.length} unique TeamTailor subdomains from CT logs`)
    
    return urls
    
  } catch (error) {
    console.log('❌ Error fetching from crt.sh:', error.message)
    return []
  }
}

/**
 * Detect TeamTailor on a given URL using HTML fingerprinting
 */
async function detectTeamtailor(url) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)
    
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; JobAggregator/1.0)'
      }
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      return { url, status: response.status, teamtailor: false }
    }
    
    const html = await response.text()
    const finalUrl = response.url
    
    // Check for TeamTailor markers
    const hasMarker = ttMarkers.some(pattern => pattern.test(html))
    
    // Check for RSS feed
    let hasRSSFeed = false
    try {
      const rssUrl = new URL('/jobs.rss', finalUrl).toString()
      const rssResponse = await fetch(rssUrl, {
        method: 'HEAD',
        signal: AbortSignal.timeout(8000),
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; JobAggregator/1.0)'
        }
      })
      hasRSSFeed = rssResponse.ok
    } catch {}
    
    // Check sitemap for TeamTailor references
    let sitemapHasTT = false
    try {
      const sitemapUrl = new URL('/sitemap.xml', finalUrl).toString()
      const sitemapResponse = await fetch(sitemapUrl, {
        signal: AbortSignal.timeout(8000),
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; JobAggregator/1.0)'
        }
      })
      if (sitemapResponse.ok) {
        const sitemapText = await sitemapResponse.text()
        sitemapHasTT = /teamtailor/i.test(sitemapText)
      }
    } catch {}
    
    // Extract company name from HTML
    let companyName = ''
    try {
      const $ = cheerio.load(html)
      companyName = $('meta[property="og:site_name"]').attr('content') || 
                    $('title').text().split('-')[0].trim() ||
                    new URL(finalUrl).hostname.split('.')[0]
    } catch {}
    
    const isTeamtailor = hasMarker || hasRSSFeed || sitemapHasTT
    
    return {
      url,
      finalUrl,
      status: response.status,
      teamtailor: isTeamtailor,
      hasRSSFeed,
      companyName,
      detectionMethod: hasMarker ? 'html-marker' : hasRSSFeed ? 'rss-feed' : sitemapHasTT ? 'sitemap' : 'none'
    }
    
  } catch (error) {
    return {
      url,
      error: error.message,
      teamtailor: false
    }
  }
}

/**
 * Test common career page patterns for a domain
 */
function generateCandidateURLs(domain) {
  const patterns = [
    `https://${domain}`,
    `https://careers.${domain}`,
    `https://jobs.${domain}`,
    `https://career.${domain}`,
    `https://work.${domain}`,
    `https://join.${domain}`,
    `https://jobb.${domain}`, // Swedish
  ]
  
  // Also try company name as subdomain on teamtailor
  const companySlug = domain.split('.')[0].toLowerCase()
  patterns.push(`https://${companySlug}.teamtailor.com`)
  patterns.push(`https://${companySlug}.career.teamtailor.com`)
  
  return patterns
}

/**
 * Process a list of domains/URLs
 */
async function processURLList(urls) {
  console.log(`\n🔍 Processing ${urls.length} URLs...`)
  
  const results = await Promise.all(
    urls.map(url => limit(() => detectTeamtailor(url)))
  )
  
  return results.filter(r => r.teamtailor)
}

/**
 * Load URLs from urls.txt file
 */
function loadURLsFromFile(filepath = 'scripts/urls.txt') {
  if (!existsSync(filepath)) {
    console.log(`ℹ️  No ${filepath} found, skipping manual URL list`)
    return []
  }
  
  const content = readFileSync(filepath, 'utf8')
  const urls = content
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
  
  console.log(`📄 Loaded ${urls.length} URLs from ${filepath}`)
  return urls
}

/**
 * Expand domains to candidate URLs
 */
function expandDomainsToURLs(domains) {
  const allUrls = []
  
  for (const domain of domains) {
    // If it's already a full URL, add it directly
    if (domain.startsWith('http')) {
      allUrls.push(domain)
    } else {
      // Generate multiple patterns
      allUrls.push(...generateCandidateURLs(domain))
    }
  }
  
  return [...new Set(allUrls)] // Deduplicate
}

/**
 * Main crawler function
 */
async function crawl() {
  console.log('🚀 Advanced TeamTailor Crawler Starting...\n')
  console.log('═══════════════════════════════════════════\n')
  
  const allDiscovered = []
  
  // Strategy 1: Certificate Transparency Logs
  console.log('📋 STRATEGY 1: Certificate Transparency Logs')
  console.log('─────────────────────────────────────────────')
  const ctUrls = await fetchFromCertificateTransparency()
  
  if (ctUrls.length > 0) {
    console.log(`\n🔍 Verifying ${ctUrls.length} URLs from CT logs...`)
    const ctResults = await processURLList(ctUrls)
    allDiscovered.push(...ctResults)
    console.log(`✅ Found ${ctResults.length} valid TeamTailor sites from CT logs`)
  }
  
  // Strategy 2: Manual URL List
  console.log('\n\n📋 STRATEGY 2: Manual URL List')
  console.log('─────────────────────────────────────────────')
  const manualUrls = loadURLsFromFile('scripts/urls.txt')
  
  if (manualUrls.length > 0) {
    const expandedUrls = expandDomainsToURLs(manualUrls)
    console.log(`🔍 Testing ${expandedUrls.length} candidate URLs...`)
    const manualResults = await processURLList(expandedUrls)
    
    // Merge without duplicates
    const existingUrls = new Set(allDiscovered.map(r => r.finalUrl || r.url))
    const newResults = manualResults.filter(r => !existingUrls.has(r.finalUrl || r.url))
    
    allDiscovered.push(...newResults)
    console.log(`✅ Found ${newResults.length} new TeamTailor sites from manual list`)
  }
  
  // Save results
  console.log('\n\n═══════════════════════════════════════════')
  console.log('📊 RESULTS SUMMARY')
  console.log('═══════════════════════════════════════════\n')
  
  console.log(`✅ Total TeamTailor sites discovered: ${allDiscovered.length}\n`)
  
  // Prepare output
  const companies = allDiscovered.map(result => ({
    name: result.companyName || new URL(result.finalUrl || result.url).hostname.split('.')[0],
    careerSiteUrl: result.finalUrl || result.url,
    rssUrl: `${result.finalUrl || result.url}/jobs.rss`.replace(/\/+/g, '/').replace(':/', '://'),
    enabled: true,
    detectionMethod: result.detectionMethod,
    discoveredAt: new Date().toISOString()
  }))
  
  // Save to JSON file
  const output = {
    discoveredAt: new Date().toISOString(),
    count: companies.length,
    companies: companies
  }
  
  const outputFile = 'discovered-teamtailor-companies-advanced.json'
  writeFileSync(outputFile, JSON.stringify(output, null, 2))
  console.log(`💾 Saved to: ${outputFile}\n`)
  
  // Also save as simple list
  const listOutput = companies.map(c => c.careerSiteUrl).join('\n')
  writeFileSync('teamtailor_list.txt', listOutput)
  console.log(`💾 Saved URL list to: teamtailor_list.txt\n`)
  
  // Print copy-paste ready format
  console.log('─────────────────────────────────────────────')
  console.log('📋 Copy-paste for teamtailorCompanies.ts:\n')
  console.log('─────────────────────────────────────────────\n')
  
  companies.forEach(company => {
    console.log(`  {
    name: '${company.name}',
    careerSiteUrl: '${company.careerSiteUrl}',
    enabled: true
  },`)
  })
  
  console.log('\n═══════════════════════════════════════════')
  console.log('✨ Crawler finished successfully!')
  console.log('═══════════════════════════════════════════\n')
  
  // Summary statistics
  const byMethod = companies.reduce((acc, c) => {
    acc[c.detectionMethod] = (acc[c.detectionMethod] || 0) + 1
    return acc
  }, {})
  
  console.log('📈 Detection Methods:')
  Object.entries(byMethod).forEach(([method, count]) => {
    console.log(`   ${method}: ${count}`)
  })
  
  return companies
}

// Run the crawler
crawl().catch(error => {
  console.error('❌ Crawler failed:', error)
  process.exit(1)
})
