<template>
  <div class="page-layout">
    <!-- Search Section -->
    <section class="search-section">
      <div class="search-container">
        <h1 class="main-heading">Mina jobb</h1>
        
        <!-- Search Controls -->
        <div class="search-controls-wrapper">
          <div class="search-group">
            <div class="search-input-wrapper">
              <input
                id="job-search"
                type="search"
                class="search-input"
                placeholder="Sök bland sparade jobb (titel eller företag)..."
                v-model="searchTerm"
                @input="filterJobs"
              />
            </div>
            <button 
              @click="clearSearch"
              class="search-button"
              type="button"
            >
              Rensa
            </button>
            <NuxtLink to="/" class="back-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Tillbaka
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Layout -->
    <div class="main-layout">
      <!-- Jobs Content -->
      <main class="main-content">

        <!-- Jobs Section -->
        <section class="jobs-section">
          <div class="jobs-container">
            <!-- Stats -->
            <div class="jobs-stats">
              <p class="jobs-count">{{ filteredJobs.length }} av {{ favoriteJobs.length }} sparade jobb</p>
            </div>
            
            <!-- Loading State -->
            <div v-if="loading" class="loading-message">
              Laddar sparade jobb...
            </div>
            
            <!-- No Jobs State -->
            <div v-else-if="favoriteJobs.length === 0" class="no-jobs-message">
              <div class="no-jobs-content">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="no-jobs-icon">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
                <h2>Inga sparade jobb än</h2>
                <p>Börja spara jobb genom att klicka på hjärtat på jobbannonser som intresserar dig.</p>
                <NuxtLink to="/" class="browse-jobs-btn">
                  Bläddra bland jobb
                </NuxtLink>
              </div>
            </div>
            
            <!-- No Search Results -->
            <div v-else-if="filteredJobs.length === 0" class="no-jobs-message">
              <h2>Inga jobb matchade din sökning</h2>
              <p>Prova att söka på något annat eller rensa sökningen.</p>
            </div>
            
            <!-- Jobs List -->
            <div v-else class="jobs-list">
              <div v-for="(job, index) in filteredJobs" :key="job.id" class="job-item-wrapper">
                <JobItem 
                  :job="job" 
                  :index="index" 
                  :is-even="index % 2 === 0"
                  :is-favorited="true"
                  :show-trash-icon="true"
                  @toggle-favorite="showDeleteConfirmation(job.id)"
                />
                
                <!-- Delete Confirmation -->
                <div v-if="confirmingDelete === job.id" class="delete-confirmation">
                  <span class="delete-text">Ta bort?</span>
                  <button @click="confirmDelete(job)" class="confirm-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  </button>
                  <button @click="cancelDelete" class="cancel-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- Right Sidebar -->
      <aside class="right-sidebar">
        <div class="sidebar-unified">
          <!-- Settings Section -->
          <div class="sidebar-section">
            <h3 class="sidebar-section-title">Inställningar</h3>
            <div class="space-y-3">
              <button class="sidebar-btn-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 1v6m0 6v6"></path>
                  <path d="M1 12h6m6 0h6"></path>
                </svg>
                Jobbaviseringar
              </button>
              <button class="sidebar-btn-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 9V5a3 3 0 0 0-6 0v4"></path>
                  <rect x="2" y="9" width="20" height="11" rx="2" ry="2"></rect>
                </svg>
                Sekretess
              </button>
              <button class="sidebar-btn-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 15l2-5-2-5-2 5 2 5z"></path>
                  <path d="M2 12h6m8 0h6"></path>
                </svg>
                Exportera data
              </button>
            </div>
          </div>

          <div class="sidebar-divider"></div>

          <!-- Statistik -->
          <div class="sidebar-section">
            <h3 class="sidebar-section-title">Statistik</h3>
            <div class="space-y-3">
              <div class="sidebar-stat">
                <div class="sidebar-stat-label">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                  </svg>
                  <span>Sparade jobb</span>
                </div>
                <span class="sidebar-badge">{{ favoriteJobs.length }}</span>
              </div>
              <div class="sidebar-stat">
                <div class="sidebar-stat-label">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>Senaste uppdatering</span>
                </div>
                <span class="sidebar-time">Nu</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useHead } from '#imports'
import JobItem from '../../components/JobItem.vue'
import type { SimpleJob } from '../../types/platsbanken'

// SEO
useHead({
  title: 'Mina Sparade Jobb - Jobbcentralen',
  meta: [
    { name: 'description', content: 'Visa och hantera dina sparade jobb från Jobbcentralen.' },
    { name: 'keywords', content: 'sparade jobb, favoriter, jobbsökning' }
  ]
})

// State
const favoriteJobs = ref<SimpleJob[]>([])
const searchTerm = ref('')
const loading = ref(true)
const confirmingDelete = ref<string | null>(null)

// Computed
const filteredJobs = computed(() => {
  if (!searchTerm.value.trim()) {
    return favoriteJobs.value
  }
  
  const term = searchTerm.value.toLowerCase()
  return favoriteJobs.value.filter(job => 
    job.title.toLowerCase().includes(term) || 
    job.company.toLowerCase().includes(term)
  )
})

// Methods
const loadFavoriteJobs = () => {
  loading.value = true
  try {
    const saved = localStorage.getItem('favoriteJobs')
    if (saved) {
      favoriteJobs.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Error loading favorite jobs:', error)
  } finally {
    loading.value = false
  }
}

const showDeleteConfirmation = (jobId: string) => {
  if (confirmingDelete.value === jobId) {
    // If clicking the same trash can again, cancel
    confirmingDelete.value = null
  } else {
    confirmingDelete.value = jobId
  }
}

const cancelDelete = () => {
  confirmingDelete.value = null
}

const confirmDelete = (job: SimpleJob) => {
  const index = favoriteJobs.value.findIndex(fav => fav.id === job.id)
  if (index > -1) {
    favoriteJobs.value.splice(index, 1)
    // Update localStorage
    localStorage.setItem('favoriteJobs', JSON.stringify(favoriteJobs.value))
  }
  confirmingDelete.value = null
}

const toggleFavorite = (job: SimpleJob) => {
  showDeleteConfirmation(job.id)
}

const filterJobs = () => {
  // Filtering is handled by computed property
}

const clearSearch = () => {
  searchTerm.value = ''
}

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (confirmingDelete.value && !target.closest('.delete-confirmation') && !target.closest('.favorite-btn')) {
    confirmingDelete.value = null
  }
}

// Lifecycle
onMounted(() => {
  loadFavoriteJobs()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.page-layout {
  min-height: 100vh;
  background-color: white;
}

/* Search Section */
.search-section {
  background-color: #E4E9E3;
  padding: 1rem 0;
  border: 1px solid black;
  margin-bottom: 6px;
  width: 1362px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}

.search-container {
  width: 100rem;
  margin: -6px auto;
  padding: 6px;
  margin-left: 6px;
  box-sizing: border-box;
}

.main-heading {
  font-family: 'Inter', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #1D6453;
  margin: 0 0 0 0;
  margin-left: -10rem;
  text-align: center;
}

.search-controls-wrapper {
  display: flex;
  justify-content: flex-start;
}

.search-group {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 30px;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  width: 400px;
  height: 30px;
  background-color: white;
  box-sizing: border-box;
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

.search-button {
  height: 30px;
  padding: 0 16px;
  background-color: #1D6453;
  color: white;
  border: 1px solid black;
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


.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 12px;
  background-color: white;
  color: #333;
  text-decoration: none;
  border: 1px solid black;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  box-sizing: border-box;
}

.back-btn:hover {
  background-color: #1D6453;
  color: white;
}

.back-btn svg {
  width: 14px;
  height: 14px;
}

/* Main Layout */
.main-layout {
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

/* Jobs Section */
.jobs-section {
  background-color: white;
  border: 1px solid black;
  padding: 1.5rem;
  margin-bottom: 6px;
}

.jobs-container {
  width: 100%;
}

.jobs-stats {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.jobs-count {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: #666;
  margin: 0;
}

.loading-message {
  text-align: center;
  padding: 3rem 0;
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  color: #666;
}

.no-jobs-message {
  text-align: center;
  padding: 3rem 0;
}

.no-jobs-content {
  max-width: 400px;
  margin: 0 auto;
}

.no-jobs-icon {
  width: 64px;
  height: 64px;
  color: #ccc;
  margin: 0 auto 1.5rem auto;
}

.no-jobs-message h2 {
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 1rem 0;
}

.no-jobs-message p {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: #666;
  margin: 0 0 2rem 0;
  line-height: 1.5;
}

.browse-jobs-btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  background-color: #1D6453;
  color: white;
  text-decoration: none;
  border: 1px solid black;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  transition: background-color 0.2s;
}

.browse-jobs-btn:hover {
  background-color: #155242;
}

.jobs-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.job-item-wrapper {
  position: relative;
}

.delete-confirmation {
  position: absolute;
  top: 125px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: white;
  border: 1px solid black;
  padding: 4px 8px;
  z-index: 10;
  animation: confirmationSlideIn 0.2s ease-out;
}

@keyframes confirmationSlideIn {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.delete-text {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #333;
  margin-right: 4px;
}

.confirm-btn, .cancel-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 1px solid black;
  background-color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.confirm-btn {
  color: #28a745;
}

.confirm-btn:hover {
  background-color: #d4edda;
}

.cancel-btn {
  color: #dc3545;
}

.cancel-btn:hover {
  background-color: #f8d7da;
}

.confirm-btn svg, .cancel-btn svg {
  width: 12px;
  height: 12px;
}

/* Right Sidebar */
.right-sidebar {
  width: 300px;
  flex-shrink: 0;
}

.sidebar-unified {
  background-color: white;
  border: 1px solid black;
  padding: 1.5rem;
}

.sidebar-section {
  margin-bottom: 2rem;
}

.sidebar-section:last-child {
  margin-bottom: 0;
}

.sidebar-section-title {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #1D6453;
  margin: 0 0 1rem 0;
}

.space-y-3 > * + * {
  margin-top: 12px;
}

.sidebar-btn-secondary {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background-color: #f8f9fa;
  color: #333;
  text-decoration: none;
  border: 1px solid black;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  transition: background-color 0.2s;
  cursor: pointer;
}

.sidebar-btn-secondary:hover {
  background-color: #e9ecef;
}

.sidebar-divider {
  height: 1px;
  background-color: black;
  margin: 1.5rem 0;
}

.sidebar-stat {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
}

.sidebar-stat-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #666;
}

.sidebar-badge {
  background-color: #1D6453;
  color: white;
  padding: 4px 8px;
  border: 1px solid black;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
}

.sidebar-time {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #999;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .main-heading {
    font-size: 2rem;
  }
  
  .search-controls-wrapper {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .search-group {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
    height: auto;
  }
  
  .search-input-wrapper {
    width: 100%;
  }
  
  .search-button,
  .back-btn {
    width: 100%;
    justify-content: center;
  }
  
  .main-layout {
    flex-direction: column;
    gap: 6px;
  }
  
  .right-sidebar {
    width: 100%;
  }
}
</style>
