<template>
  <Teleport to="body">
    <Transition name="toast" appear>
      <div v-if="visible" :class="toastClasses">
        <div class="toast-icon">
          <svg v-if="type === 'success'" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          </svg>
          <svg v-else-if="type === 'error'" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
            <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
          </svg>
          <svg v-else-if="type === 'warning'" viewBox="0 0 24 24" fill="none">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="2"/>
            <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2"/>
            <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
            <line x1="12" y1="8" x2="12.01" y2="8" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        
        <div class="toast-content">
          <h4 v-if="title" class="toast-title">{{ title }}</h4>
          <p class="toast-message">{{ message }}</p>
        </div>
        
        <button @click="close" class="toast-close">
          <svg viewBox="0 0 24 24" fill="none">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface Props {
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
  persistent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 5000,
  persistent: false
})

const emit = defineEmits<{
  close: []
}>()

const visible = ref(true)

const toastClasses = computed(() => [
  'toast',
  `toast-${props.type}`
])

let timeoutId: NodeJS.Timeout | null = null

onMounted(() => {
  if (!props.persistent && props.duration > 0) {
    timeoutId = setTimeout(() => {
      close()
    }, props.duration)
  }
})

function close() {
  visible.value = false
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  setTimeout(() => {
    emit('close')
  }, 300) // Wait for transition to complete
}
</script>

<style scoped>
.toast {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  min-width: 300px;
  max-width: 500px;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.toast-success {
  background-color: rgba(34, 197, 94, 0.95);
  color: white;
}

.toast-error {
  background-color: rgba(239, 68, 68, 0.95);
  color: white;
}

.toast-warning {
  background-color: rgba(245, 158, 11, 0.95);
  color: white;
}

.toast-info {
  background-color: rgba(59, 130, 246, 0.95);
  color: white;
}

.toast-icon {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  margin-top: 0.125rem;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  margin: 0 0 0.25rem 0;
}

.toast-message {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.4;
}

.toast-close {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  background: none;
  border: none;
  color: currentColor;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.toast-close:hover {
  opacity: 1;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@media (max-width: 640px) {
  .toast {
    left: 1rem;
    right: 1rem;
    min-width: auto;
    max-width: none;
  }
}
</style>
