/**
 * DuckDuckGo Dork Scraper - NO API KEYS
 * 
 * Kör Google-dorks via DuckDuckGo's HTML endpoint
 * Pagination stöd för att få alla resultat
 * Täcker Sverige, Norge, Danmark, Finland
 */

import fetch from 'node-fetch'
import * as cheerio from 'cheerio'
import pLimit from 'p-limit'
import { writeFileSync } from 'fs'

// Queries från ChatGPT - fokuserar på Nordics
const queries = [
  'site:*.teamtailor.com -www.teamtailor.com',
  '"Powered by Teamtailor" -site:teamtailor.com',
  '"career site by Teamtailor" -site:teamtailor.com',
  'inurl:(career OR careers OR jobs) "Teamtailor"',
  '"Teamtailor" (career OR careers OR jobb OR jobs)',
  'site:career.* "Teamtailor"',
  'site:jobb.* "Teamtailor"',
  
  // Sverige
  'site:*.se "Teamtailor" (jobb OR career OR careers)',
  'site:*.se karriär Teamtailor',
  'site:*.se lediga jobb Teamtailor',
  
  // Norge
  'site:*.no "Teamtailor" (jobb OR career OR careers)',
  'site:*.no karriere Teamtailor',
  
  // Danmark
  'site:*.dk "Teamtailor" (job OR karriere OR career OR careers)',
  'site:*.dk karriere Teamtailor',
  
  // Finland
  'site:*.fi "Teamtailor" (työpaikat OR ura OR career OR careers)',
  'site:*.fi työpaikat Teamtailor',
  
  // Extra svenska queries
  'Teamtailor Sverige',
  'Teamtailor Stockholm jobb',
  'Teamtailor Göteborg karriär',
  'Teamtailor Malmö lediga jobb'
]

const DDG = 'https://html.duckduckgo.com/html/'
const limit = pLimit(3) // Låg concurrency för att vara snäll

/**
 * Bygg DuckDuckGo URL med query och offset
 */
function ddgUrl(q, s = 0) {
  const u = new URL(DDG)
  u.searchParams.set('q', q)
  if (s) u.searchParams.set('s', String(s)) // offset i steg om 30
  u.searchParams.set('kl', 'wt-wt') // Alla regioner
  return u.toString()
}

/**
 * Fetch en sida från DuckDuckGo
 */
async function fetchPage(q, s = 0) {
  try {
    const url = ddgUrl(q, s)
    const res = await fetch(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'sv-SE,sv;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://duckduckgo.com/'
      }
    })
    
    if (!res.ok) {
      console.log(`  ⚠️  DDG returned ${res.status} for offset ${s}`)
      return { links: [], hasNext: false }
    }
    
    const html = await res.text()
    const $ = cheerio.load(html)
    const out = []
    
    // DuckDuckGo använder a.result__a för resultat-länkar
    $('a.result__a').each((_, a) => {
      let href = $(a).attr('href') || ''
      
      // Länkformat: /l/?uddg=<encoded_url>
      try {
        const u = new URL(href, DDG)
        if (u.pathname === '/l/' && u.searchParams.get('uddg')) {
          href = decodeURIComponent(u.searchParams.get('uddg'))
        } else {
          href = u.toString()
        }
      } catch {}
      
      if (href && href.startsWith('http')) {
        out.push(href)
      }
    })
    
    // Kolla om det finns fler sidor
    let hasNext = false
    $('form[action="/html/"] input[name="s"]').each((_, el) => {
      const v = $(el).attr('value')
      if (v && Number(v) > s) {
        hasNext = true
      }
    })
    
    // Alt: kolla efter "Next" knapp
    if ($('.result--more__btn, input[value="Next"]').length > 0) {
      hasNext = true
    }
    
    return { links: out, hasNext }
    
  } catch (error) {
    console.log(`  ❌ Error fetching page: ${error.message}`)
    return { links: [], hasNext: false }
  }
}

/**
 * Fetch alla sidor för en query med pagination
 */
async function fetchAllForQuery(q, maxPages = 5) {
  console.log(`\n🔍 Query: "${q}"`)
  
  const links = new Set()
  let s = 0
  
  for (let i = 0; i < maxPages; i++) {
    const { links: pageLinks, hasNext } = await fetchPage(q, s)
    
    pageLinks.forEach(u => links.add(u))
    
    console.log(`   Page ${i + 1}: ${pageLinks.length} results (total: ${links.size})`)
    
    if (!hasNext || pageLinks.length === 0) {
      console.log(`   ✅ Finished (no more pages)`)
      break
    }
    
    s += 30 // DDG paginerar i 30-resultatssteg
    
    // Snäll throttling mellan sidor
    await new Promise(r => setTimeout(r, 2000))
  }
  
  return Array.from(links)
}

/**
 * Main scraper
 */
async function scrape() {
  console.log('🚀 DuckDuckGo Dork Scraper')
  console.log('═══════════════════════════════════════════\n')
  console.log(`Running ${queries.length} dork queries...\n`)
  console.log('This will take 5-10 minutes (pagination + throttling)...\n')
  
  const allResults = []
  
  // Kör alla queries med concurrency limit
  for (const query of queries) {
    const results = await limit(() => fetchAllForQuery(query, 6))
    allResults.push(...results)
    
    // Extra paus mellan queries
    await new Promise(r => setTimeout(r, 3000))
  }
  
  console.log('\n═══════════════════════════════════════════')
  console.log('📊 Scraping Complete')
  console.log('═══════════════════════════════════════════\n')
  
  // Grovfiltrera till sidor som ser ut som karriär/jobb
  const filtered = Array.from(new Set(allResults)).filter(u =>
    /career|careers|jobs|jobb|karriere|karriär|ura|työpaikat|teamtailor/i.test(u)
  )
  
  console.log(`✅ Total URLs found: ${allResults.length}`)
  console.log(`✅ After filtering: ${filtered.length}`)
  
  // Spara alla URLs
  writeFileSync('ddg-scraped-urls.txt', filtered.join('\n'))
  console.log('\n💾 Saved to: ddg-scraped-urls.txt')
  
  // Spara även JSON
  const output = {
    scrapedAt: new Date().toISOString(),
    method: 'DuckDuckGo Dork Scraping with Pagination',
    totalQueries: queries.length,
    totalUrls: allResults.length,
    filteredUrls: filtered.length,
    urls: filtered
  }
  
  writeFileSync('ddg-scrape-results.json', JSON.stringify(output, null, 2))
  console.log('💾 Saved to: ddg-scrape-results.json\n')
  
  console.log('═══════════════════════════════════════════')
  console.log('📝 Next Steps:')
  console.log('═══════════════════════════════════════════\n')
  console.log('1. Review ddg-scraped-urls.txt')
  console.log('2. Run detector to verify TeamTailor:')
  console.log('   node scripts/free-teamtailor-discovery.js')
  console.log('\nOr manually add URLs to scripts/urls.txt and run:')
  console.log('   node scripts/advanced-teamtailor-crawler.js\n')
  
  return filtered
}

// Run
scrape().catch(console.error)
