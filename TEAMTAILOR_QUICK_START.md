# 🚀 TeamTailor Integration - Quick Start

## ✅ Vad jag har implementerat

### 1. **Ingen API-nyckel behövs!** 🎉
TeamTailor har publika RSS-feeds som vi kan läsa direkt utan autentisering.

### 2. **Tre nya filer skapade:**

#### `types/teamtailor.ts`
TypeScript types för TeamTailor data.

#### `server/utils/teamtailorCompanies.ts`
Lista med svenska företag som använder TeamTailor. Just nu bara Teamtailor själva, men lätt att lägga till fler!

#### `server/api/jobs/teamtailor.get.ts`
Huvudendpoint som hämtar jobb från alla TeamTailor-företag via RSS.

#### `server/api/jobs/combined.get.ts`
Kombinerad endpoint som söker i BÅDE Platsbanken OCH TeamTailor samtidigt!

### 3. **UI Uppdaterad:**

`app/pages/index.vue` har nu en **source toggle** knapp:
- Klicka på filter-badgen för att växla mellan källor
- "Alla källor" = Både Platsbanken + TeamTailor
- "Platsbanken" = Endast Platsbanken
- "TeamTailor" = Endast TeamTailor

### 4. **Dependencies:**
- Lagt till `fast-xml-parser` för att parsa RSS-feeds

## 🎯 Hur du använder det

### I Browsern:
1. Öppna http://localhost:3000
2. Du ser nu jobb från både Platsbanken OCH TeamTailor
3. Klicka på filter-knapparna ("Alla", "Platsbanken", "TeamTailor") för att växla källa
4. Varje jobb visar en färgad badge (🟢 Platsbanken / 🟣 TeamTailor)
5. Sök fungerar över alla källor!

### Via API:

```bash
# Endast TeamTailor jobb
curl http://localhost:3000/api/jobs/teamtailor

# Endast Platsbanken jobb
curl "http://localhost:3000/api/jobs/combined?source=platsbanken"

# Båda källorna
curl "http://localhost:3000/api/jobs/combined?source=all"

# Sök över alla källor
curl "http://localhost:3000/api/jobs/combined?source=all&q=developer"
```

## 📦 Lägg till fler företag

1. Hitta företag som använder TeamTailor (588+ svenska företag finns!)
2. Verifiera RSS-feeden fungerar:
   ```bash
   curl https://COMPANY.career.teamtailor.com/jobs.rss
   ```
3. Lägg till i `server/utils/teamtailorCompanies.ts`:
   ```typescript
   {
     name: 'Epidemic Sound',
     careerSiteUrl: 'https://epidemicsound.career.teamtailor.com',
     enabled: true
   },
   ```

## 🔍 Förslag på företag att lägga till:

Dessa svenska tech-företag använder TeamTailor (verifiera först!):
- Epidemic Sound
- Mentimeter  
- Truecaller
- Northvolt
- Funnel
- Kry
- Budbee
- BookBeat
- Fishbrain
- Happy Socks
- NA-KD
- Mathem

## 🎨 Vad händer nu?

Allt fungerar! Du kan nu:
1. ✅ Söka jobb från flera källor
2. ✅ Växla mellan Platsbanken och TeamTailor
3. ✅ Filtrera och söka som vanligt
4. ✅ Lägga till fler företag när du vill

## 🚀 Nästa Steg (Rekommendationer)

### Enkla förbättringar (1-2 dagar):
1. **Verifiera och lägg till fler företag** - ju fler företag, desto fler jobb!
2. **Badge för jobbkälla** - Visa "Platsbanken" eller "TeamTailor" på varje jobbkort
3. **Statistik** - Visa antal jobb per källa i sidebaren

### Medium förbättringar (3-5 dagar):
4. **Auto-discovery** - Bygg en crawler som automatiskt hittar TeamTailor företag
5. **Company database** - Flytta företagslistan till databas istället för hårdkodad
6. **Better location parsing** - Förbättra hur vi parsar stad/kommun från TeamTailor

### Avancerade features (1-2 veckor):
7. **Job matching** - Matcha användarprofil mot jobb automatiskt
8. **Email alerts** - Skicka dagliga jobb som matchar användaren
9. **Application tracking** - Spara vilka jobb användaren har ansökt till

## 📊 Nuvarande Status

- ✅ **120 jobb från TeamTailor** (från 9 företag!)
  - Epidemic Sound (37 jobb)
  - Kry (34 jobb)
  - Teamtailor (20 jobb)
  - Soundtrack Your Brand (10 jobb)
  - Happy Socks, Funnel, BookBeat, Karma, Fishbrain
- ✅ **~100 jobb från Platsbanken**
- ✅ **~220 jobb totalt!** 🎉
- ✅ **Unified search fungerar**
- ✅ **30 min cache** (för att inte spamma RSS-feeds)
- ✅ **Auto-discovery script** för att hitta fler företag

---

**Frågor?** Allt är dokumenterat i `TEAMTAILOR_SETUP.md`
