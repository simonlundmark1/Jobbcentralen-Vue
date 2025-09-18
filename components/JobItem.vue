<template>
  <NuxtLink :to="`/job/${job.id}`" class="job-link">
    <div class="job-container" :style="jobStyle">
      <div class="inner-div"></div>
      <div class="top-left-box" :style="topLeftBoxStyle">
        <div class="inner-top-left-bar" :style="innerTopLeftBarStyle"></div>
        <div class="inner-text">
          <p class="job-title">{{ job.headline }}</p>
          <p class="location-text">{{ displayLocation }}</p>
        </div>
      </div>
      <p class="employer-text">{{ job.employer?.name }}</p>
      <p class="deadline-text">Sista ansökningsdatum: {{ formatDate(job.application_deadline) }}</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Job {
  id: string | number
  headline?: string
  employer?: {
    name?: string
  }
  application_deadline?: string
  workplace_address?: {
    city?: string
    municipality?: string
    country?: string
  }
  description?: {
    text: string
  }
  occupation?: { label?: string }
  occupation_field?: { label?: string }
  working_hours_type?: { label?: string }
}

interface Props {
  job: Job
  index: number
  isEven: boolean
}

const props = defineProps<Props>()

const greenShade = computed(() => 120 - (props.index * 10))

const jobStyle = computed(() => ({
  height: '135px',
  width: '100%',
  border: '1px solid black',
  backgroundColor: props.isEven ? '#F8F8F8' : '#F8F8F8',
  boxSizing: 'border-box' as const,
  margin: '0 0 6px 0',
  position: 'relative' as const,
}))

const topLeftBoxStyle = computed(() => ({
  height: '40px',
  width: '98.5%',
  position: 'absolute' as const,
  top: '12px',
  left: '6px',
  border: '1px solid black',
  whiteSpace: 'nowrap' as const,
  backgroundColor: `rgb(29, ${greenShade.value}, 83)`,
}))

const innerTopLeftBarStyle = computed(() => ({
  height: '6px',
  backgroundColor: `rgb(19, ${greenShade.value - 15}, 73)`,
  width: '100%',
}))

const displayLocation = computed(() => {
  return props.job.workplace_address?.municipality || 
         props.job.workplace_address?.city || 
         'Plats ej tillgänglig'
})

function formatDate(dateString?: string): string {
  if (!dateString) return 'Datum ej tillgängligt'
  
  const months = [
    'Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
    'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'
  ]

  const date = new Date(dateString)
  return `${date.getDate()} ${months[date.getMonth()]}`
}
</script>

<style scoped>
.job-link {
  text-decoration: none;
  color: inherit;
}

.job-container {
  cursor: pointer;
}

.inner-div {
  height: 6px;
  width: 100%;
  background-color: #E8E8E8;
}

.inner-text {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 16px;
  text-align: left;
  line-height: 118%;
  letter-spacing: -0.04em;
  margin-left: 6px;
  margin-top: -4px;
  color: #FFFFFF;
}

.job-title {
  margin: 0;
  padding: 0;
  position: absolute;
  bottom: 4px;
  left: 6px;
}

.location-text {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 13px;
  text-align: left;
  line-height: 118%;
  letter-spacing: -0.02em;
  position: absolute;
  top: 6px;
  left: 1px;
  color: #000000;
  margin: 1px;
  margin-top: 4rem;
}

.employer-text {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 14px;
  text-align: left;
  line-height: 118%;
  letter-spacing: -0.02em;
  margin-left: 9px;
  margin-top: 55px;
  color: #000000;
  font-weight: bold;
  margin-bottom: 0;
}

.deadline-text {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 14px;
  text-align: left;
  line-height: 118%;
  letter-spacing: -0.02em;
  margin-left: 9px;
  margin-top: 30px;
  color: grey;
  margin-bottom: 0;
}

/* Mobile-only responsive design */
@media (max-width: 768px) {
  .job-container {
    width: 100% !important;
    margin: 0 0 6px 0 !important;
    border: 1px solid black !important;
    background-color: #F8F8F8 !important;
    height: auto !important;
    padding: 0 !important;
  }
  
  .inner-div {
    height: 6px;
    width: 100%;
    background-color: #E8E8E8;
  }
  
  .top-left-box {
    position: static !important;
    width: 100% !important;
    height: auto !important;
    border: none !important;
    margin-bottom: 1rem;
  }
  
  .inner-top-left-bar {
    height: 6px;
    width: 100%;
  }
  
  .inner-text {
    margin: 0;
    padding: 1rem;
  }
  
  .job-title {
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
  }
  
  .location-text {
    margin: 0;
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }
  
  .employer-text {
    margin: 1rem 0 0.5rem 1rem;
    font-size: 1rem;
    font-weight: 600;
  }
  
  .deadline-text {
    margin: 0 0 1rem 1rem;
    font-size: 0.875rem;
  }
}
</style>
