export type GreetingPeriod = 'morning' | 'afternoon' | 'evening' | 'night'

const WEEK_DAYS = ['日', '一', '二', '三', '四', '五', '六']

export function formatDate(ts: number): string {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr)
  const m = d.getMonth() + 1
  const day = d.getDate()
  const weekDay = WEEK_DAYS[d.getDay()]
  return `${m}月${day}日 周${weekDay}`
}

export function getToday(): string {
  return formatDate(Date.now())
}

export function isToday(dateStr: string): boolean {
  return dateStr === getToday()
}

export function getGreetingPeriod(): GreetingPeriod {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'morning'
  if (h >= 12 && h < 18) return 'afternoon'
  if (h >= 18 && h < 22) return 'evening'
  return 'night'
}

export function isMorning(): boolean {
  const h = new Date().getHours()
  return h >= 5 && h < 12
}

export function isEvening(): boolean {
  const h = new Date().getHours()
  return h >= 18 || h < 5
}
