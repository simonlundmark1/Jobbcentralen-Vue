# 🦆 DuckDuckGo Dork Scraper - Rätt Sätt!

Kör Google-dorks via DuckDuckGo's HTML endpoint med **pagination** för maximala resultat.

## 🚀 Quick Start

**2-stegs process:**

```bash
# Steg 1: Scrapa URLs från DuckDuckGo
node scripts/ddg-dork-scraper.js

# Steg 2: Verifiera vilka som har TeamTailor
node scripts/detect-teamtailor.js
```

Helt gratis, ingen API key!

## 📋 Vad Som Körs

**20+ dork queries inklusive:**

### Basic Dorks:
- `site:*.teamtailor.com -www.teamtailor.com`
- `"Powered by Teamtailor" -site:teamtailor.com`
- `"career site by Teamtailor" -site:teamtailor.com`
- `inurl:(career OR careers OR jobs) "Teamtailor"`

### Per Land:
- **Sverige:** `site:*.se "Teamtailor" (jobb OR career OR careers)`
- **Norge:** `site:*.no "Teamtailor" (jobb OR career OR careers)`
- **Danmark:** `site:*.dk "Teamtailor" (job OR karriere OR career)`
- **Finland:** `site:*.fi "Teamtailor" (työpaikat OR ura OR career)`

### Svenska Städer:
- Stockholm, Göteborg, Malmö kombinerat med Teamtailor

## 🔧 Hur Det Fungerar

### Tidigare Problem:
❌ Använde fel endpoint
❌ Ingen pagination
❌ Fel CSS selectors
❌ Fick 0-20 resultat

### Nu (Rätt Sätt):
✅ Använder `https://html.duckduckgo.com/html/`
✅ Pagination med offset (s=0, s=30, s=60...)
✅ Rätt selectors: `a.result__a`
✅ Decode `uddg` parameter från länkar
✅ Up till 6 pages per query (180 resultat)

## 📊 Expected Results

**Scraping (Steg 1):**
- 20+ queries
- 6 pages per query
- ~100-500 URLs totalt

**Detection (Steg 2):**
- Verifierar RSS feed
- HTML fingerprinting
- ~50-200 verifierade TeamTailor-företag

## ⏱️ Tid

**Scraping:** 5-10 minuter
- 2-3 sekunder per sida
- 3 sekunder mellan queries
- Total: ~8 minuter

**Detection:** 2-5 minuter
- 10 samtidiga requests
- ~1 sekund per URL

**Total:** 10-15 minuter för complete discovery

## 💡 Tips

### Justera Max Pages

I `ddg-dork-scraper.js`:
```javascript
const results = await limit(() => fetchAllForQuery(query, 6)) // 6 pages
```

Öka till 10 för fler resultat (längre tid).

### Snabbare Detection

I `detect-teamtailor.js`:
```javascript
const limit = pLimit(10) // Öka till 20 för snabbare
```

### Lägg Till Egna Queries

I `ddg-dork-scraper.js`:
```javascript
const queries = [
  // ...existing
  'site:*.se rekrytering Teamtailor',
  'site:*.se arbetsgivare Teamtailor'
]
```

## 🆚 Jämförelse

| Method | URLs Found | Verified | Time | API Key |
|--------|-----------|----------|------|---------|
| **DDG Dork (Rätt)** | 100-500 | 50-200 | 10-15 min | ❌ Nej |
| DDG Dork (Fel) | 0-20 | 0 | 5 min | ❌ Nej |
| Free Discovery | N/A | 150-200 | 5 min | ❌ Nej |
| Google API | 200-300 | 100-150 | 5 min | ✅ Ja |

## 📁 Output Files

**ddg-dork-scraper.js skapar:**
- `ddg-scraped-urls.txt` - Alla URLs (text)
- `ddg-scrape-results.json` - Metadata + URLs (JSON)

**detect-teamtailor.js skapar:**
- `detected-teamtailor-companies.json` - Verifierade företag
- Console output - Copy-paste format

## 🎯 Complete Workflow

```bash
# 1. DuckDuckGo dork scraping
node scripts/ddg-dork-scraper.js
# → ddg-scraped-urls.txt (100-500 URLs)

# 2. Verifiera TeamTailor
node scripts/detect-teamtailor.js
# → detected-teamtailor-companies.json (50-200 företag)

# 3. (Optional) Kör även FREE discovery för max coverage
node scripts/free-teamtailor-discovery.js
# → free-discovery-results.json (150-200 företag)

# 4. Merge och deduplicate
# Copy-paste båda till teamtailorCompanies.ts
```

## 🌍 Nordic Coverage

**Detta hittar företag i:**
- 🇸🇪 Sverige
- 🇳🇴 Norge
- 🇩🇰 Danmark
- 🇫🇮 Finland

Total potential: **500-1000 nordiska TeamTailor-företag!**

## 🚨 Troubleshooting

### "DuckDuckGo returned 0 results"

DDG kan ibland returnera tomma sidor.
- Scriptet fortsätter ändå med andra queries
- Försök igen senare
- Vissa dorks fungerar bättre än andra

### "Connection timeout"

- Din internet är långsam
- Öka timeout i koden (10000 → 20000)

### "Found 0 URLs"

- DDG blockerar dig (sällsynt)
- Vänta 15-30 minuter
- Eller kör `free-teamtailor-discovery.js` istället

### "Detection found 0 companies"

URLs från scraping var inte TeamTailor-sidor.
- Detta är normalt - många false positives från search
- Kör `free-teamtailor-discovery.js` för bättre hit rate

## 💪 Best Strategy

**För maximala resultat, kör ALLA metoder:**

```bash
# Method 1: CT Logs + Swedish Patterns (BEST hit rate)
node scripts/free-teamtailor-discovery.js
# ✅ 150-200 verified companies

# Method 2: DuckDuckGo Dorks (Custom domains)
node scripts/ddg-dork-scraper.js
node scripts/detect-teamtailor.js
# ✅ +50-100 additional companies

# Total: 200-300+ unique companies! 🎉
```

## ✨ Summary

**DuckDuckGo Dork Scraper:**
- ✅ Ingen API key
- ✅ Proper pagination
- ✅ Nordic focus (SE, NO, DK, FI)
- ✅ 100-500 URLs från scraping
- ✅ 50-200 verifierade företag
- ✅ Hittar custom domains

**Just run:**
```bash
node scripts/ddg-dork-scraper.js
node scripts/detect-teamtailor.js
```

**Done!** 🦆
