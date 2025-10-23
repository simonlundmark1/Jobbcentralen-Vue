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
  // MASSIVE LIST: 180+ Swedish Companies
  // Format: { name: 'Company Name', domain: 'company.se', subdomains: ['COMPANY_SLUG'] }
  
  // === ALREADY VERIFIED (from previous runs) ===
  { name: 'Epidemic Sound', domain: 'epidemicsound.com', subdomains: ['epidemicsound', 'epidemic-sound'] },
  { name: 'Funnel', domain: 'funnel.io', subdomains: ['funnel', 'funnelio'] },
  { name: 'Kry', domain: 'kry.se', subdomains: ['kry'] },
  { name: 'Karma', domain: 'karma.life', subdomains: ['karma'] },
  { name: 'Fishbrain', domain: 'fishbrain.com', subdomains: ['fishbrain'] },
  { name: 'BookBeat', domain: 'bookbeat.com', subdomains: ['bookbeat'] },
  { name: 'Happy Socks', domain: 'happysocks.com', subdomains: ['happysocks', 'happy-socks'] },
  { name: 'Bazooka', domain: 'bazooka.se', subdomains: ['bazooka'] },
  { name: 'Soundtrack Your Brand', domain: 'soundtrackyourbrand.com', subdomains: ['soundtrackyourbrand'] },
  { name: 'Doktor.se', domain: 'doktor.se', subdomains: ['doktor'] },
  { name: 'Atlar', domain: 'atlar.com', subdomains: ['atlar'] },
  { name: 'Billogram', domain: 'billogram.com', subdomains: ['billogram'] },
  { name: 'Qred', domain: 'qred.com', subdomains: ['qred'] },
  { name: 'Qliro', domain: 'qliro.com', subdomains: ['qliro'] },
  { name: 'Estrid', domain: 'estrid.com', subdomains: ['estrid'] },
  { name: 'H2 Green Steel', domain: 'h2greensteel.com', subdomains: ['h2greensteel', 'h2-green-steel'] },
  { name: 'Normative', domain: 'normative.io', subdomains: ['normative'] },
  { name: 'Oatly', domain: 'oatly.com', subdomains: ['oatly'] },
  { name: 'Hemnet', domain: 'hemnet.se', subdomains: ['hemnet'] },
  { name: 'Qasa', domain: 'qasa.se', subdomains: ['qasa'] },
  { name: 'Gina Tricot', domain: 'ginatricot.com', subdomains: ['ginatricot', 'gina-tricot'] },
  
  // === LARGE TECH COMPANIES ===
  { name: 'Klarna', domain: 'klarna.com', subdomains: ['klarna'] },
  { name: 'Spotify', domain: 'spotify.com', subdomains: ['spotify'] },
  { name: 'Polestar', domain: 'polestar.com', subdomains: ['polestar'] },
  { name: 'Volvo Cars', domain: 'volvocars.com', subdomains: ['volvo', 'volvocars'] },
  { name: 'Ericsson', domain: 'ericsson.com', subdomains: ['ericsson'] },
  { name: 'H&M Group', domain: 'hmgroup.com', subdomains: ['hm', 'hmgroup'] },
  
  // === FINTECH & PAYMENTS ===
  { name: 'Tink', domain: 'tink.com', subdomains: ['tink'] },
  { name: 'Trustly', domain: 'trustly.com', subdomains: ['trustly'] },
  { name: 'iZettle', domain: 'izettle.com', subdomains: ['izettle'] },
  { name: 'Zimpler', domain: 'zimpler.com', subdomains: ['zimpler'] },
  { name: 'Lunar', domain: 'lunar.app', subdomains: ['lunar'] },
  { name: 'Anyfin', domain: 'anyfin.com', subdomains: ['anyfin'] },
  { name: 'Hedvig', domain: 'hedvig.com', subdomains: ['hedvig'] },
  { name: 'Insurello', domain: 'insurello.se', subdomains: ['insurello'] },
  { name: 'Spiir', domain: 'spiir.dk', subdomains: ['spiir'] },
  { name: 'Anyfin', domain: 'anyfin.com', subdomains: ['anyfin'] },
  { name: 'Dreams', domain: 'dreams.se', subdomains: ['dreams'] },
  { name: 'Betalo', domain: 'betalo.com', subdomains: ['betalo'] },
  { name: 'Qapital', domain: 'qapital.com', subdomains: ['qapital'] },
  { name: 'Lendify', domain: 'lendify.se', subdomains: ['lendify'] },
  { name: 'Kivra', domain: 'kivra.com', subdomains: ['kivra'] },
  { name: 'Fortnox', domain: 'fortnox.se', subdomains: ['fortnox'] },
  { name: 'Froda', domain: 'froda.se', subdomains: ['froda'] },
  
  // === HEALTHTECH & MEDTECH ===
  { name: 'Neko Health', domain: 'nekohealth.com', subdomains: ['neko', 'nekohealth'] },
  { name: 'Min Doktor', domain: 'mindoktor.se', subdomains: ['mindoktor', 'min-doktor'] },
  { name: 'Doctrin', domain: 'doctrin.se', subdomains: ['doctrin'] },
  { name: 'Camanio', domain: 'camanio.com', subdomains: ['camanio'] },
  { name: 'GetAccept', domain: 'getaccept.com', subdomains: ['getaccept'] },
  { name: 'Validoo', domain: 'validoo.se', subdomains: ['validoo'] },
  { name: 'Eir', domain: 'eir.se', subdomains: ['eir'] },
  { name: 'Doktor24', domain: 'doktor24.se', subdomains: ['doktor24'] },
  { name: 'Mindler', domain: 'mindler.se', subdomains: ['mindler'] },
  { name: 'Hjärnkoll', domain: 'hjarnkoll.se', subdomains: ['hjarnkoll'] },
  
  // === E-COMMERCE & D2C BRANDS ===
  { name: 'Mathem', domain: 'mathem.se', subdomains: ['mathem'] },
  { name: 'NA-KD', domain: 'nakd.com', subdomains: ['nakd', 'na-kd'] },
  { name: 'Nelly', domain: 'nelly.com', subdomains: ['nelly'] },
  { name: 'Lyko', domain: 'lyko.com', subdomains: ['lyko'] },
  { name: 'Jollyroom', domain: 'jollyroom.se', subdomains: ['jollyroom'] },
  { name: 'Dust', domain: 'dust.se', subdomains: ['dust'] },
  { name: 'Eton', domain: 'etonshirts.com', subdomains: ['eton'] },
  { name: 'Nakd Fashion', domain: 'nakdfashion.com', subdomains: ['nakd', 'nakdfashion'] },
  { name: 'Axel Arigato', domain: 'axelarigato.com', subdomains: ['axel', 'axelarigato'] },
  { name: 'Filippa K', domain: 'filippa-k.com', subdomains: ['filippa', 'filippak'] },
  { name: 'Resteröds', domain: 'resterods.com', subdomains: ['resterods'] },
  { name: 'Nudie Jeans', domain: 'nudiejeans.com', subdomains: ['nudie', 'nudiejeans'] },
  { name: 'Houdini Sportswear', domain: 'houdinisportswear.com', subdomains: ['houdini'] },
  { name: 'Casall', domain: 'casall.com', subdomains: ['casall'] },
  { name: 'Craft Sportswear', domain: 'craftsports.com', subdomains: ['craft'] },
  { name: 'Foreo', domain: 'foreo.com', subdomains: ['foreo'] },
  
  // === FOODTECH & FOOD BRANDS ===
  { name: 'Matsmart', domain: 'matsmart.se', subdomains: ['matsmart'] },
  { name: 'Kavall', domain: 'kavall.se', subdomains: ['kavall'] },
  { name: 'Linas Matkasse', domain: 'linasmatkasse.se', subdomains: ['linas'] },
  { name: 'Middagsfrid', domain: 'middagsfrid.se', subdomains: ['middagsfrid'] },
  { name: 'Godtl', domain: 'godtl.se', subdomains: ['godtl'] },
  { name: 'Felix', domain: 'felix.se', subdomains: ['felix'] },
  { name: 'Dryck.se', domain: 'dryck.se', subdomains: ['dryck'] },
  
  // === SaaS & B2B SOFTWARE ===
  { name: 'Mentimeter', domain: 'mentimeter.com', subdomains: ['mentimeter'] },
  { name: 'Upsales', domain: 'upsales.com', subdomains: ['upsales'] },
  { name: 'Lime Technologies', domain: 'lime-technologies.com', subdomains: ['lime'] },
  { name: 'Planday', domain: 'planday.com', subdomains: ['planday'] },
  { name: 'Stratsys', domain: 'stratsys.se', subdomains: ['stratsys'] },
  { name: 'Ongoing Warehouse', domain: 'ongoingwarehouse.com', subdomains: ['ongoing'] },
  { name: 'Visma', domain: 'visma.com', subdomains: ['visma'] },
  { name: 'Palette Software', domain: 'palettesoftware.com', subdomains: ['palette'] },
  { name: 'Hypergene', domain: 'hypergene.com', subdomains: ['hypergene'] },
  { name: 'Textalk', domain: 'textalk.se', subdomains: ['textalk'] },
  { name: 'Sitoo', domain: 'sitoo.com', subdomains: ['sitoo'] },
  { name: 'Proceedo', domain: 'proceedo.com', subdomains: ['proceedo'] },
  { name: 'Hogia', domain: 'hogia.se', subdomains: ['hogia'] },
  { name: 'Jeeves', domain: 'jeeves.se', subdomains: ['jeeves'] },
  
  // === MOBILITY & LOGISTICS ===
  { name: 'Budbee', domain: 'budbee.com', subdomains: ['budbee'] },
  { name: 'Instabox', domain: 'instabox.se', subdomains: ['instabox'] },
  { name: 'Bzzt', domain: 'bzzt.se', subdomains: ['bzzt'] },
  { name: 'Voi', domain: 'voiscooters.com', subdomains: ['voi'] },
  { name: 'Einride', domain: 'einride.tech', subdomains: ['einride'] },
  { name: 'Bzzt', domain: 'bzzt.se', subdomains: ['bzzt'] },
  { name: 'Cuvva', domain: 'cuvva.com', subdomains: ['cuvva'] },
  { name: 'Volta Trucks', domain: 'voltatrucks.com', subdomains: ['volta'] },
  
  // === GREEN TECH & SUSTAINABILITY ===
  { name: 'Northvolt', domain: 'northvolt.com', subdomains: ['northvolt'] },
  { name: 'Climeon', domain: 'climeon.com', subdomains: ['climeon'] },
  { name: 'Aira', domain: 'aira.com', subdomains: ['aira'] },
  { name: 'Ngenic', domain: 'ngenic.se', subdomains: ['ngenic'] },
  { name: 'ClimateView', domain: 'climateview.global', subdomains: ['climateview'] },
  { name: 'Vargas', domain: 'vargas.se', subdomains: ['vargas'] },
  { name: 'Terranet', domain: 'terranet.se', subdomains: ['terranet'] },
  { name: 'Flower', domain: 'flower.se', subdomains: ['flower'] },
  
  // === GAMING & ENTERTAINMENT ===
  { name: 'King', domain: 'king.com', subdomains: ['king'] },
  { name: 'Embracer Group', domain: 'embracer.com', subdomains: ['embracer'] },
  { name: 'Paradox Interactive', domain: 'paradoxinteractive.com', subdomains: ['paradox', 'paradoxinteractive'] },
  { name: 'Starbreeze', domain: 'starbreeze.com', subdomains: ['starbreeze'] },
  { name: 'MAG Interactive', domain: 'maginteractive.com', subdomains: ['mag'] },
  { name: 'Truecaller', domain: 'truecaller.com', subdomains: ['truecaller'] },
  { name: 'Fever', domain: 'feverup.com', subdomains: ['fever', 'feverup'] },
  
  // === PROPTECH & REAL ESTATE ===
  { name: 'Notar', domain: 'notar.se', subdomains: ['notar'] },
  { name: 'Settle', domain: 'settle.eu', subdomains: ['settle'] },
  { name: 'Booli', domain: 'booli.se', subdomains: ['booli'] },
  { name: 'Homepal', domain: 'homepal.se', subdomains: ['homepal'] },
  { name: 'Bythjul', domain: 'bythjul.se', subdomains: ['bythjul'] },
  { name: 'Qasa', domain: 'qasa.se', subdomains: ['qasa'] },
  
  // === HR TECH & RECRUITMENT ===
  { name: 'Teamtailor', domain: 'teamtailor.com', subdomains: ['teamtailor'] },
  { name: 'TNG', domain: 'tng.se', subdomains: ['tng'] },
  { name: 'Jurek', domain: 'jurek.se', subdomains: ['jurek'] },
  { name: 'Benify', domain: 'benify.com', subdomains: ['benify'] },
  { name: 'Winningtemp', domain: 'winningtemp.com', subdomains: ['winningtemp'] },
  { name: 'Scrive', domain: 'scrive.com', subdomains: ['scrive'] },
  
  // === MEDIA & MARKETING ===
  { name: 'Strossle', domain: 'strossle.com', subdomains: ['strossle'] },
  { name: 'Schibsted', domain: 'schibsted.com', subdomains: ['schibsted'] },
  { name: 'Bonnier News', domain: 'bonniernews.se', subdomains: ['bonnier', 'bonniernews'] },
  { name: 'United Screens', domain: 'unitedscreens.se', subdomains: ['unitedscreens'] },
  { name: 'Quickbutik', domain: 'quickbutik.com', subdomains: ['quickbutik'] },
  
  // === EDUCATION TECH ===
  { name: 'Bambuser', domain: 'bambuser.com', subdomains: ['bambuser'] },
  { name: 'Caspeco', domain: 'caspeco.se', subdomains: ['caspeco'] },
  { name: 'Learnster', domain: 'learnster.com', subdomains: ['learnster'] },
  { name: 'Albert', domain: 'getalbert.com', subdomains: ['albert'] },
  
  // === CYBERSECURITY & SECURITY ===
  { name: 'Yubico', domain: 'yubico.com', subdomains: ['yubico'] },
  { name: 'Detectify', domain: 'detectify.com', subdomains: ['detectify'] },
  { name: 'Clavister', domain: 'clavister.com', subdomains: ['clavister'] },
  { name: 'Truesec', domain: 'truesec.com', subdomains: ['truesec'] },
  { name: 'BehavioSec', domain: 'behaviosec.com', subdomains: ['behaviosec'] },
  
  // === ADDITIONAL TECH & STARTUPS ===
  { name: 'Sinch', domain: 'sinch.com', subdomains: ['sinch'] },
  { name: 'Centrical', domain: 'centrical.com', subdomains: ['centrical'] },
  { name: 'Comscore', domain: 'comscore.com', subdomains: ['comscore'] },
  { name: 'Leya', domain: 'leya.ai', subdomains: ['leya'] },
  { name: 'Grafana Labs', domain: 'grafana.com', subdomains: ['grafana'] },
  { name: 'Sana Commerce', domain: 'sana-commerce.com', subdomains: ['sana'] },
  { name: 'Nexer Group', domain: 'nexergroup.com', subdomains: ['nexer', 'nexergroup'] },
  { name: 'Brilliant', domain: 'brilliant.se', subdomains: ['brilliant'] },
  { name: 'Telness', domain: 'telness.se', subdomains: ['telness'] },
  { name: 'Ework', domain: 'ework.se', subdomains: ['ework'] },
  
  // === MORE FINTECH (High success rate - 53%) ===
  { name: 'Svea', domain: 'svea.com', subdomains: ['svea'] },
  { name: 'Collector Bank', domain: 'collector.se', subdomains: ['collector'] },
  { name: 'Rocker', domain: 'rocker.com', subdomains: ['rocker'] },
  { name: 'Wrapp', domain: 'wrapp.com', subdomains: ['wrapp'] },
  { name: 'Zaver', domain: 'zaver.com', subdomains: ['zaver'] },
  { name: 'Advisa', domain: 'advisa.se', subdomains: ['advisa'] },
  { name: 'Dreams Technology', domain: 'dreams.se', subdomains: ['dreams'] },
  { name: 'Hejdå', domain: 'hejda.se', subdomains: ['hejda'] },
  { name: 'Stabelo', domain: 'stabelo.se', subdomains: ['stabelo'] },
  { name: 'Vaam', domain: 'vaam.io', subdomains: ['vaam'] },
  
  // === MORE FASHION & D2C (High success rate - 46%) ===
  { name: 'Sandqvist', domain: 'sandqvist.com', subdomains: ['sandqvist'] },
  { name: 'Oscar Jacobson', domain: 'oscarjacobson.com', subdomains: ['oscar', 'oscarjacobson'] },
  { name: 'Sudioplay', domain: 'sudio.com', subdomains: ['sudio'] },
  { name: 'Björn Borg', domain: 'bjornborg.com', subdomains: ['bjornborg', 'bjorn-borg'] },
  { name: 'Whyred', domain: 'whyred.se', subdomains: ['whyred'] },
  { name: 'Lindex', domain: 'lindex.com', subdomains: ['lindex'] },
  { name: 'Odd Molly', domain: 'oddmolly.com', subdomains: ['odd', 'oddmolly'] },
  { name: 'Stutterheim', domain: 'stutterheim.com', subdomains: ['stutterheim'] },
  { name: 'Acne Studios', domain: 'acnestudios.com', subdomains: ['acne'] },
  { name: 'By Malina', domain: 'bymalina.com', subdomains: ['bymalina'] },
  
  // === MORE HEALTH TECH (High success rate - 43%) ===
  { name: 'Werlabs', domain: 'werlabs.se', subdomains: ['werlabs'] },
  { name: 'AlphaCB', domain: 'alphacb.se', subdomains: ['alphacb'] },
  { name: 'Flow Neuroscience', domain: 'flowneuroscience.com', subdomains: ['flow'] },
  { name: 'Lifesum', domain: 'lifesum.com', subdomains: ['lifesum'] },
  { name: 'Braive', domain: 'braive.se', subdomains: ['braive'] },
  { name: 'Good Monday', domain: 'goodmonday.com', subdomains: ['goodmonday'] },
  { name: 'Memini', domain: 'memini.se', subdomains: ['memini'] },
  { name: 'Sidekick Health', domain: 'sidekickhealth.com', subdomains: ['sidekick'] },
  
  // === MORE SaaS & B2B SOFTWARE ===
  { name: 'Tracklib', domain: 'tracklib.com', subdomains: ['tracklib'] },
  { name: 'Quinyx', domain: 'quinyx.com', subdomains: ['quinyx'] },
  { name: 'Tacton', domain: 'tacton.com', subdomains: ['tacton'] },
  { name: 'Acast', domain: 'acast.com', subdomains: ['acast'] },
  { name: 'Appeartain', domain: 'appeartain.com', subdomains: ['appeartain'] },
  { name: 'Bokio', domain: 'bokio.se', subdomains: ['bokio'] },
  { name: 'Capcito', domain: 'capcito.com', subdomains: ['capcito'] },
  { name: 'Centium', domain: 'centium.se', subdomains: ['centium'] },
  { name: 'Citybreak', domain: 'citybreak.com', subdomains: ['citybreak'] },
  { name: 'Cint', domain: 'cint.com', subdomains: ['cint'] },
  
  // === MORE E-COMMERCE & RETAIL ===
  { name: 'Afound', domain: 'afound.com', subdomains: ['afound'] },
  { name: 'Boozt', domain: 'boozt.com', subdomains: ['boozt'] },
  { name: 'Cervera', domain: 'cervera.se', subdomains: ['cervera'] },
  { name: 'Blocket', domain: 'blocket.se', subdomains: ['blocket'] },
  { name: 'Sellpy', domain: 'sellpy.se', subdomains: ['sellpy'] },
  { name: 'Tise', domain: 'tise.com', subdomains: ['tise'] },
  { name: 'Stadium', domain: 'stadium.se', subdomains: ['stadium'] },
  
  // === MORE GREEN TECH & CLIMATE ===
  { name: 'Greenely', domain: 'greenely.se', subdomains: ['greenely'] },
  { name: 'Tibber', domain: 'tibber.com', subdomains: ['tibber'] },
  { name: 'Volta Greentech', domain: 'voltagreentech.com', subdomains: ['volta'] },
  { name: 'Ferroamp', domain: 'ferroamp.com', subdomains: ['ferroamp'] },
  { name: 'Aira', domain: 'aira.com', subdomains: ['aira'] },
  
  // === ADDITIONAL STARTUPS ===
  { name: 'Mapillary', domain: 'mapillary.com', subdomains: ['mapillary'] },
  { name: 'Min Doktor', domain: 'mindoktor.se', subdomains: ['mindoktor'] },
  { name: 'Videofy', domain: 'videofy.me', subdomains: ['videofy'] },
  { name: 'Watty', domain: 'watty.io', subdomains: ['watty'] },
  { name: 'Neat', domain: 'neat.se', subdomains: ['neat'] },
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
