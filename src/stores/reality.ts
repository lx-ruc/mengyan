import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { loadFromStorage, saveToStorage } from '@/utils/storage'
import { getToday } from '@/utils/date'

const STORAGE_KEY = 'dream_verify_realities'

interface RealityData {
  id: string
  dreamId: string
  date: string
  eventTags: string[]
  content: string
  selfScore: number
  aiScore?: number
  finalScore?: number
  aiComment?: string
  createdAt: number
}

function load(): RealityData[] {
  return loadFromStorage<RealityData[]>(STORAGE_KEY, [])
}

export const useRealityStore = defineStore('reality', () => {
  const records = ref<RealityData[]>(load())

  function persist(): void {
    saveToStorage(STORAGE_KEY, records.value)
  }

  const todayReality = computed(() =>
    records.value.find(r => r.date === getToday()),
  )

  function getRealityByDreamId(dreamId: string): RealityData | undefined {
    return records.value.find(r => r.dreamId === dreamId)
  }

  function getRealityById(id: string): RealityData | undefined {
    return records.value.find(r => r.id === id)
  }

  function addReality(record: RealityData): void {
    records.value.push({ ...record })
    persist()
  }

  function updateReality(id: string, patch: Partial<RealityData>): void {
    const idx = records.value.findIndex(r => r.id === id)
    if (idx !== -1) {
      records.value[idx] = { ...records.value[idx], ...patch }
      persist()
    }
  }

  function clearAll(): void {
    records.value = []
    persist()
  }

  function deleteReality(id: string): void {
    records.value = records.value.filter(r => r.id !== id)
    persist()
  }

  return {
    records,
    todayReality,
    addReality,
    updateReality,
    clearAll,
    deleteReality,
    getRealityByDreamId,
    getRealityById,
  }
})
