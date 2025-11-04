import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Funktion för att göra HTTPS-förfrågan
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

// Kolla om en URL är giltig och har jobb
async function checkCareerSite(url) {
  console.log(`🔍 Kollar: ${url}`);
  
  try {
    const rssUrl = url.endsWith('/') ? `${url}jobs.rss` : `${url}/jobs.rss`;
    const data = await httpsGet(rssUrl);
    
    if (!data) return null;
    
    // Räkna antal jobb (om RSS-feed är tillgänglig)
    const jobCount = data.channel?.item?.length || 0;
    
    return { url, rssUrl, hasJobs: jobCount > 0, jobCount };
  } catch (error) {
    return null;
  }
}

// Hitta TeamTailor-företag via Google-liknande sökning
async function discoverCompanies() {
  console.log('🚀 Startar discovery av TeamTailor-företag...\n');
  
  const companies = new Map();
  const excludePatterns = [
    'www.teamtailor.com',
    'dashboard.teamtailor.com',
    'analytics.teamtailor.com',
    'hello.teamtailor.com',
    'highlights.teamtailor.com',
    'errors.teamtailor.com',
    'status.teamtailor.com',
    'updates.teamtailor.com',
    'docs.teamtailor.com',
    'partner.teamtailor.com',
    'support.teamtailor.com',
    'app.teamtailor.com',
    'career.teamtailor.com'
  ];

  // Lista med svenska företag och startups att kolla
  const potentialCompanies = [
    // Startups & Tech
    'soundtrack', 'epidemic-sound', 'einride', 'vimla', 'weld', 'normative',
    'tibber', 'greenely', 'aira', 'eliq', 'flower', 'ferroamp',
    'pleo', 'lunar', 'anyfin', 'lysa', 'qred', 'tink', 'klarna',
    'truecaller', 'fishbrain', 'mentimeter', 'whereby', 'superside',
    'budbee', 'instabox', 'instabee', 'urb-it', 'mata', 'mathem',
    'karma', 'matsmart', 'oatly', 'sproud', 'veg-of-lund',
    'paradox-interactive', 'sharkmob', 'starbreeze', 'embark-studios',
    'quickbit', 'btcx', 'safello', 'trijo', 'tessin',
    // E-commerce & Retail
    'nelly', 'na-kd', 'bubbleroom', 'boozt', 'footway', 'qliro',
    'sellpy', 'vestiaire-collective', 'vinted', 'blocket',
    // Healthtech
    'kry', 'doktor', 'mindler', 'neko-health', 'doctrin',
    // Proptech
    'hemnet', 'qasa', 'samtrygg', 'bostadsportal', 'homepal',
    // Services
    'telia', 'tre', 'comviq', 'hallon', 'vimla', 
    'svt', 'sr', 'mtr', 'sl', 'sj',
    // More established
    'spotify', 'minecraft', 'king', 'mojang',
    'volvo', 'scania', 'polestar', 'northvolt',
    'ikea', 'hm', 'stadium', 'xxl', 'intersport',
    'ica', 'coop', 'axfood', 'willys', 'hemkop',
    'seb', 'swedbank', 'handelsbanken', 'nordea', 'sbab', 'lansforsakringar',
    'ericsson', 'tele2', 'telenor', 'telia',
    'electrolux', 'husqvarna', 'abb', 'sandvik', 'skf',
    'accenture', 'deloitte', 'pwc', 'kpmg', 'ey', 'bcg', 'mckinsey',
    // Creative & Design
    'studiofloa', 'oakwood', 'forsman-bodenfors', 'nord-ddb',
    // SaaS & B2B
    'upsales', 'lime-technologies', 'fortnox', 'visma', 'tripletex',
    'funnel', 'supermetrics', 'quinyx', 'planday', 'bambora',
    // Consulting & Agencies  
    'transformator', 'valtech', 'prototyp', 'symbio', 'jayway',
    'factor10', 'tretton37', 'avega', 'knowit', 'hiq',
    // More startups
    'billogram', 'bokio', 'zettle', 'izettle', 'klarna',
    'acast', 'podme', 'storytel', 'bookbeat', 'nextory',
    'epidemic-sound', 'soundtrack', 'soundtrap', 'songtradr',
    'einride', 'volta-trucks', 'bzzt', 'yepstr', 'truecaller',
    'bambuser', 'sinch', 'twilio', 'messagebird', 'cellavision',
    // Insurance & Fintech
    'hedvig', 'insurello', 'bynk', 'lendo', 'zmarta',
    // Staffing & HR
    'teamtailor', 'tng', 'randstad', 'adecco', 'manpower', 'poolia',
    'academic-work', 'studentconsulting', 'uniflex', 'bemannia'
  ];

  console.log(`📋 Kollar ${potentialCompanies.length} företag...\n`);

  for (const company of potentialCompanies) {
    // Prova olika URL-format
    const urls = [
      `https://${company}.teamtailor.com`,
      `https://career.${company}.com`,
      `https://careers.${company}.com`,
      `https://jobs.${company}.com`,
      `https://career.${company}.se`,
      `https://careers.${company}.se`,
      `https://jobs.${company}.se`,
      `https://karriar.${company}.se`,
      `https://jobb.${company}.se`
    ];

    for (const url of urls) {
      // Skippa om URL:en är i exclude-listan
      if (excludePatterns.some(pattern => url.includes(pattern))) continue;
      
      // Skippa om vi redan kollat denna URL
      if (companies.has(url)) continue;

      const result = await checkCareerSite(url);
      
      if (result && result.hasJobs) {
        companies.set(url, {
          name: company.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          careerSiteUrl: result.url,
          rssUrl: result.rssUrl,
          jobCount: result.jobCount,
          enabled: true
        });
        console.log(`✅ Hittade: ${company} (${result.jobCount} jobb)\n`);
      }
      
      // Vänta lite för att inte överbelasta servrar
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return Array.from(companies.values());
}

// Huvudfunktion
async function main() {
  try {
    const companies = await discoverCompanies();
    
    // Sortera efter antal jobb (minst först - mindre företag = intressantare)
    companies.sort((a, b) => a.jobCount - b.jobCount);
    
    // Läs befintliga företag
    const existingPath = path.join(__dirname, '..', 'teamtailor-companies.json');
    let existingCompanies = [];
    
    if (fs.existsSync(existingPath)) {
      const existing = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
      existingCompanies = existing.companies || [];
    }
    
    // Merge nya och gamla (ta bort duplicat)
    const allCompaniesMap = new Map();
    
    // Lägg till befintliga först
    existingCompanies.forEach(c => {
      allCompaniesMap.set(c.careerSiteUrl, c);
    });
    
    // Lägg till nya (overwrite om de finns)
    companies.forEach(c => {
      allCompaniesMap.set(c.careerSiteUrl, c);
    });
    
    const finalCompanies = Array.from(allCompaniesMap.values());
    finalCompanies.sort((a, b) => a.name.localeCompare(b.name, 'sv'));
    
    // Spara resultat
    const result = {
      discoveredAt: new Date().toISOString(),
      count: finalCompanies.length,
      newCompaniesFound: companies.length,
      companies: finalCompanies
    };
    
    fs.writeFileSync(existingPath, JSON.stringify(result, null, 2), 'utf8');
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ KLART!');
    console.log('='.repeat(60));
    console.log(`📊 Totalt antal företag: ${finalCompanies.length}`);
    console.log(`🆕 Nya företag hittade: ${companies.length}`);
    console.log(`\n💾 Sparad till: teamtailor-companies.json`);
    console.log('\n🔥 Mindre företag (1-10 jobb) är listade först!');
    
    // Visa de 10 minsta företagen
    const smallest = companies.slice(0, 10);
    if (smallest.length > 0) {
      console.log('\n📌 Topp 10 minsta företag (mest intressanta):');
      smallest.forEach((c, i) => {
        console.log(`   ${i + 1}. ${c.name} - ${c.jobCount} jobb`);
      });
    }
    
  } catch (error) {
    console.error('❌ Fel:', error);
    process.exit(1);
  }
}

main();
