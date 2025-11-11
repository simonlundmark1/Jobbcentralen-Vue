/**
 * User profile for job matching
 */
export interface UserProfile {
  skills: string[]
  jobTitles: string[]
  experienceLevel: 'junior' | 'medior' | 'senior' | 'expert' | ''
  preferredLocations: string[]
  avoidKeywords: string[] // Keywords to avoid (e.g., 'konsult', 'säljare')
  createdAt: string
  updatedAt: string
}

export const defaultProfile: UserProfile = {
  skills: [],
  jobTitles: [],
  experienceLevel: '',
  preferredLocations: [],
  avoidKeywords: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

/**
 * Job with match information
 */
export interface JobWithMatch {
  job: any // SimpleJob from platsbanken.ts
  matchScore: number
  matchReasons: string[]
}
