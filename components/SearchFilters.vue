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
          <label for="occupation-field" class="filter-label">Yrke</label>
          <div class="combo-box" @click.stop>
            <button
              type="button"
              class="combo-trigger"
              @click.stop="toggleOccupationDropdown"
              tabindex="-1"
            >
              <input
                id="occupation-field"
                type="text"
                class="combo-input"
                v-model="occupationField"
                @input="updateOccupationField"
                placeholder="Välj eller skriv yrke..."
                autocomplete="off"
              />
              <svg v-if="!occupationField" class="combo-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m6 9 6 6 6-6"></path>
              </svg>
              <button v-if="occupationField" @click.stop="clearOccupationField" class="combo-clear" type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
              </button>
            </button>
            <div v-if="showOccupationDropdown && filteredOccupationFields.length > 0" class="combo-dropdown">
              <button
                v-for="(field, index) in filteredOccupationFields"
                :key="`occupation-${index}`"
                type="button"
                class="combo-option"
                @mousedown.prevent="selectOccupationField(field)"
              >
                {{ field }}
              </button>
            </div>
          </div>
        </div>

        <div class="filter-group">
          <label for="municipality" class="filter-label">Plats</label>
          <div class="combo-box" @click.stop>
            <button
              type="button"
              class="combo-trigger"
              @click.stop="toggleMunicipalityDropdown"
              tabindex="-1"
            >
              <input
                id="municipality"
                type="text"
                class="combo-input"
                v-model="municipality"
                @input="updateMunicipality"
                placeholder="Välj eller skriv plats..."
                autocomplete="off"
              />
              <svg v-if="!municipality" class="combo-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m6 9 6 6 6-6"></path>
              </svg>
              <button v-if="municipality" @click.stop="clearMunicipality" class="combo-clear" type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
              </button>
            </button>
            <div v-if="showMunicipalityDropdown && filteredMunicipalities.length > 0" class="combo-dropdown">
              <button
                v-for="(city, index) in filteredMunicipalities"
                :key="`municipality-${index}`"
                type="button"
                class="combo-option"
                @mousedown.prevent="selectMunicipality(city)"
              >
                {{ city }}
              </button>
            </div>
          </div>
        </div>

        <div class="filter-group">
          <label for="work-extent" class="filter-label">Omfattning</label>
          <div class="combo-box" @click.stop>
            <button
              type="button"
              class="combo-trigger"
              @click.stop="toggleWorkTimeDropdown"
              tabindex="-1"
            >
              <input
                id="work-extent"
                type="text"
                class="combo-input"
                v-model="workTimeExtent"
                @input="updateWorkTimeExtent"
                placeholder="Välj eller skriv omfattning..."
                autocomplete="off"
              />
              <svg v-if="!workTimeExtent" class="combo-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m6 9 6 6 6-6"></path>
              </svg>
              <button v-if="workTimeExtent" @click.stop="clearWorkTimeExtent" class="combo-clear" type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
              </button>
            </button>
            <div v-if="showWorkTimeDropdown && filteredWorkTimeExtents.length > 0" class="combo-dropdown">
              <button
                v-for="(extent, index) in filteredWorkTimeExtents"
                :key="`extent-${index}`"
                type="button"
                class="combo-option"
                @mousedown.prevent="selectWorkTimeExtent(extent)"
              >
                {{ extent }}
              </button>
            </div>
          </div>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface FilterOptions {
  occupationFields: string[]
  municipalities: string[]
  workTimeExtents: string[]
  employmentTypes: string[]
}

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

// Dropdown state
const showMunicipalityDropdown = ref(false)
const showOccupationDropdown = ref(false)
const showWorkTimeDropdown = ref(false)

// Filter options from API
const filterOptions = ref<FilterOptions>({
  occupationFields: [],
  municipalities: [],
  workTimeExtents: [],
  employmentTypes: []
})

// Global click handler reference
const globalClickHandler = () => {
  showOccupationDropdown.value = false
  showMunicipalityDropdown.value = false
  showWorkTimeDropdown.value = false
}

// Fetch filter options on mount
onMounted(async () => {
  try {
    const response = await $fetch<{ success: boolean; data: FilterOptions }>('/api/jobs/filter-options')
    if (response.success) {
      filterOptions.value = response.data
    }
  } catch (error) {
    console.error('Error fetching filter options:', error)
  }
  
  // Add global click handler to close dropdowns
  document.addEventListener('click', globalClickHandler)
})

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('click', globalClickHandler)
})

// Computed properties for filter options
const uniqueOccupationFields = computed(() => {
  return filterOptions.value.occupationFields
})

const uniqueMunicipalities = computed(() => {
  return filterOptions.value.municipalities
})

const uniqueWorkTimeExtents = computed(() => {
  return filterOptions.value.workTimeExtents
})

// Smart filtered options for searchable dropdowns
const filteredOccupationFields = computed(() => {
  if (!occupationField.value) {
    return filterOptions.value.occupationFields.slice(0, 10) // Show top 10 when empty
  }
  
  const query = occupationField.value.toLowerCase()
  const fields = filterOptions.value.occupationFields
  
  // Prioritize: exact matches, starts with, then contains
  const exactMatches = fields.filter(field => field.toLowerCase() === query)
  const startsWith = fields.filter(field => 
    field.toLowerCase().startsWith(query) && !exactMatches.includes(field)
  )
  const contains = fields.filter(field => 
    field.toLowerCase().includes(query) && 
    !exactMatches.includes(field) && 
    !startsWith.includes(field)
  )
  
  return [...exactMatches, ...startsWith, ...contains].slice(0, 10)
})

const filteredMunicipalities = computed(() => {
  if (!municipality.value) {
    // Show Sweden's 10 largest cities in order when dropdown is empty
    const swedenLargestCities = [
      'Stockholm',
      'Göteborg', 
      'Malmö',
      'Uppsala',
      'Västerås',
      'Örebro',
      'Linköping',
      'Helsingborg',
      'Jönköping',
      'Norrköping'
    ]
    
    // Filter to only show cities that are available in the API response
    const availableCities = filterOptions.value.municipalities
    return swedenLargestCities.filter(city => availableCities.includes(city))
  }
  
  const query = municipality.value.toLowerCase()
  const cities = filterOptions.value.municipalities
  
  // Prioritize: exact matches, starts with, then contains
  const exactMatches = cities.filter(city => city.toLowerCase() === query)
  const startsWith = cities.filter(city => 
    city.toLowerCase().startsWith(query) && !exactMatches.includes(city)
  )
  const contains = cities.filter(city => 
    city.toLowerCase().includes(query) && 
    !exactMatches.includes(city) && 
    !startsWith.includes(city)
  )
  
  return [...exactMatches, ...startsWith, ...contains].slice(0, 10)
})

const filteredWorkTimeExtents = computed(() => {
  if (!workTimeExtent.value) {
    return filterOptions.value.workTimeExtents.slice(0, 10) // Show top 10 when empty
  }
  
  const query = workTimeExtent.value.toLowerCase()
  const extents = filterOptions.value.workTimeExtents
  
  // Prioritize: exact matches, starts with, then contains
  const exactMatches = extents.filter(extent => extent.toLowerCase() === query)
  const startsWith = extents.filter(extent => 
    extent.toLowerCase().startsWith(query) && !exactMatches.includes(extent)
  )
  const contains = extents.filter(extent => 
    extent.toLowerCase().includes(query) && 
    !exactMatches.includes(extent) && 
    !startsWith.includes(extent)
  )
  
  return [...exactMatches, ...startsWith, ...contains].slice(0, 10)
})

const hasActiveFilters = computed(() => {
  return occupationField.value || municipality.value || workTimeExtent.value
})

// Dropdown functions
const toggleOccupationDropdown = () => {
  showOccupationDropdown.value = !showOccupationDropdown.value
}

const hideOccupationDropdown = () => {
  setTimeout(() => {
    showOccupationDropdown.value = false
  }, 150) // Delay to allow click event
}

const selectOccupationField = (field: string) => {
  occupationField.value = field
  showOccupationDropdown.value = false
  handleFilterChange('occupationField', field)
}

const toggleMunicipalityDropdown = () => {
  showMunicipalityDropdown.value = !showMunicipalityDropdown.value
}

const hideMunicipalityDropdown = () => {
  setTimeout(() => {
    showMunicipalityDropdown.value = false
  }, 150) // Delay to allow click event
}

const selectMunicipality = (city: string) => {
  municipality.value = city
  showMunicipalityDropdown.value = false
  handleFilterChange('municipality', city)
}

const toggleWorkTimeDropdown = () => {
  showWorkTimeDropdown.value = !showWorkTimeDropdown.value
}

const hideWorkTimeDropdown = () => {
  setTimeout(() => {
    showWorkTimeDropdown.value = false
  }, 150) // Delay to allow click event
}

const selectWorkTimeExtent = (extent: string) => {
  workTimeExtent.value = extent
  showWorkTimeDropdown.value = false
  // Don't emit filter change immediately
}

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
  // Emit search with all current filter values
  emit('search', searchTerm.value)
  if (occupationField.value) emit('filter-change', 'occupationField', occupationField.value)
  if (municipality.value) emit('filter-change', 'municipality', municipality.value)
  if (workTimeExtent.value) emit('filter-change', 'workTimeExtent', workTimeExtent.value)
}

// Update functions that don't trigger immediate filtering
const updateOccupationField = () => {
  // Just update the dropdown, don't emit filter change
}

const updateMunicipality = () => {
  // Just update the dropdown, don't emit filter change
}

const updateWorkTimeExtent = () => {
  // Just update the dropdown, don't emit filter change
}

// Clear functions for X buttons
const clearOccupationField = () => {
  occupationField.value = ''
  showOccupationDropdown.value = false
  // Don't emit filter change immediately
}

const clearMunicipality = () => {
  municipality.value = ''
  showMunicipalityDropdown.value = false
  // Don't emit filter change immediately
}

const clearWorkTimeExtent = () => {
  workTimeExtent.value = ''
  showWorkTimeDropdown.value = false
  // Don't emit filter change immediately
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
  background-color: #E4E9E3;
  border: 1px solid black;
  margin: 0 0 6px 0;
  padding: 6px;
  box-sizing: border-box;
}

.search-container {
  padding: 6px;
}

.main-heading {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 19px;
  text-align: left;
  margin: 6px 0 16px 0;
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
  align-items: center;
  width: 340px;
  height: 30px;
  background-color: white;
  box-sizing: border-box;
}

.search-icon {
  display: none;
}

.search-input {
  flex: 1;
  border: 1px solid black !important;
  outline: none;
  padding: 8px 12px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  background-color: white;
  line-height: 1.2;
  height: 28px;
  box-sizing: border-box;
}

.clear-search {
  display: none;
}

.filter-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid black;
  border-radius: 0;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-select:hover {
  background-color: #f0f0f0;
}

.filter-select:focus {
  outline: none;
  background-color: #f8f8f8;
}

/* Combo Box Styling */
.combo-box {
  position: relative;
  width: 100%;
}

.combo-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 30px;
  padding: 0;
  border: 1px solid black;
  border-radius: 0;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
}

.combo-trigger:focus {
  outline: none;
}

.combo-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 8px 12px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: inherit;
  line-height: 1.2;
}

.combo-input::placeholder {
  color: #666;
}

.combo-chevron {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  opacity: 0.5;
  pointer-events: none;
  flex-shrink: 0;
}

.combo-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 6px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.combo-clear:hover {
  background-color: #f0f0f0;
}

.combo-clear svg {
  width: 14px;
  height: 14px;
  opacity: 0.7;
}

.combo-clear:hover svg {
  opacity: 1;
}

.combo-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid black;
  border-top: none;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: translateY(-10px);
  animation: dropdownFadeIn 0.2s ease-out forwards;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.combo-option {
  width: 100%;
  padding: 8px 12px;
  border: none;
  background-color: white;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
}

.combo-option:hover {
  background-color: #f0f0f0;
}

.combo-option:active {
  background-color: #e0e0e0;
}

.search-button {
  height: 30px;
  padding: 0 16px;
  background-color: #1D6453;
  color: white;
  border: 1px solid black;
  border-radius: 0;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.search-button:hover {
  background-color: #155242;
}

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
  align-items: center;
  gap: 6px;
  height: 30px;
}

.filter-label {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: black;
  margin: 0 0 4px 0;
  display: block;
}

.filter-select {
  display: flex;
  align-items: center;
  flex: 1;
  border: 1px solid black;
  background-color: white;
  position: relative;
  min-height: 36px;
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

/* Desktop styles - ensure they override mobile */
@media (min-width: 769px) {
  .search-input {
    border: 1px solid black !important;
    height: 28px !important;
  }
  
  .search-input-wrapper {
    height: 30px !important;
    width: 340px !important;
    border: none !important;
  }
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
