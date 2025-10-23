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

    // Sort by publication date (newest first)
    allJobs.sort((a, b) => {
      const dateA = new Date(a.publicationDate).getTime()
      const dateB = new Date(b.publicationDate).getTime()
      return dateB - dateA // Newest first
    })

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
  // Extract description first - keep full description with formatting
  let description = item.description || item.summary || ''
  if (typeof description === 'string') {
    // Convert HTML to text while preserving structure
    description = description
      // Convert common block elements to newlines
      .replace(/<\/?(p|div|br|h[1-6]|li|tr)[^>]*>/gi, '\n')
      .replace(/<\/ul[^>]*>/gi, '\n\n')
      .replace(/<\/ol[^>]*>/gi, '\n\n')
      .replace(/<li[^>]*>/gi, '\n• ')
      // Remove all other HTML tags
      .replace(/<[^>]*>/g, '')
      // Decode HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      // Clean up excessive whitespace but preserve intentional line breaks
      .replace(/[ \t]+/g, ' ')        // Replace multiple spaces/tabs with single space
      .replace(/\n\s+\n/g, '\n\n')    // Clean up whitespace between paragraphs
      .replace(/\n{3,}/g, '\n\n')     // Max 2 consecutive newlines
      .trim()
    // Don't truncate! Keep full description with formatting
  }

  // Extract location - try multiple sources
  let location = 'Not specified'
  let municipality = ''
  let region = ''
  
  // Try teamtailor:location first
  if (item['teamtailor:location']) {
    const locations = Array.isArray(item['teamtailor:location']) 
      ? item['teamtailor:location'] 
      : [item['teamtailor:location']]
    location = locations.join(', ')
    
    // Parse municipality/region from location
    if (locations.length > 0) {
      const firstLocation = String(locations[0])
      municipality = firstLocation
      
      // Map to regions
      if (firstLocation.match(/Stockholm/i)) {
        municipality = 'Stockholm'
        region = 'Stockholm'
      } else if (firstLocation.match(/Göteborg|Gothenburg/i)) {
        municipality = 'Göteborg'
        region = 'Västra Götaland'
      } else if (firstLocation.match(/Malmö|Malmo/i)) {
        municipality = 'Malmö'
        region = 'Skåne'
      } else if (firstLocation.match(/Uppsala/i)) {
        municipality = 'Uppsala'
        region = 'Uppsala'
      } else if (firstLocation.match(/Lund/i)) {
        municipality = 'Lund'
        region = 'Skåne'
      } else if (firstLocation.match(/Linköping/i)) {
        municipality = 'Linköping'
        region = 'Östergötland'
      }
    }
  } 
  // Fallback: Try to extract from title or description
  else {
    const titleAndDesc = `${item.title || ''} ${description}`.toLowerCase()
    const cityPatterns = [
      { pattern: /stockholm/i, city: 'Stockholm', region: 'Stockholm' },
      { pattern: /göteborg|gothenburg/i, city: 'Göteborg', region: 'Västra Götaland' },
      { pattern: /malmö|malmo/i, city: 'Malmö', region: 'Skåne' },
      { pattern: /uppsala/i, city: 'Uppsala', region: 'Uppsala' },
      { pattern: /lund/i, city: 'Lund', region: 'Skåne' },
      { pattern: /linköping/i, city: 'Linköping', region: 'Östergötland' },
    ]
    
    for (const { pattern, city, region: reg } of cityPatterns) {
      if (pattern.test(titleAndDesc)) {
        location = city
        municipality = city
        region = reg
        break
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

  // Generate a unique ID from the GUID or link
  const guid = item.guid || item.id || item.link
  const id = typeof guid === 'object' && guid['#text'] ? guid['#text'] : String(guid)

  // Try to extract deadline from description
  let applicationDeadline = ''
  const deadlinePatterns = [
    /sista ansökningsdag[:\s]+([0-9]{4}-[0-9]{2}-[0-9]{2})/i,
    /ansök senast[:\s]+([0-9]{4}-[0-9]{2}-[0-9]{2})/i,
    /deadline[:\s]+([0-9]{4}-[0-9]{2}-[0-9]{2})/i,
    /([0-9]{4}-[0-9]{2}-[0-9]{2})/i // Generic date pattern
  ]
  
  for (const pattern of deadlinePatterns) {
    const match = description.match(pattern)
    if (match && match[1]) {
      const deadlineDate = new Date(match[1])
      if (deadlineDate > new Date()) { // Only use future dates
        applicationDeadline = match[1]
        break
      }
    }
  }

  return {
    id: `tt_${Buffer.from(id).toString('base64').substring(0, 20)}`,
    title: item.title || 'Untitled Position',
    company: companyName,
    location,
    municipality,
    region,
    description,
    employmentType: item['teamtailor:role'] || item['teamtailor:department'] || 'Ej specificerad',
    publicationDate: item.pubDate || item.published || new Date().toISOString(),
    applicationDeadline,
    applicationUrl: item.link || '',
    experienceRequired: false,
    salary: undefined,
    workingHours: undefined,
    coordinates: undefined
  }
}
