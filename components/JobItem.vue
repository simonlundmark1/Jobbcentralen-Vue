<template>
  <div class="job-container" :class="{ 'expanded': isExpanded, 'contracting': isContracting }" :style="jobStyle">
    <div class="inner-div"></div>
    <div class="top-left-box" :style="topLeftBoxStyle">
      <div class="inner-top-left-bar" :style="innerTopLeftBarStyle"></div>
      <div class="inner-text">
        <h3 class="job-title">{{ job.title }}</h3>
        <p class="location-text">{{ job.location }}</p>
      </div>
    </div>
    <p class="employer-text">{{ job.company }}</p>
    <p class="deadline-text">Sista ansökningsdatum: {{ formatDate(job.applicationDeadline) }}</p>
    
    <!-- Action Buttons Row -->
    <div class="action-buttons">
      <button @click="toggleExpanded" class="expand-btn">
        <span v-if="!isExpanded">Visa mer</span>
        <span v-else>Visa mindre</span>
        <svg class="expand-icon" :class="{ 'rotated': isExpanded }" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      
      <button @click="toggleFavorite" class="favorite-btn" :class="{ 'favorited': props.isFavorited, 'trash-btn': props.showTrashIcon }">
        <svg v-if="props.showTrashIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14ZM10 11v6M14 11v6"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" 
                :stroke="props.isFavorited ? 'none' : 'currentColor'" 
                :fill="props.isFavorited ? 'currentColor' : 'none'" 
                stroke-width="2"/>
        </svg>
      </button>
    </div>
    
    <!-- Expanded Content -->
    <div v-if="isExpanded || isContracting" class="expanded-content" :class="{ 'contracting': isContracting }">
      <div class="job-details">
        <div class="detail-section">
          <h4>Beskrivning</h4>
          <div class="job-description" v-html="formattedDescription"></div>
        </div>
        
        <div class="detail-section" v-if="job.employmentType">
          <h4>Anställningsform</h4>
          <p>{{ job.employmentType }}</p>
        </div>
        
        <div class="detail-section" v-if="job.workingHours">
          <h4>Arbetstid</h4>
          <p>{{ job.workingHours }}</p>
        </div>
        
        <div class="detail-section" v-if="job.salary">
          <h4>Lön</h4>
          <p>{{ job.salary }}</p>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="expanded-actions">
        <button @click="applyToJob" class="action-btn apply-btn">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2"/>
            <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2"/>
            <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2"/>
            <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2"/>
            <polyline points="10,9 9,9 8,9" stroke="currentColor" stroke-width="2"/>
          </svg>
          Ansök
        </button>
        
        <button @click="optimizeCV" class="action-btn optimize-btn">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2"/>
            <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2"/>
            <path d="M12 18v-6l-3 3" stroke="currentColor" stroke-width="2"/>
            <path d="M9 15l3-3 3 3" stroke="currentColor" stroke-width="2"/>
          </svg>
          Optimera CV
        </button>
        
        <button @click="optimizeCoverLetter" class="action-btn optimize-btn">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" stroke="currentColor" stroke-width="2"/>
            <path d="M3 9l9 6 9-6" stroke="currentColor" stroke-width="2"/>
            <path d="M12 15v-6l-3 3" stroke="currentColor" stroke-width="2"/>
            <path d="M9 12l3-3 3 3" stroke="currentColor" stroke-width="2"/>
          </svg>
          Generera personligt brev
        </button>
      </div>
    </div>
    
    <!-- Personal Letter Section -->
    <div v-if="showPersonalLetter" class="personal-letter-section">
      <div class="personal-letter-header">
        <h4>Personligt Brev</h4>
        <button @click="showPersonalLetter = false" class="close-letter-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <div v-if="isGeneratingLetter" class="generating-message">
        <div class="spinner"></div>
        <p>Genererar personligt brev...</p>
      </div>
      
      <div v-else class="letter-content">
        <textarea 
          v-model="personalLetter" 
          class="letter-textarea"
          placeholder="Ditt personliga brev kommer att visas här..."
          rows="10"
        ></textarea>
        
        <div class="letter-actions">
          <div class="prompt-section">
            <input 
              v-model="personalLetterPrompt" 
              type="text" 
              class="prompt-input"
              placeholder="Lägg till instruktioner för att regenerera brevet..."
              @keypress.enter="regeneratePersonalLetter"
            />
            <button 
              @click="regeneratePersonalLetter" 
              class="regenerate-btn"
              :disabled="!personalLetterPrompt.trim() || isGeneratingLetter"
            >
              Regenerera
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SimpleJob } from '../types/platsbanken'
import { useProfile } from '../composables/useProfile'

interface Props {
  job: SimpleJob
  index: number
  isEven: boolean
  isFavorited?: boolean
  showTrashIcon?: boolean
}

interface Emits {
  (e: 'toggle-favorite'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Get profile from global state
const { profile } = useProfile()

// Component state
const isExpanded = ref(false)
const isContracting = ref(false)
const showPersonalLetter = ref(false)
const personalLetter = ref('')
const personalLetterPrompt = ref('')
const isGeneratingLetter = ref(false)

// Methods
const toggleExpanded = () => {
  if (isExpanded.value) {
    // Start contracting
    isContracting.value = true
    // Wait for content to fade out, then collapse container
    setTimeout(() => {
      isExpanded.value = false
      isContracting.value = false
    }, 300) // Match the fadeOut animation duration
  } else {
    // Expand immediately
    isExpanded.value = true
    isContracting.value = false
  }
}

const toggleFavorite = () => {
  emit('toggle-favorite')
}

const applyToJob = () => {
  if (props.job.applicationUrl) {
    window.open(props.job.applicationUrl, '_blank')
  } else if (props.job.applicationEmail) {
    window.location.href = `mailto:${props.job.applicationEmail}?subject=Ansökan - ${props.job.title}`
  } else {
    alert('Ingen ansökningslänk tillgänglig för detta jobb.')
  }
}

const optimizeCV = () => {
  // TODO: Navigate to profile page with CV optimization for this job
  alert('CV-optimering kommer snart! Detta kommer att öppna profilsidan med AI-optimering för detta specifika jobb.')
}

const optimizeCoverLetter = () => {
  showPersonalLetter.value = !showPersonalLetter.value
  if (showPersonalLetter.value && !personalLetter.value) {
    generatePersonalLetter()
  }
}

const generatePersonalLetter = async () => {
  isGeneratingLetter.value = true
  try {
    // Debug: Log what we're sending
    console.log('Generating cover letter with profile:', {
      firstName: profile.value.firstName,
      lastName: profile.value.lastName,
      email: profile.value.email,
      phone: profile.value.phone,
      summary: profile.value.summary
    })
    
    const response = await $fetch('/api/ai/generate-cover-letter', {
      method: 'POST',
      body: {
        profile: profile.value,
        jobTitle: props.job.title,
        companyName: props.job.company,
        jobDescription: props.job.description
      }
    })
    
    if (response.success) {
      personalLetter.value = response.coverLetter
    } else {
      throw new Error('Failed to generate cover letter')
    }
  } catch (error: any) {
    console.error('Error generating personal letter:', error)
    
    // Show more specific error message
    let errorMessage = 'Fel vid generering av personligt brev.'
    
    if (error.statusCode === 500) {
      errorMessage += '\n\nTroligen saknas OpenAI API-nyckel. Kontakta administratören.'
    } else if (error.statusCode === 400) {
      errorMessage += '\n\nKontrollera att du har fyllt i alla obligatoriska fält i din profil (namn, email, telefon).'
    } else {
      errorMessage += '\n\nFel: ' + (error.message || 'Okänt fel')
    }
    
    personalLetter.value = errorMessage
  } finally {
    isGeneratingLetter.value = false
  }
}

const regeneratePersonalLetter = async () => {
  if (!personalLetterPrompt.value.trim()) return
  
  isGeneratingLetter.value = true
  try {
    // Add custom instructions to the job description
    const customJobDescription = `${props.job.description}\n\nExtra instruktioner: ${personalLetterPrompt.value}`
    
    const response = await $fetch('/api/ai/generate-cover-letter', {
      method: 'POST',
      body: {
        profile: profile.value,
        jobTitle: props.job.title,
        companyName: props.job.company,
        jobDescription: customJobDescription
      }
    })
    
    if (response.success) {
      personalLetter.value = response.coverLetter
    } else {
      throw new Error('Failed to regenerate cover letter')
    }
  } catch (error: any) {
    console.error('Error regenerating personal letter:', error)
    
    let errorMessage = 'Fel vid regenerering av personligt brev.'
    
    if (error.statusCode === 500) {
      errorMessage += '\n\nTroligen saknas OpenAI API-nyckel. Kontakta administratören.'
    } else {
      errorMessage += '\n\nFel: ' + (error.message || 'Okänt fel')
    }
    
    personalLetter.value = errorMessage
  } finally {
    isGeneratingLetter.value = false
    personalLetterPrompt.value = ''
  }
}

const formattedDescription = computed(() => {
  if (!props.job.description) return 'Ingen beskrivning tillgänglig.'
  
  // Basic HTML formatting for job descriptions
  return props.job.description
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
})


const jobStyle = computed(() => {
  let minHeight = '135px'
  let height = '135px'
  
  if (isExpanded.value || showPersonalLetter.value) {
    minHeight = 'auto'
    height = 'auto'
    
    // Add extra height when personal letter is shown to ensure proper expansion
    if (showPersonalLetter.value) {
      minHeight = '600px' // Ensure enough space for the letter section
    }
  }
  
  return {
    minHeight,
    height,
    width: '100%',
    border: '1px solid black',
    backgroundColor: props.isEven ? '#FCFCFC' : '#F8F8F8',
    boxSizing: 'border-box' as const,
    margin: '0 0 6px 0',
    position: 'relative' as const,
    overflow: 'visible' as const,
  }
})

const topLeftBoxStyle = computed(() => ({
  height: '40px',
  width: '98.5%',
  position: 'absolute' as const,
  top: '12px',
  left: '6px',
  border: '1px solid black',
  whiteSpace: 'nowrap' as const,
  backgroundColor: '#1D6453',
}))

const innerTopLeftBarStyle = computed(() => ({
  height: '6px',
  backgroundColor: '#155242',
  width: '100%',
}))

const displayLocation = computed(() => {
  return props.job.location || 'Plats ej tillgänglig'
})

function formatDate(dateString?: string): string {
  if (!dateString) return 'Datum ej tillgängligt'
  
  const months = [
    'Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
    'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'
  ]

  const date = new Date(dateString)
  return `${date.getDate()} ${months[date.getMonth()]}`
}
</script>

<style scoped>
.job-link {
  text-decoration: none;
  color: inherit;
}

.job-container {
  cursor: default;
  min-height: 135px;
  max-height: 135px;
  transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.job-container.expanded {
  min-height: auto;
  max-height: none;
  transition: max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
}

.job-container.contracting {
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
}

.job-container:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Action Buttons */
.action-buttons {
  position: absolute;
  top: 97px;
  right: 8px;
  display: flex;
  gap: 8px;
  align-items: center;
  z-index: 10;
}

.job-container.expanded .action-buttons {
  position: absolute;
  top: 97px;
  right: 8px;
  z-index: 10;
}

.expand-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background-color: white;
  border: 1px solid black;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.expand-btn:hover {
  background-color: #f0f0f0;
}

.expand-icon {
  width: 12px;
  height: 12px;
  transition: transform 0.2s;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

.favorite-btn {
  padding: 4px;
  background-color: white;
  border: 1px solid black;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.favorite-btn:hover {
  background-color: #f0f0f0;
}

.favorite-btn.favorited {
  background-color: #1D6453;
  color: white;
}

.favorite-btn.trash-btn {
  background-color: white;
  color: black;
}

.favorite-btn.trash-btn:hover {
  background-color: #f0f0f0;
  color: black;
}

.favorite-btn svg {
  width: 16px;
  height: 16px;
}

/* Expanded Content */
.expanded-content {
  position: relative;
  margin-top: 12px;
  padding: 12px;
  border-top: 1px solid #e0e0e0;
  background-color: #fafafa;
  width: calc(100% - 24px);
  margin-left: 12px;
  margin-right: 12px;
  margin-bottom: 6px;
  box-sizing: border-box;
  max-width: calc(100% - 24px);
}

@keyframes expandedContentFadeIn {
  from {
    opacity: 0;
    transform: translateY(-15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes expandedContentFadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}

.job-details {
  margin-bottom: 16px;
}

.detail-section {
  margin-bottom: 12px;
}

.detail-section h4 {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #333;
}

.detail-section p {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  margin: 0;
  color: #666;
  line-height: 1.4;
}

.job-description {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #666;
  line-height: 1.4;
  max-height: 300px;
  overflow-y: auto;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  max-width: 100%;
  background-color: white;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
}

.job-description p {
  margin: 0 0 8px 0;
  max-width: 100%;
  overflow-wrap: break-word;
}

/* Action Buttons in Expanded State */
.expanded-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid black;
  background-color: white;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: #f0f0f0;
}

.apply-btn:hover {
  background-color: #1D6453;
  color: white;
}

.optimize-btn:hover {
  background-color: #e8f4f1;
  border-color: #1D6453;
  color: #1D6453;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .action-buttons {
    position: static;
    justify-content: flex-end;
    margin-top: 8px;
  }
  
  .expanded-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
  
  .job-container {
    min-height: auto;
  }
}

.inner-div {
  height: 6px;
  width: 100%;
  background-color: #E8E8E8;
}

.inner-text {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 16px;
  text-align: left;
  line-height: 118%;
  letter-spacing: -0.04em;
  margin-left: 6px;
  margin-top: -4px;
  color: #FFFFFF;
}

.job-title {
  margin: 0;
  padding: 0;
  position: absolute;
  bottom: 4px;
  left: 6px;
}

.location-text {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 13px;
  text-align: left;
  line-height: 118%;
  letter-spacing: -0.02em;
  position: absolute;
  top: 6px;
  left: 1px;
  color: #000000;
  margin: 1px;
  margin-top: 4rem;
}

.employer-text {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 14px;
  text-align: left;
  line-height: 118%;
  letter-spacing: -0.02em;
  margin-left: 9px;
  margin-top: 55px;
  color: #000000;
  font-weight: bold;
  margin-bottom: 0;
}

.deadline-text {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 14px;
  text-align: left;
  line-height: 118%;
  letter-spacing: -0.02em;
  margin-left: 9px;
  margin-top: 30px;
  color: grey;
  margin-bottom: 0;
}

/* Mobile-only responsive design */
@media (max-width: 768px) {
  .job-container {
    width: 100% !important;
    margin: 0 0 6px 0 !important;
    border: 1px solid black !important;
    background-color: #F8F8F8 !important;
    height: auto !important;
    padding: 0 !important;
  }
  
  .inner-div {
    height: 6px;
    width: 100%;
    background-color: #E8E8E8;
  }
  
  .top-left-box {
    position: static !important;
    width: 100% !important;
    height: auto !important;
    border: none !important;
    margin-bottom: 1rem;
  }
  
  .inner-top-left-bar {
    height: 6px;
    width: 100%;
  }
  
  .inner-text {
    margin: 0;
    padding: 1rem;
  }
  
  .job-title {
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
  }
  
  .location-text {
    margin: 0;
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }
  
  .employer-text {
    margin: 1rem 0 0.5rem 1rem;
    font-size: 1rem;
    font-weight: 600;
  }
  
  .deadline-text {
    margin: 0 0 1rem 1rem;
    font-size: 0.875rem;
  }
}

/* Personal Letter Section */
.personal-letter-section {
  margin: 16px 12px 12px 12px;
  padding: 16px;
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  animation: letterSectionFadeIn 0.3s ease-out;
  width: calc(100% - 24px);
  box-sizing: border-box;
  min-height: 300px;
}

@keyframes letterSectionFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.personal-letter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.personal-letter-header h4 {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #1D6453;
  margin: 0;
}

.close-letter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-letter-btn:hover {
  background-color: #e0e0e0;
}

.close-letter-btn svg {
  width: 16px;
  height: 16px;
}

.generating-message {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  text-align: center;
  color: #666;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e0e0e0;
  border-top: 2px solid #1D6453;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.letter-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.letter-textarea {
  width: 100%;
  min-height: 200px;
  padding: 12px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  box-sizing: border-box;
}

.letter-textarea:focus {
  outline: none;
  border-color: #1D6453;
  box-shadow: 0 0 0 2px rgba(29, 100, 83, 0.1);
}

.letter-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.prompt-section {
  display: flex;
  gap: 8px;
  align-items: center;
}

.prompt-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
}

.prompt-input:focus {
  outline: none;
  border-color: #1D6453;
  box-shadow: 0 0 0 2px rgba(29, 100, 83, 0.1);
}

.regenerate-btn {
  padding: 8px 16px;
  background-color: #1D6453;
  color: white;
  border: none;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.regenerate-btn:hover:not(:disabled) {
  background-color: #155242;
}

.regenerate-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
