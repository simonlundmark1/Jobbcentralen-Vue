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
  
  // To add more companies, run: node scripts/discover-teamtailor-companies.js
  // Last discovery: 2025-10-22 Evening - Found 53+ companies from 230+ tested!
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
