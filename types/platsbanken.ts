export interface PlatsbankenJob {
  id: string
  external_id: string
  headline: string
  application_deadline: string
  number_of_vacancies: number
  description: {
    text: string
    text_formatted: string
    company_information: string
    needs: string
    requirements: string
    conditions: string
  }
  employment_type: {
    label: string
    concept_id: string
  }
  salary_type: {
    label: string
    concept_id: string
  }
  duration: {
    label: string
    concept_id: string
  }
  working_hours_type: {
    label: string
    concept_id: string
  }
  scope_of_work: {
    min: number
    max: number
  }
  access: {
    label: string
    concept_id: string
  }
  employer: {
    phone_number: string
    email: string
    url: string
    organization_number: string
    name: string
    workplace: string
  }
  application_details: {
    information: string
    reference: string
    email: string
    via_af: boolean
    url: string
    other: string
  }
  experience_required: boolean
  access_to_own_car: boolean
  driving_license_required: boolean
  driving_license: Array<{
    label: string
    concept_id: string
  }>
  occupation: {
    label: string
    concept_id: string
  }
  occupation_group: {
    label: string
    concept_id: string
  }
  occupation_field: {
    label: string
    concept_id: string
  }
  workplace_address: {
    municipality: string
    municipality_concept_id: string
    region: string
    region_concept_id: string
    country: string
    country_concept_id: string
    street_address: string
    postcode: string
    city: string
    coordinates: Array<number>
  }
  must_have: {
    skills: Array<{
      label: string
      concept_id: string
    }>
    languages: Array<{
      label: string
      concept_id: string
    }>
    work_experiences: Array<{
      label: string
      concept_id: string
    }>
    educations: Array<{
      label: string
      concept_id: string
    }>
    education_level: Array<{
      label: string
      concept_id: string
    }>
  }
  nice_to_have: {
    skills: Array<{
      label: string
      concept_id: string
    }>
    languages: Array<{
      label: string
      concept_id: string
    }>
    work_experiences: Array<{
      label: string
      concept_id: string
    }>
    educations: Array<{
      label: string
      concept_id: string
    }>
    education_level: Array<{
      label: string
      concept_id: string
    }>
  }
  publication_date: string
  last_publication_date: string
  removed: boolean
  removed_date: string | null
  source_type: string
  timestamp: number
}

export interface PlatsbankenSearchResponse {
  total: {
    value: number
    relation: string
  }
  positions: number
  hits: PlatsbankenJob[]
  freetext_concepts: {
    skill: Array<{
      concept_id: string
      label: string
      count: number
    }>
    occupation: Array<{
      concept_id: string
      label: string
      count: number
    }>
    location: Array<{
      concept_id: string
      label: string
      count: number
    }>
  }
}

export interface PlatsbankenSearchParams {
  q?: string // Free text search
  limit?: number // Number of results (max 2000)
  offset?: number // Offset for pagination
  municipality?: string[] // Municipality concept IDs
  region?: string[] // Region concept IDs
  occupation?: string[] // Occupation concept IDs
  occupation_group?: string[] // Occupation group concept IDs
  occupation_field?: string[] // Occupation field concept IDs
  employment_type?: string[] // Employment type concept IDs
  published_after?: string // ISO date string
  published_before?: string // ISO date string
  experience_required?: boolean
  driving_license_required?: boolean
  remote_work?: boolean
}

// Simplified interface for our application
export interface SimpleJob {
  id: string
  title: string
  company: string
  location: string
  municipality: string
  region: string
  description: string
  employmentType: string
  publicationDate: string
  applicationDeadline: string
  applicationUrl?: string
  applicationEmail?: string
  salary?: string
  workingHours?: string
  experienceRequired: boolean
  coordinates?: [number, number]
  source?: 'platsbanken' | 'teamtailor'
}

// Filter options for the UI
export interface JobFilters {
  query?: string
  municipality?: string
  region?: string
  occupation?: string
  experienceRequired?: boolean
  employmentType?: string
}
