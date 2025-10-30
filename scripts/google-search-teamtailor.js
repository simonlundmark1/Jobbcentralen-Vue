/**
 * Google Custom Search - TeamTailor Discovery
 * 
 * Uses Google Custom Search API to find TeamTailor sites
 * 
 * Setup:
 * 1. Get API key: https://developers.google.com/custom-search/v1/overview
 * 2. Create Search Engine: https://programmablesearchengine.google.com/
 * 3. Set environment variables:
 *    - GOOGLE_API_KEY
 *    - GOOGLE_SEARCH_ENGINE_ID
 * 
 * Usage:
 *   node scripts/google-search-teamtailor.js
 * 
 * Note: Free tier = 100 searches/day
 */

import { writeFileSync, appendFileSync } from 'fs'

// Check for required env vars
const API_KEY = process.env.GOOGLE_API_KEY
const SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID

if (!API_KEY || !SEARCH_ENGINE_ID) {
  console.error('❌ Missing required environment variables!')
  console.error('')
  console.error('Please set:')
  console.error('  GOOGLE_API_KEY=your_api_key')
  console.error('  GOOGLE_SEARCH_ENGINE_ID=your_engine_id')
  console.error('')
  console.error('Get them from:')
  console.error('  API Key: https://developers.google.com/custom-search/v1/overview')
  console.error('  Search Engine: https://programmablesearchengine.google.com/')
  process.exit(1)
}

// Search queries to try (Google-dorks)
const searchQueries = [
  // Direct TeamTailor subdomains
  'site:*.teamtailor.com -www.teamtailor.com sweden',
  'site:*.teamtailor.com -www.teamtailor.com sverige',
  
  // Powered by Teamtailor
  '"Powered by Teamtailor" -site:teamtailor.com sweden',
  '"Powered by Teamtailor" -site:teamtailor.com sverige',
  
  // Career pages with Teamtailor
  'inurl:careers Teamtailor sweden',
  'inurl:career Teamtailor sweden',
  'inurl:jobs Teamtailor sweden',
  'inurl:jobb Teamtailor sweden',
  
  // Swedish domain patterns
  'site:careers.*.se "Teamtailor"',
  'site:career.*.se "Teamtailor"',
  'site:jobs.*.se "Teamtailor"',
  'site:jobb.*.se "Teamtailor"',
  
  // Generic Swedish sites
  'site:*.se "Teamtailor" (jobs OR career OR careers OR jobb)',
  
  // RSS feeds
  'inurl:jobs.rss teamtailor',
  'site:*.teamtailor.com/jobs.rss',
]

/**
 * Perform a Google Custom Search
 */
async function googleSearch(query, startIndex = 1) {
  const url = new URL('https://www.googleapis.com/customsearch/v1')
  url.searchParams.set('key', API_KEY)
  url.searchParams.set('cx', SEARCH_ENGINE_ID)
  url.searchParams.set('q', query)
  url.searchParams.set('start', startIndex.toString())
  url.searchParams.set('num', '10') // Max 10 results per request
  
  try {
    const response = await fetch(url.toString())
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(`API Error: ${error.error?.message || response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error(`❌ Search failed for "${query}":`, error.message)
    return null
  }
}

/**
 * Extract URLs from search results
 */
function extractURLs(searchResults) {
  if (!searchResults || !searchResults.items) {
    return []
  }
  
  return searchResults.items.map(item => item.link)
}

/**
 * Main search function
 */
async function searchTeamtailorSites() {
  console.log('🔍 Google Custom Search - TeamTailor Discovery')
  console.log('═══════════════════════════════════════════\n')
  
  const allUrls = new Set()
  let searchCount = 0
  const maxSearches = 50 // Stay well under 100/day limit
  
  for (const query of searchQueries) {
    if (searchCount >= maxSearches) {
      console.log(`\n⚠️  Reached search limit (${maxSearches}), stopping`)
      break
    }
    
    console.log(`\n🔍 Searching: "${query}"`)
    
    // Get first page (10 results)
    const results = await googleSearch(query, 1)
    searchCount++
    
    if (results && results.items) {
      const urls = extractURLs(results)
      urls.forEach(url => allUrls.add(url))
      console.log(`   Found ${urls.length} results`)
      
      // If there are more results, get second page
      if (results.searchInformation?.totalResults > 10 && searchCount < maxSearches) {
        await new Promise(resolve => setTimeout(resolve, 1000)) // Rate limit
        
        const moreResults = await googleSearch(query, 11)
        searchCount++
        
        if (moreResults && moreResults.items) {
          const moreUrls = extractURLs(moreResults)
          moreUrls.forEach(url => allUrls.add(url))
          console.log(`   Found ${moreUrls.length} more results`)
        }
      }
    } else {
      console.log('   No results')
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('\n═══════════════════════════════════════════')
  console.log('📊 SEARCH COMPLETE')
  console.log('═══════════════════════════════════════════\n')
  
  console.log(`✅ Total unique URLs found: ${allUrls.size}`)
  console.log(`📊 Searches performed: ${searchCount}/${maxSearches}`)
  
  // Save results
  const urlList = Array.from(allUrls)
  
  // Save as JSON
  const output = {
    searchedAt: new Date().toISOString(),
    searchCount: searchCount,
    totalUrls: urlList.length,
    urls: urlList,
    queries: searchQueries.slice(0, searchCount)
  }
  
  writeFileSync('google-search-results.json', JSON.stringify(output, null, 2))
  console.log('\n💾 Saved to: google-search-results.json')
  
  // Append to urls.txt for further processing
  if (urlList.length > 0) {
    const timestamp = new Date().toISOString()
    appendFileSync('scripts/urls.txt', `\n\n# === GOOGLE SEARCH RESULTS (${timestamp}) ===\n`)
    urlList.forEach(url => {
      appendFileSync('scripts/urls.txt', `${url}\n`)
    })
    console.log('💾 Appended to: scripts/urls.txt')
  }
  
  console.log('\n📝 Next steps:')
  console.log('   1. Review google-search-results.json')
  console.log('   2. Run: node scripts/advanced-teamtailor-crawler.js')
  console.log('   3. Verify the discovered companies\n')
  
  return urlList
}

// Run if executed directly
if (typeof process !== 'undefined') {
  searchTeamtailorSites().catch(error => {
    console.error('❌ Search failed:', error)
    process.exit(1)
  })
}

export { searchTeamtailorSites, googleSearch }
