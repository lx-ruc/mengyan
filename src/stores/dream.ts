import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { loadFromStorage, saveToStorage } from '@/utils/storage'
import { getToday } from '@/utils/date'
import type { DreamAnalysis } from '@/types/dream'

const STORAGE_KEY = 'dream_verify_dreams'

interface DreamData {
  id: string
  date: string
  content: string
  voiceUrl?: string
  tags: string[]
  emotion: string
  clarity: number
  isRecurring: boolean
  keywords: string[]
  aiAnalysis?: DreamAnalysis
  realityMatchScore?: number
  realityId?: string
  createdAt: number
}

function load(): DreamData[] {
  return loadFromStorage<DreamData[]>(STORAGE_KEY, [])
}

export const useDreamStore = defineStore('dream', () => {
  const records = ref<DreamData[]>(load())

  function persist(): void {
    saveToStorage(STORAGE_KEY, records.value)
  }

  const todayDream = computed(() =>
    records.value.find(r => r.date === getToday()),
  )

  const recentDreams = computed(() =>
    [...records.value].sort((a, b) => b.createdAt - a.createdAt).slice(0, 10),
  )

  const dreamsByDate = computed<Record<string, DreamData[]>>(() => {
    const map: Record<string, DreamData[]> = {}
    for (const r of records.value) {
      if (!map[r.date]) map[r.date] = []
      map[r.date].push(r)
    }
    return map
  })

  function addDream(record: DreamData): void {
    records.value.push({ ...record })
    persist()
  }

  function updateDream(id: string, patch: Partial<DreamData>): void {
    const idx = records.value.findIndex(r => r.id === id)
    if (idx !== -1) {
      records.value[idx] = { ...records.value[idx], ...patch }
      persist()
    }
  }

  function updateDreamAnalysis(id: string, analysis: DreamAnalysis, keywords: string[]): void {
    updateDream(id, { aiAnalysis: analysis, keywords })
  }

  function clearAll(): void {
    records.value = []
    persist()
  }

  function deleteDream(id: string): void {
    records.value = records.value.filter(r => r.id !== id)
    persist()
  }

  function getDreamById(id: string): DreamData | undefined {
    return records.value.find(r => r.id === id)
  }

  return {
    records,
    todayDream,
    recentDreams,
    dreamsByDate,
    addDream,
    updateDream,
    updateDreamAnalysis,
    clearAll,
    deleteDream,
    getDreamById,
  }
})
