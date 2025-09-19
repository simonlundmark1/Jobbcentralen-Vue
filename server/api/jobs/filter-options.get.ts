export default defineEventHandler(async (event) => {
  try {
    // Fetch a sample of jobs to extract filter options
    const response = await fetch('https://jobsearch.api.jobtechdev.se/search?limit=100')
    
    if (!response.ok) {
      throw new Error(`Platsbanken API returned ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    const jobs = data.hits || []
    
    // Extract unique values for filters
    const occupationFields = new Set<string>()
    const municipalities = new Set<string>()
    const workTimeExtents = new Set<string>()
    const employmentTypes = new Set<string>()
    
    jobs.forEach((job: any) => {
      if (job.occupation_field?.label) {
        occupationFields.add(job.occupation_field.label)
      }
      if (job.workplace_address?.municipality) {
        municipalities.add(job.workplace_address.municipality)
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
        occupationFields: Array.from(occupationFields).sort(),
        municipalities: Array.from(municipalities).sort(),
        workTimeExtents: Array.from(workTimeExtents).sort(),
        employmentTypes: Array.from(employmentTypes).sort()
      }
    }
    
  } catch (error) {
    console.error('Error fetching filter options:', error)
    
    // Return fallback options
    return {
      success: true,
      data: {
        occupationFields: [
          'Data/IT',
          'Ekonomi, finans',
          'Hälso- och sjukvård',
          'Utbildning',
          'Försäljning, inköp, marknadsföring',
          'Teknik, tillverkning',
          'Administration, ekonomi, juridik',
          'Bygg och anläggning',
          'Chefer och verksamhetsledare',
          'Hotell, restaurang, turism',
          'Kultur, media',
          'Naturbruk',
          'Pedagogiskt arbete',
          'Sanering och renhållning',
          'Säkerhetstjänst',
          'Transport',
          'Vård och omsorg',
          'Militärt arbete'
        ],
        municipalities: [
          'Stockholm',
          'Göteborg',
          'Malmö',
          'Uppsala',
          'Västerås',
          'Örebro',
          'Linköping',
          'Helsingborg',
          'Jönköping',
          'Norrköping',
          'Lund',
          'Umeå',
          'Gävle',
          'Borås',
          'Södertälje',
          'Eskilstuna',
          'Halmstad',
          'Växjö',
          'Karlstad',
          'Sundsvall'
        ],
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
