<template>
  <div class="job-matching-section">
    <div class="section-header">
      <h2 class="section-title">Jobbmatchning</h2>
      <div class="match-info">
        <span class="match-count">{{ matchingJobs.length }} matchande jobb</span>
      </div>
    </div>
    
    <div class="matching-form">
      <!-- Skills Section -->
      <div class="form-group">
        <label class="form-label">Kompetenser & Teknologier</label>
        <div class="skills-input">
          <input
            v-model="newSkill"
            type="text"
            class="form-input"
            placeholder="t.ex. React, Python, JavaScript..."
            @keyup.enter="addSkill"
          />
          <button @click="addSkill" type="button" class="add-btn">Lägg till</button>
        </div>
        <div v-if="profile.skills.length > 0" class="tags-container">
          <span
            v-for="skill in profile.skills"
            :key="skill"
            class="tag"
          >
            {{ skill }}
            <button @click="removeSkill(skill)" class="tag-remove">×</button>
          </span>
        </div>
        <div class="suggestions">
          <span class="suggestions-label">Förslag:</span>
          <button
            v-for="suggestion in skillSuggestions"
            :key="suggestion"
            @click="addSkillFromSuggestion(suggestion)"
            class="suggestion-btn"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>

      <!-- Job Titles Section -->
      <div class="form-group">
        <label class="form-label">Önskade jobbtitlar</label>
        <div class="skills-input">
          <input
            v-model="newJobTitle"
            type="text"
            class="form-input"
            placeholder="t.ex. Frontend Developer, Fullstack..."
            @keyup.enter="addJobTitle"
          />
          <button @click="addJobTitle" type="button" class="add-btn">Lägg till</button>
        </div>
        <div v-if="profile.jobTitles.length > 0" class="tags-container">
          <span
            v-for="title in profile.jobTitles"
            :key="title"
            class="tag"
          >
            {{ title }}
            <button @click="removeJobTitle(title)" class="tag-remove">×</button>
          </span>
        </div>
        <div class="suggestions">
          <span class="suggestions-label">Förslag:</span>
          <button
            v-for="suggestion in jobTitleSuggestions"
            :key="suggestion"
            @click="addJobTitleFromSuggestion(suggestion)"
            class="suggestion-btn"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>


      <!-- Preferred Locations -->
      <div class="form-group">
        <label class="form-label">Önskade platser</label>
        <div class="skills-input">
          <input
            v-model="newLocation"
            type="text"
            class="form-input"
            placeholder="t.ex. Stockholm, Remote, Göteborg..."
            @keyup.enter="addLocation"
          />
          <button @click="addLocation" type="button" class="add-btn">Lägg till</button>
        </div>
        <div v-if="profile.preferredLocations.length > 0" class="tags-container">
          <span
            v-for="location in profile.preferredLocations"
            :key="location"
            class="tag"
          >
            {{ location }}
            <button @click="removeLocation(location)" class="tag-remove">×</button>
          </span>
        </div>
      </div>

      <!-- Avoid Keywords -->
      <div class="form-group">
        <label class="form-label">Undvik nyckelord</label>
        <div class="skills-input">
          <input
            v-model="newAvoidKeyword"
            type="text"
            class="form-input"
            placeholder="t.ex. konsult, säljare, telemarketing..."
            @keyup.enter="addAvoidKeyword"
          />
          <button @click="addAvoidKeyword" type="button" class="add-btn">Lägg till</button>
        </div>
        <div v-if="profile.avoidKeywords.length > 0" class="tags-container">
          <span
            v-for="keyword in profile.avoidKeywords"
            :key="keyword"
            class="tag avoid-tag"
          >
            {{ keyword }}
            <button @click="removeAvoidKeyword(keyword)" class="tag-remove">×</button>
          </span>
        </div>
      </div>

      <!-- Test Matching -->
      <div class="test-section">
        <button @click="testMatching" class="test-btn" :disabled="isTestingMatch">
          <svg v-if="isTestingMatch" class="loading-icon" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" opacity="0.25"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
          <svg v-else class="test-icon" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          </svg>
          {{ isTestingMatch ? 'Testar matchning...' : 'Testa matchning' }}
        </button>
        <p class="test-description">
          Testa din profil mot befintliga jobb för att se hur bra matchningen fungerar
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Profile } from '../composables/useProfile'

interface Props {
  profile: Profile
  matchingJobs: any[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:profile': [profile: Profile]
  'test-matching': []
}>()

// Reactive inputs
const newSkill = ref('')
const newJobTitle = ref('')
const newLocation = ref('')
const newAvoidKeyword = ref('')
const isTestingMatch = ref(false)

// Suggestions
const skillSuggestions = ['React', 'Vue', 'TypeScript', 'Node.js', 'Python', 'Java', 'AWS', 'Docker']
const jobTitleSuggestions = ['Frontend Developer', 'Backend Developer', 'Fullstack Developer', 'DevOps Engineer']

// Profile is reactive through props
const profile = computed({
  get: () => props.profile,
  set: (value) => emit('update:profile', value)
})

// Methods
function addSkill() {
  if (newSkill.value.trim() && !profile.value.skills.includes(newSkill.value.trim())) {
    profile.value.skills.push(newSkill.value.trim())
    newSkill.value = ''
  }
}

function removeSkill(skill: string) {
  const index = profile.value.skills.indexOf(skill)
  if (index > -1) {
    profile.value.skills.splice(index, 1)
  }
}

function addSkillFromSuggestion(skill: string) {
  if (!profile.value.skills.includes(skill)) {
    profile.value.skills.push(skill)
  }
}

function addJobTitle() {
  if (newJobTitle.value.trim() && !profile.value.jobTitles.includes(newJobTitle.value.trim())) {
    profile.value.jobTitles.push(newJobTitle.value.trim())
    newJobTitle.value = ''
  }
}

function removeJobTitle(title: string) {
  const index = profile.value.jobTitles.indexOf(title)
  if (index > -1) {
    profile.value.jobTitles.splice(index, 1)
  }
}

function addJobTitleFromSuggestion(title: string) {
  if (!profile.value.jobTitles.includes(title)) {
    profile.value.jobTitles.push(title)
  }
}

function addLocation() {
  if (newLocation.value.trim() && !profile.value.preferredLocations.includes(newLocation.value.trim())) {
    profile.value.preferredLocations.push(newLocation.value.trim())
    newLocation.value = ''
  }
}

function removeLocation(location: string) {
  const index = profile.value.preferredLocations.indexOf(location)
  if (index > -1) {
    profile.value.preferredLocations.splice(index, 1)
  }
}

function addAvoidKeyword() {
  if (newAvoidKeyword.value.trim() && !profile.value.avoidKeywords.includes(newAvoidKeyword.value.trim())) {
    profile.value.avoidKeywords.push(newAvoidKeyword.value.trim())
    newAvoidKeyword.value = ''
  }
}

function removeAvoidKeyword(keyword: string) {
  const index = profile.value.avoidKeywords.indexOf(keyword)
  if (index > -1) {
    profile.value.avoidKeywords.splice(index, 1)
  }
}

async function testMatching() {
  isTestingMatch.value = true
  emit('test-matching')
  
  // Simulate test delay
  setTimeout(() => {
    isTestingMatch.value = false
  }, 2000)
}
</script>

<style scoped>
.job-matching-section {
  margin-bottom: 2rem;
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

.match-info {
  display: flex;
  align-items: center;
}

.match-count {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  color: #1D6453;
  font-weight: 500;
}

.matching-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  color: black;
}

.skills-input {
  display: flex;
  gap: 0.5rem;
}

.form-input, .form-select {
  font-family: 'Inter', sans-serif;
  padding: 0.75rem;
  border: 1px solid black;
  background-color: white;
  font-size: 1rem;
  flex: 1;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #1D6453;
}

.add-btn {
  font-family: 'Inter', sans-serif;
  padding: 0.75rem 1rem;
  background-color: #1D6453;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  white-space: nowrap;
}

.add-btn:hover {
  background-color: #155242;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background-color: #1D6453;
  color: white;
  font-size: 0.875rem;
  font-family: 'Inter', sans-serif;
}

.tag.avoid-tag {
  background-color: #DC2626;
}

.tag-remove {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  margin-left: 0.25rem;
}

.tag-remove:hover {
  opacity: 0.7;
}

.suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.5rem;
}

.suggestions-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
}

.suggestion-btn {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background-color: #f8f8f8;
  border: 1px solid #e5e5e5;
  color: #666;
  cursor: pointer;
}

.suggestion-btn:hover {
  background-color: #1D6453;
  color: white;
  border-color: #1D6453;
}

.test-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  background-color: #f8f8f8;
  border: 1px solid #e5e5e5;
  margin-top: 1rem;
}

.test-btn {
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #1D6453;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
}

.test-btn:hover:not(:disabled) {
  background-color: #155242;
}

.test-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.test-icon, .loading-icon {
  width: 1rem;
  height: 1rem;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.test-description {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  color: #666;
  text-align: center;
  margin: 0;
}
</style>
