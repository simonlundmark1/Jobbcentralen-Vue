<template>
  <div v-if="matchScore > 0" class="match-badge" :class="matchCategory.label.toLowerCase().replace(' ', '-')">
    <div class="match-score">
      <span class="match-percentage">{{ Math.round(matchCategory.percentage) }}%</span>
      <span class="match-label">{{ matchCategory.label }}</span>
    </div>
    <div v-if="showReasons && matchReasons.length > 0" class="match-reasons">
      <span 
        v-for="reason in matchReasons.slice(0, 3)" 
        :key="reason" 
        class="match-reason"
      >
        {{ reason }}
      </span>
      <span v-if="matchReasons.length > 3" class="more-reasons">
        +{{ matchReasons.length - 3 }} till
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getMatchCategory } from '../utils/jobMatcher'

interface Props {
  matchScore: number
  matchReasons?: string[]
  showReasons?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  matchReasons: () => [],
  showReasons: false
})

const matchCategory = computed(() => getMatchCategory(props.matchScore))
</script>

<style scoped>
.match-badge {
  display: inline-flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  min-width: 80px;
}

.match-badge.utmärkt-match {
  background-color: #1D6453;
  color: white;
}

.match-badge.bra-match {
  background-color: #059669;
  color: white;
}

.match-badge.okej-match {
  background-color: #D97706;
  color: white;
}

.match-badge.svag-match {
  background-color: #DC2626;
  color: white;
}

.match-badge.ingen-match {
  background-color: #6B7280;
  color: white;
}

.match-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
}

.match-percentage {
  font-weight: bold;
  font-size: 0.875rem;
}

.match-label {
  font-size: 0.625rem;
  opacity: 0.9;
}

.match-reasons {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  margin-top: 0.25rem;
  padding-top: 0.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.match-reason {
  font-size: 0.625rem;
  opacity: 0.8;
}

.more-reasons {
  font-size: 0.625rem;
  opacity: 0.6;
  font-style: italic;
}
</style>
