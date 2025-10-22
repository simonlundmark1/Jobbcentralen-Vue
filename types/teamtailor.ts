// TeamTailor RSS Feed Types
export interface TeamTailorRSSItem {
  title: string
  description: string
  link: string
  pubDate: string
  guid: string
  'teamtailor:remote': string
  'teamtailor:location': string[]
  'teamtailor:department': string
  'teamtailor:role': string
}

export interface TeamTailorRSSFeed {
  channel: {
    title: string
    link: string
    description: string
    item: TeamTailorRSSItem[]
  }
}

// Normalized TeamTailor job format (before converting to SimpleJob)
export interface TeamTailorJob {
  id: string
  title: string
  company: string
  description: string
  url: string
  location: string[]
  department: string
  role: string
  isRemote: boolean
  publicationDate: string
}

// Company configuration
export interface TeamTailorCompany {
  name: string
  careerSiteUrl: string
  enabled: boolean
}
