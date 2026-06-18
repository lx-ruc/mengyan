import type { Context } from 'hono'
import type { Env, MatchDreamRealityData, RawDreamRealityMatch } from '../types'
import { ok, fail, upstream } from '../response'
import {
  asString,
  asStringArray,
  clampClarity,
  clampSelfScore,
  safeEmotion,
  validateDreamContent,
  validateRealityContent,
} from '../validation'
import { MATCH_DREAM_REALITY_SYSTEM, buildMatchDreamRealityPrompt } from '../prompts'
import { callGemini, parseJsonResponse } from '../gemini'

type AppContext = Context<{ Bindings: Env }>

export async function matchDreamReality(c: AppContext) {
  const body = await readJsonBody(c)
  if (!body.ok) return fail(c, 400, body.error)

  const { value } = body

  const dreamCheck = validateDreamContent(value.dreamContent)
  if (!dreamCheck.ok) return fail(c, 400, '缺少梦境内容')

  const realityCheck = validateRealityContent(value.realityContent)
  if (!realityCheck.ok) return fail(c, 400, '缺少现实内容')

  const dreamKeywords = asStringArray(value.dreamKeywords)
  const dreamTags = asStringArray(value.dreamTags)
  const realityTags = asStringArray(value.realityEventTags)
  const dreamEmotion = safeEmotion(value.dreamEmotion)
  const dreamClarity = clampClarity(value.dreamClarity)
  const selfScore = clampSelfScore(value.selfScore)

  const result = await callGemini({
    apiKey: c.env.GEMINI_API_KEY,
    systemPrompt: MATCH_DREAM_REALITY_SYSTEM,
    userPrompt: buildMatchDreamRealityPrompt({
      dreamContent: dreamCheck.content,
      dreamKeywordsText: dreamKeywords.length > 0 ? dreamKeywords.join('、') : '无',
      dreamTagsText: dreamTags.length > 0 ? dreamTags.join('、') : '无',
      dreamEmotion,
      dreamClarity,
      realityContent: realityCheck.content,
      realityTagsText: realityTags.length > 0 ? realityTags.join('、') : '无',
      selfScore,
    }),
    maxOutputTokens: 1024,
  })

  if (!result.ok) {
    if (result.rateLimited) return upstream(c, 'API 调用频率超限，请稍后重试', 429)
    return upstream(c, '梦迹对照失败，请稍后重试')
  }

  const parsed = parseJsonResponse<RawDreamRealityMatch>(result.text)
  if (!parsed.ok) return upstream(c, parsed.error)

  const value2 = parsed.value
  const aiScore = typeof value2.aiScore === 'number' ? value2.aiScore : NaN
  if (!Number.isFinite(aiScore) || !value2.aiComment) {
    return upstream(c, 'AI 返回数据格式不完整')
  }

  const finalScore = 0.6 * aiScore + 0.4 * (selfScore / 5)
  const data: MatchDreamRealityData = {
    aiScore,
    finalScore,
    aiComment: String(value2.aiComment),
  }
  return ok(c, data)
}

interface MatchBody {
  readonly dreamContent: unknown
  readonly dreamKeywords: unknown
  readonly dreamTags: unknown
  readonly dreamEmotion: unknown
  readonly dreamClarity: unknown
  readonly realityContent: unknown
  readonly realityEventTags: unknown
  readonly selfScore: unknown
}

async function readJsonBody(
  c: AppContext,
): Promise<{ readonly ok: true; readonly value: MatchBody } | { readonly ok: false; readonly error: string }> {
  let value: MatchBody
  try {
    value = (await c.req.json()) as MatchBody
  } catch {
    return { ok: false, error: '请求体格式错误' }
  }
  return { ok: true, value }
}

// 显式保留 asString 引用以便未来扩展（当前仅用作类型导出验证）
void asString
