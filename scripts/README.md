# TeamTailor Company Discovery

Automatisk discovery av svenska företag som använder TeamTailor för rekrytering.

## 🚀 Snabbstart

```bash
# Hitta ALLA TeamTailor-företag automatiskt
node scripts/auto-discover-teamtailor.js
```

Detta kommer att:
- ✅ Hitta 300+ företag automatiskt
- ✅ Verifiera att de har aktiva jobb
- ✅ Spara till `teamtailor-companies.json`
- ✅ Sortera med minsta företag först (mest intressanta)

## 📋 Discovery-metoder

Scriptet använder 5 olika metoder för maximal täckning:

### 1. **TeamTailor Showcase Scraping**
Scrapar TeamTailors egna kundcase-sidor för att hitta företag de visar upp.

### 2. **Subdomän Enumeration**
Testar vanliga svenska företagsnamn mot `*.teamtailor.com`

### 3. **Common Crawl Index**
Söker i Common Crawl (arkiv av hela internet) efter TeamTailor-domäner.

### 4. **Custom Domain Detection** 🆕
Hittar företag som använder egna domäner istället för `.teamtailor.com`:
- `jobb.företag.se`
- `karriar.företag.se`  
- `careers.företag.com`
- `jobs.företag.io`

**Exempel som hittas:**
- ✅ `jobb.sveakbt.se`
- ✅ `careers.soundtrack.io`
- ✅ `karriar.inet.se`

### 5. **Sitemap Crawling**
Letar genom TeamTailors sitemap efter kund-länkar.

## 📊 Resultat

Efter körning får du en fil med:
```json
{
  "discoveredAt": "2025-11-03T09:00:00.000Z",
  "count": 367,
  "newCompaniesFound": 2,
  "companies": [
    {
      "name": "Svea KBT & Elly Care",
      "careerSiteUrl": "https://jobb.sveakbt.se/",
      "rssUrl": "https://jobb.sveakbt.se/jobs.rss",
      "jobCount": 20,
      "enabled": true
    }
  ]
}
```

## 🔍 Hitta mindre företag

Scriptet sorterar automatiskt företag efter antal jobb, med **minsta först**.

Mindre företag = Mindre konkurrens = Bättre chans att få jobbet!

## ⚙️ Anpassa

### Lägg till fler företag att söka

Editera `auto-discover-teamtailor.js` och lägg till i `potentialCustomDomains`:

```javascript
const potentialCustomDomains = [
  'dittföretag',
  'ettannatföretag',
  // ...
];
```

### Lägg till manuellt

Om du hittar ett företag som scriptet missat:

```bash
# Exempel: Lägg till Svea KBT
curl https://jobb.sveakbt.se/jobs.rss
```

Om det fungerar, lägg till det i teamtailor-companies.json.

## 📝 Tips

1. **Kör regelbundet** - Nya företag börjar använda TeamTailor hela tiden
2. **Fokusera på små** - Företag med 1-10 jobb är goldmines
3. **Custom domains** - Många stora företag använder egna domäner
4. **Verifiera RSS** - Alla URLs i listan har verifierad RSS-feed

## 🛠️ Felsökning

**Scriptet hittar inga nya företag?**
- Lägg till fler företagsnamn i `potentialCustomDomains`
- Kör Common Crawl-sökning på nytt (uppdateras varje månad)

**Timeout-errors?**
- Öka timeout i `httpsGet()` funktionen
- Minska antal samtidiga requests

**RSS-feed ger fel?**
- Vissa företag har ingen RSS eller använder annat system
- Scriptet skippar dessa automatiskt
