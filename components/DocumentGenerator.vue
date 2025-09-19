<template>
  <div class="document-generator">
    <div class="generator-header">
      <h3 class="generator-title">{{ title }}</h3>
      <p class="generator-description">{{ description }}</p>
    </div>
    
    <div v-if="showJobInputs" class="job-inputs">
      <div class="input-group">
        <label for="jobTitle" class="input-label">Jobbtitel</label>
        <input
          id="jobTitle"
          v-model="jobTitle"
          type="text"
          class="input-field"
          placeholder="t.ex. Frontend Utvecklare"
        />
      </div>
      
      <div class="input-group">
        <label for="companyName" class="input-label">Företagsnamn</label>
        <input
          id="companyName"
          v-model="companyName"
          type="text"
          class="input-field"
          placeholder="t.ex. Tech AB"
        />
      </div>
      
      <div class="input-group">
        <label for="jobDescription" class="input-label">Jobbeskrivning (valfritt)</label>
        <textarea
          id="jobDescription"
          v-model="jobDescription"
          class="input-textarea"
          rows="3"
          placeholder="Klistra in jobbeskrivningen här för bättre anpassning..."
        ></textarea>
      </div>
    </div>
    
    <div class="generator-actions">
      <button
        @click="handleGenerate"
        :disabled="!canGenerate || isGenerating"
        class="generate-button"
      >
        <svg v-if="!isGenerating" class="button-icon" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="2"/>
          <path d="M2 17l10 5 10-5" stroke="currentColor" stroke-width="2"/>
          <path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="2"/>
        </svg>
        <div v-else class="spinner"></div>
        {{ isGenerating ? 'Genererar...' : buttonText }}
      </button>
    </div>
    
    <div v-if="generatedContent" class="generated-content">
      <div class="content-header">
        <h4 class="content-title">Genererat {{ documentType }}</h4>
        <div class="content-actions">
          <button @click="copyToClipboard" class="action-button">
            <svg class="button-icon" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2"/>
            </svg>
            Kopiera
          </button>
          <button @click="downloadDocument" class="action-button">
            <svg class="button-icon" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2"/>
              <polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2"/>
              <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2"/>
            </svg>
            Ladda ner
          </button>
        </div>
      </div>
      <div class="content-preview">
        <pre class="content-text">{{ generatedContent }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  title: string
  description: string
  buttonText: string
  documentType: string
  showJobInputs?: boolean
  profile: any
  apiEndpoint: string
}

const props = withDefaults(defineProps<Props>(), {
  showJobInputs: false
})

const emit = defineEmits<{
  generated: [content: string]
}>()

const jobTitle = ref('')
const companyName = ref('')
const jobDescription = ref('')
const isGenerating = ref(false)
const generatedContent = ref('')

const canGenerate = computed(() => {
  if (props.showJobInputs) {
    return jobTitle.value.trim() && companyName.value.trim()
  }
  return props.profile.firstName && props.profile.lastName && props.profile.email
})

async function handleGenerate() {
  if (!canGenerate.value || isGenerating.value) return
  
  isGenerating.value = true
  
  try {
    const body: any = { profile: props.profile }
    
    if (props.showJobInputs) {
      body.jobTitle = jobTitle.value
      body.companyName = companyName.value
      body.jobDescription = jobDescription.value
    }
    
    const response = await $fetch(props.apiEndpoint, {
      method: 'POST',
      body
    }) as { success: boolean; cv?: string; coverLetter?: string }
    
    if (response.success) {
      generatedContent.value = response.cv || response.coverLetter || ''
      emit('generated', generatedContent.value)
    }
  } catch (error) {
    console.error('Error generating document:', error)
    alert(`Fel vid generering av ${props.documentType.toLowerCase()}. Försök igen.`)
  } finally {
    isGenerating.value = false
  }
}

function copyToClipboard() {
  navigator.clipboard.writeText(generatedContent.value)
  alert('Kopierat till urklipp!')
}

function downloadDocument() {
  const blob = new Blob([generatedContent.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  
  let filename = `${props.profile.firstName}_${props.profile.lastName}_${props.documentType}`
  if (props.showJobInputs && companyName.value) {
    filename += `_${companyName.value}`
  }
  filename += '.txt'
  
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.document-generator {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 1.5rem;
  background-color: #fafafa;
}

.generator-header {
  margin-bottom: 1.5rem;
}

.generator-title {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 1.125rem;
  color: #1D6453;
  margin-bottom: 0.5rem;
}

.generator-description {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  color: #666;
  margin: 0;
}

.job-inputs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  color: black;
}

.input-field, .input-textarea {
  font-family: 'Inter', sans-serif;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.input-field:focus, .input-textarea:focus {
  outline: none;
  border-color: #1D6453;
}

.input-textarea {
  resize: vertical;
}

.generator-actions {
  margin-bottom: 1.5rem;
}

.generate-button {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  background-color: #1D6453;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.generate-button:hover:not(:disabled) {
  background-color: #155242;
}

.generate-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.button-icon {
  width: 1rem;
  height: 1rem;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.generated-content {
  border: 1px solid #1D6453;
  border-radius: 4px;
  background-color: white;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e5e5;
  background-color: #f8f9fa;
}

.content-title {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  color: #1D6453;
  margin: 0;
}

.content-actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  background-color: transparent;
  color: #1D6453;
  border: 1px solid #1D6453;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: #f0f9f7;
}

.content-preview {
  padding: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.content-text {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  line-height: 1.5;
  color: black;
  margin: 0;
  white-space: pre-wrap;
}

@media (max-width: 768px) {
  .content-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .content-actions {
    justify-content: center;
  }
}
</style>
