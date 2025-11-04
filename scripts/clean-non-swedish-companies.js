import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the companies file
const filePath = path.join(__dirname, '..', 'teamtailor-companies.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Keywords that indicate non-Swedish companies
const excludeKeywords = [
  // Countries and regions
  'Germany', 'Deutschland', 'German', 
  'France', 'French', 'Paris',
  'Italy', 'Italia', 'Italian',
  'Greece', 'Greek',
  'Spain', 'Spanish', 'España', 'Consultoría',
  'Portugal', 'Portuguese',
  'UK', 'United Kingdom', 'Britain', 'British', 'Ltd', 'Plc',
  'USA', 'United States', 'America', 'American', 'Inc',
  'Denmark', 'Danmark', 'Danish',
  'Norway', 'Norge', 'Norwegian', ' AS', 'Nord-Norge',
  'Finland', 'Finnish', 'Suomi', ' Oy',
  'Belgium', 'Belgian', 'Belgique',
  'Netherlands', 'Dutch', 'Holland',
  'Austria', 'Austrian',
  'Switzerland', 'Swiss',
  'Poland', 'Polish', 'Polska', 'S.A.',
  'Hungary', 'Hungarian',
  'Czech', 'Praha',
  'Estonia', 'Eesti',
  'Lithuania', 'Lietuva',
  'Canada', 'Canadian',
  'Singapore',
  'Australia', 'Australian',
  'Dubai', 'Chalhoub',
  'Colombia',
  'Great Lakes', 'Midwest',
  'GmbH', // German company suffix
  'Group Site', // Morris Group Site
  'Leroy Merlin Greece',
  'Bricocenter Italia',
  'Academic Work Germany',
  'Doktor.De',
  'Huawei Research Center Germany',
  'Knauf Deutschland',
  'Knauf Group',
  'Knauf Belgium',
  'Knauf Praha',
  'Grupo MAS',
  'Grupo Hitec',
  'Grupo Binternational',
  'FYG Consultoría',
  'Innovamat',
  'MULTIVERSE COMPUTING',
  'Murfy',
  'Nude Project',
  'Heura Foods',
  'IKEA Eesti',
  'IKEA Lietuva',
  'KFC Suomi',
  'Jordbærpikene',
  'Lufthavnsvikar',
  'Pincho Nation Denmark',
  'Pincho Nation Norway',
  'Columbus Norway',
  'Crowe Norway',
  'DOGA',
  'HENT',
  'Heia Nord-Norge',
  'Netlife Design',
  'Nofence',
  'Norkart',
  'Nye og Kloke Hoder',
  'Oslo Entreprenørbedrift',
  'Attendo Danmark',
  'Dagens Byggeri',
  'DFM',
  'Forenede Care',
  'Loomis Norge',
  'Cramo Finland',
  'Finnresta',
  'Fremantle Finland',
  'Funidata',
  'Hakonen konserni',
  'iLOQ',
  'IQM Quantum Computers',
  'Kattokeskus',
  'LSK Group Oy',
  'Parcero Marketing Partners Oy',
  'Paragraaffi Oy',
  'Adapei 45',
  'AIS',
  'Atecna',
  'Ateme',
  'BETC',
  'Bihr',
  'CABAIA',
  'Cedreo',
  'Click&Boat',
  'Deepki',
  'Dolead',
  'Leocare',
  'Lydia Solutions',
  'M Room',
  'Odigo',
  'Ogilvy Paris',
  'PhantomBuster',
  'Brut. France',
  'Once For All',
  'Anthony Nolan',
  'All Response Media',
  'Arsenal Football Club',
  'BARBRI',
  'Benifex',
  'Blue Ventures',
  'Celebrus Technologies',
  'D&AD',
  'Edge Environment',
  'Gattaca Plc',
  'Hanbury Strategy',
  'Heatherwick Studio',
  'HKA Global',
  'How&How',
  'IMPOWER Consulting',
  'LRG',
  'Medefer',
  'Patchwork Health',
  'CA Customer Alliance',
  'Caparol',
  'EAT HAPPY GROUP',
  'Capgemini',
  'David Kennedy Recruitment',
  'Dingo Recruitment',
  'Excellerate Services',
  'AIRE Ancient Baths',
  'Anicura Portugal',
  'CI Games',
  'Creepy Jar',
  'MDPI Canada',
  'MDPI Poland',
  'MDPI Singapore',
  'Ministry Architects',
  'Fooda',
  'Frauenthal Gnotec',
  'Fred Perry',
  'Headway Inc',
  'Morris Great Lakes',
  'Morris Group Site',
  'Morris Group, Inc',
  'Morris Midwest',
  'The Interface Financial Group',
  'Dataloy Systems AS',
  'Digiflow AS',
  'KBRW',
  'Keyrus Belgium',
  'Keyrus Colombia',
  'KPMG Global Services Hungary',
  'ML6',
  'Monday Media',
  'Doodle'
];

// Filter companies
const filteredCompanies = data.companies.filter(company => {
  const name = company.name || '';
  const url = company.careerSiteUrl || '';
  
  // Check if company name or URL contains any exclude keywords
  const shouldExclude = excludeKeywords.some(keyword => {
    const keywordLower = keyword.toLowerCase();
    const nameLower = name.toLowerCase();
    const urlLower = url.toLowerCase();
    
    return nameLower.includes(keywordLower) || urlLower.includes(keywordLower);
  });
  
  return !shouldExclude;
});

// Update the data
data.companies = filteredCompanies;
data.count = filteredCompanies.length;
data.discoveredAt = new Date().toISOString();
data.newCompaniesFound = 0;

// Write back to file
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

console.log(`✓ Cleaned companies file`);
console.log(`  Original count: ${data.companies.length + (367 - filteredCompanies.length)}`);
console.log(`  Removed: ${367 - filteredCompanies.length}`);
console.log(`  New count: ${filteredCompanies.length}`);
