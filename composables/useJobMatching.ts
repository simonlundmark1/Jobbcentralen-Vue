import { computed, ref } from 'vue'
import type { SimpleJob } from '../types/platsbanken'
import type { Profile } from './useProfile'
import { calculateJobMatch, getMatchedJobs, type JobWithMatch } from '../utils/jobMatcher'

export const useJobMatching = () => {
  const isMatchingEnabled = ref(false)
  const matchingJobs = ref<JobWithMatch[]>([])
  const lastMatchTime = ref<Date | null>(null)

  /**
   * Calculate match scores for all jobs based on profile
   */
  const calculateMatches = (jobs: SimpleJob[], profile: Profile, minScore = 5): JobWithMatch[] => {
    if (!hasValidProfile(profile)) {
      return []
    }

    const matches = getMatchedJobs(jobs, profile, minScore)
    matchingJobs.value = matches
    lastMatchTime.value = new Date()
    
    return matches
  }

  /**
   * Get match score for a single job
   */
  const getJobMatchScore = (job: SimpleJob, profile: Profile): JobWithMatch => {
    return calculateJobMatch(job, profile)
  }

  /**
   * Check if profile has enough data for matching
   */
  const hasValidProfile = (profile: Profile): boolean => {
    return profile.skills.length > 0 || profile.jobTitles.length > 0
  }

  /**
   * Get recommended jobs (high match scores)
   */
  const getRecommendedJobs = computed(() => {
    return matchingJobs.value.filter(match => match.matchScore >= 30)
  })

  /**
   * Get match statistics
   */
  const getMatchStats = computed(() => {
    const total = matchingJobs.value.length
    const excellent = matchingJobs.value.filter(m => m.matchScore >= 50).length
    const good = matchingJobs.value.filter(m => m.matchScore >= 30 && m.matchScore < 50).length
    const okay = matchingJobs.value.filter(m => m.matchScore >= 15 && m.matchScore < 30).length
    const weak = matchingJobs.value.filter(m => m.matchScore >= 5 && m.matchScore < 15).length

    return {
      total,
      excellent,
      good,
      okay,
      weak,
      averageScore: total > 0 ? Math.round(matchingJobs.value.reduce((sum, m) => sum + m.matchScore, 0) / total) : 0
    }
  })

  /**
   * Enable/disable job matching
   */
  const toggleMatching = (enabled: boolean) => {
    isMatchingEnabled.value = enabled
  }

  /**
   * Clear all matches
   */
  const clearMatches = () => {
    matchingJobs.value = []
    lastMatchTime.value = null
  }

  return {
    isMatchingEnabled,
    matchingJobs,
    lastMatchTime,
    calculateMatches,
    getJobMatchScore,
    hasValidProfile,
    getRecommendedJobs,
    getMatchStats,
    toggleMatching,
    clearMatches
  }
}
