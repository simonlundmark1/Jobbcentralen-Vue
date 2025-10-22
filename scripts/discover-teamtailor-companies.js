/**
 * Script to discover companies using TeamTailor
 * 
 * TeamTailor companies can use either:
 * 1. Subdomain on TeamTailor: company.career.teamtailor.com
 * 2. Custom domain: careers.company.com, jobs.company.se, etc.
 * 
 * This script tests both patterns for known Swedish tech companies
 */

const knownSwedishCompanies = [
  // Format: { name: 'Company Name', domain: 'company.se', subdomains: ['COMPANY_SLUG'] }
  { name: 'Epidemic Sound', domain: 'epidemicsound.com', subdomains: ['epidemicsound', 'epidemic-sound'] },
  { name: 'Mentimeter', domain: 'mentimeter.com', subdomains: ['mentimeter'] },
  { name: 'Truecaller', domain: 'truecaller.com', subdomains: ['truecaller'] },
  { name: 'Funnel', domain: 'funnel.io', subdomains: ['funnel', 'funnelio'] },
  { name: 'Kry', domain: 'kry.se', subdomains: ['kry'] },
  { name: 'Budbee', domain: 'budbee.com', subdomains: ['budbee'] },
  { name: 'Karma', domain: 'karma.life', subdomains: ['karma'] },
  { name: 'Mathem', domain: 'mathem.se', subdomains: ['mathem'] },
  { name: 'Fishbrain', domain: 'fishbrain.com', subdomains: ['fishbrain'] },
  { name: 'BookBeat', domain: 'bookbeat.com', subdomains: ['bookbeat'] },
  { name: 'Happy Socks', domain: 'happysocks.com', subdomains: ['happysocks', 'happy-socks'] },
  { name: 'NA-KD', domain: 'nakd.com', subdomains: ['nakd', 'na-kd'] },
  { name: 'Bazooka', domain: 'bazooka.se', subdomains: ['bazooka'] },
  { name: 'Northvolt', domain: 'northvolt.com', subdomains: ['northvolt'] },
  { name: 'Soundtrack Your Brand', domain: 'soundtrackyourbrand.com', subdomains: ['soundtrackyourbrand'] },
]

const careerSubdomains = ['careers', 'jobs', 'career', 'work', 'join']

async function testURL(url) {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; JobAggregator/1.0)'
      }
    })
    return response.ok
  } catch (error) {
    return false
  }
}

async function testRSSFeed(baseUrl) {
  try {
    const response = await fetch(`${baseUrl}/jobs.rss`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; JobAggregator/1.0)'
      }
    })
    if (!response.ok) return false
    
    const text = await response.text()
    // Check if it's a TeamTailor feed by looking for their namespace
    return text.includes('xmlns:tt="https://teamtailor.com') || text.includes('teamtailor')
  } catch (error) {
    return false
  }
}

async function discoverCompany(company) {
  const results = []
  
  // Test pattern 1: company.career.teamtailor.com
  for (const slug of company.subdomains) {
    const url = `https://${slug}.career.teamtailor.com`
    if (await testRSSFeed(url)) {
      results.push({
        name: company.name,
        url,
        type: 'teamtailor-subdomain'
      })
      console.log(`✓ Found: ${company.name} at ${url}`)
    }
  }
  
  // Test pattern 2: careers.company.com
  for (const subdomain of careerSubdomains) {
    const url = `https://${subdomain}.${company.domain}`
    if (await testRSSFeed(url)) {
      results.push({
        name: company.name,
        url,
        type: 'custom-domain'
      })
      console.log(`✓ Found: ${company.name} at ${url}`)
    }
  }
  
  return results
}

async function main() {
  console.log('🔍 Discovering TeamTailor companies...\n')
  
  const allResults = []
  
  for (const company of knownSwedishCompanies) {
    console.log(`Testing ${company.name}...`)
    const results = await discoverCompany(company)
    allResults.push(...results)
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  console.log(`\n\n✅ Discovery complete! Found ${allResults.length} companies:\n`)
  console.log(JSON.stringify(allResults, null, 2))
  
  console.log('\n\n📝 Add these to server/utils/teamtailorCompanies.ts:')
  allResults.forEach(result => {
    console.log(`  {
    name: '${result.name}',
    careerSiteUrl: '${result.url}',
    enabled: true
  },`)
  })
}

// Run if executed directly
if (typeof window === 'undefined') {
  main().catch(console.error)
}

export { discoverCompany, testRSSFeed }
