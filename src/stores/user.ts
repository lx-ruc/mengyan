import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { loadFromStorage, saveToStorage } from '@/utils/storage'
import { getToday, formatDate } from '@/utils/date'

const STORAGE_KEY = 'dream_verify_user'

interface UserData {
  nickname: string
  streak: number
  totalDreams: number
  totalRealities: number
  lastRecordDate: string
}

function load(): UserData {
  return loadFromStorage<UserData>(STORAGE_KEY, {
    nickname: '梦境探索者',
    streak: 0,
    totalDreams: 0,
    totalRealities: 0,
    lastRecordDate: '',
  })
}

export const useUserStore = defineStore('user', () => {
  const data = ref<UserData>(load())

  function persist(): void {
    saveToStorage(STORAGE_KEY, data.value)
  }

  const nickname = computed(() => data.value.nickname)
  const streak = computed(() => data.value.streak)
  const totalDreams = computed(() => data.value.totalDreams)
  const totalRealities = computed(() => data.value.totalRealities)

  const level = computed(() => {
    const t = data.value.totalDreams
    if (t >= 100) return 5
    if (t >= 50) return 4
    if (t >= 20) return 3
    if (t >= 7) return 2
    return 1
  })

  const levelTitle = computed(() => {
    const titles = ['', '梦境新手', '梦验学徒', '解梦行者', '验梦大师', '潜意识领航员']
    return titles[level.value]
  })

  function setNickname(name: string): void {
    data.value.nickname = name
    persist()
  }

  function incrementDreams(): void {
    data.value.totalDreams++
    data.value.lastRecordDate = getToday()
    persist()
  }

  function incrementRealities(): void {
    data.value.totalRealities++
    persist()
  }

  function updateStreak(dates: string[]): void {
    if (dates.length === 0) {
      data.value.streak = 0
      persist()
      return
    }
    const sorted = [...dates].sort().reverse()
    const today = getToday()
    let count = 0
    let checking = today
    for (const d of sorted) {
      if (d === checking) {
        count++
        // 安全地减一天
        const parts = checking.split('-')
        const dt = new Date(+parts[0], +parts[1] - 1, +parts[2])
        dt.setDate(dt.getDate() - 1)
        checking = formatDate(dt.getTime())
      } else if (d < checking) {
        break
      }
    }
    data.value.streak = count
    persist()
  }

  return {
    data,
    nickname,
    streak,
    totalDreams,
    totalRealities,
    level,
    levelTitle,
    setNickname,
    incrementDreams,
    incrementRealities,
    updateStreak,
  }
})
