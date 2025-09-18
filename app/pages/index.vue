<template>
  <div class="page-layout">
    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Search/Categories Section -->
      <SearchFilters 
        :jobs="mockJobs"
        @search="handleSearch"
        @filter-change="handleFilterChange"
      />

      <!-- Results Bar -->
      <div class="results-bar">
        <div class="results-info">
          <span class="results-count">Hittade {{ displayJobs.length }} jobb</span>
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
        />
      </div>
    </div>

    <!-- Right Sidebar -->
    <aside class="right-sidebar">
      <div class="sidebar-container">
        <div class="space-y-6">
          <!-- Snabbåtgärder -->
          <div class="sidebar-card">
          <h3 class="sidebar-card-title">Snabbåtgärder</h3>
          <div class="space-y-3">
            <button class="sidebar-btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Skapa profil
            </button>
            <button class="sidebar-btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
              Sparade jobb (0)
            </button>
            <button class="sidebar-btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
              </svg>
              Jobbaviseringar
            </button>
          </div>
        </div>

        <!-- Marknadsinsikter -->
        <div class="sidebar-card">
          <h3 class="sidebar-card-title">Marknadsinsikter</h3>
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

        <!-- Populära kategorier -->
        <div class="sidebar-card">
          <h3 class="sidebar-card-title">Populära kategorier</h3>
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

        <!-- Senaste aktivitet -->
        <div class="sidebar-card">
          <h3 class="sidebar-card-title">Senaste aktivitet</h3>
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
    </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHead } from '#imports'
import SearchFilters from '../../components/SearchFilters.vue'
import JobItem from '../../components/JobItem.vue'

// Page metadata
useHead({
  title: 'Jobbcentralen - Hitta ditt nästa jobb',
  meta: [
    { name: 'description', content: 'Sök bland tusentals lediga tjänster från Platsbanken. Hitta ditt drömjobb enkelt och snabbt.' },
    { name: 'keywords', content: 'jobb, lediga jobb, jobbannonser, jobbsökning' }
  ]
})

// Mock data for now - replace with real API calls later
const mockJobs = ref([
  {
    id: 1,
    headline: 'Frontend Utvecklare',
    employer: { name: 'Tech AB' },
    application_deadline: '2025-10-15',
    workplace_address: { municipality: 'Stockholm', city: 'Stockholm' },
    occupation_field: { label: 'IT/Teknik' },
    working_hours_type: { label: 'Heltid' }
  },
  {
    id: 2,
    headline: 'UX Designer',
    employer: { name: 'Design Studio' },
    application_deadline: '2025-10-20',
    workplace_address: { municipality: 'Göteborg', city: 'Göteborg' },
    occupation_field: { label: 'IT/Teknik' },
    working_hours_type: { label: 'Heltid' }
  },
  {
    id: 3,
    headline: 'Projektledare',
    employer: { name: 'Konsult Group' },
    application_deadline: '2025-10-25',
    workplace_address: { municipality: 'Malmö', city: 'Malmö' },
    occupation_field: { label: 'Ekonomi/Administration' },
    working_hours_type: { label: 'Heltid' }
  },
  {
    id: 4,
    headline: 'Sjuksköterska',
    employer: { name: 'Vårdcentral Syd' },
    application_deadline: '2025-11-01',
    workplace_address: { municipality: 'Uppsala', city: 'Uppsala' },
    occupation_field: { label: 'Vård/Omsorg' },
    working_hours_type: { label: 'Deltid' }
  },
  {
    id: 5,
    headline: 'Lärare Matematik',
    employer: { name: 'Grundskolan Centrum' },
    application_deadline: '2025-11-05',
    workplace_address: { municipality: 'Linköping', city: 'Linköping' },
    occupation_field: { label: 'Utbildning' },
    working_hours_type: { label: 'Heltid' }
  }
])

const loading = ref(false)
const searchTerm = ref('')
const sortBy = ref('latest')
const currentFilters = ref({
  occupationField: '',
  municipality: '',
  workTimeExtent: ''
})

// Computed property to filter jobs based on search and filters
const displayJobs = computed(() => {
  let filtered = [...mockJobs.value]

  // Filter by search term
  if (searchTerm.value) {
    filtered = filtered.filter(job => 
      job.headline?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      job.employer?.name?.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }

  // Filter by occupation field
  if (currentFilters.value.occupationField) {
    filtered = filtered.filter(job => 
      job.occupation_field?.label === currentFilters.value.occupationField
    )
  }

  // Filter by municipality
  if (currentFilters.value.municipality) {
    filtered = filtered.filter(job => 
      job.workplace_address?.municipality === currentFilters.value.municipality
    )
  }

  // Filter by work time extent
  if (currentFilters.value.workTimeExtent) {
    filtered = filtered.filter(job => 
      job.working_hours_type?.label === currentFilters.value.workTimeExtent
    )
  }

  return filtered
})

const handleSearch = (term: string) => {
  searchTerm.value = term
  console.log('Searching for:', term)
}

const handleFilterChange = (type: string, value: string) => {
  currentFilters.value[type as keyof typeof currentFilters.value] = value
  console.log('Filter changed:', type, value)
}
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
  width: 10rem;
  flex-shrink: 0;
  margin-top: 0;
}

.sidebar-container {
  border: 1px solid rgb(140, 145, 138);
  background-color: #ffffff;
  padding: 6px;
  box-sizing: border-box;
  width: 300px;
}

.results-bar {
  height: 50px;
  width: 100% ;
  border: 1px solid black;
  background-color: #f5f5f5;
  margin: 0 0 6px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-sizing: border-box;
}

.results-info {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #333;
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
  padding: 4px 8px;
  border: 1px solid black;
  background-color: white;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  cursor: pointer;
}

.jobs-list {
  /* Container for job items */
}

.space-y-6 > * + * {
  margin-top: 6px;
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

.sidebar-card {
  width: 285px;
  border: 1px solid black;
  background-color: white;
  padding: 16px;
  gap: 6px;
  box-sizing: border-box;
}

.sidebar-card-title {
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 18px;
  color: black;
  margin: 0 0 16px 0;
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

/* Mobile responsive */
@media (max-width: 768px) {
  .page-layout {
    flex-direction: column;
    padding: 0 0.75rem;
  }
  
  .right-sidebar {
    width: 100%;
    order: -1;
  }
  
  .sidebar-content {
    width: 100%;
    position: static;
    margin-bottom: 1rem;
  }
  
  .results-bar {
    width: 100%;
    margin: 0 0 1rem 0;
  }
}
</style>