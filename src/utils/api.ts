import type { DreamAnalysis, DreamTag, Emotion } from '@/types/dream'
import type { DreamRecord } from '@/types/dream'
import type { RealityRecord } from '@/types/reality'

const isDev = (import.meta as any).env?.DEV ?? true

const API_BASE_URL = isDev
  ? 'http://localhost:3001'
  : 'https://your-production-domain.com'

const TIMEOUT = 15000

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

function request<T>(options: UniApp.RequestOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      url: `${API_BASE_URL}${options.url}`,
      timeout: TIMEOUT,
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as T)
        } else {
          reject(new Error(`HTTP ${res.statusCode}`))
        }
      },
      fail(err) {
        reject(new Error(err.errMsg))
      },
    })
  })
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await request<ApiResponse<null>>({
      url: '/api/health',
      method: 'GET',
    })
    return res.success === true
  } catch {
    return false
  }
}

export async function fetchDreamInterpretation(
  content: string,
  tags: DreamTag[],
  emotion: Emotion,
  clarity: number,
): Promise<{ analysis: DreamAnalysis; keywords: string[] }> {
  const res = await request<ApiResponse<{ analysis: DreamAnalysis; keywords: string[] }>>({
    url: '/api/interpret-dream',
    method: 'POST',
    data: { content, tags, emotion, clarity },
  })

  if (!res.success || !res.data) {
    throw new Error(res.error || '解析请求失败')
  }

  return res.data
}

export async function fetchDreamRealityMatch(
  dream: DreamRecord,
  reality: RealityRecord,
): Promise<{ aiScore: number; finalScore: number; aiComment: string }> {
  const res = await request<ApiResponse<{ aiScore: number; finalScore: number; aiComment: string }>>({
    url: '/api/match-dream-reality',
    method: 'POST',
    data: {
      dreamContent: dream.content,
      dreamKeywords: dream.keywords,
      dreamTags: dream.tags,
      dreamEmotion: dream.emotion,
      dreamClarity: dream.clarity,
      realityContent: reality.content,
      realityEventTags: reality.eventTags,
      selfScore: reality.selfScore,
    },
  })

  if (!res.success || !res.data) {
    throw new Error(res.error || '对照请求失败')
  }

  return res.data
}
