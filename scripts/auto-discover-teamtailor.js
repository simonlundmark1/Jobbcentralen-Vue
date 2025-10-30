/**
 * AUTO-DISCOVERY: Hitta TeamTailor-företag automatiskt
 * 
 * Strategier:
 * 1. Crawla välkända företagslistor (LinkedIn, Allabolag, etc.)
 * 2. Testa vanliga patterns för karriärsidor
 * 3. Google Custom Search API
 * 4. RSS feed pattern matching
 */

import fetch from 'node-fetch'
import * as fs from 'fs'

// ===== KÄLLOR FÖR FÖRETAGSNAMN =====

const SWEDISH_TECH_SOURCES = {
  // Från Stockholm Tech Meetup, Nordic Startup School, etc.
  startupLists: [
    'https://raw.githubusercontent.com/johanbrook/swedish-startups/master/startups.json',
  ],
  
  // DI Digital, Breakit, etc. companies
  manualSeed: [
    'Spotify', 'Klarna', 'Voi', 'Tink', 'Einride', 'Northvolt', 'Truecaller',
    'Axel Johnson', 'ICA', 'Coop', 'Systembolaget', 'Vattenfall', 'Telia',
    'PostNord', 'SEB', 'Handelsbanken', 'Swedbank', 'Nordea', 'H&M', 'IKEA'
  ]
}

// ===== TEAMTAILOR PATTERNS =====

const PATTERNS = {
  // RSS feed patterns
  rssFeedPatterns: [
    'https://{domain}/jobs.rss',
    'https://careers.{domain}/jobs.rss',
    'https://jobs.{domain}/jobs.rss',
    'https://career.{domain}/jobs.rss',
    'https://work.{domain}/jobs.rss',
    'https://join.{domain}/jobs.rss',
    'https://{slug}.teamtailor.com/jobs.rss',
    'https://{slug}.career.teamtailor.com/jobs.rss',
  ],
  
  // Career page patterns (non-RSS)
  careerPagePatterns: [
    'https://{domain}/jobs',
    'https://{domain}/karriar',
    'https://{domain}/career',
    'https://careers.{domain}',
    'https://jobs.{domain}',
  ]
}

// ===== HELPER FUNCTIONS =====

async function testURL(url, timeout = 5000) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    const response = await fetch(url, {
      method: 'HEAD',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; JobbcentralenBot/1.0)' },
      signal: controller.signal,
      redirect: 'follow'
    })
    
    clearTimeout(timeoutId)
    return { success: response.ok, status: response.status, url: response.url }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function testRSSFeed(url) {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; JobbcentralenBot/1.0)' }
    })
    
    if (!response.ok) return false
    
    const text = await response.text()
    
    // Check if it's a valid RSS feed with TeamTailor signature
    const isRSS = text.includes('<rss') || text.includes('<feed')
    const isTeamTailor = text.includes('teamtailor') || text.includes('Teamtailor')
    
    return isRSS && (isTeamTailor || text.includes('<item>'))
  } catch (error) {
    return false
  }
}

// ===== DISCOVERY STRATEGIES =====

async function discoverFromCompanyList(companies) {
  console.log(`\n🔍 Testing ${companies.length} companies...`)
  const results = []
  
  for (const company of companies) {
    const domain = company.domain || `${company.name.toLowerCase().replace(/\s+/g, '')}.se`
    const slug = company.slug || company.name.toLowerCase().replace(/\s+/g, '-')
    
    console.log(`\nTesting: ${company.name}`)
    
    // Test all RSS patterns
    for (const pattern of PATTERNS.rssFeedPatterns) {
      const url = pattern
        .replace('{domain}', domain)
        .replace('{slug}', slug)
      
      const isValid = await testRSSFeed(url)
      
      if (isValid) {
        console.log(`  ✅ Found RSS: ${url}`)
        results.push({
          name: company.name,
          careerSiteUrl: url.replace('/jobs.rss', ''),
          rssUrl: url,
          enabled: true
        })
        break // Found one, skip rest
      }
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  return results
}

async function googleSearch(query) {
  // TODO: Implement Google Custom Search API
  // Requires API key: https://developers.google.com/custom-search/v1/overview
  console.log(`\n🔍 Google search: "${query}"`)
  console.log('⚠️  Google API not implemented yet')
  return []
}

// ===== MAIN DISCOVERY FUNCTION =====

async function autoDiscover() {
  console.log('🚀 Starting TeamTailor Auto-Discovery...\n')
  
  const allDiscovered = []
  
  // Strategy 1: Test manual seed list
  console.log('📋 Strategy 1: Manual seed companies')
  const manualResults = await discoverFromCompanyList(
    SWEDISH_TECH_SOURCES.manualSeed.map(name => ({ name }))
  )
  allDiscovered.push(...manualResults)
  
  // Strategy 2: Fetch from GitHub lists
  console.log('\n📋 Strategy 2: Fetching from GitHub startup lists')
  try {
    const response = await fetch(SWEDISH_TECH_SOURCES.startupLists[0])
    if (response.ok) {
      const startups = await response.json()
      const results = await discoverFromCompanyList(startups)
      allDiscovered.push(...results)
    }
  } catch (error) {
    console.log('  ⚠️  Could not fetch GitHub list:', error.message)
  }
  
  // Strategy 3: Google search for "teamtailor" + "Sweden"
  // const googleResults = await googleSearch('site:teamtailor.com sweden jobs')
  // allDiscovered.push(...googleResults)
  
  // Remove duplicates
  const unique = []
  const seen = new Set()
  
  for (const item of allDiscovered) {
    if (!seen.has(item.careerSiteUrl)) {
      seen.add(item.careerSiteUrl)
      unique.push(item)
    }
  }
  
  // Sort by name
  unique.sort((a, b) => a.name.localeCompare(b.name))
  
  // Save results
  console.log(`\n✅ Discovered ${unique.length} new TeamTailor companies!`)
  
  const output = {
    discoveredAt: new Date().toISOString(),
    count: unique.length,
    companies: unique
  }
  
  fs.writeFileSync(
    'discovered-teamtailor-companies.json',
    JSON.stringify(output, null, 2)
  )
  
  console.log('\n📁 Saved to: discovered-teamtailor-companies.json')
  console.log('\n📋 Add these to server/utils/teamtailorCompanies.ts:')
  console.log('─'.repeat(60))
  
  unique.forEach(company => {
    console.log(`  {`)
    console.log(`    name: '${company.name}',`)
    console.log(`    careerSiteUrl: '${company.careerSiteUrl}',`)
    console.log(`    enabled: true`)
    console.log(`  },`)
  })
  
  return unique
}

// ===== RUN =====

autoDiscover().catch(console.error)
