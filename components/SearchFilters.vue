<template>
  <div class="search-section">
    <div class="search-container">
      <h2 class="main-heading">Vad vill du jobba med?</h2>
      
      <!-- Search Bar -->
      <div class="search-group">
        <div class="search-controls">
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input
              id="job-search"
              type="search"
              class="search-input"
              placeholder="Sök jobb, yrken, områden..."
              v-model="searchTerm"
              @keypress="handleEnterSearch"
            />
            <button 
              v-if="searchTerm"
              @click="clearSearch"
              class="clear-search"
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <button 
            @click="performSearch"
            class="search-button"
            type="button"
          >
            Sök
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-container">
        <div class="filter-group">
          <label for="occupation-field" class="filter-label">Yrkesområde</label>
          <select
            id="occupation-field"
            class="filter-select"
            v-model="occupationField"
            @change="handleFilterChange('occupationField', occupationField)"
          >
            <option value="">Alla områden</option>
            <option v-for="(field, index) in uniqueOccupationFields" :key="`occupation-${index}`" :value="field">
              {{ field }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label for="municipality" class="filter-label">Plats</label>
          <select
            id="municipality"
            class="filter-select"
            v-model="municipality"
            @change="handleFilterChange('municipality', municipality)"
          >
            <option value="">Alla platser</option>
            <option v-for="(city, index) in uniqueMunicipalities" :key="`municipality-${index}`" :value="city">
              {{ city }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label for="work-extent" class="filter-label">Omfattning</label>
          <select
            id="work-extent"
            class="filter-select"
            v-model="workTimeExtent"
            @change="handleFilterChange('workTimeExtent', workTimeExtent)"
          >
            <option value="">Alla typer</option>
            <option v-for="(extent, index) in uniqueWorkTimeExtents" :key="`extent-${index}`" :value="extent">
              {{ extent }}
            </option>
          </select>
        </div>
      </div>

      <!-- Active Filters -->
      <div v-if="hasActiveFilters" class="active-filters">
        <span class="active-filters-label">Aktiva filter:</span>
        <div class="filter-tags">
          <button v-if="occupationField" @click="clearFilter('occupationField')" class="filter-tag">
            {{ occupationField }}
            <svg class="filter-tag-close" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <button v-if="municipality" @click="clearFilter('municipality')" class="filter-tag">
            {{ municipality }}
            <svg class="filter-tag-close" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <button v-if="workTimeExtent" @click="clearFilter('workTimeExtent')" class="filter-tag">
            {{ workTimeExtent }}
            <svg class="filter-tag-close" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  jobs?: any[]
}

interface Emits {
  (e: 'search', term: string): void
  (e: 'filter-change', type: string, value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  jobs: () => []
})

const emit = defineEmits<Emits>()

const searchTerm = ref('')
const occupationField = ref('')
const municipality = ref('')
const workTimeExtent = ref('')

// Computed properties for unique values (mock data for now)
const uniqueOccupationFields = computed(() => {
  return ['IT/Teknik', 'Ekonomi/Administration', 'Vård/Omsorg', 'Utbildning', 'Försäljning']
})

const uniqueMunicipalities = computed(() => {
  return ['Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Linköping']
})

const uniqueWorkTimeExtents = computed(() => {
  return ['Heltid', 'Deltid', 'Vikariat', 'Projektanställning']
})

const hasActiveFilters = computed(() => {
  return occupationField.value || municipality.value || workTimeExtent.value
})

const handleEnterSearch = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    emit('search', searchTerm.value)
  }
}

const handleFilterChange = (type: string, value: string) => {
  emit('filter-change', type, value)
}

const clearSearch = () => {
  searchTerm.value = ''
  emit('search', '')
}

const performSearch = () => {
  emit('search', searchTerm.value)
}

const clearFilter = (type: string) => {
  switch (type) {
    case 'occupationField':
      occupationField.value = ''
      break
    case 'municipality':
      municipality.value = ''
      break
    case 'workTimeExtent':
      workTimeExtent.value = ''
      break
  }
  emit('filter-change', type, '')
}
</script>

<style scoped>
.search-section {
  height: 185px;
  width: 100%;
  border: 1px solid black;
  border-top: 1px solid black;
  box-shadow: inset 0 6px 0 0 #B7CAB4;
  background-color: #D3E0D1;
  margin: 0;
  position: relative;
  box-sizing: border-box;
  margin-bottom: 6px;
}

.search-container {
  padding: 16px;
}

.main-heading {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 19px;
  text-align: left;
  margin: 0 0 16px 0;
  line-height: 118%;
  letter-spacing: -0.04em;
}

.search-label {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: black;
  margin-top: -9px;
  margin-left: 2px;
  margin-bottom: 4px;
}

.search-input-wrapper {
  display: flex;
  width: 340px;
  height: 30px;
}

.search-icon {
  display: none;
}

.search-input {
  width: 100%;
  height: 100%;
  border: 1px solid black;
  background-color: white;
  margin-right: 6px;
  padding: 0 8px;
  font-family: 'Inter', sans-serif;
}

.clear-search {
  display: none;
}

.search-button {
  height: 30px;
  padding: 0 16px;
  border: 1px solid black;
  background-color: #1D6453;
  color: white;
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  border-radius: 0;
}

/* Filters */
.filters-container {
  display: flex;
  margin-top: 16px;
  justify-content: flex-start;
  gap: 8px;
  margin-bottom: 0;
}

.search-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.search-controls {
  display: flex;
  align-items: flex-end;
  gap: 6px;
}

.filter-label {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: black;
  margin: 0 0 4px 0;
  display: block;
}

.filter-select {
  width: 106px;
  height: 30px;
  border: 1px solid black;
  background-color: white;
  margin-right: 6px;
  font-family: 'Inter', sans-serif;
}

.filter-select:last-child {
  margin-right: 0;
}

/* Active Filters - Hidden on desktop */
.active-filters {
  display: none;
}

/* Mobile-only responsive design */
@media (max-width: 768px) {
  .search-section {
    width: 100%;
    height: auto;
    margin: 1rem;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .search-container {
    padding: 0;
  }
  
  .main-heading {
    text-align: center;
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
  
  .search-input-wrapper {
    width: 100%;
    position: relative;
  }
  
  .search-icon {
    display: block;
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;
    color: #9ca3af;
    z-index: 10;
  }
  
  .search-input {
    width: 100%;
    height: 40px;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    margin-right: 0;
  }
  
  .search-input:focus {
    outline: none;
    border-color: #1D6453;
    box-shadow: 0 0 0 3px rgba(29, 100, 83, 0.1);
  }
  
  .clear-search {
    display: block;
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 0.25rem;
  }
  
  .filters-container {
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .filter-select {
    width: 100%;
    height: 40px;
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    margin-right: 0;
  }
  
  .filter-select:focus {
    outline: none;
    border-color: #1D6453;
    box-shadow: 0 0 0 3px rgba(29, 100, 83, 0.1);
  }
  
  .active-filters {
    display: block;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  .active-filters-label {
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    color: #4a5568;
    margin-bottom: 0.75rem;
  }
  
  .filter-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .filter-tag {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background-color: #1D6453;
    color: white;
    border: none;
    border-radius: 20px;
    font-family: 'Inter', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
  }
  
  .filter-tag-close {
    width: 0.875rem;
    height: 0.875rem;
    color: white;
  }
}
</style>
