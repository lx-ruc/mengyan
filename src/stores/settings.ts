import { ref } from 'vue'
import { defineStore } from 'pinia'
import { loadFromStorage, saveToStorage } from '@/utils/storage'

const STORAGE_KEY = 'dream_verify_settings'

interface Settings {
  notificationEnabled: boolean
  soundEnabled: boolean
}

function load(): Settings {
  return loadFromStorage<Settings>(STORAGE_KEY, {
    notificationEnabled: true,
    soundEnabled: true,
  })
}

export const useSettingsStore = defineStore('settings', () => {
  const notificationEnabled = ref(load().notificationEnabled)
  const soundEnabled = ref(load().soundEnabled)

  function persist(): void {
    saveToStorage(STORAGE_KEY, {
      notificationEnabled: notificationEnabled.value,
      soundEnabled: soundEnabled.value,
    })
  }

  function setNotificationEnabled(value: boolean): void {
    notificationEnabled.value = value
    persist()
  }

  function setSoundEnabled(value: boolean): void {
    soundEnabled.value = value
    persist()
  }

  return {
    notificationEnabled,
    soundEnabled,
    setNotificationEnabled,
    setSoundEnabled,
  }
})
