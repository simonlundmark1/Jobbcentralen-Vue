import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// HTTPS-förfrågan
function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const defaultHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      ...headers
    };
    
    https.get(url, { headers: defaultHeaders, timeout: 10000 }, (res) => {
      let data = '';
      
      // Följ redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return httpsGet(res.headers.location, headers).then(resolve).catch(reject);
      }
      
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ data, statusCode: res.statusCode, headers: res.headers }));
    }).on('error', reject).on('timeout', () => reject(new Error('Timeout')));
  });
}

// Metod 1: Scrapa TeamTailor's kund-showcase sida
async function scrapeTeamtailorShowcase() {
  console.log('📋 Metod 1: Scrapar TeamTailor showcase...');
  const companies = new Set();
  
  try {
    // TeamTailor visar ofta sina kunder på sin webbplats
    const urls = [
      'https://www.teamtailor.com/customers',
      'https://www.teamtailor.com/sv/customers',
      'https://www.teamtailor.com/case-studies'
    ];
    
    for (const url of urls) {
      try {
        const response = await httpsGet(url);
        const html = response.data;
        
        // Hitta alla *.teamtailor.com länkar
        const regex = /https?:\/\/([a-z0-9-]+)\.teamtailor\.com/gi;
        const matches = html.matchAll(regex);
        
        for (const match of matches) {
          const subdomain = match[1];
          if (subdomain && !['www', 'app', 'dashboard', 'api'].includes(subdomain)) {
            companies.add(`https://${subdomain}.teamtailor.com/`);
          }
        }
      } catch (e) {
        // Fortsätt om en URL misslyckas
      }
    }
  } catch (error) {
    console.log('  ⚠️  Showcase scraping misslyckades');
  }
  
  console.log(`  ✅ Hittade ${companies.size} företag från showcase`);
  return Array.from(companies);
}

// Metod 2: Hitta via DNS enumeration av teamtailor.com subdomäner
async function enumerateSubdomains() {
  console.log('\n🔍 Metod 2: Enumererar teamtailor.com subdomäner...');
  const companies = new Set();
  
  // Vanliga svenska företagsnamn att testa
  const commonCompanies = [
    // Alla branscher
    'klarna', 'spotify', 'northvolt', 'volvo', 'scania', 'ericsson', 
    'ikea', 'hm', 'coop', 'ica', 'stadium', 'xxl',
    'seb', 'swedbank', 'nordea', 'handelsbanken', 'sbab',
    'truecaller', 'king', 'mojang', 'paradox', 'sharkmob',
    'tink', 'lunar', 'anyfin', 'klarna', 'izettle',
    'hemnet', 'blocket', 'qasa', 'samtrygg',
    'mathem', 'karma', 'matsmart', 'oatly',
    'budbee', 'instabox', 'instabee', 'foodora', 'wolt',
    'kry', 'doktor', 'mindler', 'praktikertjanst',
    'telia', 'tre', 'telenor', 'comviq',
    'svt', 'sr', 'tv4', 'mtr', 'sj'
  ];
  
  // Testa subdomäner
  for (const company of commonCompanies) {
    const url = `https://${company}.teamtailor.com/`;
    try {
      const response = await httpsGet(url);
      if (response.statusCode === 200) {
        companies.add(url);
        console.log(`  ✅ ${company}.teamtailor.com`);
      }
    } catch (e) {
      // Skip
    }
    await new Promise(r => setTimeout(r, 100));
  }
  
  console.log(`  ✅ Hittade ${companies.size} subdomäner`);
  return Array.from(companies);
}

// Metod 3: Sök efter "powered by teamtailor" via Google (via API om tillgängligt)
async function searchViaWebArchive() {
  console.log('\n🌐 Metod 3: Söker via Common Crawl index...');
  const companies = new Set();
  
  try {
    // Common Crawl har en index av alla crawlade domäner
    // Vi kan söka efter *.teamtailor.com
    const url = 'https://index.commoncrawl.org/CC-MAIN-2024-10-index?url=*.teamtailor.com/*&output=json';
    
    const response = await httpsGet(url);
    const lines = response.data.split('\n').filter(l => l.trim());
    
    lines.forEach(line => {
      try {
        const data = JSON.parse(line);
        const urlMatch = data.url?.match(/https?:\/\/([a-z0-9-]+)\.teamtailor\.com/i);
        if (urlMatch) {
          const subdomain = urlMatch[1];
          if (subdomain && !['www', 'app', 'dashboard', 'api'].includes(subdomain)) {
            companies.add(`https://${subdomain}.teamtailor.com/`);
          }
        }
      } catch (e) {
        // Skip invalid JSON
      }
    });
  } catch (error) {
    console.log('  ⚠️  Common Crawl search misslyckades');
  }
  
  console.log(`  ✅ Hittade ${companies.size} företag från Common Crawl`);
  return Array.from(companies);
}

// Metod 4: Hitta custom domains via TeamTailor's RSS detector
async function findCustomDomains() {
  console.log('\n🔍 Metod 4: Letar efter custom domains...');
  const companies = new Set();
  
  // Expanderad lista med svenska företag och organisationer
  const potentialCustomDomains = [
    // Tech & Startups
    'soundtrack', 'epidemic-sound', 'einride', 'northvolt', 'polestar',
    'klarna', 'spotify', 'minecraft', 'king', 'mojang',
    'truecaller', 'fishbrain', 'mentimeter', 'whereby', 'superside',
    'tink', 'lunar', 'anyfin', 'trustly', 'izettle', 'zettle',
    'bambuser', 'sinch', 'cellavision', 'qlik', 'cision',
    // E-commerce & Retail
    'nelly', 'nakd', 'bubbleroom', 'boozt', 'footway', 'qliro',
    'sellpy', 'vestiaire', 'vinted', 'blocket', 'tradera',
    // Health & Care
    'kry', 'doktor', 'mindler', 'neko', 'doctrin',
    'praktikertjanst', 'capio', 'aleris', 'varden',
    'sveakbt', 'svea', 'ellyhealthgroup', 'elly',
    // Proptech & Housing
    'hemnet', 'qasa', 'samtrygg', 'bostadsportal', 'homepal',
    'hyresbostader', 'bostad', 'akademiskahus',
    // Transportation & Logistics
    'budbee', 'instabox', 'instabee', 'urb-it', 'foodora', 'wolt',
    'bolt', 'uber', 'voi', 'lime', 'tier',
    // Food & Beverage
    'mathem', 'karma', 'matsmart', 'oatly', 'sproud',
    'lantmannen', 'arla', 'procordia', 'orkla',
    // Manufacturing & Industry
    'volvo', 'scania', 'polestar', 'koenigsegg',
    'electrolux', 'husqvarna', 'abb', 'sandvik', 'skf', 'saab',
    'atlas-copco', 'assa-abloy', 'getinge', 'elekta',
    // Retail Chains
    'ikea', 'hm', 'stadium', 'xxl', 'intersport', 'elgiganten',
    'ica', 'coop', 'axfood', 'willys', 'hemkop', 'citygross',
    'systembolaget', 'apoteket', 'kronans',
    // Finance & Banking
    'seb', 'swedbank', 'nordea', 'handelsbanken', 'sbab',
    'lansforsakringar', 'folksam', 'if', 'trygg-hansa',
    'avanza', 'nordnet', 'amex',
    // Telecom & Media
    'ericsson', 'nokia', 'telia', 'tre', 'telenor', 'comviq',
    'svt', 'sr', 'tv4', 'bonnier', 'schibsted', 'aftonbladet', 'dn',
    // Consulting & Services
    'deloitte', 'pwc', 'kpmg', 'ey', 'accenture',
    'bcg', 'mckinsey', 'bain', 'capgemini', 'hiq', 'knowit',
    // Gaming
    'paradox', 'sharkmob', 'starbreeze', 'embark', 'avalanche',
    'coffee-stain', 'dice', 'massive',
    // Energy & Environment
    'vattenfall', 'fortum', 'eon', 'statkraft',
    'northvolt', 'stegra', 'h2-green-steel',
    'greenely', 'tibber', 'aira', 'eliq', 'flower',
    // Public Sector (kan också använda TeamTailor)
    'stockholm', 'goteborg', 'malmo', 'uppsala',
    'regionstockholm', 'vgregion', 'skane',
    'arbetsformedlingen', 'csn', 'skatteverket',
    // Universities & Education
    'kth', 'ki', 'su', 'uu', 'lu', 'gu', 'umu', 'ltu',
    'academedia', 'jensen', 'nackademin', 'berghs',
    // Hospitality & Hotels
    'scandic', 'nordic-choice', 'elite', 'clarion',
    // Fashion & Design
    'acne', 'filippa-k', 'ganni', 'toteme', 'rodebjer',
    // Other services
    'manpower', 'adecco', 'randstad', 'academic-work',
    'tng', 'poolia', 'teamtailor'
  ];
  
  // Test olika URL patterns (svensk fokus med jobb.*/karriar.*)
  for (const company of potentialCustomDomains) {
    const urls = [
      // Svenska patterns (mest vanliga först)
      `https://jobb.${company}.se`,
      `https://karriar.${company}.se`,
      `https://karriär.${company}.se`,
      `https://job.${company}.se`,
      `https://jobs.${company}.se`,
      `https://career.${company}.se`,
      `https://careers.${company}.se`,
      // Internationella
      `https://career.${company}.com`,
      `https://careers.${company}.com`, 
      `https://jobs.${company}.com`,
      `https://career.${company}.io`,
      `https://careers.${company}.io`,
      `https://jobs.${company}.io`,
      // Nordiska varianter
      `https://jobb.${company}.no`,
      `https://jobb.${company}.dk`,
      `https://jobb.${company}.fi`,
      // Alternativa ändelser
      `https://career.${company}.org`,
      `https://jobs.${company}.org`
    ];
    
    for (const url of urls) {
      try {
        // Testa om sidan använder TeamTailor genom att kolla RSS-feed
        const rssUrl = url.endsWith('/') ? `${url}jobs.rss` : `${url}/jobs.rss`;
        const response = await httpsGet(rssUrl);
        
        if (response.statusCode === 200 && response.data.includes('teamtailor')) {
          companies.add(url + (url.endsWith('/') ? '' : '/'));
          console.log(`  ✅ Hittade custom domain: ${url}`);
        }
      } catch (e) {
        // Fortsätt
      }
      await new Promise(r => setTimeout(r, 200));
    }
  }
  
  console.log(`  ✅ Hittade ${companies.size} custom domains`);
  return Array.from(companies);
}

// Metod 5: Hitta via sitemap och robots.txt
async function findViaSitemap() {
  console.log('\n🗺️  Metod 5: Kollar TeamTailor sitemap...');
  const companies = new Set();
  
  try {
    const sitemaps = [
      'https://www.teamtailor.com/sitemap.xml',
      'https://www.teamtailor.com/sitemap_index.xml'
    ];
    
    for (const sitemapUrl of sitemaps) {
      try {
        const response = await httpsGet(sitemapUrl);
        const xml = response.data;
        
        // Hitta alla URLs i sitemap
        const urlRegex = /<loc>(.*?)<\/loc>/g;
        const matches = xml.matchAll(urlRegex);
        
        for (const match of matches) {
          const url = match[1];
          // Kolla om URL:en refererar till ett kundcase eller liknande
          if (url.includes('customer') || url.includes('case')) {
            // Hämta sidan och leta efter länkar
            try {
              const pageResponse = await httpsGet(url);
              const pageHtml = pageResponse.data;
              
              const companyRegex = /https?:\/\/([a-z0-9-]+)\.teamtailor\.com/gi;
              const companyMatches = pageHtml.matchAll(companyRegex);
              
              for (const companyMatch of companyMatches) {
                const subdomain = companyMatch[1];
                if (subdomain && !['www', 'app', 'dashboard', 'api'].includes(subdomain)) {
                  companies.add(`https://${subdomain}.teamtailor.com/`);
                }
              }
            } catch (e) {
              // Skip
            }
          }
        }
      } catch (e) {
        // Skip
      }
    }
  } catch (error) {
    console.log('  ⚠️  Sitemap search misslyckades');
  }
  
  console.log(`  ✅ Hittade ${companies.size} företag från sitemap`);
  return Array.from(companies);
}

// Verifiera att företaget har aktiva jobb
async function verifyCompany(url) {
  try {
    const rssUrl = url.endsWith('/') ? `${url}jobs.rss` : `${url}/jobs.rss`;
    const response = await httpsGet(rssUrl);
    
    if (response.statusCode === 200 && response.data.includes('<item>')) {
      // Räkna antal jobb
      const jobMatches = response.data.match(/<item>/g);
      const jobCount = jobMatches ? jobMatches.length : 0;
      
      // Hämta företagsnamn från RSS
      const titleMatch = response.data.match(/<title>([^<]+)<\/title>/);
      const name = titleMatch ? titleMatch[1].replace(' - Jobs', '').trim() : 'Unknown';
      
      return { url, rssUrl, name, jobCount, hasJobs: jobCount > 0 };
    }
  } catch (e) {
    // Fortsätt
  }
  return null;
}

// Huvudfunktion
async function main() {
  console.log('🚀 Automatisk TeamTailor Discovery\n');
  console.log('='.repeat(60));
  
  // Samla företag från alla metoder
  const allUrls = new Set();
  
  // Kör alla discovery-metoder
  const showcaseCompanies = await scrapeTeamtailorShowcase();
  showcaseCompanies.forEach(url => allUrls.add(url));
  
  const subdomains = await enumerateSubdomains();
  subdomains.forEach(url => allUrls.add(url));
  
  const webArchiveCompanies = await searchViaWebArchive();
  webArchiveCompanies.forEach(url => allUrls.add(url));
  
  const customDomains = await findCustomDomains();
  customDomains.forEach(url => allUrls.add(url));
  
  const sitemapCompanies = await findViaSitemap();
  sitemapCompanies.forEach(url => allUrls.add(url));
  
  console.log('\n' + '='.repeat(60));
  console.log(`📊 Totalt ${allUrls.size} unika URLs att verifiera\n`);
  console.log('🔍 Verifierar att företagen har aktiva jobb...\n');
  
  // Verifiera alla företag
  const verifiedCompanies = [];
  let count = 0;
  
  for (const url of allUrls) {
    count++;
    console.log(`[${count}/${allUrls.size}] Kollar: ${url}`);
    
    const result = await verifyCompany(url);
    if (result && result.hasJobs) {
      verifiedCompanies.push({
        name: result.name,
        careerSiteUrl: result.url,
        rssUrl: result.rssUrl,
        jobCount: result.jobCount,
        enabled: true
      });
      console.log(`  ✅ ${result.name} - ${result.jobCount} jobb\n`);
    }
    
    // Rate limit
    await new Promise(r => setTimeout(r, 500));
  }
  
  // Sortera efter antal jobb (minst först)
  verifiedCompanies.sort((a, b) => a.jobCount - b.jobCount);
  
  // Merge med befintliga
  const existingPath = path.join(__dirname, '..', 'teamtailor-companies.json');
  let existingCompanies = [];
  
  if (fs.existsSync(existingPath)) {
    const existing = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
    existingCompanies = existing.companies || [];
  }
  
  const allCompaniesMap = new Map();
  existingCompanies.forEach(c => allCompaniesMap.set(c.careerSiteUrl, c));
  verifiedCompanies.forEach(c => allCompaniesMap.set(c.careerSiteUrl, c));
  
  const finalCompanies = Array.from(allCompaniesMap.values());
  finalCompanies.sort((a, b) => a.name.localeCompare(b.name, 'sv'));
  
  // Spara
  const result = {
    discoveredAt: new Date().toISOString(),
    count: finalCompanies.length,
    newCompaniesFound: verifiedCompanies.length,
    companies: finalCompanies
  };
  
  fs.writeFileSync(existingPath, JSON.stringify(result, null, 2), 'utf8');
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ KLART!');
  console.log('='.repeat(60));
  console.log(`📊 Totalt antal företag: ${finalCompanies.length}`);
  console.log(`🆕 Nya företag: ${verifiedCompanies.length}`);
  console.log(`💾 Sparat till: teamtailor-companies.json`);
  
  // Visa de 10 minsta
  const smallest = verifiedCompanies.slice(0, 10);
  if (smallest.length > 0) {
    console.log('\n📌 Topp 10 minsta företag (mest intressanta):');
    smallest.forEach((c, i) => {
      console.log(`   ${i + 1}. ${c.name} - ${c.jobCount} jobb`);
    });
  }
}

main().catch(console.error);
