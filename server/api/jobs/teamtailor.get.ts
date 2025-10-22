import { XMLParser } from 'fast-xml-parser'
import type { TeamTailorRSSItem, TeamTailorJob } from '../../../types/teamtailor'
import type { SimpleJob } from '../../../types/platsbanken'
import { getEnabledCompanies, getRSSFeedUrl } from '../../utils/teamtailorCompanies'

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
})

// Cache för att undvika att spamma företagens RSS-feeds
const cache = new Map<string, { jobs: SimpleJob[], timestamp: number }>()
const CACHE_TTL = 30 * 60 * 1000 // 30 minuter

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const useCache = query.cache !== 'false'
    
    // Check cache first
    if (useCache) {
      const cached = cache.get('all_jobs')
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log('Returning cached TeamTailor jobs')
        return {
          success: true,
          data: {
            jobs: cached.jobs,
            total: cached.jobs.length,
            cachedAt: new Date(cached.timestamp).toISOString(),
            source: 'teamtailor'
          }
        }
      }
    }

    const companies = getEnabledCompanies()
    console.log(`Fetching jobs from ${companies.length} TeamTailor companies...`)
    
    const allJobs: SimpleJob[] = []
    const errors: { company: string, error: string }[] = []

    // Fetch jobs from all companies in parallel (with a limit to avoid overload)
    const BATCH_SIZE = 5
    for (let i = 0; i < companies.length; i += BATCH_SIZE) {
      const batch = companies.slice(i, i + BATCH_SIZE)
      const batchPromises = batch.map(company => fetchCompanyJobs(company.name, getRSSFeedUrl(company)))
      
      const results = await Promise.allSettled(batchPromises)
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          allJobs.push(...result.value)
        } else if (result.status === 'rejected') {
          const company = batch[index]
          errors.push({
            company: company.name,
            error: result.reason?.message || 'Unknown error'
          })
          console.error(`Failed to fetch jobs from ${company.name}:`, result.reason)
        }
      })
    }

    console.log(`Successfully fetched ${allJobs.length} jobs from TeamTailor`)
    if (errors.length > 0) {
      console.warn(`Failed to fetch from ${errors.length} companies:`, errors)
    }

    // Update cache
    cache.set('all_jobs', {
      jobs: allJobs,
      timestamp: Date.now()
    })

    return {
      success: true,
      data: {
        jobs: allJobs,
        total: allJobs.length,
        source: 'teamtailor',
        errors: errors.length > 0 ? errors : undefined
      }
    }

  } catch (error) {
    console.error('Error fetching TeamTailor jobs:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch jobs from TeamTailor',
      data: {
        jobs: [],
        total: 0,
        source: 'teamtailor'
      }
    }
  }
})

/**
 * Fetch jobs from a single company's RSS feed
 */
async function fetchCompanyJobs(companyName: string, rssUrl: string): Promise<SimpleJob[]> {
  try {
    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Jobbcentralen/1.0 (Job Aggregator)'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const xmlText = await response.text()
    const parsed = xmlParser.parse(xmlText)

    // Handle RSS structure - items can be in rss.channel.item or feed.entry
    let items: any[] = []
    if (parsed.rss?.channel?.item) {
      items = Array.isArray(parsed.rss.channel.item) 
        ? parsed.rss.channel.item 
        : [parsed.rss.channel.item]
    } else if (parsed.feed?.entry) {
      items = Array.isArray(parsed.feed.entry)
        ? parsed.feed.entry
        : [parsed.feed.entry]
    }

    if (items.length === 0) {
      console.warn(`No jobs found in RSS feed for ${companyName}`)
      return []
    }

    // Transform RSS items to SimpleJob format
    const jobs: SimpleJob[] = items.map((item) => transformRSSItemToJob(item, companyName))
    
    console.log(`Fetched ${jobs.length} jobs from ${companyName}`)
    return jobs

  } catch (error) {
    console.error(`Error fetching from ${companyName}:`, error)
    throw error
  }
}

/**
 * Transform TeamTailor RSS item to our SimpleJob format
 */
function transformRSSItemToJob(item: any, companyName: string): SimpleJob {
  // Extract location - can be in different formats
  let location = 'Not specified'
  let municipality = ''
  let region = ''
  
  if (item['teamtailor:location']) {
    const locations = Array.isArray(item['teamtailor:location']) 
      ? item['teamtailor:location'] 
      : [item['teamtailor:location']]
    location = locations.join(', ')
    
    // Try to parse municipality/region from location string
    if (locations.length > 0) {
      const firstLocation = locations[0]
      if (typeof firstLocation === 'string') {
        // Basic parsing for Swedish cities
        if (firstLocation.includes('Stockholm')) {
          municipality = 'Stockholm'
          region = 'Stockholm'
        } else if (firstLocation.includes('Göteborg') || firstLocation.includes('Gothenburg')) {
          municipality = 'Göteborg'
          region = 'Västra Götaland'
        } else if (firstLocation.includes('Malmö')) {
          municipality = 'Malmö'
          region = 'Skåne'
        }
      }
    }
  }

  // Check for remote work
  const isRemote = item['teamtailor:remote'] === 'true' || 
                   item.title?.toLowerCase().includes('remote') ||
                   location.toLowerCase().includes('remote')

  if (isRemote && !location.includes('Remote')) {
    location = location ? `${location} (Remote)` : 'Remote'
  }

  // Extract description - remove HTML tags
  let description = item.description || item.summary || ''
  if (typeof description === 'string') {
    description = description.replace(/<[^>]*>/g, '').trim()
    // Limit description length
    if (description.length > 500) {
      description = description.substring(0, 497) + '...'
    }
  }

  // Generate a unique ID from the GUID or link
  const guid = item.guid || item.id || item.link
  const id = typeof guid === 'object' && guid['#text'] ? guid['#text'] : String(guid)

  return {
    id: `tt_${Buffer.from(id).toString('base64').substring(0, 20)}`,
    title: item.title || 'Untitled Position',
    company: companyName,
    location,
    municipality,
    region,
    description,
    employmentType: item['teamtailor:role'] || 'Ej specificerad',
    publicationDate: item.pubDate || item.published || new Date().toISOString(),
    applicationDeadline: '', // TeamTailor RSS doesn't include deadline
    applicationUrl: item.link || '',
    experienceRequired: false, // Not available in RSS feed
    // Add source identifier
    salary: undefined,
    workingHours: undefined,
    coordinates: undefined
  }
}
