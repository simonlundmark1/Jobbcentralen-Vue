/**
 * Search Engine Discovery - NO API KEY REQUIRED
 * 
 * Uses DuckDuckGo HTML scraping to run Google-dork style queries
 * DuckDuckGo doesn't block bots as aggressively as Google
 * 100% FREE and NO SETUP
 */

import * as cheerio from 'cheerio'
import pLimit from 'p-limit'
import { writeFileSync, appendFileSync, existsSync } from 'fs'

const limit = pLimit(3) // Lower limit to avoid rate limiting

/**
 * Search queries to run (Google-dork style)
 */
const searchQueries = [
  'site:*.teamtailor.com -www.teamtailor.com',
  '"Powered by Teamtailor" -site:teamtailor.com',
  'inurl:careers Teamtailor',
  'inurl:career Teamtailor',
  'inurl:jobs Teamtailor',
  'site:career.* "Teamtailor"',
  'site:jobb.* "Teamtailor"',
  'site:*.se "Teamtailor" jobs',
  'site:*.se "Teamtailor" career',
  'site:*.se "Teamtailor" careers',
  'teamtailor sweden',
  'teamtailor sverige',
  'teamtailor stockholm',
  'teamtailor göteborg',
  'teamtailor malmö'
]

/**
 * Search DuckDuckGo with HTML scraping
 */
async function searchDuckDuckGo(query) {
  try {
    // DuckDuckGo HTML search
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://duckduckgo.com/'
      }
    })
    
    if (!response.ok) {
      console.log(`  ⚠️  DuckDuckGo returned: ${response.status}`)
      return []
    }
    
    const html = await response.text()
    const $ = cheerio.load(html)
    
    // Extract URLs from search results
    const urls = []
    $('.result__url').each((i, elem) => {
      const url = $(elem).text().trim()
      if (url && (url.includes('teamtailor') || url.includes('career') || url.includes('job'))) {
        // Construct full URL
        let fullUrl = url
        if (!fullUrl.startsWith('http')) {
          fullUrl = 'https://' + fullUrl.replace(/^\/\//, '')
        }
        urls.push(fullUrl)
      }
    })
    
    // Also check links
    $('.result__a').each((i, elem) => {
      const href = $(elem).attr('href')
      if (href && href.includes('uddg=')) {
        // DuckDuckGo redirect URL - extract real URL
        try {
          const realUrl = decodeURIComponent(href.split('uddg=')[1].split('&')[0])
          if (realUrl.includes('teamtailor') || realUrl.includes('career') || realUrl.includes('job')) {
            urls.push(realUrl)
          }
        } catch {}
      }
    })
    
    return [...new Set(urls)] // Deduplicate
    
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`)
    return []
  }
}

/**
 * Alternative: Use Bing (also allows scraping)
 */
async function searchBing(query) {
  try {
    const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}&count=50`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    })
    
    if (!response.ok) return []
    
    const html = await response.text()
    const $ = cheerio.load(html)
    
    const urls = []
    
    // Bing result links
    $('li.b_algo h2 a, cite').each((i, elem) => {
      let url = $(elem).attr('href') || $(elem).text()
      if (url) {
        if (!url.startsWith('http')) {
          url = 'https://' + url.replace(/^\/\//, '')
        }
        if (url.includes('teamtailor') || url.includes('career') || url.includes('job')) {
          urls.push(url)
        }
      }
    })
    
    return [...new Set(urls)]
    
  } catch (error) {
    console.log(`  ❌ Bing error: ${error.message}`)
    return []
  }
}

/**
 * Try both search engines and combine results
 */
async function searchBoth(query) {
  console.log(`\n🔍 Searching: "${query}"`)
  
  const results = []
  
  // Try DuckDuckGo first
  const ddgResults = await searchDuckDuckGo(query)
  results.push(...ddgResults)
  console.log(`   DuckDuckGo: ${ddgResults.length} results`)
  
  // Wait to avoid rate limiting
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Try Bing
  const bingResults = await searchBing(query)
  results.push(...bingResults)
  console.log(`   Bing: ${bingResults.length} results`)
  
  // Deduplicate
  const unique = [...new Set(results)]
  console.log(`   ✅ Total unique: ${unique.length}`)
  
  return unique
}

/**
 * Verify if URL has TeamTailor
 */
async function verifyTeamTailor(url) {
  try {
    // Clean up URL
    url = url.split('?')[0].split('#')[0].trim()
    if (!url.startsWith('http')) return null
    
    const response = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(10000),
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    
    if (!response.ok) return null
    
    // Check for RSS feed
    const rssUrl = new URL(response.url).origin + '/jobs.rss'
    const rssCheck = await fetch(rssUrl, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }).catch(() => null)
    
    if (!rssCheck || !rssCheck.ok) return null
    
    // Extract company name
    const html = await response.text()
    const $ = cheerio.load(html)
    const name = $('meta[property="og:site_name"]').attr('content') || 
                 $('title').text().split('-')[0].trim() ||
                 new URL(response.url).hostname.split('.')[0]
    
    return {
      name,
      careerSiteUrl: response.url,
      enabled: true
    }
    
  } catch {
    return null
  }
}

/**
 * Main function
 */
async function discover() {
  console.log('🚀 Search Engine Discovery - NO API KEYS!')
  console.log('═══════════════════════════════════════════\n')
  console.log('Using DuckDuckGo + Bing HTML scraping\n')
  console.log('Running Google-dork style queries...\n')
  
  const allUrls = new Set()
  
  // Run all search queries
  for (const query of searchQueries) {
    const urls = await limit(() => searchBoth(query))
    urls.forEach(url => allUrls.add(url))
    
    // Rate limiting between queries
    await new Promise(resolve => setTimeout(resolve, 3000))
  }
  
  console.log('\n═══════════════════════════════════════════')
  console.log(`📊 Total URLs found: ${allUrls.size}`)
  console.log('═══════════════════════════════════════════\n')
  
  // Save all URLs to file for manual review
  const urlList = Array.from(allUrls)
  writeFileSync('search-engine-urls.txt', urlList.join('\n'))
  console.log('💾 Saved URLs to: search-engine-urls.txt\n')
  
  // Verify TeamTailor (this might take a while)
  console.log('🔍 Verifying which URLs have TeamTailor...\n')
  
  const verified = []
  let count = 0
  
  for (const url of urlList) {
    count++
    process.stdout.write(`\r  Checking ${count}/${urlList.length}...`)
    
    const result = await limit(() => verifyTeamTailor(url))
    if (result) {
      verified.push(result)
      console.log(`\n  ✅ ${result.name}`)
    }
  }
  
  console.log('\n\n═══════════════════════════════════════════')
  console.log('✨ FINAL RESULTS')
  console.log('═══════════════════════════════════════════\n')
  
  console.log(`✅ Verified TeamTailor companies: ${verified.length}\n`)
  
  // Save results
  const output = {
    discoveredAt: new Date().toISOString(),
    method: 'Search Engine Scraping (DuckDuckGo + Bing)',
    totalUrlsFound: urlList.length,
    verifiedCompanies: verified.length,
    companies: verified
  }
  
  writeFileSync('search-engine-results.json', JSON.stringify(output, null, 2))
  console.log('💾 Saved to: search-engine-results.json\n')
  
  // Append to urls.txt for further processing
  if (verified.length > 0) {
    const timestamp = new Date().toISOString()
    appendFileSync('scripts/urls.txt', `\n\n# === SEARCH ENGINE DISCOVERIES (${timestamp}) ===\n`)
    verified.forEach(c => {
      appendFileSync('scripts/urls.txt', `${c.careerSiteUrl}\n`)
    })
    console.log('💾 Appended to: scripts/urls.txt\n')
  }
  
  // Print copy-paste format
  if (verified.length > 0) {
    console.log('─────────────────────────────────────────────')
    console.log('📋 Copy-paste for teamtailorCompanies.ts:\n')
    console.log('─────────────────────────────────────────────\n')
    
    verified.forEach(c => {
      console.log(`  {
    name: '${c.name}',
    careerSiteUrl: '${c.careerSiteUrl}',
    enabled: true
  },`)
    })
  }
  
  console.log('\n═══════════════════════════════════════════')
  console.log('✨ Discovery Complete!')
  console.log('═══════════════════════════════════════════\n')
  
  console.log('📝 Next steps:')
  console.log('   1. Review search-engine-results.json')
  console.log('   2. Run: node scripts/free-teamtailor-discovery.js')
  console.log('   3. Add new companies to teamtailorCompanies.ts\n')
  
  return verified
}

// Run
discover().catch(console.error)
