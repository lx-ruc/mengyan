import { computed } from 'vue'
import { getGreetingPeriod } from '@/utils/date'

export interface ThemeColors {
  accent: string
  accentBg: string
  accentGlow: string
  gradientStart: string
  gradientEnd: string
}

const DAY_THEME: ThemeColors = {
  accent: '#FFD700',
  accentBg: 'rgba(255, 215, 0, 0.1)',
  accentGlow: 'rgba(255, 215, 0, 0.3)',
  gradientStart: '#FFD700',
  gradientEnd: '#FFA000',
}

const NIGHT_THEME: ThemeColors = {
  accent: '#B388FF',
  accentBg: 'rgba(123, 45, 142, 0.12)',
  accentGlow: 'rgba(123, 45, 142, 0.3)',
  gradientStart: '#7B2D8E',
  gradientEnd: '#4A1D8E',
}

export function useTheme() {
  const period = computed(() => getGreetingPeriod())

  const isDaytime = computed(() => {
    return period.value === 'morning' || period.value === 'afternoon'
  })

  const colors = computed<ThemeColors>(() => {
    return isDaytime.value ? DAY_THEME : NIGHT_THEME
  })

  const cssVars = computed(() => ({
    '--theme-accent': colors.value.accent,
    '--theme-accent-bg': colors.value.accentBg,
    '--theme-accent-glow': colors.value.accentGlow,
    '--theme-gradient-start': colors.value.gradientStart,
    '--theme-gradient-end': colors.value.gradientEnd,
  }))

  return { period, isDaytime, colors, cssVars }
}
