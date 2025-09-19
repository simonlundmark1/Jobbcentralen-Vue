import { ref } from 'vue'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
  persistent?: boolean
}

const notifications = ref<Notification[]>([])

export const useNotifications = () => {
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const newNotification: Notification = {
      id,
      ...notification
    }
    
    notifications.value.push(newNotification)
    return id
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearAll = () => {
    notifications.value = []
  }

  // Convenience methods
  const success = (message: string, title?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'success',
      message,
      title,
      ...options
    })
  }

  const error = (message: string, title?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'error',
      message,
      title,
      persistent: true, // Errors should be persistent by default
      ...options
    })
  }

  const warning = (message: string, title?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'warning',
      message,
      title,
      ...options
    })
  }

  const info = (message: string, title?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'info',
      message,
      title,
      ...options
    })
  }

  return {
    notifications: readonly(notifications),
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  }
}
