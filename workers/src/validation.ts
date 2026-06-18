/** 系统边界输入校验：所有外部数据进入业务逻辑前都必须经过这里 */

const MAX_CONTENT_LENGTH = 2000
const MAX_REALITY_LENGTH = 500
const MAX_TAGS = 10
const MAX_EMOTION_LENGTH = 20

export type ContentCheck =
  | { readonly ok: true; readonly content: string }
  | { readonly ok: false; readonly error: string }

export function asString(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}

export function asStringArray(value: unknown): readonly string[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((x): x is string => typeof x === 'string')
    .slice(0, MAX_TAGS)
}

export function clampClarity(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 3
  return Math.max(1, Math.min(5, Math.round(value)))
}

export function clampSelfScore(value: unknown): number {
  const num = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(num)) return 3
  return Math.max(1, Math.min(5, Math.round(num)))
}

export function safeEmotion(value: unknown): string {
  const s = asString(value)
  return s ? s.slice(0, MAX_EMOTION_LENGTH) : '未知'
}

export function validateDreamContent(value: unknown): ContentCheck {
  if (typeof value !== 'string' || !value) {
    return { ok: false, error: '缺少梦境内容' }
  }
  if (value.length > MAX_CONTENT_LENGTH) {
    return { ok: false, error: '梦境内容过长（最多2000字）' }
  }
  return { ok: true, content: value }
}

export function validateRealityContent(value: unknown): ContentCheck {
  if (typeof value !== 'string' || !value) {
    return { ok: false, error: '缺少梦境或现实内容' }
  }
  if (value.length > MAX_REALITY_LENGTH) {
    return { ok: false, error: '现实内容过长' }
  }
  return { ok: true, content: value }
}

export const LIMITS = {
  MAX_CONTENT_LENGTH,
  MAX_REALITY_LENGTH,
  MAX_TAGS,
  MAX_EMOTION_LENGTH,
} as const
