<template>
  <div class="profile-layout">
    <div class="profile-container">
      <h1 class="profile-title">Min Profil</h1>
      
      <div class="profile-columns">
        <!-- Left Column: Personal Information -->
        <div class="left-column">
          <div class="profile-section">
            <div class="section-header">
              <h2 class="section-title">Personlig Information</h2>
              <div class="completion-indicator">
                <div class="completion-badge" :class="{ 'complete': isProfileComplete }">
                  <svg v-if="isProfileComplete" class="completion-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <svg v-else class="completion-icon" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
                    <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <span class="completion-text">
                    {{ isProfileComplete ? 'Komplett' : 'Ofullständig' }}
                  </span>
                </div>
              </div>
            </div>
            <form @submit.prevent="saveProfile" class="profile-form">
              <div class="form-grid">
                <div class="form-group">
                  <label for="firstName" class="form-label">Förnamn</label>
                  <input
                    id="firstName"
                    v-model="profile.firstName"
                    type="text"
                    class="form-input"
                    placeholder="Ditt förnamn"
                  />
                </div>
                
                <div class="form-group">
                  <label for="lastName" class="form-label">Efternamn</label>
                  <input
                    id="lastName"
                    v-model="profile.lastName"
                    type="text"
                    class="form-input"
                    placeholder="Ditt efternamn"
                  />
                </div>
                
                <div class="form-group">
                  <label for="email" class="form-label">E-post</label>
                  <input
                    id="email"
                    v-model="profile.email"
                    type="email"
                    class="form-input"
                    placeholder="din@email.se"
                  />
                </div>
                
                <div class="form-group">
                  <label for="phone" class="form-label">Telefon</label>
                  <input
                    id="phone"
                    v-model="profile.phone"
                    type="tel"
                    class="form-input"
                    placeholder="070-123 45 67"
                  />
                </div>
                
                <div class="form-group full-width">
                  <label for="address" class="form-label">Adress</label>
                  <input
                    id="address"
                    v-model="profile.address"
                    type="text"
                    class="form-input"
                    placeholder="Gatuadress, Postnummer, Stad"
                  />
                </div>
                
                <div class="form-group full-width">
                  <label for="summary" class="form-label">Kort beskrivning</label>
                  <textarea
                    id="summary"
                    v-model="profile.summary"
                    class="form-textarea"
                    rows="4"
                    placeholder="Beskriv dig själv och dina mål..."
                  ></textarea>
                </div>
              </div>
              
              <button type="submit" class="save-btn">
                Spara Profil
              </button>
            </form>
          </div>
        </div>

        <!-- Right Column: CV and Cover Letter Generation -->
        <div class="right-column">
          <!-- CV Section -->
          <div class="profile-section">
            <h2 class="section-title">CV Hantering</h2>
            <div class="cv-section">
              <div class="upload-area">
                <input
                  ref="cvFileInput"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  @change="handleCVUpload"
                  class="file-input"
                />
                <button @click="cvFileInput?.click()" class="upload-btn">
                  <svg class="upload-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2"/>
                    <polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2"/>
                    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  Ladda upp CV
                </button>
              </div>
              
              <div v-if="profile.cvFile" class="file-info">
                <div class="file-details">
                  <span class="file-name">{{ profile.cvFile.name }}</span>
                  <span class="file-size">({{ formatFileSize(profile.cvFile.size) }})</span>
                </div>
                <button @click="removeCVFile" class="remove-btn">Ta bort</button>
              </div>
              
              <DocumentGenerator
                title="AI CV Generator"
                description="Generera ett professionellt CV baserat på din profilinformation"
                button-text="Generera CV med AI"
                document-type="CV"
                :profile="profile"
                api-endpoint="/api/ai/generate-cv"
                @generated="handleCVGenerated"
              />
            </div>
          </div>

          <!-- Job Matching Section -->
          <div class="profile-section">
            <JobMatchingSection 
              :profile="profile" 
              :matching-jobs="[]"
              @update:profile="profile = $event"
              @test-matching="handleTestMatching"
            />
          </div>

          <!-- Cover Letter Section -->
          <div class="profile-section">
            <h2 class="section-title">Personligt Brev</h2>
            <div class="cover-letter-section">
              <div class="template-area">
                <div class="template-header">
                  <label for="coverLetterTemplate" class="form-label">Mall för personligt brev</label>
                  <button @click="resetToDefaultTemplate" type="button" class="reset-template-btn">
                    <svg class="reset-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M21 3v5h-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M3 21v-5h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Återställ mall
                  </button>
                </div>
                <textarea
                  id="coverLetterTemplate"
                  v-model="profile.coverLetterTemplate"
                  class="form-textarea"
                  rows="8"
                  placeholder="Skriv din mall för personligt brev här. Använd {company} och {position} som platshållare..."
                ></textarea>
              </div>
              
              <DocumentGenerator
                title="AI Personligt Brev Generator"
                description="Generera ett skräddarsytt personligt brev för specifika jobb"
                button-text="Generera personligt brev med AI"
                document-type="Personligt Brev"
                :show-job-inputs="true"
                :profile="profile"
                api-endpoint="/api/ai/generate-cover-letter"
                @generated="handleCoverLetterGenerated"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Notifications -->
    <NotificationToast
      v-for="notification in notifications"
      :key="notification.id"
      :type="notification.type"
      :title="notification.title"
      :message="notification.message"
      :duration="notification.duration"
      :persistent="notification.persistent"
      @close="removeNotification(notification.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useHead } from '#imports'
import DocumentGenerator from '../../components/DocumentGenerator.vue'
import NotificationToast from '../../components/NotificationToast.vue'
import JobMatchingSection from '../../components/JobMatchingSection.vue'
import { useProfile } from '../../composables/useProfile'
import { useNotifications } from '../../composables/useNotifications'

// Page metadata
useHead({
  title: 'Min Profil - Jobbcentralen',
  meta: [
    { name: 'description', content: 'Hantera din profil, CV och personliga brev på Jobbcentralen' }
  ]
})

const { 
  profile, 
  isProfileComplete, 
  canGenerateCV, 
  canGenerateCoverLetter, 
  loadProfile, 
  saveProfile: saveProfileData,
  getValidationErrors 
} = useProfile()

const { notifications, success, error, warning, removeNotification } = useNotifications()

const cvFileInput = ref<HTMLInputElement>()
const isLoading = ref(false)

// Load profile from localStorage on mount
onMounted(() => {
  loadProfile()
})

function saveProfile() {
  const errors = getValidationErrors()
  
  if (errors.length > 0) {
    warning('Vänligen korrigera följande fel:', 'Validering misslyckades', {
      message: errors.join(', '),
      persistent: true
    })
    return
  }
  
  if (saveProfileData()) {
    success('Profil sparad framgångsrikt!', 'Sparad')
  } else {
    error('Kunde inte spara profil. Försök igen.', 'Fel')
  }
}

function handleCVUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    profile.value.cvFile = file
  }
}

function removeCVFile() {
  profile.value.cvFile = null
  if (cvFileInput.value) {
    cvFileInput.value.value = ''
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

async function generateCV() {
  if (!canGenerateCV.value) return
  
  try {
    const response = await $fetch('/api/ai/generate-cv', {
      method: 'POST',
      body: {
        profile: profile.value
      }
    })
    
    if (response.success) {
      // Create and download the CV as a text file
      const blob = new Blob([response.cv], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${profile.value.firstName}_${profile.value.lastName}_CV.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      alert('CV genererat och nedladdat!')
    }
  } catch (error) {
    console.error('Error generating CV:', error)
    alert('Fel vid generering av CV. Försök igen.')
  }
}

function handleCVGenerated(content: string) {
  success('CV genererat framgångsrikt!', 'AI Generation')
  console.log('CV generated:', content)
}

function handleCoverLetterGenerated(content: string) {
  success('Personligt brev genererat framgångsrikt!', 'AI Generation')
  console.log('Cover letter generated:', content)
}

function resetToDefaultTemplate() {
  const defaultTemplate = `Hej _____!

Mitt namn är _____ och jag skriver angående tjänsten som _____ hos er. Jag såg er annons på _____ och det lät mycket intressant. Jag är på jakt efter ett jobb med liknande beskrivning där jag kan få användning för min kompetens, men också utvecklas. Jag är utbildad _____ och har lång erfarenhet inom ___. Jag är övertygad om att jag skulle kunna hjälpa er med en hel del.

Hej på er!

Jag heter _____ och läste på _____ att ni söker nya medarbetare. Jag är en jätteduktig _____ med mycket energi och stor dedikation till _____. Nu jobbar jag som _____, men känner att jag vill vidareutvecklas i min karriär. Jag vet att jag har stor potential, mycket att erbjuda och jag är säker på att jag skulle vara fantastisk på det jobb ni erbjuder.

Hejsan!

Jag fann er annons på _____ och det låter som något för mig. Jag har en bakgrund som _____ och har jobbat ganska länge inom _____ med allt ifrån _____ till _____. Jag söker nu ett jobb som är mer i linje med den tjänst ni beskriver, och tror jag skulle kunna tillföra mycket hos er.`
  
  profile.value.coverLetterTemplate = defaultTemplate
  success('Mall återställd till standard!', 'Återställd')
}

async function handleTestMatching() {
  try {
    console.log('🎯 Hämtar alla jobb för matchning...')
    const allFetchedJobs: any[] = []
    
    // Fetch from Platsbanken in batches (max 2000 per request)
    console.log('📦 Hämtar jobb från Platsbanken...')
    const platsbankenBatchSize = 2000
    const maxPlatsbankenBatches = 10 // Up to 20000 jobs
    
    for (let i = 0; i < maxPlatsbankenBatches; i++) {
      const offset = i * platsbankenBatchSize
      const response = await $fetch(`/api/jobs/platsbanken?limit=${platsbankenBatchSize}&offset=${offset}`)
      
      if (response.success && response.data.jobs.length > 0) {
        const jobsWithSource = response.data.jobs.map((job: any) => ({
          ...job,
          source: 'platsbanken' as const
        }))
        allFetchedJobs.push(...jobsWithSource)
        console.log(`  Batch ${i + 1}: ${response.data.jobs.length} jobb (totalt Platsbanken: ${allFetchedJobs.length})`)
        
        // If we got fewer jobs than batch size, we've reached the end
        if (response.data.jobs.length < platsbankenBatchSize) {
          console.log('  ✅ Alla Platsbanken-jobb hämtade')
          break
        }
      } else {
        break
      }
    }
    
    // Fetch all TeamTailor jobs
    console.log('📦 Hämtar jobb från TeamTailor...')
    const teamtailorResponse = await $fetch('/api/jobs/teamtailor')
    if (teamtailorResponse.success && teamtailorResponse.data.jobs.length > 0) {
      const jobsWithSource = teamtailorResponse.data.jobs.map((job: any) => ({
        ...job,
        source: 'teamtailor' as const
      }))
      allFetchedJobs.push(...jobsWithSource)
      console.log(`  ${teamtailorResponse.data.jobs.length} TeamTailor-jobb hämtade`)
    }
    
    if (allFetchedJobs.length > 0) {
      // Import the job matching utilities
      const { calculateJobMatch, getMatchedJobs } = await import('../../utils/jobMatcher')
      
      // Calculate matches
      const matches = getMatchedJobs(allFetchedJobs, profile.value, 5)
      
      console.group('🎯 Jobbmatchning Resultat')
      console.log('📊 Profil:', {
        skills: profile.value.skills,
        jobTitles: profile.value.jobTitles,
        preferredLocations: profile.value.preferredLocations,
        avoidKeywords: profile.value.avoidKeywords
      })
      console.log(`📈 Totalt ${matches.length} matchande jobb av ${allFetchedJobs.length} testade`)
      
      // Check sources distribution
      const platsbankenJobs = allFetchedJobs.filter((j: any) => j.source === 'platsbanken').length
      const teamtailorJobs = allFetchedJobs.filter((j: any) => j.source === 'teamtailor').length
      console.log(`📦 Källor: ${platsbankenJobs} från Platsbanken, ${teamtailorJobs} från TeamTailor`)
      
      // Find TeamTailor jobs with frontend/javascript/typescript
      const techJobs = allFetchedJobs.filter((j: any) => {
        const text = `${j.title} ${j.description}`.toLowerCase()
        return text.includes('frontend') || text.includes('javascript') || text.includes('typescript') || 
               text.includes('react') || text.includes('vue') || text.includes('developer')
      })
      console.log(`🔧 Jobb med tech-termer: ${techJobs.length} av ${allFetchedJobs.length}`)
      if (techJobs.length > 0) {
        console.log('📋 Exempel på tech-jobb som BORDE matcha:')
        techJobs.slice(0, 3).forEach(job => {
          console.log(`   - "${job.title}" från ${job.company} (${job.source})`)
        })
      }
      
      // Debug: Show first 5 jobs with their content
      console.group('🔍 Debug: Första 5 jobben')
      allFetchedJobs.slice(0, 5).forEach((job: any, index: number) => {
        console.log(`\n${index + 1}. "${job.title}" - ${job.company}`)
        console.log('   📍 Källa:', job.source || 'okänd')
        console.log('   📝 Beskrivning längd:', job.description.length, 'tecken')
        console.log('   📝 Beskrivning (första 300 tecken):', job.description.substring(0, 300))
        
        // Check for "frontend" and common tech terms in description
        const desc = job.description.toLowerCase()
        const hasRelevantTerms = {
          frontend: desc.includes('frontend') || desc.includes('front-end'),
          javascript: desc.includes('javascript'),
          typescript: desc.includes('typescript'),
          react: desc.includes('react'),
          vue: desc.includes('vue'),
          developer: desc.includes('developer') || desc.includes('utvecklare')
        }
        console.log('   🔍 Innehåller:', hasRelevantTerms)
        
        const match = calculateJobMatch(job, profile.value)
        console.log('   💯 Match Score:', match.matchScore, '- Reasons:', match.matchReasons.join(', ') || 'Inga')
      })
      console.groupEnd()
      
      if (matches.length > 0) {
        console.log('🏆 Top 10 matchningar:')
        matches.slice(0, 10).forEach((match, index) => {
          console.log(`${index + 1}. "${match.job.title}" - ${match.job.company}`)
          console.log(`   💯 Poäng: ${match.matchScore}`)
          console.log(`   ✅ Anledningar: ${match.matchReasons.join(', ')}`)
          console.log(`   📍 Plats: ${match.job.location}`)
          
          // Debug: Show snippet of description where match might be
          if (match.matchReasons.length > 0) {
            const desc = match.job.description.toLowerCase()
            const title = match.job.title.toLowerCase()
            console.log(`   📝 Titel (lowercase): "${title}"`)
            console.log(`   📝 Beskrivning innehåller:`)
            
            // Check each reason
            match.matchReasons.forEach(reason => {
              if (reason.startsWith('Skill:')) {
                const skill = reason.replace('Skill: ', '').toLowerCase()
                const searchTerms = [skill, skill.replace(' ', '')]
                
                searchTerms.forEach(term => {
                  if (desc.includes(term)) {
                    const index = desc.indexOf(term)
                    const snippet = desc.substring(Math.max(0, index - 30), Math.min(desc.length, index + term.length + 30))
                    console.log(`      - "${term}": ...${snippet}...`)
                  }
                  if (title.includes(term)) {
                    console.log(`      - "${term}" finns i TITELN: "${title}"`)
                  }
                })
              }
            })
          }
          
          console.log('---')
        })
        
        // Statistics
        const excellent = matches.filter(m => m.matchScore >= 50).length
        const good = matches.filter(m => m.matchScore >= 30 && m.matchScore < 50).length
        const okay = matches.filter(m => m.matchScore >= 15 && m.matchScore < 30).length
        
        console.log('📊 Statistik:')
        console.log(`   🌟 Utmärkta matchningar (50+ poäng): ${excellent}`)
        console.log(`   ✨ Bra matchningar (30-49 poäng): ${good}`)
        console.log(`   👍 Okej matchningar (15-29 poäng): ${okay}`)
        
        const avgScore = Math.round(matches.reduce((sum, m) => sum + m.matchScore, 0) / matches.length)
        console.log(`   📈 Genomsnittlig poäng: ${avgScore}`)
      } else {
        console.log('❌ Inga matchningar hittades. Prova att:')
        console.log('   • Lägg till fler skills')
        console.log('   • Lägg till jobbtitlar')
        console.log('   • Kontrollera stavning')
      }
      console.groupEnd()
      
      success(`Hittade ${matches.length} matchande jobb! Kolla konsolen för detaljer.`, 'Matchning testad')
    } else {
      warning('Kunde inte hämta jobb för test', 'Fel')
    }
  } catch (err) {
    console.error('Fel vid testning av matchning:', err)
    error('Kunde inte testa matchning. Försök igen.', 'Fel')
  }
}

async function generateCoverLetter() {
  if (!canGenerateCoverLetter.value) return
  
  const jobTitle = prompt('Ange jobbtitel:')
  const companyName = prompt('Ange företagsnamn:')
  
  if (!jobTitle || !companyName) {
    alert('Jobbtitel och företagsnamn krävs för att generera personligt brev.')
    return
  }
  
  try {
    const response = await $fetch('/api/ai/generate-cover-letter', {
      method: 'POST',
      body: {
        profile: profile.value,
        jobTitle,
        companyName
      }
    })
    
    if (response.success) {
      // Create and download the cover letter as a text file
      const blob = new Blob([response.coverLetter], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${profile.value.firstName}_${profile.value.lastName}_Personligt_Brev_${companyName}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      alert('Personligt brev genererat och nedladdat!')
    }
  } catch (error) {
    console.error('Error generating cover letter:', error)
    alert('Fel vid generering av personligt brev. Försök igen.')
  }
}
</script>

<style scoped>
.profile-layout {
  width: 1364px;
  margin: 6px auto;
  margin-left: -10.6rem;
  padding: 0;
}

.profile-container {
  background-color: #f5f5f5;
  border: 1px solid black;
  padding: 6px;
  box-sizing: border-box;
}

.profile-columns {
  display: flex;
  gap: 6px;
  height: 100%;
}

.left-column {
  flex: 1;
  background-color: white;
  border: 1px solid black;
  padding: 2rem;
  box-sizing: border-box;
}

.right-column {
  flex: 1;
  background-color: white;
  border: 1px solid black;
  padding: 2rem;
  box-sizing: border-box;
}

.profile-title {
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 2rem;
  color: #1D6453;
  margin-bottom: 2rem;
  text-align: center;
}

.profile-section {
  margin-bottom: 2rem;
}

.left-column .profile-section {
  border-bottom: none;
}

.right-column .profile-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e5e5;
}

.right-column .profile-section:last-child {
  border-bottom: none;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 1.5rem;
  color: black;
  margin: 0;
}

.completion-indicator {
  display: flex;
  align-items: center;
}

.completion-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 6px 12px;
  border-radius: 0;
  border: 1px solid black;
  background-color: white;
  transition: all 0.2s;
}

.completion-badge.complete {
  background-color: #1D6453;
  border-color: black;
  color: white;
}

.completion-icon {
  width: 1rem;
  height: 1rem;
}

.completion-text {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
}

.profile-form {
  width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  color: black;
  margin-bottom: 0.5rem;
}

.form-input, .form-textarea {
  font-family: 'Inter', sans-serif;
  padding: 0.75rem;
  border: 1px solid black;
  background-color: white;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #1D6453;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.save-btn, .upload-btn, .generate-btn {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.save-btn {
  background-color: #1D6453;
  color: white;
  font-size: 1rem;
}

.save-btn:hover {
  background-color: #155242;
}

.upload-btn {
  background-color: transparent;
  color: #1D6453;
  border: 1px solid #1D6453;
}

.upload-btn:hover {
  background-color: #f0f9f7;
}

.generate-btn {
  background-color: #1D6453;
  color: white;
  margin-top: 1rem;
}

.generate-btn:hover:not(:disabled) {
  background-color: #155242;
}

.generate-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.upload-icon, .generate-icon {
  width: 1rem;
  height: 1rem;
}

.cv-section, .cover-letter-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.file-input {
  display: none;
}

.file-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f8f8;
  border: 1px solid #e5e5e5;
}

.file-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.file-name {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  color: black;
}

.file-size {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  color: #666;
}

.remove-btn {
  font-family: 'Inter', sans-serif;
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
}

.remove-btn:hover {
  background-color: #c82333;
}

.template-area {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.reset-template-btn {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  background-color: transparent;
  color: #666;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s;
}

.reset-template-btn:hover {
  background-color: #f8f8f8;
  border-color: #1D6453;
  color: #1D6453;
}

.reset-icon {
  width: 1rem;
  height: 1rem;
}

@media (max-width: 1400px) {
  .profile-layout {
    width: 100%;
    max-width: 1364px;
    margin: 6px auto;
    margin-left: auto;
    padding: 0 1rem;
  }
}

@media (max-width: 768px) {
  .profile-layout {
    width: 100%;
    margin: 6px auto;
    padding: 0 0.5rem;
  }
  
  .profile-container {
    padding: 1rem;
  }
  
  .profile-columns {
    flex-direction: column;
    gap: 1rem;
  }
  
  .left-column,
  .right-column {
    padding: 1.5rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .profile-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .section-title {
    font-size: 1.25rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .completion-indicator {
    align-self: flex-end;
  }
}
</style>
