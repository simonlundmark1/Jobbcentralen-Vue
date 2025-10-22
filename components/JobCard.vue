<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow-soft hover:shadow-medium transition-shadow duration-200 p-6">
    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between">
      <!-- Main Content -->
      <div class="flex-1">
        <!-- Job Title with Source Badge -->
        <div class="flex items-start justify-between gap-2 mb-2">
          <h3 class="text-lg font-semibold text-gray-900 flex-1">
            <a 
              :href="applicationUrl" 
              target="_blank" 
              rel="noopener noreferrer"
              class="hover:text-primary-600 transition-colors duration-200"
            >
              {{ job.title }}
            </a>
          </h3>
          <span 
            v-if="jobSource"
            :class="[
              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap',
              jobSource === 'teamtailor' 
                ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            ]"
          >
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path v-if="jobSource === 'teamtailor'" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"/>
              <path v-else d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
              <path v-else d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
            </svg>
            {{ jobSource === 'teamtailor' ? 'TeamTailor' : 'Platsbanken' }}
          </span>
        </div>

        <!-- Company and Location -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
          <div class="flex items-center text-gray-600 text-sm">
            <svg class="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m11 0a2 2 0 01-2 2H7a2 2 0 01-2-2m2-2h2m8-2V9a2 2 0 00-2-2H9a2 2 0 00-2 2v8.8"/>
            </svg>
            <span class="font-medium">{{ job.company }}</span>
          </div>
          
          <div class="flex items-center text-gray-600 text-sm">
            <svg class="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span>{{ job.location }}</span>
          </div>
        </div>

        <!-- Job Description Preview -->
        <div class="text-gray-700 mb-4">
          <p class="line-clamp-3">
            {{ truncatedDescription }}
          </p>
          <button 
            v-if="job.description.length > 200"
            @click="toggleExpanded"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium mt-1"
          >
            {{ expanded ? 'Visa mindre' : 'Läs mer' }}
          </button>
        </div>

        <!-- Job Tags -->
        <div class="flex flex-wrap gap-2 mb-4">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            {{ job.employmentType }}
          </span>
          
          <span v-if="job.salary" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {{ job.salary }}
          </span>
          
          <span v-if="job.workingHours" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {{ job.workingHours }}
          </span>
          
          <span v-if="!job.experienceRequired" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Ingen erfarenhet krävs
          </span>
        </div>

        <!-- Publication Date -->
        <div class="text-sm text-gray-500">
          Publicerad {{ formatDate(job.publicationDate) }}
          <span v-if="job.applicationDeadline && !isDeadlinePassed" class="ml-2">
            • Ansök senast {{ formatDate(job.applicationDeadline) }}
          </span>
          <span v-else-if="isDeadlinePassed" class="ml-2 text-red-600 font-medium">
            • Ansökningstid utgången
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-4 sm:mt-0 sm:ml-6 flex-shrink-0">
        <div class="flex flex-col gap-2">
          <a
            :href="applicationUrl"
            target="_blank"
            rel="noopener noreferrer"
            :class="[
              'inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white transition-colors duration-200',
              isDeadlinePassed 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            ]"
            :aria-disabled="isDeadlinePassed"
          >
            <svg class="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
            {{ isDeadlinePassed ? 'Stängd' : 'Ansök' }}
          </a>
          
          <button
            @click="saveJob"
            class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            <svg class="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            Spara
          </button>
        </div>
      </div>
    </div>

    <!-- Expanded Description -->
    <div v-if="expanded" class="mt-4 pt-4 border-t border-gray-200">
      <div class="prose prose-sm max-w-none text-gray-700">
        <div v-html="formattedDescription"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SimpleJob } from '../types/platsbanken'

interface Props {
  job: SimpleJob & { source?: string }
}

const props = defineProps<Props>()

const jobSource = computed(() => {
  return (props.job as any).source || null
})

const expanded = ref(false)

// Computed properties
const truncatedDescription = computed(() => {
  if (expanded.value || props.job.description.length <= 200) {
    return props.job.description
  }
  return props.job.description.substring(0, 200) + '...'
})

const formattedDescription = computed(() => {
  return props.job.description.replace(/\n/g, '<br>')
})

const applicationUrl = computed(() => {
  return props.job.applicationUrl || 
         `mailto:${props.job.applicationEmail}?subject=Ansökan - ${props.job.title}` ||
         `https://arbetsformedlingen.se/for-arbetssokande/hitta-jobb/platsbanken/annonser/${props.job.id}`
})

const isDeadlinePassed = computed(() => {
  if (!props.job.applicationDeadline) return false
  return new Date(props.job.applicationDeadline) < new Date()
})

// Methods
const toggleExpanded = () => {
  expanded.value = !expanded.value
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  })
}

const saveJob = () => {
  // TODO: Implement job saving functionality
  console.log('Saving job:', props.job.id)
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-clamp: 3;
  overflow: hidden;
}

.prose p {
  margin-bottom: 1rem;
}

.prose:last-child p:last-child {
  margin-bottom: 0;
}
</style>
