/**
 * Google Custom Search för att hitta TeamTailor-företag
 * 
 * Setup:
 * 1. Skapa Google Custom Search Engine: https://programmablesearchengine.google.com/
 * 2. Få API key: https://console.cloud.google.com/apis/credentials
 * 3. Sätt environment variables:
 *    - GOOGLE_API_KEY
 *    - GOOGLE_SEARCH_ENGINE_ID
 */

import fetch from 'node-fetch'

const API_KEY = process.env.GOOGLE_API_KEY
const SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID

const SEARCH_QUERIES = [
  // Söka efter TeamTailor subdomains
  'site:teamtailor.com sweden',
  'site:teamtailor.com stockholm',
  'site:teamtailor.com göteborg',
  
  // Söka efter karriärsidor med TeamTailor
  'inurl:jobs.rss sweden teamtailor',
  'inurl:careers sweden teamtailor',
  '"powered by teamtailor" sweden',
  
  // Söka efter specifika branscher
  'teamtailor fintech sweden',
  'teamtailor healthtech sweden',
  'teamtailor greentech sweden',
]

async function googleSearch(query, startIndex = 1) {
  if (!API_KEY || !SEARCH_ENGINE_ID) {
    console.log('⚠️  Google API credentials missing!')
    console.log('Set GOOGLE_API_KEY and GOOGLE_SEARCH_ENGINE_ID')
    return []
  }
  
  const url = `https://www.googleapis.com/customsearch/v1?` +
    `key=${API_KEY}&` +
    `cx=${SEARCH_ENGINE_ID}&` +
    `q=${encodeURIComponent(query)}&` +
    `start=${startIndex}&` +
    `num=10`
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.error) {
      console.error('Google API Error:', data.error.message)
      return []
    }
    
    return data.items || []
  } catch (error) {
    console.error('Search error:', error.message)
    return []
  }
}

async function extractTeamTailorCompanies() {
  console.log('🔍 Searching Google for TeamTailor companies...\n')
  
  const allResults = []
  const companies = new Set()
  
  for (const query of SEARCH_QUERIES) {
    console.log(`📝 Query: "${query}"`)
    
    const results = await googleSearch(query)
    
    for (const result of results) {
      const url = result.link
      
      // Extract company from TeamTailor subdomain
      const teamtailorMatch = url.match(/https?:\/\/([^.]+)\.(?:career\.)?teamtailor\.com/)
      if (teamtailorMatch) {
        const slug = teamtailorMatch[1]
        companies.add({
          slug,
          url: `https://${slug}.teamtailor.com`,
          title: result.title,
          source: 'teamtailor-subdomain'
        })
        console.log(`  ✅ Found: ${slug}.teamtailor.com`)
      }
      
      // Extract from custom domains
      if (url.includes('/jobs.rss') || url.includes('/careers') || url.includes('/jobs')) {
        const domain = new URL(url).hostname
        companies.add({
          domain,
          url: url.replace(/\/jobs.*$/, ''),
          title: result.title,
          source: 'custom-domain'
        })
        console.log(`  ✅ Found: ${domain}`)
      }
    }
    
    // Respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log(`\n✅ Found ${companies.size} unique companies`)
  
  return Array.from(companies)
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  extractTeamTailorCompanies()
    .then(companies => {
      console.log('\n📋 Results:')
      companies.forEach(c => console.log(`  - ${c.slug || c.domain}: ${c.url}`))
    })
    .catch(console.error)
}

export { extractTeamTailorCompanies, googleSearch }
