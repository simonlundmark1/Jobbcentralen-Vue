import type { SimpleJob } from '../../../types/platsbanken'

/**
 * Combined endpoint that fetches jobs from both Platsbanken and TeamTailor
 * This provides a unified search across multiple sources
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    
    // Extract common parameters
    const limit = parseInt(query.limit as string) || 20
    const offset = parseInt(query.offset as string) || 0
    const searchQuery = query.q as string
    const municipality = query.municipality
    const source = query.source as string // 'all', 'platsbanken', 'teamtailor'

    const allJobs: SimpleJob[] = []
    const errors: any[] = []

    // Determine which sources to fetch from
    const fetchPlatsbanken = !source || source === 'all' || source === 'platsbanken'
    const fetchTeamtailor = !source || source === 'all' || source === 'teamtailor'

    // Fetch from both sources in parallel
    const promises: Promise<any>[] = []

    if (fetchPlatsbanken) {
      // Build Platsbanken query params
      const platsbankenParams = new URLSearchParams()
      // Use the actual limit from query, not hardcoded 100
      platsbankenParams.append('limit', limit.toString())
      platsbankenParams.append('offset', offset.toString())
      if (searchQuery) platsbankenParams.append('q', searchQuery)
      if (municipality) {
        const municipalities = Array.isArray(municipality) ? municipality : [municipality]
        municipalities.forEach(m => platsbankenParams.append('municipality', m as string))
      }
      if (query.region) {
        const regions = Array.isArray(query.region) ? query.region : [query.region]
        regions.forEach(r => platsbankenParams.append('region', r as string))
      }
      if (query.occupation) platsbankenParams.append('occupation', query.occupation as string)
      if (query['employment-type']) platsbankenParams.append('employment-type', query['employment-type'] as string)
      
      promises.push(
        $fetch(`/api/jobs/platsbanken?${platsbankenParams.toString()}`)
          .then((data: any) => {
            if (data.success && data.data?.jobs) {
              return data.data.jobs.map((job: SimpleJob) => ({
                ...job,
                source: 'platsbanken'
              }))
            }
            return []
          })
          .catch(error => {
            console.error('Platsbanken fetch error:', error)
            errors.push({ source: 'platsbanken', error: error.message })
            return []
          })
      )
    }

    if (fetchTeamtailor) {
      promises.push(
        $fetch('/api/jobs/teamtailor')
          .then((data: any) => {
            if (data.success && data.data?.jobs) {
              return data.data.jobs.map((job: SimpleJob) => ({
                ...job,
                source: 'teamtailor'
              }))
            }
            return []
          })
          .catch(error => {
            console.error('TeamTailor fetch error:', error)
            errors.push({ source: 'teamtailor', error: error.message })
            return []
          })
      )
    }

    // Wait for all sources
    const results = await Promise.all(promises)
    results.forEach(jobs => allJobs.push(...jobs))

    // Filter jobs by search query if provided (for TeamTailor jobs)
    let filteredJobs = allJobs
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      filteredJobs = allJobs.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower)
      )
    }

    // Filter by municipality if provided (for TeamTailor jobs that don't have native filtering)
    if (municipality) {
      const municipalities = Array.isArray(municipality) ? municipality : [municipality]
      const municipalitiesLower = municipalities.map(m => (m as string).toLowerCase())
      
      filteredJobs = filteredJobs.filter(job => 
        municipalitiesLower.some(m => 
          job.location.toLowerCase().includes(m) ||
          job.municipality.toLowerCase().includes(m)
        )
      )
    }

    // Sort by publication date (newest first)
    filteredJobs.sort((a, b) => {
      const dateA = new Date(a.publicationDate).getTime()
      const dateB = new Date(b.publicationDate).getTime()
      return dateB - dateA
    })

    // Apply pagination
    const total = filteredJobs.length
    const paginatedJobs = filteredJobs.slice(offset, offset + limit)

    return {
      success: true,
      data: {
        jobs: paginatedJobs,
        total,
        offset,
        limit,
        sources: {
          platsbanken: fetchPlatsbanken,
          teamtailor: fetchTeamtailor
        },
        errors: errors.length > 0 ? errors : undefined
      }
    }

  } catch (error) {
    console.error('Error in combined job search:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch jobs',
      data: {
        jobs: [],
        total: 0,
        offset: 0,
        limit: 20
      }
    }
  }
})
