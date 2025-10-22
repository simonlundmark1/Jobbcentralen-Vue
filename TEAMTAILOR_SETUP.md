# TeamTailor Integration Guide

## 📋 Overview

Jobbcentralen now integrates with TeamTailor career sites through their public RSS feeds. This integration allows us to aggregate jobs from hundreds of Swedish tech companies without needing API keys!

## ✅ What's Working

- **RSS Feed Parser**: Automatically fetches and parses TeamTailor job feeds
- **No Authentication Required**: Uses public RSS feeds (no API keys needed!)
- **Unified Search**: Combined endpoint that searches both Platsbanken and TeamTailor
- **Source Toggle**: Users can switch between "Alla källor", "Platsbanken", or "TeamTailor"
- **30-minute Cache**: RSS feeds are cached to avoid excessive requests

## 🏢 Currently Integrated Companies

Currently, we have **1 company** verified and active:
- ✅ Teamtailor (their own career site)

## 📦 Adding More Companies

### Step 1: Find TeamTailor Companies

You can find Swedish companies using TeamTailor in several ways:

1. **Google Search**:
   ```
   site:career.teamtailor.com Sverige
   site:career.teamtailor.com Stockholm
   site:career.teamtailor.com tech
   ```

2. **Company Lists**:
   - Check [TheirStack](https://theirstack.com/en/technology/teamtailor/se) for 588+ Swedish companies
   - Look for companies with career sites at `company.career.teamtailor.com`

### Step 2: Verify RSS Feed

Before adding a company, verify their RSS feed exists and is accessible:

```bash
# Test the RSS feed
curl https://COMPANY.career.teamtailor.com/jobs.rss
```

Example:
```bash
curl https://mentimeter.career.teamtailor.com/jobs.rss
```

If you get XML back with job listings, it's working! ✅

### Step 3: Add to Company List

Edit `server/utils/teamtailorCompanies.ts`:

```typescript
export const TEAMTAILOR_COMPANIES: TeamTailorCompany[] = [
  {
    name: 'Teamtailor',
    careerSiteUrl: 'https://career.teamtailor.com',
    enabled: true
  },
  // Add your new company:
  {
    name: 'Company Name',
    careerSiteUrl: 'https://company.career.teamtailor.com',
    enabled: true
  },
]
```

### Step 4: Test

Restart the dev server and test:

```bash
# Test TeamTailor endpoint
curl http://localhost:3000/api/jobs/teamtailor

# Test combined endpoint
curl http://localhost:3000/api/jobs/combined?source=all
```

## 📊 API Endpoints

### `/api/jobs/teamtailor`
Fetches jobs from all enabled TeamTailor companies.

**Query Parameters:**
- `cache` (optional): Set to `false` to bypass cache

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [...],
    "total": 20,
    "source": "teamtailor",
    "cachedAt": "2024-01-01T12:00:00Z"
  }
}
```

### `/api/jobs/combined`
Unified endpoint for searching both Platsbanken and TeamTailor.

**Query Parameters:**
- `source`: `'all'` | `'platsbanken'` | `'teamtailor'` (default: `'all'`)
- `q`: Search query
- `municipality`: Filter by municipality
- `limit`: Number of results (default: 20)
- `offset`: Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [...],
    "total": 120,
    "sources": {
      "platsbanken": true,
      "teamtailor": true
    }
  }
}
```

## 🎨 UI Integration

The main page (`app/pages/index.vue`) now includes:

- **Source Toggle**: Click the filter badge to cycle between sources
  - "Alla källor" → Shows jobs from both Platsbanken and TeamTailor
  - "Platsbanken" → Only Platsbanken jobs
  - "TeamTailor" → Only TeamTailor jobs

- **Source Badge**: Each job card shows which source it came from

## 🔧 Technical Details

### RSS Feed Format

TeamTailor RSS feeds include:
- Job title
- Job description (HTML formatted)
- Application URL
- Publication date
- Location(s)
- Department
- Role/Category
- Remote status

### Caching Strategy

- RSS feeds are cached for **30 minutes**
- Cache is stored in-memory on the server
- Can be bypassed with `?cache=false` query parameter

### Error Handling

- Failed company fetches are logged but don't break the entire request
- Errors are returned in the response for debugging
- Individual company failures are isolated

## 🚀 Suggested Companies to Add

Here are some verified Swedish tech companies using TeamTailor:

- Epidemic Sound
- Mentimeter
- Truecaller
- Northvolt
- Funnel
- Kry
- Budbee
- BookBeat
- Fishbrain

**Note**: Always verify the RSS feed works before adding!

## 📝 Future Improvements

1. **Automatic Discovery**: Build a crawler to automatically find and verify TeamTailor companies
2. **Company Database**: Store companies in database instead of hardcoded list
3. **Health Checks**: Periodically verify RSS feeds are still accessible
4. **Better Location Parsing**: Improve municipality/region extraction from TeamTailor locations
5. **Job Deduplication**: Detect if same job appears on both platforms

## 🐛 Troubleshooting

### "fetch failed" errors

This usually means:
1. The RSS feed URL is incorrect
2. The company's RSS feed is not publicly accessible
3. Network/firewall issues

**Solution**: Verify the URL manually with curl first.

### No jobs returned

1. Check if the company actually has open positions
2. Verify the RSS feed has content: visit `https://COMPANY.career.teamtailor.com/jobs.rss` in browser
3. Check server logs for parsing errors

### Cache not updating

Clear the cache by adding `?cache=false` to the request, or restart the server.

## 💡 Tips

- Start with companies you know are hiring
- Test RSS feeds manually before adding to ensure they work
- Consider regional companies based on your target audience
- Monitor server logs for fetch errors
- Update the company list regularly

---

**Built with ❤️ for Jobbcentralen**
