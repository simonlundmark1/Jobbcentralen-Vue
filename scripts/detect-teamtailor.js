/**
 * TeamTailor Detector
 * 
 * Tar en lista med URLs och verifierar vilka som använder TeamTailor
 * Kan läsa från:
 * - ddg-scraped-urls.txt
 * - search-engine-urls.txt
 * - scripts/urls.txt
 * - Eller custom fil
 */

import * as cheerio from 'cheerio'
import pLimit from 'p-limit'
import { readFileSync, writeFileSync, existsSync } from 'fs'

const limit = pLimit(10)

// TeamTailor markers
const ttMarkers = [
  /<meta[^>]+name=["']generator["'][^>]+content=["']Teamtailor["']/i,
  /teamtailor\.com/i,
  /static\.teamtailor\.com/i,
  /careers-page-assets\.teamtailor\.com/i,
  /window\.__TT__/i
]

/**
 * Verify TeamTailor på en URL
 */
async function verifyTeamTailor(url) {
  try {
    // Cleanup URL
    url = url.split('?')[0].split('#')[0].trim()
    if (!url.startsWith('http')) return null
    
    const response = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(10000),
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    if (!response.ok) return null
    
    const html = await response.text()
    const finalUrl = response.url
    
    // Check markers
    const hasMarker = ttMarkers.some(pattern => pattern.test(html))
    
    // Check RSS feed
    let hasRSS = false
    try {
      const rssUrl = new URL('/jobs.rss', finalUrl).toString()
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
             new URL(finalUrl).hostname.split('.')[0]
    } catch {}
    
    return {
      name,
      careerSiteUrl: finalUrl,
      rssUrl: `${finalUrl}/jobs.rss`.replace(/\/+/g, '/').replace(':/', '://'),
      enabled: true,
      hasRSS,
      detectionMethod: hasMarker ? 'html-marker' : 'rss-feed'
    }
    
  } catch (error) {
    return null
  }
}

/**
 * Load URLs från fil
 */
function loadUrls(filepath) {
  if (!existsSync(filepath)) {
    console.log(`❌ File not found: ${filepath}`)
    return []
  }
  
  const content = readFileSync(filepath, 'utf8')
  const urls = content
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#') && line.startsWith('http'))
  
  console.log(`📄 Loaded ${urls.length} URLs from ${filepath}\n`)
  return urls
}

/**
 * Main detector
 */
async function detect(inputFile) {
  console.log('🔍 TeamTailor Detector')
  console.log('═══════════════════════════════════════════\n')
  
  // Try to find input file
  const possibleFiles = [
    inputFile,
    'ddg-scraped-urls.txt',
    'search-engine-urls.txt',
    'scripts/urls.txt',
    'urls.txt'
  ].filter(Boolean)
  
  let urls = []
  let usedFile = ''
  
  for (const file of possibleFiles) {
    if (existsSync(file)) {
      urls = loadUrls(file)
      usedFile = file
      break
    }
  }
  
  if (urls.length === 0) {
    console.log('❌ No URLs found!')
    console.log('\nPlease run one of these first:')
    console.log('  node scripts/ddg-dork-scraper.js')
    console.log('  node scripts/search-engine-discovery.js')
    console.log('\nOr create urls.txt with URLs to check')
    return
  }
  
  console.log(`🔍 Checking ${urls.length} URLs for TeamTailor...\n`)
  
  const verified = []
  let checked = 0
  
  const tasks = urls.map(url => limit(async () => {
    const result = await verifyTeamTailor(url)
    checked++
    
    process.stdout.write(`\r  Progress: ${checked}/${urls.length}`)
    
    if (result) {
      verified.push(result)
      console.log(`\n  ✅ ${result.name} - ${result.careerSiteUrl}`)
    }
    
    return result
  }))
  
  await Promise.all(tasks)
  
  console.log('\n\n═══════════════════════════════════════════')
  console.log('✨ Detection Complete!')
  console.log('═══════════════════════════════════════════\n')
  
  console.log(`✅ Verified TeamTailor companies: ${verified.length}/${urls.length}\n`)
  
  if (verified.length === 0) {
    console.log('⚠️  No TeamTailor companies found in the URLs')
    console.log('\nTry running:')
    console.log('  node scripts/free-teamtailor-discovery.js')
    console.log('\nWhich has a better success rate!\n')
    return
  }
  
  // Save results
  const output = {
    detectedAt: new Date().toISOString(),
    inputFile: usedFile,
    totalUrls: urls.length,
    verifiedCompanies: verified.length,
    companies: verified.map(c => ({
      name: c.name,
      careerSiteUrl: c.careerSiteUrl,
      enabled: true
    }))
  }
  
  writeFileSync('detected-teamtailor-companies.json', JSON.stringify(output, null, 2))
  console.log('💾 Saved to: detected-teamtailor-companies.json\n')
  
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
  
  console.log('\n═══════════════════════════════════════════\n')
  
  return verified
}

// Get input file from command line or use default
const inputFile = process.argv[2]

detect(inputFile).catch(console.error)
