<template>
  <div class="page-layout">
    <!-- Mobile Hamburger Menu -->
    <div class="mobile-menu-overlay" :class="{ 'active': showMobileMenu }" @click="closeMobileMenu"></div>
    <div class="mobile-menu" :class="{ 'active': showMobileMenu }">
      <div class="mobile-menu-header">
        <h3>Meny</h3>
        <button @click="closeMobileMenu" class="close-menu-btn">
          <svg viewBox="0 0 24 24" fill="none">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>
      <div class="mobile-menu-content">
        <!-- Mobile Sidebar Content -->
        <div class="mobile-sidebar-section">
          <h4 class="mobile-section-title">Snabbåtgärder</h4>
          <div class="mobile-actions">
            <NuxtLink to="/profile" class="mobile-btn-primary" @click="closeMobileMenu">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Min profil
            </NuxtLink>
            <NuxtLink to="/my-jobs" class="mobile-btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
              Sparade jobb ({{ favoriteJobs.length }})
            </NuxtLink>
          </div>
        </div>
        
        <div class="mobile-sidebar-section">
          <h4 class="mobile-section-title">Statistik</h4>
          <div class="mobile-stats">
            <div class="mobile-stat">
              <span class="mobile-stat-label">Totalt aktiva</span>
              <span class="mobile-stat-value">{{ totalJobs }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Mobile Menu Button -->
    <button class="mobile-menu-button" @click="toggleMobileMenu">
      <svg viewBox="0 0 24 24" fill="none">
        <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2"/>
        <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2"/>
        <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2"/>
      </svg>
    </button>

    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Search/Categories Section -->
      <SearchFilters 
        :jobs="jobs"
        @search="handleSearch"
        @filter-change="handleFilterChange"
      />

      <!-- Results Bar -->
      <div class="results-bar">
        <div class="results-info">
          <span class="results-count">Hittade {{ totalJobs }} jobb</span>
          
          <!-- Active Filters -->
          <div class="active-filters">
            <!-- Source Filter Buttons -->
            <div class="source-filters">
              <button 
                @click="setSource('all')"
                :class="['source-filter-btn', currentSource === 'all' ? 'active' : '']"
                title="Visa alla jobb"
              >
                <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
                </svg>
                Alla
              </button>
              
              <button 
                @click="setSource('platsbanken')"
                :class="['source-filter-btn', 'platsbanken', currentSource === 'platsbanken' ? 'active' : '']"
                title="Endast Platsbanken"
              >
                <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
                Platsbanken
              </button>
              
              <button 
                @click="setSource('teamtailor')"
                :class="['source-filter-btn', 'teamtailor', currentSource === 'teamtailor' ? 'active' : '']"
                title="Endast TeamTailor"
              >
                <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"/>
                </svg>
                TeamTailor
              </button>
            </div>
            
            <!-- Dynamic Filters -->
            <div v-if="currentFilters.occupationField" class="filter-tag">
              <span class="filter-text">{{ currentFilters.occupationField }}</span>
              <button @click="removeFilter('occupationField')" class="filter-remove">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
            </div>
            
            <div v-if="currentFilters.municipality" class="filter-tag">
              <span class="filter-text">{{ currentFilters.municipality }}</span>
              <button @click="removeFilter('municipality')" class="filter-remove">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
            </div>
            
            <div v-if="currentFilters.workTimeExtent" class="filter-tag">
              <span class="filter-text">{{ currentFilters.workTimeExtent }}</span>
              <button @click="removeFilter('workTimeExtent')" class="filter-remove">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
            </div>
            
            <div v-if="searchTerm" class="filter-tag">
              <span class="filter-text">"{{ searchTerm }}"</span>
              <button @click="removeFilter('search')" class="filter-remove">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="sort-controls">
          <label for="sort-select" class="sort-label">Sortera:</label>
          <select id="sort-select" v-model="sortBy" class="sort-select">
            <option value="latest">Senaste</option>
            <option value="recommended">Rekommenderade</option>
            <option value="relevance">Relevans</option>
            <option value="deadline">Ansökningsdatum</option>
          </select>
        </div>
      </div>

      <!-- Job Results -->
      <div v-if="loading" class="loading-message">
        Laddar jobb...
      </div>
      
      <div v-else-if="displayJobs.length === 0" class="no-jobs-message">
        Inga jobb hittades med de valda filtren.
      </div>
      
      <div v-else class="jobs-list">
        <JobItem 
          v-for="(job, index) in displayJobs" 
          :key="job.id" 
          :job="job" 
          :index="index" 
          :is-even="index % 2 === 0"
          :is-favorited="isFavorited(job.id)"
          @toggle-favorite="toggleFavorite(job)"
        />
        
        <!-- Load More Button -->
        <div v-if="hasMoreJobs" class="load-more-container">
          <button @click="loadMoreJobs" :disabled="loading" class="load-more-btn">
            <span v-if="loading">Laddar...</span>
            <span v-else>Ladda fler jobb ({{ remainingJobs }} kvar)</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Right Sidebar -->
    <aside class="right-sidebar">
      <div class="sidebar-unified">
        <!-- Snabbåtgärder -->
        <div class="sidebar-section">
          <h3 class="sidebar-section-title">Snabbåtgärder</h3>
          <div class="space-y-3">
            <NuxtLink to="/profile" class="sidebar-btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Min profil
            </NuxtLink>
            <div class="favorites-dropdown-container">
              <button class="sidebar-btn-secondary" @click="toggleFavoritesView">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
                Sparade jobb ({{ favoriteJobs.length }})
                <svg class="dropdown-chevron" :class="{ 'rotated': showFavorites }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </button>
              
              <!-- Favorites Dropdown -->
              <div v-if="showFavorites" class="favorites-dropdown">
                <div v-if="favoriteJobs.length === 0" class="no-favorites">
                  <p>Inga sparade jobb än.</p>
                  <p class="no-favorites-hint">Klicka på hjärtat på ett jobb för att spara det här.</p>
                </div>
                
                <div v-else class="favorites-list">
                  <div 
                    v-for="(job, index) in favoriteJobs.slice(0, 3)" 
                    :key="job.id" 
                    class="favorite-job-card"
                  >
                    <div class="favorite-job-header">
                      <h4 class="favorite-job-title">{{ job.title }}</h4>
                      <button @click="toggleFavorite(job)" class="remove-favorite-btn">
                        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                        </svg>
                      </button>
                    </div>
                    <p class="favorite-job-company">{{ job.company }}</p>
                    <p class="favorite-job-location">{{ job.location }}</p>
                  </div>
                  
                  <div v-if="favoriteJobs.length > 3" class="more-favorites">
                    <p>+{{ favoriteJobs.length - 3 }} fler sparade jobb</p>
                  </div>
                  
                  <div class="favorites-actions">
                    <NuxtLink to="/my-jobs" class="view-all-btn">
                      Visa alla sparade jobb
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
            <button class="sidebar-btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
              </svg>
              Jobbaviseringar
            </button>
          </div>
        </div>

        <div class="sidebar-divider"></div>

        <!-- Marknadsinsikter -->
        <div class="sidebar-section">
          <h3 class="sidebar-section-title">Marknadsinsikter</h3>
          <div class="space-y-4">
            <div class="sidebar-stat">
              <div class="sidebar-stat-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                  <polyline points="16 7 22 7 22 13"></polyline>
                </svg>
                <span>Nya jobb idag</span>
              </div>
              <span class="sidebar-badge">47</span>
            </div>
            <div class="sidebar-stat">
              <div class="sidebar-stat-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  <rect width="20" height="14" x="2" y="6" rx="2"></rect>
                </svg>
                <span>Totalt aktiva</span>
              </div>
              <span class="sidebar-badge">1,234</span>
            </div>
            <div class="sidebar-stat">
              <div class="sidebar-stat-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>Senaste uppdatering</span>
              </div>
              <span class="sidebar-time">2 min sedan</span>
            </div>
          </div>
        </div>

        <div class="sidebar-divider"></div>

        <!-- Populära kategorier -->
        <div class="sidebar-section">
          <h3 class="sidebar-section-title">Populära kategorier</h3>
          <div class="space-y-2">
            <div class="sidebar-category">
              <span class="sidebar-category-name">IT & Tech</span>
              <span class="sidebar-category-badge">342</span>
            </div>
            <div class="sidebar-category">
              <span class="sidebar-category-name">Ekonomi</span>
              <span class="sidebar-category-badge">156</span>
            </div>
            <div class="sidebar-category">
              <span class="sidebar-category-name">Marknadsföring</span>
              <span class="sidebar-category-badge">89</span>
            </div>
            <div class="sidebar-category">
              <span class="sidebar-category-name">Design</span>
              <span class="sidebar-category-badge">67</span>
            </div>
            <div class="sidebar-category">
              <span class="sidebar-category-name">Försäljning</span>
              <span class="sidebar-category-badge">134</span>
            </div>
          </div>
        </div>

        <div class="sidebar-divider"></div>

        <!-- Senaste aktivitet -->
        <div class="sidebar-section">
          <h3 class="sidebar-section-title">Senaste aktivitet</h3>
          <div class="space-y-3">
            <div class="sidebar-activity">
              <div class="sidebar-activity-dot"></div>
              <div>
                <p class="sidebar-activity-text">Ny utvecklare sökes hos <strong>TechCorp</strong></p>
                <p class="sidebar-activity-time">5 min sedan</p>
              </div>
            </div>
            <div class="sidebar-activity">
              <div class="sidebar-activity-dot"></div>
              <div>
                <p class="sidebar-activity-text">Designer position hos <strong>CreativeAB</strong></p>
                <p class="sidebar-activity-time">12 min sedan</p>
              </div>
            </div>
            <div class="sidebar-activity">
              <div class="sidebar-activity-dot"></div>
              <div>
                <p class="sidebar-activity-text">Projektledare sökes hos <strong>InnovateNow</strong></p>
                <p class="sidebar-activity-time">18 min sedan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useHead } from '#imports'
import SearchFilters from '../../components/SearchFilters.vue'
import JobItem from '../../components/JobItem.vue'
import type { SimpleJob } from '../../types/platsbanken'

// Page metadata
useHead({
  title: 'Jobbcentralen - Hitta ditt nästa jobb',
  meta: [
    { name: 'description', content: 'Sök bland tusentals lediga tjänster från Platsbanken. Hitta ditt drömjobb enkelt och snabbt.' },
    { name: 'keywords', content: 'jobb, lediga jobb, jobbannonser, jobbsökning' }
  ]
})

// Real API data
const jobs = ref<SimpleJob[]>([])
const loading = ref(false)
const error = ref('')
const hasMore = ref(true)
const currentPage = ref(1)
const totalJobs = ref(0)
const favoriteJobs = ref<SimpleJob[]>([])
const showFavorites = ref(false)
const searchTerm = ref('')
const sortBy = ref('latest')
const currentFilters = ref({
  occupationField: '',
  municipality: '',
  workTimeExtent: ''
})

// Pagination constants
const jobsPerPage = 20
const currentOffset = ref(0)

// Mobile menu state
const showMobileMenu = ref(false)

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

// Favorite jobs management
const toggleFavorite = (job: SimpleJob) => {
  const index = favoriteJobs.value.findIndex(fav => fav.id === job.id)
  if (index > -1) {
    // Remove from favorites
    favoriteJobs.value.splice(index, 1)
  } else {
    // Add to favorites
    favoriteJobs.value.push(job)
  }
  // Save to localStorage
  localStorage.setItem('favoriteJobs', JSON.stringify(favoriteJobs.value))
}

const isFavorited = (jobId: string) => {
  return favoriteJobs.value.some(fav => fav.id === jobId)
}

const toggleFavoritesView = () => {
  showFavorites.value = !showFavorites.value
}

// Date formatting function
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('sv-SE')
}

// Load favorites from localStorage on mount
onMounted(() => {
  const saved = localStorage.getItem('favoriteJobs')
  if (saved) {
    favoriteJobs.value = JSON.parse(saved)
  }
})

// Computed property for displaying jobs (no filtering here since API handles it)
const displayJobs = computed(() => {
  return jobs.value
})

const handleSearch = (term: string) => {
  searchTerm.value = term
  currentPage.value = 1 // Reset to first page
  currentOffset.value = 0 // Reset offset
  console.log('Searching for:', term)
}

const handleFilterChange = (type: string, value: string) => {
  currentFilters.value[type as keyof typeof currentFilters.value] = value
  currentPage.value = 1 // Reset to first page
  currentOffset.value = 0 // Reset offset
  console.log('Filter changed:', type, value)
}

const removeFilter = (type: string) => {
  if (type === 'search') {
    searchTerm.value = ''
  } else {
    currentFilters.value[type as keyof typeof currentFilters.value] = ''
  }
}

const currentSource = ref<'all' | 'platsbanken' | 'teamtailor'>('all')

const setSource = (source: 'all' | 'platsbanken' | 'teamtailor') => {
  currentSource.value = source
  currentPage.value = 1
  currentOffset.value = 0
  fetchJobs()
}

// Computed properties for pagination
const hasMoreJobs = computed(() => {
  return jobs.value.length < totalJobs.value
})

const remainingJobs = computed(() => {
  return totalJobs.value - jobs.value.length
})

// API functions
const fetchJobs = async (append = false) => {
  if (loading.value) return
  
  loading.value = true
  
  try {
    const params = new URLSearchParams()
    params.append('limit', jobsPerPage.toString())
    params.append('offset', append ? currentOffset.value.toString() : '0')
    
    if (searchTerm.value) {
      params.append('q', searchTerm.value)
    }
    
    if (currentFilters.value.municipality) {
      params.append('municipality', currentFilters.value.municipality)
    }
    
    if (currentFilters.value.occupationField) {
      params.append('occupation-field', currentFilters.value.occupationField)
    }
    
    if (currentFilters.value.workTimeExtent) {
      params.append('employment-type', currentFilters.value.workTimeExtent)
    }
    
    // Add source parameter
    params.append('source', currentSource.value)
    
    const response = await $fetch(`/api/jobs/combined?${params.toString()}`)
    
    if (response.success) {
      if (append) {
        jobs.value.push(...response.data.jobs)
      } else {
        jobs.value = response.data.jobs
        currentOffset.value = 0
      }
      totalJobs.value = response.data.total
      currentOffset.value = response.data.offset + response.data.jobs.length
    }
  } catch (error) {
    console.error('Error fetching jobs:', error)
  } finally {
    loading.value = false
  }
}

// Load more jobs function
const loadMoreJobs = () => {
  if (loading.value || !hasMoreJobs.value) return
  fetchJobs(true)
}

// Initial load and watchers
onMounted(() => {
  fetchJobs()
})

// Watch for filter changes
watch([searchTerm, currentFilters, currentSource], () => {
  fetchJobs()
}, { deep: true })
</script>

<style scoped>
.page-layout {
  display: flex;
  gap: 6px;
  width: 100rem;
  margin: -6px auto;
  padding: 6px;
  margin-left: -11rem;
  box-sizing: border-box;
}

.main-content {
  width: 1058px;
  flex-shrink: 0;
}

.right-sidebar {
  width: 300px;
  flex-shrink: 0;
  margin-top: 0;
}

.sidebar-container {
  border: 1px solid rgb(140, 145, 138);
  background-color: #ffffff;
  padding: 6px;
  box-sizing: border-box;
  width: 300px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.sidebar-unified {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.results-bar {
  min-height: 50px;
  width: 100% ;
  border: 1px solid black;
  background-color: #f5f5f5;
  margin: 0 0 6px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  box-sizing: border-box;
  flex-wrap: wrap;
  gap: 12px;
}

.results-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.results-count {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.filter-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background-color: #1D6453;
  color: white;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #1D6453;
}

.filter-text {
  white-space: nowrap;
}

.filter-remove {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  transition: background-color 0.2s;
}

.filter-remove:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.source-filters {
  display: flex;
  gap: 8px;
  align-items: center;
}

.source-filter-btn {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 6px;
  border: 2px solid transparent;
  background-color: white;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.source-filter-btn:hover {
  background-color: #f8fafc;
  color: #334155;
}

.source-filter-btn.active {
  background-color: #116A3E;
  color: white;
  border-color: #116A3E;
}

.source-filter-btn.platsbanken.active {
  background-color: #10b981;
  border-color: #10b981;
}

.source-filter-btn.teamtailor.active {
  background-color: #8b5cf6;
  border-color: #8b5cf6;
}

.source-filter-btn svg {
  flex-shrink: 0;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-label {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.sort-select {
  padding: 6px 12px;
  border: 1px solid black;
  background-color: white;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  cursor: pointer;
  border-radius: 0;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 8px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 32px;
  transition: all 0.2s ease;
}

.sort-select:hover {
  background-color: #f8f8f8;
  border-color: #1D6453;
}

.sort-select:focus {
  outline: none;
  border-color: #1D6453;
  box-shadow: 0 0 0 2px rgba(29, 100, 83, 0.1);
}


.space-y-4 > * + * {
  margin-top: 16px;
}

.space-y-3 > * + * {
  margin-top: 12px;
}

.space-y-2 > * + * {
  margin-top: 8px;
}

.sidebar-unified {
  width: 300px;
  border: 1px solid black;
  background-color: white;
  box-sizing: border-box;
}

.sidebar-section {
  padding: 20px;
}

.sidebar-section-title {
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 18px;
  color: black;
  margin: 0 0 16px 0;
}

.sidebar-divider {
  height: 1px;
  background-color: #e5e5e5;
  margin: 0 20px;
}

.sidebar-btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 36px;
  padding: 0 16px;
  background-color: #1D6453;
  color: white;
  border: none;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
  box-sizing: border-box;
}

.sidebar-btn-primary:hover {
  background-color: #155242;
}

.sidebar-btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 36px;
  padding: 0 16px;
  background-color: transparent;
  color: black;
  border: 1px solid black;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sidebar-btn-secondary:hover {
  background-color: #D3E0D1;
}

.sidebar-stat {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-stat-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar-stat-label svg {
  color: #1D6453;
}

.sidebar-stat-label span {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: black;
}

.sidebar-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  background-color: #1D6453;
  color: white;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
}

.sidebar-time {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #666;
}

.sidebar-category {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e5e5e5;
}

.sidebar-category:last-child {
  border-bottom: none;
}

.sidebar-category-name {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: black;
  cursor: pointer;
  transition: color 0.2s;
}

.sidebar-category-name:hover {
  color: #1D6453;
}

.sidebar-category-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border: 1px solid #1D6453;
  color: #1D6453;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
}

.sidebar-activity {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.sidebar-activity-dot {
  width: 8px;
  height: 8px;
  background-color: #1D6453;
  border-radius: 50%;
  margin-top: 8px;
  flex-shrink: 0;
}

.sidebar-activity-text {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: black;
  margin: 0;
}

.sidebar-activity-time {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #666;
  margin: 0;
}

.sidebar-content {
  width: 100%;
  border: 1px solid black;
  background-color: #f8f8f8;
  padding: 16px;
  box-sizing: border-box;
  position: static;
  margin-top: -6px;
}

.sidebar-title {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: #333;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.filter-section {
  margin-bottom: 24px;
}

.filter-title {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #333;
  margin: 0 0 12px 0;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.filter-option input[type="radio"] {
  margin: 0;
  cursor: pointer;
}

.loading-message {
  text-align: center;
  margin: 20px 0;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
}

.no-jobs-message {
  text-align: center;
  margin: 20px 0;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
}

/* Mobile Menu */
.mobile-menu-button {
  display: none;
  position: fixed;
  top: 80px;
  right: 1rem;
  z-index: 1001;
  background-color: #1D6453;
  color: white;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
}

.mobile-menu-button:hover {
  background-color: #155242;
  transform: scale(1.05);
}

.mobile-menu-button svg {
  width: 20px;
  height: 20px;
}

.mobile-menu-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1002;
  opacity: 0;
  transition: opacity 0.3s;
}

.mobile-menu-overlay.active {
  opacity: 1;
}

.mobile-menu {
  display: none;
  position: fixed;
  top: 0;
  right: -300px;
  width: 300px;
  height: 100vh;
  background-color: white;
  z-index: 1003;
  transition: right 0.3s ease;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.mobile-menu.active {
  right: 0;
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  background-color: #1D6453;
  color: white;
}

.mobile-menu-header h3 {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.close-menu-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
}

.close-menu-btn svg {
  width: 20px;
  height: 20px;
}

.mobile-menu-content {
  padding: 1rem;
}

.mobile-sidebar-section {
  margin-bottom: 2rem;
}

.mobile-section-title {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #333;
}

.mobile-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: #1D6453;
  color: white;
  border: none;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.2s;
}

.mobile-btn-primary:hover {
  background-color: #155242;
}

.mobile-btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: transparent;
  color: black;
  border: 1px solid black;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.mobile-btn-secondary:hover {
  background-color: #f0f0f0;
}

.mobile-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.mobile-stat-label {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #666;
}

.mobile-stat-value {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #1D6453;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .page-layout {
    flex-direction: column;
    padding: 0 0.75rem;
    margin-left: 0;
  }
  
  .right-sidebar {
    display: none;
  }
  
  .mobile-menu-button,
  .mobile-menu-overlay,
  .mobile-menu {
    display: block;
  }
  
  .results-bar {
    width: 100%;
    margin: 0 0 1rem 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 12px;
  }
  
  .results-info {
    width: 100%;
  }
  
  .sort-controls {
    width: 100%;
    justify-content: space-between;
  }
  
  .sort-select {
    min-width: 150px;
  }
  
  .active-filters {
    max-width: 100%;
  }
  
  .main-content {
    width: 100%;
  }
}

/* Load More Button */
.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  padding: 1rem;
}

.load-more-btn {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  padding: 12px 24px;
  background-color: #1D6453;
  color: white;
  border: 1px solid #1D6453;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 200px;
}

.load-more-btn:hover:not(:disabled) {
  background-color: #155242;
  border-color: #155242;
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Jobs List */
.jobs-list {
  min-height: 100vh;
}

/* Favorites Dropdown */
.favorites-dropdown-container {
  position: relative;
}

.dropdown-chevron {
  width: 12px;
  height: 12px;
  margin-left: auto;
  transition: transform 0.2s ease;
}

.dropdown-chevron.rotated {
  transform: rotate(180deg);
}

.favorites-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid black;
  border-top: none;
  z-index: 1000;
  animation: dropdownSlideDown 0.2s ease-out;
  max-height: 400px;
  overflow-y: auto;
}

@keyframes dropdownSlideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.no-favorites {
  text-align: center;
  padding: 24px 16px;
  color: #666;
}

.no-favorites p {
  margin: 0 0 8px 0;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
}

.no-favorites-hint {
  font-size: 12px;
  opacity: 0.8;
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 8px;
}

.favorite-job-card {
  padding: 12px;
  background-color: #f9f9f9;
  border: 1px solid black;
  transition: background-color 0.2s;
}

.favorite-job-card:hover {
  background-color: #f0f0f0;
}

.more-favorites {
  text-align: center;
  padding: 12px;
  color: #666;
  font-style: italic;
  border-top: 1px solid #f0f0f0;
  margin-top: 8px;
}

.more-favorites p {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
}

.favorites-actions {
  padding: 8px;
  border-top: 1px solid #f0f0f0;
  margin-top: 8px;
  display: flex;
  justify-content: center;
}

.view-all-btn {
  display: block;
  width: calc(100% - 32px);
  padding: 8px 12px;
  background-color: #1D6453;
  color: white;
  text-decoration: none;
  text-align: center;
  border: 1px solid black;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.view-all-btn:hover {
  background-color: #155242;
}

.favorite-job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.favorite-job-title {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #1D6453;
  margin: 0;
  flex: 1;
  margin-right: 12px;
}

.remove-favorite-btn {
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
  color: #e74c3c;
}

.remove-favorite-btn:hover {
  background-color: #ffeaea;
}

.remove-favorite-btn svg {
  width: 16px;
  height: 16px;
}

.favorite-job-company {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0 0 4px 0;
}

.favorite-job-location {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #666;
  margin: 0 0 4px 0;
}

.favorite-job-deadline {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #888;
  margin: 0 0 12px 0;
}

.favorite-job-actions {
  display: flex;
  gap: 8px;
}

.favorite-apply-btn {
  padding: 6px 12px;
  background-color: #1D6453;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.favorite-apply-btn:hover {
  background-color: #155242;
}
</style>