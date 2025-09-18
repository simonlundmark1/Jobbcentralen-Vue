// API endpoint to fetch concepts (municipalities, regions, occupations) for filter dropdowns

interface ConceptItem {
  concept_id: string
  label: string
}

interface ConceptsResponse {
  municipalities: ConceptItem[]
  regions: ConceptItem[]
  occupations: ConceptItem[]
  occupation_groups: ConceptItem[]
}

const PLATSBANKEN_API_BASE = 'https://jobsearch.api.jobtechdev.se'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const type = query.type as string
    
    // Fetch specific concept type or all
    const endpoints = {
      municipalities: '/complete?type=municipality',
      regions: '/complete?type=region', 
      occupations: '/complete?type=occupation',
      occupation_groups: '/complete?type=occupation-group'
    }
    
    if (type && type in endpoints) {
      // Fetch specific type
      const response = await fetch(`${PLATSBANKEN_API_BASE}${endpoints[type as keyof typeof endpoints]}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${type}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      return {
        success: true,
        data: data.typeahead || []
      }
    } else {
      // Fetch all concept types in parallel
      const [municipalitiesRes, regionsRes, occupationsRes, occupationGroupsRes] = await Promise.all([
        fetch(`${PLATSBANKEN_API_BASE}${endpoints.municipalities}`),
        fetch(`${PLATSBANKEN_API_BASE}${endpoints.regions}`),
        fetch(`${PLATSBANKEN_API_BASE}${endpoints.occupations}`),
        fetch(`${PLATSBANKEN_API_BASE}${endpoints.occupation_groups}`)
      ])
      
      if (!municipalitiesRes.ok || !regionsRes.ok || !occupationsRes.ok || !occupationGroupsRes.ok) {
        throw new Error('Failed to fetch one or more concept types')
      }
      
      const [municipalities, regions, occupations, occupationGroups] = await Promise.all([
        municipalitiesRes.json(),
        regionsRes.json(), 
        occupationsRes.json(),
        occupationGroupsRes.json()
      ])
      
      const response: ConceptsResponse = {
        municipalities: municipalities.typeahead || [],
        regions: regions.typeahead || [],
        occupations: occupations.typeahead || [],
        occupation_groups: occupationGroups.typeahead || []
      }
      
      return {
        success: true,
        data: response
      }
    }
    
  } catch (error) {
    console.error('Error fetching concepts:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch concepts',
      data: type ? [] : {
        municipalities: [],
        regions: [],
        occupations: [],
        occupation_groups: []
      }
    }
  }
})
