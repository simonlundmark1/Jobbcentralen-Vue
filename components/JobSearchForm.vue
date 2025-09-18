<template>
  <div class="bg-white rounded-lg shadow-large p-6">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Search Query Input -->
        <div class="flex-1">
          <label for="search" class="sr-only">Sök jobb</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              placeholder="Yrke, arbetsgivare eller sökord..."
              class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
            />
          </div>
        </div>

        <!-- Location Input -->
        <div class="flex-1 sm:flex-none sm:w-64">
          <label for="location" class="sr-only">Plats</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <input
              id="location"
              v-model="location"
              type="text"
              placeholder="Stad eller kommun..."
              class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
            />
          </div>
        </div>

        <!-- Search Button -->
        <button
          type="submit"
          :disabled="loading"
          class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-3 w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-if="loading">Söker...</span>
          <span v-else>Sök jobb</span>
        </button>
      </div>

      <!-- Quick Filter Chips -->
      <div class="flex flex-wrap gap-2 pt-2">
        <span class="text-sm text-gray-600">Populära sökningar:</span>
        <button
          v-for="quickSearch in quickSearches"
          :key="quickSearch"
          type="button"
          @click="handleQuickSearch(quickSearch)"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
        >
          {{ quickSearch }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
interface Props {
  loading?: boolean
}

interface Emits {
  (e: 'search', query: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const searchQuery = ref('')
const location = ref('')

const quickSearches = [
  'Utvecklare',
  'Säljare', 
  'Lärare',
  'Sjuksköterska',
  'Ekonomi',
  'Marknad',
  'Design',
  'IT-support'
]

const handleSubmit = () => {
  const query = buildSearchQuery()
  emit('search', query)
}

const handleQuickSearch = (term: string) => {
  searchQuery.value = term
  const query = buildSearchQuery()
  emit('search', query)
}

const buildSearchQuery = () => {
  const parts: string[] = []
  if (searchQuery.value.trim()) {
    parts.push(searchQuery.value.trim())
  }
  if (location.value.trim()) {
    parts.push(location.value.trim())
  }
  return parts.join(' ')
}

// Auto-trigger search on Enter key
onMounted(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && (event.target as HTMLElement).tagName !== 'BUTTON') {
      handleSubmit()
    }
  }
  document.addEventListener('keydown', handleKeyDown)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })
})
</script>
