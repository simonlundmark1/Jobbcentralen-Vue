import { municipalityNameToCode } from '../../utils/municipalityMapping'
import { occupationFieldNameToCode } from '../../utils/occupationFieldMapping'

export default defineEventHandler(async (event) => {
  try {
    // Fetch both municipality and occupation field statistics from the API
    const statsResponse = await fetch('https://jobsearch.api.jobtechdev.se/search?stats=municipality&stats=occupation-field&stats.limit=30&limit=1')
    
    if (!statsResponse.ok) {
      throw new Error(`Platsbanken API returned ${statsResponse.status}: ${statsResponse.statusText}`)
    }
    
    const statsData = await statsResponse.json()
    const municipalityStats = statsData.stats?.find((stat: any) => stat.type === 'municipality')?.values || []
    const occupationFieldStats = statsData.stats?.find((stat: any) => stat.type === 'occupation-field')?.values || []
    
    // Extract municipality names from stats (these are the actual available municipalities)
    const availableMunicipalities = municipalityStats.map((stat: any) => stat.term).filter(Boolean)
    
    // Extract occupation field names from stats (these are the actual available occupation fields)
    const availableOccupationFields = occupationFieldStats.map((stat: any) => stat.term).filter(Boolean)
    
    // Fetch a sample of jobs to extract other filter options
    const response = await fetch('https://jobsearch.api.jobtechdev.se/search?limit=100')
    
    if (!response.ok) {
      throw new Error(`Platsbanken API returned ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    const jobs = data.hits || []
    
    // Extract unique values for filters
    const occupationFields = new Set<string>()
    const workTimeExtents = new Set<string>()
    const employmentTypes = new Set<string>()
    
    jobs.forEach((job: any) => {
      if (job.occupation_field?.label) {
        occupationFields.add(job.occupation_field.label)
      }
      if (job.working_hours_type?.label) {
        workTimeExtents.add(job.working_hours_type.label)
      }
      if (job.employment_type?.label) {
        employmentTypes.add(job.employment_type.label)
      }
    })
    
    return {
      success: true,
      data: {
        occupationFields: availableOccupationFields.sort(),
        municipalities: availableMunicipalities.sort(),
        workTimeExtents: Array.from(workTimeExtents).sort(),
        employmentTypes: Array.from(employmentTypes).sort()
      }
    }
    
  } catch (error) {
    console.error('Error fetching filter options:', error)
    
    // Return fallback options with municipalities from our mapping
    return {
      success: true,
      data: {
        occupationFields: Object.keys(occupationFieldNameToCode).sort(),
        municipalities: Object.keys(municipalityNameToCode).sort(),
        workTimeExtents: [
          'Heltid',
          'Deltid',
          'Vikariat',
          'Projektanställning'
        ],
        employmentTypes: [
          'Tillsvidare',
          'Vikariat',
          'Projektanställning',
          'Säsongsarbete'
        ]
      }
    }
  }
})
