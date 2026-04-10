import { computed } from 'vue'
import { getGreetingPeriod, type GreetingPeriod } from '@/utils/date'

export type BackgroundType = 'starry' | 'dawn' | 'daytime'

export function useTimeGreeting() {
  const period = computed<GreetingPeriod>(() => getGreetingPeriod())

  const greeting = computed(() => {
    switch (period.value) {
      case 'morning': return '早安，昨晚做了什么梦？'
      case 'afternoon': return '今天有没有什么特别的梦或事？'
      case 'evening': return '夜深了，今天发生了什么？'
      case 'night': return '深夜了，今天有什么值得记录的？'
    }
  })

  const backgroundType = computed<BackgroundType>(() => {
    switch (period.value) {
      case 'morning': return 'dawn'
      case 'afternoon': return 'daytime'
      case 'evening': return 'starry'
      case 'night': return 'starry'
    }
  })

  const mode = computed<'dream' | 'reality' | 'both'>(() => {
    switch (period.value) {
      case 'morning': return 'dream'
      case 'afternoon': return 'both'
      case 'evening': return 'reality'
      case 'night': return 'reality'
    }
  })

  const buttonText = computed(() => {
    switch (mode.value) {
      case 'dream': return '记录梦境'
      case 'reality': return '记录今天发生的事'
      case 'both': return '记录'
    }
  })

  const periodIcon = computed(() => {
    switch (period.value) {
      case 'morning': return '🌅'
      case 'afternoon': return '☀️'
      case 'evening': return '🌙'
      case 'night': return '✨'
    }
  })

  return {
    period,
    greeting,
    backgroundType,
    mode,
    buttonText,
    periodIcon,
  }
}
