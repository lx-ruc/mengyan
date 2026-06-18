/**
 * 零依赖 fetch-based Gemini client。
 * 直接调用 generativelanguage.googleapis.com REST API，
 * 在 Cloudflare Workers 边缘节点上原生兼容。
 */

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'
export const DEFAULT_MODEL = 'gemini-2.0-flash'

export interface GeminiRequest {
  readonly apiKey: string
  readonly systemPrompt: string
  readonly userPrompt: string
  readonly model?: string
  readonly maxOutputTokens?: number
  readonly temperature?: number
}

export type GeminiResult =
  | { readonly ok: true; readonly text: string }
  | { readonly ok: false; readonly status: number; readonly message: string; readonly rateLimited: boolean }

interface GeminiResponseBody {
  readonly candidates?: ReadonlyArray<{
    readonly content?: { readonly parts?: ReadonlyArray<{ readonly text?: string }> }
    readonly finishReason?: string
  }>
  readonly promptFeedback?: { readonly blockReason?: string }
  readonly error?: { readonly code?: number; readonly message?: string; readonly status?: string }
}

interface InternalError extends Error {
  readonly status?: number
}

export async function callGemini(req: GeminiRequest): Promise<GeminiResult> {
  const model = req.model ?? DEFAULT_MODEL
  const url = `${GEMINI_BASE}/${model}:generateContent?key=${encodeURIComponent(req.apiKey)}`

  const body = {
    system_instruction: { parts: [{ text: req.systemPrompt }] },
    contents: [{ role: 'user', parts: [{ text: req.userPrompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      maxOutputTokens: req.maxOutputTokens ?? 2048,
      temperature: req.temperature ?? 0.8,
    },
  }

  let res: Response
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch (e) {
    const err = e as InternalError
    return {
      ok: false,
      status: 502,
      message: err?.message ?? 'Gemini 网络调用失败',
      rateLimited: false,
    }
  }

  if (!res.ok) {
    const errBody = await safeReadJson(res)
    return {
      ok: false,
      status: res.status,
      message: errBody?.error?.message ?? `Gemini HTTP ${res.status}`,
      rateLimited: res.status === 429,
    }
  }

  const data = await safeReadJson(res)
  if (!data) {
    return { ok: false, status: 502, message: 'Gemini 返回非 JSON 响应', rateLimited: false }
  }

  const candidate = data.candidates?.[0]
  const text = candidate?.content?.parts?.map((p) => p.text ?? '').join('').trim() ?? ''

  if (!text) {
    const blocked = data.promptFeedback?.blockReason
    return {
      ok: false,
      status: 502,
      message: blocked ? `内容被安全过滤：${blocked}` : 'Gemini 返回空响应',
      rateLimited: false,
    }
  }

  return { ok: true, text }
}

export type JsonParseResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: string }

export function parseJsonResponse<T>(text: string): JsonParseResult<T> {
  let jsonStr = text.trim()
  // responseMimeType=application/json 时模型直接返回 JSON，
  // 但仍兜底处理可能被 ``` 代码块包裹的情况
  const fenced = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced) {
    jsonStr = fenced[1].trim()
  }
  try {
    return { ok: true, value: JSON.parse(jsonStr) as T }
  } catch {
    return { ok: false, error: 'AI 返回数据格式无效' }
  }
}

async function safeReadJson(res: Response): Promise<GeminiResponseBody | null> {
  try {
    return (await res.json()) as GeminiResponseBody
  } catch {
    return null
  }
}
