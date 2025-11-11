import type { Profile } from '../composables/useProfile'
import type { SimpleJob } from '../types/platsbanken'

/**
 * Job with match information
 */
export interface JobWithMatch {
  job: SimpleJob
  matchScore: number
  matchReasons: string[]
}

/**
 * Synonym mappings for skills and job titles
 * Maps common variations to a canonical form
 */
export const skillSynonyms: Record<string, string[]> = {
  // Frontend
  'react': ['react', 'reactjs', 'react.js', 'react native', 'react utvecklare', 'react developer'],
  'vue': ['vue', 'vuejs', 'vue.js', 'vue 3', 'nuxt', 'nuxtjs', 'vue utvecklare'],
  'angular': ['angular', 'angularjs', 'angular 2+', 'angular utvecklare'],
  'svelte': ['svelte', 'sveltekit'],
  'typescript': ['typescript', 'type script'],
  'javascript': ['javascript', 'ecmascript', 'es6', 'es2015'],
  'html': ['html', 'html5'],
  'css': ['css', 'css3', 'scss', 'sass', 'less', 'styled-components'],
  'tailwind': ['tailwind', 'tailwindcss', 'tailwind css'],
  
  // Backend
  'node': ['node', 'nodejs', 'node.js', 'express', 'expressjs', 'nestjs'],
  'python': ['python', 'django', 'flask', 'fastapi'],
  'java': ['java', 'spring', 'spring boot'],
  'csharp': ['c#', 'csharp', '.net', 'dotnet', 'asp.net'],
  'go': ['go', 'golang'],
  'php': ['php', 'laravel', 'symfony'],
  'ruby': ['ruby', 'rails', 'ruby on rails'],
  
  // Databases
  'sql': ['sql', 'mysql', 'postgresql', 'postgres', 'sqlite'],
  'mongodb': ['mongodb', 'mongo', 'nosql'],
  'redis': ['redis', 'cache'],
  
  // Cloud & DevOps
  'aws': ['aws', 'amazon web services', 'ec2', 's3', 'lambda'],
  'azure': ['azure', 'microsoft azure'],
  'docker': ['docker', 'containerization', 'containers'],
  'kubernetes': ['kubernetes', 'k8s'],
  'git': ['git', 'github', 'gitlab', 'version control'],
  
  // Mobile
  'ios': ['ios', 'swift', 'objective-c', 'xcode'],
  'android': ['android', 'kotlin', 'java android'],
  'flutter': ['flutter', 'dart'],
  
  // Design
  'figma': ['figma', 'design', 'ui design'],
  'photoshop': ['photoshop', 'ps', 'adobe photoshop'],
  'sketch': ['sketch', 'sketch app']
}

export const jobTitleSynonyms: Record<string, string[]> = {
  'frontend': [
    'frontend', 'front-end', 'front end', 'frontendutvecklare', 'frontend developer',
    'front end developer', 'frontend engineer', 'ui developer', 'web developer'
  ],
  'backend': [
    'backend', 'back-end', 'back end', 'backendutvecklare', 'backend developer', 
    'back end developer', 'backend engineer', 'server developer', 'api developer'
  ],
  'fullstack': [
    'fullstack', 'full-stack', 'full stack', 'fullstackutvecklare', 'fullstack developer',
    'full stack developer', 'fullstack engineer', 'webbutvecklare', 'web developer'
  ],
  'designer': [
    'designer', 'ui designer', 'ux designer', 'product designer', 'web designer',
    'grafisk designer', 'digital designer', 'interaction designer'
  ],
  'devops': [
    'devops', 'dev ops', 'devops engineer', 'infrastructure engineer', 
    'cloud engineer', 'platform engineer', 'sre', 'site reliability engineer'
  ],
  'data': [
    'data scientist', 'data engineer', 'data analyst', 'machine learning engineer',
    'ml engineer', 'ai engineer', 'business intelligence', 'bi developer'
  ],
  'mobile': [
    'mobile developer', 'ios developer', 'android developer', 'app developer',
    'mobile engineer', 'apputvecklare'
  ],
  'projektledare': [
    'projektledare', 'project manager', 'scrum master', 'agile coach',
    'product owner', 'product manager', 'tech lead', 'team lead'
  ]
}

/**
 * Calculate match score for a job based on user profile
 */
export function calculateJobMatch(job: SimpleJob, profile: Profile): JobWithMatch {
  let score = 0
  const reasons: string[] = []
  const jobText = `${job.title} ${job.description}`.toLowerCase()
  
  // 1. Skills matching (10 points per skill)
  profile.skills.forEach(skill => {
    const skillLower = skill.toLowerCase()
    const synonyms = skillSynonyms[skillLower] || [skillLower]
    
    // Use word boundary matching to avoid false positives (e.g., "ts" matching "arbets")
    const matchedSynonym = synonyms.find(synonym => {
      // Escape special regex characters
      const escapedSynonym = synonym.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      // Use word boundary for complete words, but also allow matching in compound words with dash
      const pattern = new RegExp(`(\\b|-)${escapedSynonym}(\\b|-)`, 'i')
      return pattern.test(jobText)
    })
    if (matchedSynonym) {
      score += 10
      reasons.push(`Skill: ${skill}`)
    }
  })
  
  // 2. Job title matching (20 points per title)
  profile.jobTitles.forEach(title => {
    const titleLower = title.toLowerCase()
    const synonyms = jobTitleSynonyms[titleLower] || [titleLower]
    
    // Use word boundary matching for more accurate matches
    const matchedSynonym = synonyms.find(synonym => {
      const escapedSynonym = synonym.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const pattern = new RegExp(`(\\b|-)${escapedSynonym}(\\b|-)`, 'i')
      return pattern.test(jobText)
    })
    if (matchedSynonym) {
      score += 20
      reasons.push(`Jobbtitel: ${title}`)
    }
  })
  
  // 3. Location matching (15 points)
  if (profile.preferredLocations.length > 0) {
    const jobLocation = job.location.toLowerCase()
    const locationMatch = profile.preferredLocations.some(loc => 
      jobLocation.includes(loc.toLowerCase()) || 
      job.municipality.toLowerCase().includes(loc.toLowerCase())
    )
    if (locationMatch) {
      score += 15
      reasons.push(`Plats: ${job.location}`)
    }
  }
  
  
  // 5. Avoid keywords (subtract 50 points)
  profile.avoidKeywords.forEach(keyword => {
    if (jobText.includes(keyword.toLowerCase())) {
      score -= 50
      reasons.push(`Undviker: ${keyword}`)
    }
  })
  
  // 6. Remote work bonus (if profile has "remote" in preferred locations)
  if (profile.preferredLocations.some(loc => loc.toLowerCase().includes('remote'))) {
    if (job.location.toLowerCase().includes('remote') || jobText.includes('remote')) {
      score += 10
      reasons.push('Remote-möjlighet')
    }
  }
  
  return {
    job,
    matchScore: Math.max(0, score), // Don't allow negative scores
    matchReasons: reasons
  }
}

/**
 * Filter and sort jobs by match score
 */
export function getMatchedJobs(jobs: SimpleJob[], profile: Profile, minScore = 10): JobWithMatch[] {
  return jobs
    .map(job => calculateJobMatch(job, profile))
    .filter(match => match.matchScore >= minScore)
    .sort((a, b) => b.matchScore - a.matchScore)
}

/**
 * Get match score category for display
 */
export function getMatchCategory(score: number): { label: string; color: string; percentage: number } {
  if (score >= 50) {
    return { label: 'Utmärkt match', color: '#1D6453', percentage: Math.min(100, (score / 80) * 100) }
  } else if (score >= 30) {
    return { label: 'Bra match', color: '#059669', percentage: Math.min(100, (score / 50) * 100) }
  } else if (score >= 15) {
    return { label: 'Okej match', color: '#D97706', percentage: Math.min(100, (score / 30) * 100) }
  } else if (score >= 5) {
    return { label: 'Svag match', color: '#DC2626', percentage: Math.min(100, (score / 15) * 100) }
  } else {
    return { label: 'Ingen match', color: '#6B7280', percentage: 0 }
  }
}
