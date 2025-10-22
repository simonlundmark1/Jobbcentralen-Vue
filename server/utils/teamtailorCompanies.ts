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
  // Verified working companies (auto-discovered 2025-01-22)
  {
    name: 'Teamtailor',
    careerSiteUrl: 'https://career.teamtailor.com',
    enabled: true
  },
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
    name: 'Kry',
    careerSiteUrl: 'https://career.kry.se',
    enabled: true
  },
  {
    name: 'Karma',
    careerSiteUrl: 'https://careers.karma.life',
    enabled: true
  },
  {
    name: 'Fishbrain',
    careerSiteUrl: 'https://careers.fishbrain.com',
    enabled: true
  },
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
    name: 'Bazooka',
    careerSiteUrl: 'https://careers.bazooka.se',
    enabled: true
  },
  {
    name: 'Soundtrack Your Brand',
    careerSiteUrl: 'https://careers.soundtrackyourbrand.com',
    enabled: true
  },
  
  // To add more companies, run: node scripts/discover-teamtailor-companies.js
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
