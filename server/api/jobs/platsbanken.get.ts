import type { PlatsbankenSearchResponse, PlatsbankenSearchParams, SimpleJob, PlatsbankenJob } from '../../../types/platsbanken'
import { normalizeMunicipalityForAPI } from '../../utils/municipalityMapping'
import { normalizeOccupationFieldForAPI } from '../../utils/occupationFieldMapping'

const PLATSBANKEN_API_BASE = 'https://jobsearch.api.jobtechdev.se'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    
    // Build search parameters
    const searchParams: PlatsbankenSearchParams = {
      limit: Math.min(parseInt(query.limit as string) || 20, 100), // Limit to max 100 for performance
      offset: parseInt(query.offset as string) || 0,
    }

    // Add optional filters
    if (query.q) {
      searchParams.q = query.q as string
    }
    
    if (query.municipality) {
      const municipalities = Array.isArray(query.municipality) 
        ? query.municipality as string[]
        : [query.municipality as string]
      
      // Convert municipality names to codes for API compatibility
      searchParams.municipality = municipalities.map(municipality => 
        normalizeMunicipalityForAPI(municipality)
      )
    }
    
    if (query.region) {
      searchParams.region = Array.isArray(query.region)
        ? query.region as string[]
        : [query.region as string]
    }
    
    if (query.occupation) {
      searchParams.occupation = Array.isArray(query.occupation)
        ? query.occupation as string[]
        : [query.occupation as string]
    }
    
    if (query['occupation-field']) {
      const occupationFields = Array.isArray(query['occupation-field'])
        ? query['occupation-field'] as string[]
        : [query['occupation-field'] as string]
      
      // Convert occupation field names to codes for API compatibility
      searchParams.occupation_field = occupationFields.map(occupationField => 
        normalizeOccupationFieldForAPI(occupationField)
      )
    }
    
    if (query.employment_type || query['employment-type']) {
      const empType = query.employment_type || query['employment-type']
      searchParams.employment_type = Array.isArray(empType)
        ? empType as string[]
        : [empType as string]
    }
    
    if (query.experience_required === 'true') {
      searchParams.experience_required = true
    } else if (query.experience_required === 'false') {
      searchParams.experience_required = false
    }

    // Convert params to URLSearchParams, mapping our internal names to API names
    const urlParams = new URLSearchParams()
    if (searchParams.q) urlParams.append('q', searchParams.q)
    if (typeof searchParams.limit === 'number') urlParams.append('limit', String(searchParams.limit))
    if (typeof searchParams.offset === 'number') urlParams.append('offset', String(searchParams.offset))

    // Arrays
    searchParams.municipality?.forEach((v: string) => urlParams.append('municipality', v))
    searchParams.region?.forEach((v: string) => urlParams.append('region', v))
    searchParams.occupation?.forEach((v: string) => urlParams.append('occupation-name', v))
    searchParams.occupation_group?.forEach((v: string) => urlParams.append('occupation-group', v))
    searchParams.occupation_field?.forEach((v: string) => urlParams.append('occupation-field', v))
    searchParams.employment_type?.forEach((v: string) => urlParams.append('employment-type', v))

    // Booleans and date params
    if (typeof searchParams.experience_required === 'boolean') {
      urlParams.append('experience', String(searchParams.experience_required))
    }
    if (searchParams.published_after) urlParams.append('published-after', searchParams.published_after)
    if (searchParams.published_before) urlParams.append('published-before', searchParams.published_before)
    if (typeof searchParams.driving_license_required === 'boolean') {
      urlParams.append('driving-license-required', String(searchParams.driving_license_required))
    }
    if (typeof searchParams.remote_work === 'boolean') urlParams.append('remote', String(searchParams.remote_work))

    // Fetch from Platsbanken API
    const response = await fetch(`${PLATSBANKEN_API_BASE}/search?${urlParams.toString()}`)
    
    if (!response.ok) {
      throw new Error(`Platsbanken API returned ${response.status}: ${response.statusText}`)
    }
    
    const data: PlatsbankenSearchResponse = await response.json()
    
    // Transform to simplified format
    const hits: PlatsbankenJob[] = Array.isArray((data as any).hits) ? (data as any).hits as PlatsbankenJob[] : []
    const jobs: SimpleJob[] = hits.map((job: PlatsbankenJob) => ({
      id: job.id,
      title: job.headline,
      company: job.employer?.name ?? 'Okänd arbetsgivare',
      location: [job.workplace_address?.city, job.workplace_address?.municipality].filter(Boolean).join(', '),
      municipality: job.workplace_address?.municipality ?? '',
      region: job.workplace_address?.region ?? '',
      description: job.description?.text ?? '',
      employmentType: job.employment_type?.label ?? 'Ej specificerad',
      publicationDate: job.publication_date,
      applicationDeadline: job.application_deadline,
      applicationUrl: (job as any).webpage_url || job.application_details?.url || undefined,
      applicationEmail: job.application_details?.email || undefined,
      salary: job.salary_type?.label && job.salary_type.label !== 'Ej specificerad' ? job.salary_type.label : undefined,
      workingHours: job.working_hours_type?.label && job.working_hours_type.label !== 'Ej specificerad' ? job.working_hours_type.label : undefined,
      experienceRequired: !!job.experience_required,
      coordinates: Array.isArray(job.workplace_address?.coordinates) && job.workplace_address!.coordinates.length === 2
        ? [job.workplace_address!.coordinates[1], job.workplace_address!.coordinates[0]] as [number, number]
        : undefined
    }))
    
    return {
      success: true,
      data: {
        jobs,
        total: data.total?.value ?? jobs.length,
        offset: searchParams.offset || 0,
        limit: searchParams.limit || 20,
        freetext_concepts: data.freetext_concepts
      }
    }
    
  } catch (error) {
    console.error('Error fetching jobs from Platsbanken:', error)
    
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
