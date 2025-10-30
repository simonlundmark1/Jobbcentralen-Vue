/**
 * FREE TeamTailor Discovery - NO API KEYS REQUIRED
 * 
 * Uses 100% free sources:
 * 1. Certificate Transparency logs (crt.sh) - All *.teamtailor.com subdomains
 * 2. Swedish company databases - Scrape from public lists
 * 3. Pattern testing - Test common Swedish companies
 * 4. GitHub lists - Public Swedish startup lists
 */

import * as cheerio from 'cheerio'
import pLimit from 'p-limit'
import { writeFileSync } from 'fs'

const limit = pLimit(10)

// TeamTailor detection markers
const ttMarkers = [
  /<meta[^>]+name=["']generator["'][^>]+content=["']Teamtailor["']/i,
  /teamtailor\.com/i,
  /static\.teamtailor.com/i,
  /careers-page-assets\.teamtailor\.com/i,
  /window\.__TT__/i
]

/**
 * Strategy 1: Certificate Transparency Logs
 * Fetch ALL *.teamtailor.com subdomains
 */
async function fetchCertificateTransparency() {
  console.log('📋 STRATEGY 1: Certificate Transparency Logs')
  console.log('─────────────────────────────────────────────\n')
  
  try {
    console.log('🔍 Fetching from crt.sh...')
    
    const response = await fetch('https://crt.sh/?q=%.teamtailor.com&output=json', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    
    if (!response.ok) {
      console.log('⚠️  crt.sh returned:', response.status)
      return []
    }
    
    const data = await response.json()
    console.log(`✅ Fetched ${data.length} certificate entries`)
    
    // Extract unique domains
    const domains = new Set()
    
    data.forEach(cert => {
      if (cert.name_value) {
        cert.name_value.split('\n').forEach(name => {
          name = name.replace('*.', '').trim().toLowerCase()
          
          // Only direct teamtailor.com subdomains
          if (name.endsWith('.teamtailor.com') && !name.includes('*')) {
            // Exclude system domains
            const subdomain = name.split('.')[0]
            if (subdomain && 
                subdomain !== 'www' && 
                subdomain !== 'api' && 
                subdomain !== 'static' &&
                subdomain !== 'assets' &&
                subdomain !== 'cdn' &&
                subdomain !== 'app' &&
                subdomain !== 'admin' &&
                subdomain !== 'support' &&
                subdomain !== 'help' &&
                subdomain !== 'docs' &&
                subdomain !== 'blog' &&
                subdomain !== 'status') {
              domains.add(name)
            }
          }
        })
      }
    })
    
    const urls = Array.from(domains).map(d => `https://${d}`)
    console.log(`✅ Found ${urls.length} potential company domains\n`)
    
    return urls
    
  } catch (error) {
    console.log('❌ Error fetching from crt.sh:', error.message)
    return []
  }
}

/**
 * Strategy 2: Swedish Company Patterns
 * Test common Swedish companies with TeamTailor patterns
 */
function generateSwedishCompanies() {
  console.log('\n📋 STRATEGY 2: Swedish Company Patterns')
  console.log('─────────────────────────────────────────────\n')
  
  // Top 200 Swedish companies (from various sources)
  const companies = [
    // Tech unicorns & major startups
    'klarna', 'spotify', 'northvolt', 'voi', 'budbee', 'einride', 
    'truecaller', 'tink', 'king', 'mojang', 'dice', 'paradox',
    
    // Banks & Finance
    'seb', 'swedbank', 'nordea', 'handelsbanken', 'sbab', 'lansforsakringar',
    'trygg-hansa', 'folksam', 'skandia', 'if', 'moderna-forsakringar',
    
    // Retail & E-commerce
    'ikea', 'hm', 'ica', 'coop', 'axfood', 'willys', 'hemkop', 'citygross',
    'systembolaget', 'stadium', 'xxl', 'elgiganten', 'webhallen', 'inet',
    'komplett', 'dustin', 'boozt', 'zalando', 'nelly', 'nakd', 'gina-tricot',
    
    // Industrial
    'volvo', 'scania', 'saab', 'abb', 'atlas-copco', 'sandvik', 'skf',
    'electrolux', 'husqvarna', 'getinge', 'elekta', 'assa-abloy',
    
    // Telecom & Media
    'ericsson', 'telia', 'tele2', 'telenor', 'tre', 'comhem', 
    'bonnier', 'schibsted', 'tv4', 'svt', 'sr',
    
    // Consulting
    'accenture', 'deloitte', 'pwc', 'kpmg', 'ey', 'capgemini',
    'hiq', 'knowit', 'tretton37', 'frontend', 'jayway',
    
    // Healthcare & Pharma
    'astrazeneca', 'kry', 'doktor', 'min-doktor', 'doctrin',
    'capio', 'aleris', 'praktikertjanst',
    
    // Food & Restaurants
    'oatly', 'karma', 'matsmart', 'mathem', 'mittkok', 'linas-matkasse',
    'max-burgers', 'espresso-house', 'waynes-coffee',
    
    // Fashion
    'acne-studios', 'filippa-k', 'nudie-jeans', 'happy-socks',
    'bjorn-borg', 'oscar-jacobson', 'peak-performance', 'haglofs',
    'fjallraven', 'houdini', 'craft', 'casall',
    
    // Real Estate
    'hemnet', 'booli', 'qasa', 'samtrygg', 'homepal',
    'svensk-fastighetsformedling', 'maklarhuset',
    
    // Green Tech
    'h2greensteel', 'stegra', 'aira', 'tibber', 'greenely',
    'ferroamp', 'ngenic', 'normative', 'climeon', 'flower',
    
    // Gaming
    'paradox-interactive', 'sharkmob', 'starbreeze', 'coffee-stain',
    'avalanche-studios', 'massive-entertainment', 'mad-interactive',
    
    // Logistics & Mobility
    'postnord', 'bring', 'dhl', 'ups', 'schenker', 'instabox',
    'budbee', 'bzzt', 'wolt', 'foodora', 'uber',
    
    // PropTech
    'homepal', 'qasa', 'samtrygg', 'booli', 'settl',
    
    // Education
    'academedia', 'jensen', 'nackademin', 'hyper-island',
    
    // Hotels & Travel
    'scandic', 'nordic-choice', 'strawberry', 'radisson',
    'booking', 'hotels', 'momondo', 'supersaver',
    
    // HR & Recruitment
    'teamtailor', 'benify', 'tng', 'academic-work', 'adecco',
    'manpower', 'randstad', 'poolia', 'wise-professionals',
    
    // Security & Defense
    'yubico', 'detectify', 'truesec', 'clavister', 'sectra',
    
    // Additional Startups
    'epidemic-sound', 'funnel', 'fishbrain', 'soundtrack-your-brand',
    'mentimeter', 'upsales', 'lime-technologies', 'bambuser',
    'lunar', 'anyfin', 'hedvig', 'insurello', 'billogram', 'qred',
    'estrid', 'bookbeat', 'acast', 'quinyx', 'tacton', 'bokio'
  ]
  
  console.log(`🔍 Testing ${companies.length} Swedish companies...\n`)
  
  const urls = []
  companies.forEach(slug => {
    // Pattern 1: company.teamtailor.com
    urls.push(`https://${slug}.teamtailor.com`)
    
    // Pattern 2: company.career.teamtailor.com
    urls.push(`https://${slug}.career.teamtailor.com`)
  })
  
  return urls
}

/**
 * Strategy 3: Scrape Swedish Startup Lists
 * Fetch from GitHub and other public sources
 */
async function scrapePublicLists() {
  console.log('\n📋 STRATEGY 3: Public Swedish Startup Lists')
  console.log('─────────────────────────────────────────────\n')
  
  const lists = []
  
  // GitHub awesome lists
  const sources = [
    'https://raw.githubusercontent.com/anderssonjohan/awesome-swedish-opensource/master/README.md',
    'https://raw.githubusercontent.com/philippkeller/awesome-sweden/master/README.md'
  ]
  
  for (const url of sources) {
    try {
      console.log(`🔍 Fetching ${url.split('/').slice(-2).join('/')}...`)
      const response = await fetch(url)
      if (response.ok) {
        const text = await response.text()
        // Extract company names from markdown links
        const matches = text.matchAll(/\[([^\]]+)\]\(https?:\/\/([^)]+)\)/g)
        for (const match of matches) {
          const domain = match[2].split('/')[0]
          lists.push(domain)
        }
      }
    } catch (error) {
      console.log(`  ⚠️  Failed: ${error.message}`)
    }
  }
  
  console.log(`✅ Collected ${lists.length} companies from public lists\n`)
  
  // Generate TeamTailor URLs
  const urls = []
  lists.forEach(domain => {
    const slug = domain.split('.')[0].toLowerCase()
    urls.push(`https://${slug}.teamtailor.com`)
    urls.push(`https://careers.${domain}`)
    urls.push(`https://jobs.${domain}`)
  })
  
  return urls
}

/**
 * Verify if URL has TeamTailor
 */
async function verifyTeamTailor(url) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)
    
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) return null
    
    const html = await response.text()
    const hasMarker = ttMarkers.some(pattern => pattern.test(html))
    
    // Check RSS feed
    let hasRSS = false
    try {
      const rssUrl = new URL('/jobs.rss', response.url).toString()
      const rssRes = await fetch(rssUrl, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000),
        headers: { 'User-Agent': 'Mozilla/5.0' }
      })
      hasRSS = rssRes.ok
    } catch {}
    
    if (!hasMarker && !hasRSS) return null
    
    // Extract company name
    let name = ''
    try {
      const $ = cheerio.load(html)
      name = $('meta[property="og:site_name"]').attr('content') || 
             $('title').text().split('-')[0].trim() ||
             new URL(response.url).hostname.split('.')[0]
    } catch {}
    
    return {
      name,
      careerSiteUrl: response.url,
      rssUrl: `${response.url}/jobs.rss`.replace(/\/+/g, '/').replace(':/', '://'),
      hasRSS,
      discoveredAt: new Date().toISOString()
    }
    
  } catch (error) {
    return null
  }
}

/**
 * Process URLs in batches
 */
async function processURLs(urls, batchName) {
  console.log(`🔍 Verifying ${urls.length} URLs...`)
  
  const results = []
  let verified = 0
  
  const tasks = urls.map(url => limit(async () => {
    const result = await verifyTeamTailor(url)
    if (result) {
      verified++
      process.stdout.write(`\r  ✅ Verified: ${verified}/${urls.length}`)
      results.push(result)
    }
    return result
  }))
  
  await Promise.all(tasks)
  console.log(`\n✅ Found ${results.length} valid TeamTailor sites\n`)
  
  return results
}

/**
 * Main function
 */
async function discover() {
  console.log('🚀 FREE TeamTailor Discovery - NO API KEYS!')
  console.log('═══════════════════════════════════════════\n')
  
  const allDiscovered = []
  
  // Strategy 1: Certificate Transparency
  const ctUrls = await fetchCertificateTransparency()
  if (ctUrls.length > 0) {
    const ctResults = await processURLs(ctUrls, 'CT Logs')
    allDiscovered.push(...ctResults)
  }
  
  // Strategy 2: Swedish Companies
  const companyUrls = generateSwedishCompanies()
  const companyResults = await processURLs(companyUrls, 'Swedish Companies')
  
  // Merge without duplicates
  const existingUrls = new Set(allDiscovered.map(r => r.careerSiteUrl))
  const newCompanies = companyResults.filter(r => !existingUrls.has(r.careerSiteUrl))
  allDiscovered.push(...newCompanies)
  
  // Strategy 3: Public Lists
  const listUrls = await scrapePublicLists()
  if (listUrls.length > 0) {
    const listResults = await processURLs(listUrls, 'Public Lists')
    const newFromLists = listResults.filter(r => !existingUrls.has(r.careerSiteUrl))
    allDiscovered.push(...newFromLists)
  }
  
  // Save results
  console.log('\n═══════════════════════════════════════════')
  console.log('📊 FINAL RESULTS')
  console.log('═══════════════════════════════════════════\n')
  
  console.log(`✅ Total companies discovered: ${allDiscovered.length}`)
  
  // Save to JSON
  const output = {
    discoveredAt: new Date().toISOString(),
    method: 'FREE - No API Keys',
    count: allDiscovered.length,
    companies: allDiscovered.map(c => ({
      name: c.name,
      careerSiteUrl: c.careerSiteUrl,
      enabled: true
    }))
  }
  
  writeFileSync('free-discovery-results.json', JSON.stringify(output, null, 2))
  console.log('\n💾 Saved to: free-discovery-results.json\n')
  
  // Print copy-paste format
  console.log('─────────────────────────────────────────────')
  console.log('📋 Copy-paste for teamtailorCompanies.ts:\n')
  console.log('─────────────────────────────────────────────\n')
  
  output.companies.forEach(c => {
    console.log(`  {
    name: '${c.name}',
    careerSiteUrl: '${c.careerSiteUrl}',
    enabled: true
  },`)
  })
  
  console.log('\n═══════════════════════════════════════════')
  console.log('✨ Discovery Complete!')
  console.log('═══════════════════════════════════════════\n')
  
  return allDiscovered
}

// Run
discover().catch(console.error)
