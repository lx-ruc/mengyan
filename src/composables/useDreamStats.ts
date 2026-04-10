import { computed } from 'vue'
import type { DreamRecord } from '@/types/dream'
import type { RealityRecord } from '@/types/reality'
import { EmotionLabel, type Emotion } from '@/types/dream'
import { getToday } from '@/utils/date'

export function useDreamStats(
  dreams: () => DreamRecord[],
  realities: () => RealityRecord[],
) {
  const totalDreams = computed(() => dreams().length)
  const totalRealities = computed(() => realities().length)

  /** 计算连续打卡天数 */
  const streak = computed(() => {
    const ds = dreams()
    if (ds.length === 0) return 0
    const dates = [...new Set(ds.map(d => d.date))].sort().reverse()
    const today = getToday()
    let count = 0
    let checkDate = today
    for (const d of dates) {
      if (d === checkDate) {
        count++
        const parts = checkDate.split('-')
        const dt = new Date(+parts[0], +parts[1] - 1, +parts[2])
        dt.setDate(dt.getDate() - 1)
        const y = dt.getFullYear()
        const m = String(dt.getMonth() + 1).padStart(2, '0')
        const day = String(dt.getDate()).padStart(2, '0')
        checkDate = `${y}-${m}-${day}`
      } else if (d < checkDate) {
        break
      }
    }
    return count
  })

  /** 平均吻合度 */
  const avgMatchScore = computed(() => {
    const rs = realities().filter(r => r.finalScore != null)
    if (rs.length === 0) return 0
    return rs.reduce((sum, r) => sum + (r.finalScore ?? 0), 0) / rs.length
  })

  /** 情绪分布 */
  const emotionDistribution = computed<Record<string, number>>(() => {
    const dist: Record<string, number> = {}
    for (const d of dreams()) {
      const label = EmotionLabel[d.emotion as Emotion] ?? d.emotion
      dist[label] = (dist[label] || 0) + 1
    }
    return dist
  })

  /** 热门关键词 */
  const topKeywords = computed<{ word: string; count: number }[]>(() => {
    const map: Record<string, number> = {}
    for (const d of dreams()) {
      for (const kw of d.keywords) {
        map[kw] = (map[kw] || 0) + 1
      }
    }
    return Object.entries(map)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15)
  })

  /** 月度梦境频次 */
  const monthlyFrequency = computed<Record<string, number>>(() => {
    const freq: Record<string, number> = {}
    for (const d of dreams()) {
      const month = d.date.slice(0, 7) // YYYY-MM
      freq[month] = (freq[month] || 0) + 1
    }
    return freq
  })

  return {
    totalDreams,
    totalRealities,
    streak,
    avgMatchScore,
    emotionDistribution,
    topKeywords,
    monthlyFrequency,
  }
}
