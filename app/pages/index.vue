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
      <div class="results-bar" :class="showMatchedOnly ? 'right-active' : 'left-active'">
        <!-- Left Section: Platsbanken/Teamtailor -->
        <div :class="['results-bar-section', 'left-section', !showMatchedOnly ? 'active' : '']" @click="deactivateMatchedJobs">
          <div class="results-info">
            <span class="results-count">Hittade {{ totalJobs }} jobb</span>
            
            <!-- Active Filters -->
            <div class="active-filters">
              <!-- Source Filter Buttons -->
              <div class="source-filters">
                <button 
                  @click.stop="setSource('all')"
                  :class="['source-filter-btn', currentSource === 'all' ? 'active' : '']"
                  title="Visa alla jobb"
                >
                  <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
                  </svg>
                  Alla
                </button>
                
                <button 
                  @click.stop="setSource('platsbanken')"
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
                  @click.stop="setSource('teamtailor')"
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
                <button @click.stop="removeFilter('occupationField')" class="filter-remove">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
              </div>
              
              <div v-if="currentFilters.municipality" class="filter-tag">
                <span class="filter-text">{{ currentFilters.municipality }}</span>
                <button @click.stop="removeFilter('municipality')" class="filter-remove">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
              </div>
              
              <div v-if="currentFilters.workTimeExtent" class="filter-tag">
                <span class="filter-text">{{ currentFilters.workTimeExtent }}</span>
                <button @click.stop="removeFilter('workTimeExtent')" class="filter-remove">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
              </div>
              
              <div v-if="searchTerm" class="filter-tag">
                <span class="filter-text">"{{ searchTerm }}"</span>
                <button @click.stop="removeFilter('search')" class="filter-remove">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right Section: Mina matchningar -->
        <div :class="['results-bar-section', 'right-section', showMatchedOnly ? 'active' : '']" @click="activateMatchedJobs">
          <div class="matched-section-content">
            <button 
              @click.stop="toggleMatchedJobs"
              class="matched-tab-btn"
            >
              <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              Mina matchningar
            </button>
            <span v-if="showMatchedOnly" class="matched-count">{{ allMatchedJobs.length }} matchningar</span>
          </div>
        </div>
      </div>
      
      <!-- Sort Controls Bar (only shown when not in Mina matchningar) -->
      <div v-if="!showMatchedOnly" class="sort-controls-bar">
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
      
      <!-- Date Filter Bar (only shown when Mina matchningar is active) -->
      <div v-if="showMatchedOnly" class="date-filter-bar">
        <div class="filter-group">
          <span class="date-filter-label">Datum:</span>
          <div class="date-filter-buttons">
            <button 
              @click="setDateFilter('all')"
              :class="['date-filter-btn', dateFilter === 'all' ? 'active' : '']"
            >
              Alla
            </button>
            <button 
              @click="setDateFilter('6months')"
              :class="['date-filter-btn', dateFilter === '6months' ? 'active' : '']"
            >
              6 månader
            </button>
            <button 
              @click="setDateFilter('1month')"
              :class="['date-filter-btn', dateFilter === '1month' ? 'active' : '']"
            >
              1 månad
            </button>
            <button 
              @click="setDateFilter('1week')"
              :class="['date-filter-btn', dateFilter === '1week' ? 'active' : '']"
            >
              1 vecka
            </button>
            <button 
              @click="setDateFilter('1day')"
              :class="['date-filter-btn', dateFilter === '1day' ? 'active' : '']"
            >
              1 dag
            </button>
          </div>
        </div>
        
        <div class="filter-group">
          <span class="date-filter-label">Plats:</span>
          <div class="location-filter-input">
            <input 
              v-model="matchedJobsLocationFilter"
              type="text"
              placeholder="Filtrera på plats..."
              class="location-input"
            />
            <button 
              v-if="matchedJobsLocationFilter"
              @click="clearLocationFilter"
              class="clear-location-btn"
              title="Rensa platsfilter"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Job Results -->
      <div v-if="loading || isLoadingMatchedJobs" class="platsbanken-loading">
        <div class="loading-spinner"></div>
        <span v-if="isLoadingMatchedJobs">Laddar alla jobb för matchning...</span>
        <span v-else>Laddar jobb från Platsbanken...</span>
      </div>
      
      <div v-else-if="displayJobs.length === 0 && !teamtailorLoading" class="no-jobs-message">
        <span v-if="showMatchedOnly && profile.skills.length === 0 && profile.jobTitles.length === 0">
          Ingen profil hittades. 
          <NuxtLink to="/profile" style="color: #1B7C5A; text-decoration: underline;">Gå till profilen</NuxtLink> 
          och lägg till skills och jobbtitlar för att se matchningar.
        </span>
        <span v-else-if="showMatchedOnly && allJobsForMatching.length === 0">
          Laddar jobb för matchning... Klicka på knappen igen om inget händer.
        </span>
        <span v-else-if="showMatchedOnly">
          Inga jobb matchade din profil. Prova att justera dina skills och jobbtitlar i 
          <NuxtLink to="/profile" style="color: #1B7C5A; text-decoration: underline;">profilen</NuxtLink>.
        </span>
        <span v-else>Inga jobb hittades med de valda filtren.</span>
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
        
        <!-- TeamTailor Loading Indicator -->
        <div v-if="teamtailorLoading" class="teamtailor-loading">
          <div class="loading-spinner"></div>
          <span>Laddar jobb från TeamTailor...</span>
        </div>
        
        <!-- Load More Button (for regular jobs) -->
        <div v-if="!showMatchedOnly && hasMoreJobs && teamtailorLoaded" class="load-more-container">
          <button @click="loadMoreJobs" :disabled="loading" class="load-more-btn">
            <span v-if="loading">Laddar...</span>
            <span v-else>Ladda fler jobb ({{ remainingJobs }} kvar)</span>
          </button>
        </div>
        
        <!-- Matched jobs info and load more -->
        <div v-if="showMatchedOnly && displayJobs.length > 0" class="matched-jobs-section">
          <div class="matched-jobs-info">
            <p>Visar {{ displayJobs.length }} av {{ allMatchedJobs.length }} matchande jobb</p>
          </div>
          
          <!-- Load More Button for matched jobs -->
          <div v-if="hasMoreMatchedJobs" class="load-more-container">
            <button @click="loadMoreMatchedJobs" class="load-more-btn">
              Ladda fler matchningar ({{ allMatchedJobs.length - matchedJobsLimit }} kvar)
            </button>
          </div>
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
import { calculateJobMatch } from '../../utils/jobMatcher'
import { useProfile } from '../../composables/useProfile'

// Page metadata
useHead({
  title: 'Jobbcentralen - Hitta ditt nästa jobb',
  meta: [
    { name: 'description', content: 'Sök bland tusentals lediga tjänster från Platsbanken. Hitta ditt drömjobb enkelt och snabbt.' },
    { name: 'keywords', content: 'jobb, lediga jobb, jobbannonser, jobbsökning' }
  ]
})

// Get user profile for matching
const { profile, loadProfile } = useProfile()

// Note: Profile loading is in the main onMounted below

// Real API data
const jobs = ref<SimpleJob[]>([])
const loading = ref(false)
const error = ref('')
const hasMore = ref(true)
const currentPage = ref(1)
const totalJobs = ref(0)
const favoriteJobs = ref<SimpleJob[]>([])
const showFavorites = ref(false)
const showMatchedOnly = ref(false)
const allJobsForMatching = ref<SimpleJob[]>([])
const isLoadingMatchedJobs = ref(false)
const matchedJobsLimit = ref(50)
const searchTerm = ref('')
const sortBy = ref('latest')
const dateFilter = ref<'all' | '6months' | '1month' | '1week' | '1day'>('all')
const matchedJobsLocationFilter = ref('')
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

// Load profile and favorites from localStorage on mount
onMounted(() => {
  // Load profile explicitly
  loadProfile()
  console.log('👤 Profil laddad:', {
    skills: profile.value.skills,
    jobTitles: profile.value.jobTitles,
    hasSkills: profile.value.skills.length > 0,
    hasJobTitles: profile.value.jobTitles.length > 0
  })
  
  // Load favorites
  const saved = localStorage.getItem('favoriteJobs')
  if (saved) {
    favoriteJobs.value = JSON.parse(saved)
  }
})

// Debug function to compare search results with matched jobs
// You can call this from browser console: window.compareJobLists()
if (typeof window !== 'undefined') {
  (window as any).compareJobLists = () => {
    const currentJobs = jobs.value
    const matchedJobs = allJobsForMatching.value
    
    console.group('📊 Jämförelse: Vanliga jobb vs Alla jobb för matchning')
    console.log(`Vanliga jobb (från senaste sökning): ${currentJobs.length}`)
    console.log(`Alla jobb för matchning: ${matchedJobs.length}`)
    
    // Find jobs in current search but not in matched
    const currentIds = new Set(currentJobs.map(j => j.id))
    const matchedIds = new Set(matchedJobs.map(j => j.id))
    
    const onlyInCurrent = currentJobs.filter(j => !matchedIds.has(j.id))
    const onlyInMatched = matchedJobs.filter(j => !currentIds.has(j.id))
    
    console.log(`\n🔴 Jobb som finns i vanlig sökning men INTE i matchningslistan: ${onlyInCurrent.length}`)
    if (onlyInCurrent.length > 0) {
      onlyInCurrent.slice(0, 5).forEach((job, i) => {
        console.log(`  ${i + 1}. "${job.title}" - ${job.company} (ID: ${job.id})`)
      })
    }
    
    console.log(`\n🟢 Jobb som finns i matchningslistan men INTE i vanlig sökning: ${onlyInMatched.length}`)
    
    // Check if current search jobs would match
    console.log(`\n🎯 Matchningstest för vanliga jobb:`)
    currentJobs.slice(0, 5).forEach((job, i) => {
      const match = calculateJobMatch(job, profile.value)
      console.log(`  ${i + 1}. "${job.title}" - ${match.matchScore} poäng`)
      if (match.matchScore > 0) {
        console.log(`     Anledningar: ${match.matchReasons.join(', ')}`)
      }
    })
    
    console.groupEnd()
  }
}

// Computed property for all matched jobs (before pagination)
const allMatchedJobs = computed(() => {
  if (!showMatchedOnly.value) return []
  
  // Use all jobs for matching if available, otherwise use current jobs
  const jobsToMatch = allJobsForMatching.value.length > 0 ? allJobsForMatching.value : jobs.value
  
  console.log(`🎯 Beräknar matchningar mot ${jobsToMatch.length} jobb...`)
  
  // Calculate matches and filter jobs with score > 0
  const matched = jobsToMatch
    .map(job => ({
      job,
      match: calculateJobMatch(job, profile.value)
    }))
    .filter(item => item.match.matchScore > 0)
    .sort((a, b) => b.match.matchScore - a.match.matchScore)
  
  console.log(`✅ Hittade ${matched.length} matchande jobb`)
  
  // Show top 10 matches for debugging
  if (matched.length > 0) {
    console.log('🏆 Top 10 matchningar:')
    matched.slice(0, 10).forEach((item, i) => {
      console.log(`  ${i + 1}. "${item.job.title}" - ${item.job.company} (${item.match.matchScore} poäng)`)
      console.log(`     Anledningar: ${item.match.matchReasons.join(', ')}`)
    })
  }
  
  // Apply date filter
  const matchedJobs = matched.map(item => item.job)
  
  if (dateFilter.value === 'all') {
    return matchedJobs
  }
  
  // Calculate date threshold based on filter
  const now = new Date()
  let thresholdDate: Date
  
  switch (dateFilter.value) {
    case '1day':
      thresholdDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      break
    case '1week':
      thresholdDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case '1month':
      thresholdDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case '6months':
      thresholdDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
      break
    default:
      return matchedJobs
  }
  
  // Filter jobs by publication date
  let filteredJobs = matchedJobs.filter(job => {
    const jobDate = new Date(job.publicationDate)
    return jobDate >= thresholdDate
  })
  
  console.log(`📅 Efter datumfilter (${dateFilter.value}): ${filteredJobs.length} av ${matchedJobs.length} jobb`)
  
  // Apply location filter if set
  if (matchedJobsLocationFilter.value.trim()) {
    const locationQuery = matchedJobsLocationFilter.value.toLowerCase().trim()
    filteredJobs = filteredJobs.filter(job => {
      const jobLocation = job.location?.toLowerCase() || ''
      return jobLocation.includes(locationQuery)
    })
    console.log(`📍 Efter platsfilter ("${matchedJobsLocationFilter.value}"): ${filteredJobs.length} jobb`)
  }
  
  return filteredJobs
})

// Computed property for displaying jobs (with optional match filtering)
const displayJobs = computed(() => {
  // Filter by matched jobs if enabled
  if (showMatchedOnly.value) {
    // Return paginated matched jobs
    return allMatchedJobs.value.slice(0, matchedJobsLimit.value)
  }
  
  return jobs.value
})

// Check if there are more matched jobs to load
const hasMoreMatchedJobs = computed(() => {
  return showMatchedOnly.value && allMatchedJobs.value.length > matchedJobsLimit.value
})

// Function to load more matched jobs
const loadMoreMatchedJobs = () => {
  matchedJobsLimit.value += 50
}

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

const setDateFilter = (filter: 'all' | '6months' | '1month' | '1week' | '1day') => {
  dateFilter.value = filter
}

const clearLocationFilter = () => {
  matchedJobsLocationFilter.value = ''
}

const deactivateMatchedJobs = () => {
  if (showMatchedOnly.value) {
    showMatchedOnly.value = false
    dateFilter.value = 'all'
  }
}

const activateMatchedJobs = async () => {
  if (!showMatchedOnly.value) {
    await toggleMatchedJobs()
  }
}

const toggleMatchedJobs = async () => {
  showMatchedOnly.value = !showMatchedOnly.value
  
  // Reset limit, date filter, and location filter when toggling
  if (showMatchedOnly.value) {
    matchedJobsLimit.value = 50
    dateFilter.value = 'all'
    matchedJobsLocationFilter.value = ''
  }
  
  // When enabling matched jobs, fetch all jobs for matching
  if (showMatchedOnly.value && allJobsForMatching.value.length === 0) {
    isLoadingMatchedJobs.value = true
    try {
      console.log('🎯 Hämtar jobb baserat på din profil...')
      
      const allFetchedJobs: SimpleJob[] = []
      const fetchedJobIds = new Set<string>() // Track job IDs to avoid duplicates
      
      // Build search queries from profile
      const searchQueries: string[] = []
      
      // Add job titles as search queries
      if (profile.value.jobTitles.length > 0) {
        searchQueries.push(...profile.value.jobTitles)
      }
      
      // Add all skills as search queries
      if (profile.value.skills.length > 0) {
        searchQueries.push(...profile.value.skills)
      }
      
      // Check if we have any search queries
      if (searchQueries.length === 0) {
        console.warn('⚠️ Ingen profil hittades. Profil måste ha minst en skill eller jobbtitel.')
        isLoadingMatchedJobs.value = false
        return
      }
      
      console.log(`📋 Söker med: ${searchQueries.join(', ')}`)
      
      // Fetch from Platsbanken using profile-based searches
      console.log('📦 Hämtar jobb från Platsbanken...')
      const platsbankenBatchSize = 100 // Use smaller batches when searching
      
      for (const query of searchQueries) {
        console.log(`  🔍 Söker på: "${query}"`)
        
        // Fetch multiple pages for each query
        for (let page = 0; page < 3; page++) { // Get 3 pages per search term
          const offset = page * platsbankenBatchSize
          const response = await $fetch(`/api/jobs/platsbanken?q=${encodeURIComponent(query)}&limit=${platsbankenBatchSize}&offset=${offset}`)
          
          if (response.success && response.data.jobs.length > 0) {
            // Add only unique jobs
            let newJobsCount = 0
            response.data.jobs.forEach((job: SimpleJob) => {
              if (!fetchedJobIds.has(job.id)) {
                fetchedJobIds.add(job.id)
                allFetchedJobs.push({
                  ...job,
                  source: 'platsbanken' as const
                })
                newJobsCount++
              }
            })
            
            if (newJobsCount > 0) {
              console.log(`    Sida ${page + 1}: ${newJobsCount} nya jobb (totalt: ${allFetchedJobs.length})`)
            }
            
            // If we got fewer jobs than batch size, no more pages
            if (response.data.jobs.length < platsbankenBatchSize) {
              break
            }
          } else {
            break
          }
        }
      }
      
      // Fetch all TeamTailor jobs
      console.log('📦 Hämtar jobb från TeamTailor...')
      const teamtailorResponse = await $fetch('/api/jobs/teamtailor')
      if (teamtailorResponse.success && teamtailorResponse.data.jobs.length > 0) {
        const jobsWithSource = teamtailorResponse.data.jobs.map((job: SimpleJob) => ({
          ...job,
          source: 'teamtailor' as const
        }))
        allFetchedJobs.push(...jobsWithSource)
        console.log(`  ${teamtailorResponse.data.jobs.length} TeamTailor-jobb hämtade`)
      }
      
      allJobsForMatching.value = allFetchedJobs
      console.log(`✅ Totalt laddade ${allJobsForMatching.value.length} jobb för matchning`)
      
      // Log sources for debugging
      const platsbankenCount = allFetchedJobs.filter(j => j.source === 'platsbanken').length
      const teamtailorCount = allFetchedJobs.filter(j => j.source === 'teamtailor').length
      console.log(`📊 Källor: ${platsbankenCount} från Platsbanken, ${teamtailorCount} från TeamTailor`)
      
      // Debug: Check for frontend jobs
      const frontendJobs = allFetchedJobs.filter(j => {
        const text = `${j.title} ${j.description}`.toLowerCase()
        return text.includes('frontend')
      })
      console.log(`🔍 Debug: Hittade ${frontendJobs.length} jobb med "frontend" i titel/beskrivning`)
      
      // Show first 5 frontend jobs
      if (frontendJobs.length > 0) {
        console.log('📋 Första 5 frontend-jobben:')
        frontendJobs.slice(0, 5).forEach((job, i) => {
          console.log(`  ${i + 1}. "${job.title}" - ${job.company} (${job.source})`)
        })
      }
    } catch (err) {
      console.error('Fel vid hämtning av jobb för matchning:', err)
    } finally {
      isLoadingMatchedJobs.value = false
    }
  }
}

// Computed properties for pagination
const hasMoreJobs = computed(() => {
  return jobs.value.length < totalJobs.value
})

const remainingJobs = computed(() => {
  return totalJobs.value - jobs.value.length
})

// Progressive loading state
const teamtailorLoading = ref(false)
const teamtailorLoaded = ref(false)

// API functions - Progressive loading: Platsbanken first, then TeamTailor
const fetchJobs = async (append = false) => {
  // Prevent multiple simultaneous fetches
  if (loading.value || teamtailorLoading.value) {
    console.log('Fetch already in progress, skipping...')
    return
  }
  
  loading.value = true
  teamtailorLoaded.value = false
  let platsbankenTotal = 0
  
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
    
    // Check which sources to fetch
    const shouldFetchPlatsbanken = currentSource.value === 'all' || currentSource.value === 'platsbanken'
    const shouldFetchTeamtailor = currentSource.value === 'all' || currentSource.value === 'teamtailor'
    
    // STEP 1: Fetch Platsbanken first (fast)
    if (shouldFetchPlatsbanken) {
      const platsbankenParams = new URLSearchParams(params)
      platsbankenParams.append('source', 'platsbanken')
      
      const platsbankenResponse = await $fetch(`/api/jobs/combined?${platsbankenParams.toString()}`)
      
      if (platsbankenResponse.success) {
        if (append) {
          jobs.value.push(...platsbankenResponse.data.jobs)
          console.log(`Loaded ${platsbankenResponse.data.jobs.length} more Platsbanken jobs (total: ${jobs.value.length})`)
        } else {
          jobs.value = platsbankenResponse.data.jobs
          currentOffset.value = 0
          console.log(`Initial load: ${platsbankenResponse.data.jobs.length} Platsbanken jobs`)
        }
        platsbankenTotal = platsbankenResponse.data.total
        totalJobs.value = platsbankenTotal
      }
    } else {
      // If not fetching platsbanken, reset jobs
      if (!append) {
        jobs.value = []
        currentOffset.value = 0
        totalJobs.value = 0
      }
    }
    
    loading.value = false
    
    // STEP 2: Fetch TeamTailor in background (slower)
    if (shouldFetchTeamtailor) {
      teamtailorLoading.value = true
      
      const teamtailorParams = new URLSearchParams(params)
      teamtailorParams.append('source', 'teamtailor')
      
      try {
        const teamtailorResponse = await $fetch(`/api/jobs/combined?${teamtailorParams.toString()}`)
        
        if (teamtailorResponse.success) {
          // Merge TeamTailor jobs with existing jobs
          const existingIds = new Set(jobs.value.map(j => j.id))
          const newJobs = teamtailorResponse.data.jobs.filter((j: SimpleJob) => !existingIds.has(j.id))
          
          jobs.value.push(...newJobs)
          totalJobs.value = platsbankenTotal + teamtailorResponse.data.total
          
          console.log(`Loaded ${newJobs.length} TeamTailor jobs (total: ${jobs.value.length}, available: ${totalJobs.value})`)
          
          // Sort by publication date (newest first)
          jobs.value.sort((a, b) => {
            const dateA = new Date(a.publicationDate).getTime()
            const dateB = new Date(b.publicationDate).getTime()
            return dateB - dateA
          })
        }
      } catch (error) {
        console.error('Error fetching TeamTailor jobs:', error)
      } finally {
        teamtailorLoading.value = false
        teamtailorLoaded.value = true
      }
    } else {
      teamtailorLoaded.value = true
    }
    
  } catch (error) {
    console.error('Error fetching jobs:', error)
    loading.value = false
  }
}

// Load more jobs function
const loadMoreJobs = () => {
  if (loading.value || !hasMoreJobs.value) return
  currentOffset.value += jobsPerPage
  console.log('Loading more jobs, new offset:', currentOffset.value)
  fetchJobs(true)
}

// Initial load and watchers
onMounted(() => {
  fetchJobs()
})

// Watch for filter changes with debounce to prevent multiple simultaneous calls
let debounceTimer: NodeJS.Timeout | null = null
watch([searchTerm, currentFilters, currentSource], () => {
  // Clear any pending fetch
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  
  // Debounce to prevent multiple rapid calls
  debounceTimer = setTimeout(() => {
    fetchJobs()
    debounceTimer = null
  }, 300)
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
  width: 100%;
  border: 1px solid black;
  background-color: white;
  margin: 0 0 0 0;
  display: flex;
  align-items: stretch;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
}

/* Diagonal background - blends green and white */
.results-bar::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: background 0.3s ease;
  z-index: 1;
}

/* Left side active - diagonal white from left, green on right */
.results-bar.left-active::before {
  background: linear-gradient(
    45deg,
    white 0%,
    white 70%,
    #1D6453 30%,
    #1D6453 100%
  );
}

/* Right side active - diagonal green on left, white from right */
.results-bar.right-active::before {
  background: linear-gradient(
    135deg,
    #1D6453 0%,
    #1D6453 70%,
    white 30%,
    white 100%
  );
}

.results-bar-section {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  box-sizing: border-box;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  background-color: transparent;
  z-index: 2;
}

.results-bar-section.left-section {
  flex: 3;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.results-bar-section.right-section {
  flex: 1;
  justify-content: center;
  min-width: 250px;
}

/* Active section - dark text on white background */
.results-bar-section.active .results-count,
.results-bar-section.active .sort-label {
  color: #333;
}

.results-bar-section.active .matched-tab-btn {
  color: #333;
}

/* Inactive section on green background - white text */
.results-bar.left-active .right-section .matched-tab-btn,
.results-bar.right-active .left-section .results-count,
.results-bar.right-active .left-section .sort-label {
  color: white;
}

.results-bar-section.active .sort-select {
  background-color: white;
  border-color: #333;
  color: #333;
}

.results-bar-section.active .filter-tag {
  background-color: #1D6453;
  color: white;
  border-color: #1D6453;
}

.results-bar-section.active .filter-remove {
  color: white;
}

.results-bar-section.active .source-filter-btn {
  background-color: rgba(29, 100, 83, 0.2);
  color: #333;
  border-color: rgba(29, 100, 83, 0.3);
}

.results-bar-section.active .source-filter-btn:hover {
  background-color: rgba(29, 100, 83, 0.3);
}

.results-bar-section.active .source-filter-btn.active {
  background-color: #1D6453;
  color: white;
  border-color: #1D6453;
}

/* Inactive section source filter buttons on green background */
.results-bar.right-active .left-section .source-filter-btn {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
}

.results-bar.right-active .left-section .source-filter-btn.active {
  background-color: white;
  color: #1D6453;
  border-color: white;
}

.results-bar.right-active .left-section .filter-tag {
  background-color: rgba(255, 255, 255, 0.9);
  color: #1D6453;
  border-color: rgba(255, 255, 255, 0.9);
}

.results-bar.right-active .left-section .filter-remove {
  color: #1D6453;
}

.results-bar.left-active .right-section .matched-count {
  color: white;
  background-color: rgba(255, 255, 255, 0.2);
}

.results-bar.right-active .right-section .matched-count {
  color: #333;
  background-color: rgba(29, 100, 83, 0.15);
}

.matched-section-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.matched-tab-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  background: none;
  border: none;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.matched-tab-btn svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.matched-tab-btn:hover {
  opacity: 0.8;
}

.matched-count {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #333;
  background-color: rgba(29, 100, 83, 0.15);
  padding: 4px 12px;
  border-radius: 12px;
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
  font-size: 12px;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 6px;
  border: 2px solid transparent;
  background-color: white;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  min-height: 32px;
}

.source-filter-btn svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
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

/* Sort Controls Bar */
.sort-controls-bar {
  width: 100%;
  background-color: white;
  border: 1px solid black;
  border-top: none;
  padding: 8px 16px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  margin-bottom: 6px;
}

.sort-controls-bar .sort-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Date Filter Bar */
.date-filter-bar {
  width: 100%;
  background-color: white;
  border: 1px solid black;
  border-top: none;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 24px;
  box-sizing: border-box;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.date-filter-label {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
}

.date-filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.location-filter-input {
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative;
}

.location-input {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  padding: 6px 32px 6px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  background-color: white;
  color: #333;
  min-width: 200px;
  transition: all 0.2s ease;
}

.location-input:focus {
  outline: none;
  border-color: #116A3E;
  box-shadow: 0 0 0 2px rgba(17, 106, 62, 0.1);
}

.location-input::placeholder {
  color: #94a3b8;
}

.clear-location-btn {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.clear-location-btn:hover {
  background-color: #f1f5f9;
  color: #334155;
}

.date-filter-btn {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 6px;
  border: 2px solid #e2e8f0;
  background-color: white;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.date-filter-btn:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
  color: #334155;
}

.date-filter-btn.active {
  background-color: #116A3E;
  color: white;
  border-color: #116A3E;
  font-weight: 600;
}

.date-filter-btn.active:hover {
  background-color: #0f5d36;
  border-color: #0f5d36;
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

.platsbanken-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  margin: 16px 0;
  background-color: #ecfdf5;
  border: 2px dashed #10b981;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: #047857;
  font-weight: 500;
}

.platsbanken-loading .loading-spinner {
  border-color: #a7f3d0;
  border-top-color: #10b981;
}

.no-jobs-message {
  text-align: center;
  margin: 20px 0;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
}

.teamtailor-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  margin: 16px 0;
  background-color: #f8f4ff;
  border: 2px dashed #8b5cf6;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: #6d28d9;
  font-weight: 500;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid #e9d5ff;
  border-top-color: #8b5cf6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.load-more-container {
  display: flex;
  justify-content: center;
  margin: 24px 0;
}

.load-more-btn {
  padding: 12px 32px;
  background-color: #1D6453;
  color: white;
  border: none;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.load-more-btn:hover:not(:disabled) {
  background-color: #155242;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(29, 100, 83, 0.2);
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.matched-jobs-section {
  margin: 24px 0;
}

.matched-jobs-info {
  text-align: center;
  padding: 16px 24px;
  margin-bottom: 16px;
  background-color: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 8px;
}

.matched-jobs-info p {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #166534;
  margin: 0;
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
    margin: 0 0 0 0;
    flex-direction: column;
    align-items: stretch;
  }
  
  .results-bar::before {
    display: none;
  }
  
  .results-bar-section {
    border-right: none;
    border-bottom: 1px solid black;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 12px;
  }
  
  .results-bar-section:last-child {
    border-bottom: none;
  }
  
  .results-bar-section.left-section,
  .results-bar-section.right-section {
    flex: 1;
    min-width: auto;
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
  
  .sort-controls-bar {
    padding: 8px 12px;
    margin-bottom: 1rem;
  }
  
  .sort-controls-bar .sort-controls {
    width: 100%;
    justify-content: space-between;
  }
  
  .date-filter-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 1rem;
  }
  
  .filter-group {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .date-filter-buttons {
    width: 100%;
  }
  
  .date-filter-btn {
    flex: 1;
    min-width: calc(50% - 4px);
  }
  
  .location-input {
    width: 100%;
    min-width: auto;
  }
  
  .matched-section-content {
    width: 100%;
    align-items: flex-start;
  }
  
  .source-filter-btn {
    font-size: 11px;
    padding: 4px 8px;
  }
  
  .source-filter-btn svg {
    width: 12px;
    height: 12px;
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