<template>
  <div class="space-y-6">
    <!-- Location Filters -->
    <div>
      <h4 class="text-sm font-medium text-gray-900 mb-3">Plats</h4>
      <div class="space-y-3">
        <!-- Region Filter -->
        <div>
          <label for="region" class="block text-sm text-gray-700 mb-1">Län</label>
          <select
            id="region"
            v-model="localFilters.region"
            @change="handleFilterChange"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
          >
            <option value="">Alla län</option>
            <option
              v-for="region in concepts?.regions || []"
              :key="region.concept_id"
              :value="region.concept_id"
            >
              {{ region.label }}
            </option>
          </select>
        </div>

        <!-- Municipality Filter -->
        <div>
          <label for="municipality" class="block text-sm text-gray-700 mb-1">Kommun</label>
          <select
            id="municipality"
            v-model="localFilters.municipality"
            @change="handleFilterChange"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
          >
            <option value="">Alla kommuner</option>
            <option
              v-for="municipality in filteredMunicipalities"
              :key="municipality.concept_id"
              :value="municipality.concept_id"
            >
              {{ municipality.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Profession Filters -->
    <div>
      <h4 class="text-sm font-medium text-gray-900 mb-3">Yrke</h4>
      <div class="space-y-3">
        <!-- Occupation Group -->
        <div>
          <label for="occupation-group" class="block text-sm text-gray-700 mb-1">Yrkesområde</label>
          <select
            id="occupation-group"
            v-model="localFilters.occupationGroup"
            @change="handleOccupationGroupChange"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
          >
            <option value="">Alla yrkesområden</option>
            <option
              v-for="group in concepts?.occupation_groups || []"
              :key="group.concept_id"
              :value="group.concept_id"
            >
              {{ group.label }}
            </option>
          </select>
        </div>

        <!-- Specific Occupation -->
        <div>
          <label for="occupation" class="block text-sm text-gray-700 mb-1">Specifikt yrke</label>
          <select
            id="occupation"
            v-model="localFilters.occupation"
            @change="handleFilterChange"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
          >
            <option value="">Alla yrken</option>
            <option
              v-for="occupation in filteredOccupations"
              :key="occupation.concept_id"
              :value="occupation.concept_id"
            >
              {{ occupation.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Employment Type -->
    <div>
      <h4 class="text-sm font-medium text-gray-900 mb-3">Anställningsform</h4>
      <div class="space-y-2">
        <label class="flex items-center">
          <input
            type="radio"
            :value="undefined"
            v-model="localFilters.employmentType"
            @change="handleFilterChange"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
          />
          <span class="ml-2 text-sm text-gray-700">Alla typer</span>
        </label>
        <label class="flex items-center">
          <input
            type="radio"
            value="1"
            v-model="localFilters.employmentType"
            @change="handleFilterChange"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
          />
          <span class="ml-2 text-sm text-gray-700">Tillsvidare</span>
        </label>
        <label class="flex items-center">
          <input
            type="radio"
            value="2"
            v-model="localFilters.employmentType"
            @change="handleFilterChange"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
          />
          <span class="ml-2 text-sm text-gray-700">Tidsbegränsat</span>
        </label>
      </div>
    </div>

    <!-- Experience Required -->
    <div>
      <h4 class="text-sm font-medium text-gray-900 mb-3">Erfarenhet</h4>
      <div class="space-y-2">
        <label class="flex items-center">
          <input
            type="radio"
            :value="undefined"
            v-model="localFilters.experienceRequired"
            @change="handleFilterChange"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
          />
          <span class="ml-2 text-sm text-gray-700">Alla jobb</span>
        </label>
        <label class="flex items-center">
          <input
            type="radio"
            :value="false"
            v-model="localFilters.experienceRequired"
            @change="handleFilterChange"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
          />
          <span class="ml-2 text-sm text-gray-700">Ingen erfarenhet krävs</span>
        </label>
        <label class="flex items-center">
          <input
            type="radio"
            :value="true"
            v-model="localFilters.experienceRequired"
            @change="handleFilterChange"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
          />
          <span class="ml-2 text-sm text-gray-700">Erfarenhet krävs</span>
        </label>
      </div>
    </div>

    <!-- Clear Filters -->
    <div class="pt-4 border-t border-gray-200">
      <button
        @click="clearFilters"
        class="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
      >
        Rensa alla filter
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { JobFilters } from '../types/platsbanken'

interface Props {
  filters: JobFilters
  concepts?: any
}

interface Emits {
  (e: 'update:filters', filters: JobFilters): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Local reactive copy of filters
const localFilters = ref<JobFilters & { occupationGroup?: string }>({
  ...props.filters
})

// Computed for filtered municipalities based on selected region
const filteredMunicipalities = computed(() => {
  if (!props.concepts?.municipalities) return []
  
  if (!localFilters.value.region) {
    return props.concepts.municipalities.slice(0, 50) // Limit for performance
  }
  
  // Note: In a real implementation, you'd need to map municipalities to regions
  // For now, just return all municipalities
  return props.concepts.municipalities.slice(0, 50)
})

// Computed for filtered occupations based on selected group
const filteredOccupations = computed(() => {
  if (!props.concepts?.occupations) return []
  
  if (!localFilters.value.occupationGroup) {
    return props.concepts.occupations.slice(0, 100) // Limit for performance
  }
  
  // Note: In a real implementation, you'd filter occupations by group
  // For now, just return all occupations
  return props.concepts.occupations.slice(0, 100)
})

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })

const handleFilterChange = () => {
  // Remove occupationGroup from emitted filters (it's just for UI)
  const { occupationGroup, ...filtersToEmit } = localFilters.value
  emit('update:filters', filtersToEmit)
}

const handleOccupationGroupChange = () => {
  // Clear specific occupation when group changes
  localFilters.value.occupation = undefined
  handleFilterChange()
}

const clearFilters = () => {
  localFilters.value = {}
  handleFilterChange()
}
</script>
