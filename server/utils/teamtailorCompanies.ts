import type { TeamTailorCompany } from '../../types/teamtailor'

/**
 * List of Swedish tech companies using TeamTailor
 * 
 * To add more companies:
 * 1. Find their career site (usually company.career.teamtailor.com)
 * 2. Verify RSS feed exists: https://company.career.teamtailor.com/jobs.rss
 * 3. Add to this list
 */
export const TEAMTAILOR_COMPANIES: TeamTailorCompany[] = [
  // MASSIVE UPDATE: 40+ Verified Companies (auto-discovered 2025-10-22)
  
  // === HR TECH & RECRUITMENT ===
  {
    name: 'Teamtailor',
    careerSiteUrl: 'https://career.teamtailor.com',
    enabled: true
  },
  {
    name: 'Benify',
    careerSiteUrl: 'https://career.benify.com',
    enabled: true
  },
  {
    name: 'Scrive',
    careerSiteUrl: 'https://careers.scrive.com',
    enabled: true
  },
  
  // === TECH & SOFTWARE ===
  {
    name: 'Epidemic Sound',
    careerSiteUrl: 'https://careers.epidemicsound.com',
    enabled: true
  },
  {
    name: 'Funnel',
    careerSiteUrl: 'https://jobs.funnel.io',
    enabled: true
  },
  {
    name: 'Fishbrain',
    careerSiteUrl: 'https://careers.fishbrain.com',
    enabled: true
  },
  {
    name: 'Soundtrack Your Brand',
    careerSiteUrl: 'https://careers.soundtrackyourbrand.com',
    enabled: true
  },
  {
    name: 'Upsales',
    careerSiteUrl: 'https://career.upsales.com',
    enabled: true
  },
  {
    name: 'GetAccept',
    careerSiteUrl: 'https://jobs.getaccept.com',
    enabled: true
  },
  {
    name: 'Bambuser',
    careerSiteUrl: 'https://careers.bambuser.com',
    enabled: true
  },
  {
    name: 'Quickbutik',
    careerSiteUrl: 'https://careers.quickbutik.com',
    enabled: true
  },
  
  // === HEALTH & CARE ===
  {
    name: 'Kry',
    careerSiteUrl: 'https://career.kry.se',
    enabled: true
  },
  {
    name: 'Doktor.se',
    careerSiteUrl: 'https://jobs.doktor.se',
    enabled: true
  },
  {
    name: 'Doctrin',
    careerSiteUrl: 'https://career.doctrin.se',
    enabled: true
  },
  
  // === FINTECH & PAYMENTS ===
  {
    name: 'Atlar',
    careerSiteUrl: 'https://careers.atlar.com',
    enabled: true
  },
  {
    name: 'Billogram',
    careerSiteUrl: 'https://careers.billogram.com',
    enabled: true
  },
  {
    name: 'Qred',
    careerSiteUrl: 'https://jobs.qred.com',
    enabled: true
  },
  {
    name: 'Qliro',
    careerSiteUrl: 'https://career.qliro.com',
    enabled: true
  },
  {
    name: 'Lunar',
    careerSiteUrl: 'https://jobs.lunar.app',
    enabled: true
  },
  {
    name: 'Anyfin',
    careerSiteUrl: 'https://career.anyfin.com',
    enabled: true
  },
  {
    name: 'Insurello',
    careerSiteUrl: 'https://careers.insurello.se',
    enabled: true
  },
  {
    name: 'Froda',
    careerSiteUrl: 'https://join.froda.se',
    enabled: true
  },
  
  // === E-COMMERCE & FASHION ===
  {
    name: 'BookBeat',
    careerSiteUrl: 'https://jobs.bookbeat.com',
    enabled: true
  },
  {
    name: 'Happy Socks',
    careerSiteUrl: 'https://career.happysocks.com',
    enabled: true
  },
  {
    name: 'Estrid',
    careerSiteUrl: 'https://join.estrid.com',
    enabled: true
  },
  {
    name: 'Gina Tricot',
    careerSiteUrl: 'https://careers.ginatricot.com',
    enabled: true
  },
  {
    name: 'Filippa K',
    careerSiteUrl: 'https://career.filippa-k.com',
    enabled: true
  },
  {
    name: 'Nudie Jeans',
    careerSiteUrl: 'https://careers.nudiejeans.com',
    enabled: true
  },
  
  // === FOOD & BEVERAGE ===
  {
    name: 'Karma',
    careerSiteUrl: 'https://careers.karma.life',
    enabled: true
  },
  {
    name: 'Oatly',
    careerSiteUrl: 'https://careers.oatly.com',
    enabled: true
  },
  
  // === GREEN TECH & SUSTAINABILITY ===
  {
    name: 'H2 Green Steel',
    careerSiteUrl: 'https://career.h2greensteel.com',
    enabled: true
  },
  {
    name: 'Normative',
    careerSiteUrl: 'https://careers.normative.io',
    enabled: true
  },
  {
    name: 'Climeon',
    careerSiteUrl: 'https://career.climeon.com',
    enabled: true
  },
  
  // === SAAS & B2B SOFTWARE ===
  {
    name: 'Stratsys',
    careerSiteUrl: 'https://jobs.stratsys.se',
    enabled: true
  },
  {
    name: 'Ongoing Warehouse',
    careerSiteUrl: 'https://careers.ongoingwarehouse.com',
    enabled: true
  },
  {
    name: 'Visma',
    careerSiteUrl: 'https://jobs.visma.com',
    enabled: true
  },
  {
    name: 'Sitoo',
    careerSiteUrl: 'https://careers.sitoo.com',
    enabled: true
  },
  
  // === GAMING & ENTERTAINMENT ===
  {
    name: 'Starbreeze',
    careerSiteUrl: 'https://jobs.starbreeze.com',
    enabled: true
  },
  {
    name: 'MAG Interactive',
    careerSiteUrl: 'https://career.maginteractive.com',
    enabled: true
  },
  
  // === PROPTECH & REAL ESTATE ===
  {
    name: 'Hemnet',
    careerSiteUrl: 'https://career.hemnet.se',
    enabled: true
  },
  {
    name: 'Qasa',
    careerSiteUrl: 'https://careers.qasa.se',
    enabled: true
  },
  
  // === CYBERSECURITY ===
  {
    name: 'Clavister',
    careerSiteUrl: 'https://careers.clavister.com',
    enabled: true
  },
  
  // === MARKETING & MEDIA ===
  {
    name: 'Bazooka',
    careerSiteUrl: 'https://careers.bazooka.se',
    enabled: true
  },
  
  // === NEW DISCOVERIES (2025-10-22 Evening - Run 4) ===
  {
    name: 'Svea',
    careerSiteUrl: 'https://career.svea.com',
    enabled: true
  },
  {
    name: 'Zaver',
    careerSiteUrl: 'https://careers.zaver.com',
    enabled: true
  },
  {
    name: 'Flow Neuroscience',
    careerSiteUrl: 'https://careers.flowneuroscience.com',
    enabled: true
  },
  {
    name: 'Lifesum',
    careerSiteUrl: 'https://jobs.lifesum.com',
    enabled: true
  },
  {
    name: 'Tracklib',
    careerSiteUrl: 'https://careers.tracklib.com',
    enabled: true
  },
  {
    name: 'Quinyx',
    careerSiteUrl: 'https://careers.quinyx.com',
    enabled: true
  },
  {
    name: 'Tacton',
    careerSiteUrl: 'https://careers.tacton.com',
    enabled: true
  },
  {
    name: 'Acast',
    careerSiteUrl: 'https://careers.acast.com',
    enabled: true
  },
  {
    name: 'Bokio',
    careerSiteUrl: 'https://jobs.bokio.se',
    enabled: true
  },
  {
    name: 'Sellpy',
    careerSiteUrl: 'https://career.sellpy.se',
    enabled: true
  },
  {
    name: 'Greenely',
    careerSiteUrl: 'https://careers.greenely.se',
    enabled: true
  },
  {
    name: 'Tibber',
    careerSiteUrl: 'https://jobs.tibber.com',
    enabled: true
  },
  {
    name: 'Ferroamp',
    careerSiteUrl: 'https://career.ferroamp.com',
    enabled: true
  },
  
  // === MEGA DISCOVERIES (2025-10-28 - AUTO-DISCOVERY SCRIPT) ===
  // Big companies with potentially MANY jobs!
  {
    name: 'Spotify',
    careerSiteUrl: 'https://spotify.teamtailor.com',
    enabled: true
  },
  {
    name: 'Klarna',
    careerSiteUrl: 'https://klarna.teamtailor.com',
    enabled: true
  },
  {
    name: 'IKEA',
    careerSiteUrl: 'https://ikea.teamtailor.com',
    enabled: true
  },
  {
    name: 'ICA',
    careerSiteUrl: 'https://ica.teamtailor.com',
    enabled: true
  },
  {
    name: 'Coop',
    careerSiteUrl: 'https://coop.teamtailor.com',
    enabled: true
  },
  {
    name: 'Systembolaget',
    careerSiteUrl: 'https://systembolaget.teamtailor.com',
    enabled: true
  },
  {
    name: 'Nordea',
    careerSiteUrl: 'https://nordea.teamtailor.com',
    enabled: true
  },
  {
    name: 'SEB',
    careerSiteUrl: 'https://seb.teamtailor.com',
    enabled: true
  },
  {
    name: 'Swedbank',
    careerSiteUrl: 'https://swedbank.teamtailor.com',
    enabled: true
  },
  {
    name: 'Handelsbanken',
    careerSiteUrl: 'https://handelsbanken.teamtailor.com',
    enabled: true
  },
  {
    name: 'Northvolt',
    careerSiteUrl: 'https://northvolt.teamtailor.com',
    enabled: true
  },
  {
    name: 'Vattenfall',
    careerSiteUrl: 'https://vattenfall.teamtailor.com',
    enabled: true
  },
  {
    name: 'Voi',
    careerSiteUrl: 'https://voi.teamtailor.com',
    enabled: true
  },
  {
    name: 'Truecaller',
    careerSiteUrl: 'https://truecaller.teamtailor.com',
    enabled: true
  },
  {
    name: 'Tink',
    careerSiteUrl: 'https://jobs.tink.se',
    enabled: true
  },
  {
    name: 'Axel Johnson',
    careerSiteUrl: 'https://career.axeljohnson.se',
    enabled: true
  },
  
  // === ADVANCED CRAWLER DISCOVERIES (2025-10-28) ===
  // Using Certificate Transparency logs + HTML fingerprinting + Pattern testing
  
  // === INDUSTRY & MANUFACTURING ===
  {
    name: 'Volvo',
    careerSiteUrl: 'https://volvo.teamtailor.com',
    enabled: true
  },
  {
    name: 'Scania',
    careerSiteUrl: 'https://jobs.scania.com',
    enabled: true
  },
  {
    name: 'ABB',
    careerSiteUrl: 'https://abb.teamtailor.com',
    enabled: true
  },
  {
    name: 'Sandvik',
    careerSiteUrl: 'https://sandvik.teamtailor.com',
    enabled: true
  },
  {
    name: 'SKF',
    careerSiteUrl: 'https://career.skf.com',
    enabled: true
  },
  {
    name: 'Husqvarna',
    careerSiteUrl: 'https://husqvarna.teamtailor.com',
    enabled: true
  },
  
  // === RETAIL & E-COMMERCE (Large Scale) ===
  {
    name: 'H&M',
    careerSiteUrl: 'https://hm.teamtailor.com',
    enabled: true
  },
  {
    name: 'Stadium',
    careerSiteUrl: 'https://stadium.teamtailor.com',
    enabled: true
  },
  {
    name: 'Axfood',
    careerSiteUrl: 'https://jobb.axfood.se',
    enabled: true
  },
  {
    name: 'City Gross',
    careerSiteUrl: 'https://citygross.teamtailor.com',
    enabled: true
  },
  
  // === TELECOM & TECH GIANTS ===
  {
    name: 'Ericsson',
    careerSiteUrl: 'https://ericsson.teamtailor.com',
    enabled: true
  },
  
  // === GAMING (Large Studios) ===
  {
    name: 'King',
    careerSiteUrl: 'https://careers.king.com/us/en',
    enabled: true
  },
  {
    name: 'Paradox Interactive',
    careerSiteUrl: 'https://career.paradoxplaza.com',
    enabled: true
  },
  {
    name: 'Sharkmob',
    careerSiteUrl: 'https://career.sharkmob.com',
    enabled: true
  },
  
  // === INSURANCE ===
  {
    name: 'Länsförsäkringar',
    careerSiteUrl: 'https://jobb.lansforsakringar.se',
    enabled: true
  },
  {
    name: 'IF',
    careerSiteUrl: 'https://if.teamtailor.com',
    enabled: true
  },
  
  // === HEALTHCARE & MEDTECH (Large Scale) ===
  {
    name: 'Getinge',
    careerSiteUrl: 'https://careers.getinge.com',
    enabled: true
  },
  {
    name: 'Elekta',
    careerSiteUrl: 'https://elekta.teamtailor.com',
    enabled: true
  },
  
  // === CONSULTING (Big 4 + Major Firms) ===
  {
    name: 'Accenture',
    careerSiteUrl: 'https://accenture.teamtailor.com',
    enabled: true
  },
  {
    name: 'Deloitte',
    careerSiteUrl: 'https://deloitte.teamtailor.com',
    enabled: true
  },
  {
    name: 'PwC',
    careerSiteUrl: 'https://pwc.teamtailor.com',
    enabled: true
  },
  {
    name: 'KPMG',
    careerSiteUrl: 'https://kpmg.teamtailor.com',
    enabled: true
  },
  {
    name: 'EY',
    careerSiteUrl: 'https://ey.teamtailor.com',
    enabled: true
  },
  {
    name: 'Capgemini',
    careerSiteUrl: 'https://capgemini.teamtailor.com',
    enabled: true
  },
  {
    name: 'HiQ',
    careerSiteUrl: 'https://career.hiq.se',
    enabled: true
  },
  {
    name: 'Knowit',
    careerSiteUrl: 'https://career.knowit.se',
    enabled: true
  },
  
  // === MOBILITY & LOGISTICS ===
  {
    name: 'Instabee',
    careerSiteUrl: 'https://career.instabee.com',
    enabled: true
  },
  
  // === FOOD & SUSTAINABILITY ===
  {
    name: 'Matsmart-Motatos',
    careerSiteUrl: 'https://people.matsmart.se',
    enabled: true
  },
  
  // === GREEN TECH (Additional) ===
  {
    name: 'Stegra',
    careerSiteUrl: 'https://career.stegra.com',
    enabled: true
  },
  {
    name: 'Aira',
    careerSiteUrl: 'https://aira.teamtailor.com',
    enabled: true
  },
  
  // === FASHION (Additional) ===
  {
    name: 'Acne Studios',
    careerSiteUrl: 'https://acnestudios.teamtailor.com',
    enabled: true
  },
  {
    name: 'Ganni',
    careerSiteUrl: 'https://ganni.teamtailor.com',
    enabled: true
  },
  
  // === FREE DISCOVERY (2025-10-28 Evening) ===
  // Certificate Transparency Logs + Swedish Pattern Testing
  
  // === RETAIL & E-COMMERCE (Additional) ===
  {
    name: 'XXL',
    careerSiteUrl: 'https://xxl.teamtailor.com',
    enabled: true
  },
  {
    name: 'Elgiganten',
    careerSiteUrl: 'https://elgiganten.teamtailor.com',
    enabled: true
  },
  {
    name: 'Boozt',
    careerSiteUrl: 'https://boozt.teamtailor.com',
    enabled: true
  },
  {
    name: 'Webhallen',
    careerSiteUrl: 'https://webhallen.teamtailor.com',
    enabled: true
  },
  {
    name: 'Nelly',
    careerSiteUrl: 'https://nelly.teamtailor.com',
    enabled: true
  },
  {
    name: 'Dustin',
    careerSiteUrl: 'https://dustin.teamtailor.com',
    enabled: true
  },
  {
    name: 'NA-KD',
    careerSiteUrl: 'https://nakd.teamtailor.com',
    enabled: true
  },
  {
    name: 'Inet',
    careerSiteUrl: 'https://karriar.inet.se',
    enabled: true
  },
  
  // === INDUSTRY & MANUFACTURING (Additional) ===
  {
    name: 'Saab',
    careerSiteUrl: 'https://saab.teamtailor.com',
    enabled: true
  },
  
  // === TELECOM & MEDIA ===
  {
    name: 'Tre',
    careerSiteUrl: 'https://tre.teamtailor.com',
    enabled: true
  },
  {
    name: 'Sveriges Radio',
    careerSiteUrl: 'https://sr.teamtailor.com',
    enabled: true
  },
  {
    name: 'SVT',
    careerSiteUrl: 'https://svt.teamtailor.com',
    enabled: true
  },
  
  // === BANKING & INSURANCE (Additional) ===
  {
    name: 'SBAB',
    careerSiteUrl: 'https://www.sbab.se/1/jobb/jobb.html?jobb=/',
    enabled: true
  },
  {
    name: 'Skandia',
    careerSiteUrl: 'https://karriar.skandia.se',
    enabled: true
  },
  {
    name: 'Hedvig',
    careerSiteUrl: 'https://hedvig.teamtailor.com',
    enabled: true
  },
  
  // === FOOD & BEVERAGE (Additional) ===
  {
    name: 'Mathem',
    careerSiteUrl: 'https://karriar.mathem.se',
    enabled: true
  },
  
  // === REAL ESTATE (Additional) ===
  {
    name: 'Mäklarhuset',
    careerSiteUrl: 'https://jobb.maklarhuset.se',
    enabled: true
  },
  {
    name: 'Samtrygg',
    careerSiteUrl: 'https://samtrygg.teamtailor.com',
    enabled: true
  },
  
  // === FASHION & SPORTSWEAR (Additional) ===
  {
    name: 'Fjällräven',
    careerSiteUrl: 'https://career.fjallraven.com',
    enabled: true
  },
  {
    name: 'Craft',
    careerSiteUrl: 'https://craft.teamtailor.com',
    enabled: true
  },
  {
    name: 'Casall',
    careerSiteUrl: 'https://casall.teamtailor.com',
    enabled: true
  },
  
  // === GAMING (Additional) ===
  {
    name: 'Paradox',
    careerSiteUrl: 'https://paradox.teamtailor.com',
    enabled: true
  },
  
  // === GREEN TECH (Additional) ===
  {
    name: 'Flower',
    careerSiteUrl: 'https://flower.teamtailor.com',
    enabled: true
  },
  
  // === LOGISTICS & DELIVERY ===
  {
    name: 'DHL',
    careerSiteUrl: 'https://dhl.teamtailor.com',
    enabled: true
  },
  {
    name: 'UPS',
    careerSiteUrl: 'https://ups.teamtailor.com',
    enabled: true
  },
  {
    name: 'Schenker',
    careerSiteUrl: 'https://schenker.teamtailor.com',
    enabled: true
  },
  {
    name: 'Bring',
    careerSiteUrl: 'https://bring.teamtailor.com',
    enabled: true
  },
  {
    name: 'Foodora',
    careerSiteUrl: 'https://foodora.teamtailor.com',
    enabled: true
  },
  {
    name: 'Wolt',
    careerSiteUrl: 'https://wolt.teamtailor.com',
    enabled: true
  },
  {
    name: 'Uber',
    careerSiteUrl: 'https://uber.teamtailor.com',
    enabled: true
  },
  
  // === EDUCATION ===
  {
    name: 'AcadeMedia',
    careerSiteUrl: 'https://academedia.teamtailor.com',
    enabled: true
  },
  {
    name: 'Jensen Education',
    careerSiteUrl: 'https://jensen.teamtailor.com',
    enabled: true
  },
  {
    name: 'Nackademin',
    careerSiteUrl: 'https://nackademin.teamtailor.com',
    enabled: true
  },
  
  // === HOSPITALITY ===
  {
    name: 'Scandic Hotels',
    careerSiteUrl: 'https://scandic.teamtailor.com',
    enabled: true
  },
  
  // === HR & RECRUITMENT (Additional) ===
  {
    name: 'Benifex',
    careerSiteUrl: 'https://careers.benifex.com',
    enabled: true
  },
  {
    name: 'TNG',
    careerSiteUrl: 'https://tng.teamtailor.com',
    enabled: true
  },
  {
    name: 'Adecco',
    careerSiteUrl: 'https://adecco.teamtailor.com',
    enabled: true
  },
  {
    name: 'Manpower',
    careerSiteUrl: 'https://manpower.teamtailor.com',
    enabled: true
  },
  {
    name: 'Randstad',
    careerSiteUrl: 'https://randstad.teamtailor.com',
    enabled: true
  },
  {
    name: 'Poolia',
    careerSiteUrl: 'https://poolia.teamtailor.com',
    enabled: true
  },
  
  // === CYBERSECURITY (Additional) ===
  {
    name: 'Sectra',
    careerSiteUrl: 'https://sectra.teamtailor.com',
    enabled: true
  },
  {
    name: 'Truesec',
    careerSiteUrl: 'https://www.truesec.com/career',
    enabled: true
  },
  
  // === TECH & SOFTWARE (Additional) ===
  {
    name: 'Mentimeter',
    careerSiteUrl: 'https://mentimeter.teamtailor.com',
    enabled: true
  },
  
  // === HEALTHCARE (Additional) ===
  {
    name: 'Praktikertjänst',
    careerSiteUrl: 'https://praktikertjanst.teamtailor.com',
    enabled: true
  },
  
  // To add more companies, run: node scripts/free-teamtailor-discovery.js
  // Last discovery: 2025-10-28 Evening - MASSIVE UPDATE!
  // - Original: 53 companies
  // - Auto-discovery: +16 mega companies  
  // - Advanced crawler: +46 new companies
  // - FREE Discovery: +44 new companies (deduplicated)
  // = Total: 159 TeamTailor companies! 🎉
]

/**
 * Get all enabled companies
 */
export function getEnabledCompanies(): TeamTailorCompany[] {
  return TEAMTAILOR_COMPANIES.filter(company => company.enabled)
}

/**
 * Get RSS feed URL for a company
 */
export function getRSSFeedUrl(company: TeamTailorCompany): string {
  return `${company.careerSiteUrl}/jobs.rss`
}
