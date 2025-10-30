# 🔍 Search Engine Discovery - Kör Google-Dorks GRATIS!

Kör Google-dork queries utan API key genom **DuckDuckGo + Bing scraping**.

## 🚀 Quick Start

```bash
node scripts/search-engine-discovery.js
```

Ingen API key, ingen setup, helt gratis!

## 📋 Queries Som Körs

Exakt de du ville ha:

1. `site:*.teamtailor.com -www.teamtailor.com`
2. `"Powered by Teamtailor" -site:teamtailor.com`
3. `inurl:careers Teamtailor`
4. `inurl:career Teamtailor`
5. `inurl:jobs Teamtailor`
6. `site:career.* "Teamtailor"`
7. `site:jobb.* "Teamtailor"`
8. `site:*.se "Teamtailor" jobs`
9. `site:*.se "Teamtailor" career`
10. `site:*.se "Teamtailor" careers`

Plus extra svenska queries för Stockholm, Göteborg, Malmö.

## 🎯 Hur Det Fungerar

1. **DuckDuckGo HTML Scraping** - Kör queries och scrapar resultat
2. **Bing HTML Scraping** - Backup search engine
3. **Kombinera Resultat** - Ta bästa från båda
4. **Verifiera** - Kolla att RSS feed finns
5. **Spara** - JSON output + copy-paste format

## 📊 Expected Results

- **100-300 URLs** från search engines
- **50-150 verifierade** TeamTailor företag
- **Många custom domains** som inte finns i CT logs

## 🆚 Varför Inte Bara Google?

| Feature | Detta Script | Google API | Google Scraping |
|---------|-------------|------------|----------------|
| API Key | ❌ Nej | ✅ Ja | ❌ Nej |
| Setup | ❌ Ingen | ✅ Krånglig | ❌ Ingen |
| Cost | 💰 $0 | 💰 $0-5 | 💰 $0 |
| Blocked by Google | ❌ Nej | ❌ Nej | ✅ **JA** |
| Works | ✅ **JA** | ✅ Ja | ❌ Nej |

Google blockar bots aggressivt. DuckDuckGo och Bing är mer tillåtande.

## 📁 Output

**3 filer skapas:**

1. **search-engine-urls.txt** - Alla URLs som hittades
2. **search-engine-results.json** - Verifierade företag (JSON)
3. **scripts/urls.txt** - Uppdateras med nya URLs

## 💡 Tips

### Långsam? Normal!

Search engine scraping tar tid:
- 15 queries × 5 sekunder = ~1-2 minuter för queries
- Verification tar ytterligare 2-5 minuter
- **Total: 5-10 minuter**

Det är värt det för att hitta custom domains!

### Kombinera Med Free Discovery

Kör båda för maximal coverage:

```bash
# Först: CT logs + Swedish patterns (snabbast)
node scripts/free-teamtailor-discovery.js

# Sen: Search engine dorks (custom domains)
node scripts/search-engine-discovery.js
```

### Rate Limiting

Om du får errors:
- Scriptet väntar 2-3 sekunder mellan queries
- Detta är normalt för att undvika blocking
- Var tålmodig!

## 🎉 Resultat

**Detta hittar företag som:**
- Använder custom domains (careers.company.se)
- Inte är i Certificate Transparency logs
- Har "Powered by Teamtailor" i footern
- Har career/jobs i URL:en

## 📈 Combined Strategy

**Bästa resultatet:**

```bash
# Steg 1: FREE discovery (CT logs + patterns)
node scripts/free-teamtailor-discovery.js
# → Hittar: 150-200 företag

# Steg 2: Search engine dorks
node scripts/search-engine-discovery.js
# → Hittar: +50-100 custom domains

# = Total: 200-300+ unika företag!
```

## 🚨 Troubleshooting

### "No results found"

DuckDuckGo/Bing kan ibland returnera inga resultat.
- Vänta 5 minuter
- Försök igen
- Eller kör bara free-discovery istället

### "Connection timeout"

- Din internetanslutning är långsam
- Öka timeout i koden (10000 → 20000)

### "Too many requests"

- Scriptet blev blockerat (sällsynt)
- Vänta 10-15 minuter
- Kör igen

## ✅ Summary

**Detta script:**
- ✅ Kör alla dina Google-dorks
- ✅ Utan API key
- ✅ Helt gratis
- ✅ Hittar custom domains
- ✅ Verifierar automatiskt

**Bara kör:**
```bash
node scripts/search-engine-discovery.js
```

**Done!** 🎉
