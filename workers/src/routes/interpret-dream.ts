import type { Context } from 'hono'
import type {
  Env,
  DreamInterpretationData,
  DreamAnalysis,
  DreamSymbol,
  SymbolCategory,
  RawDreamInterpretation,
} from '../types'
import { ok, fail, upstream } from '../response'
import {
  asStringArray,
  clampClarity,
  safeEmotion,
  validateDreamContent,
} from '../validation'
import {
  INTERPRET_DREAM_SYSTEM,
  CLARITY_DESCRIPTIONS,
  buildInterpretDreamPrompt,
} from '../prompts'
import { callGemini, parseJsonResponse } from '../gemini'

type AppContext = Context<{ Bindings: Env }>

const VALID_CATEGORIES: ReadonlySet<SymbolCategory> = new Set([
  'element',
  'animal',
  'person',
  'place',
  'action',
  'object',
])

export async function interpretDream(c: AppContext) {
  const body = await readJsonBody(c)
  if (!body.ok) return fail(c, 400, body.error)

  const { value } = body

  const contentCheck = validateDreamContent(value.content)
  if (!contentCheck.ok) return fail(c, 400, contentCheck.error)

  const tags = asStringArray(value.tags)
  const emotion = safeEmotion(value.emotion)
  const clarity = clampClarity(value.clarity)

  const tagsText = tags.length > 0 ? tags.join('、') : '无'
  const clarityDesc = CLARITY_DESCRIPTIONS[clarity] ?? '未知'

  const result = await callGemini({
    apiKey: c.env.GEMINI_API_KEY,
    systemPrompt: INTERPRET_DREAM_SYSTEM,
    userPrompt: buildInterpretDreamPrompt({
      content: contentCheck.content,
      tagsText,
      emotion,
      clarityDesc,
    }),
    maxOutputTokens: 2048,
  })

  if (!result.ok) {
    if (result.rateLimited) return upstream(c, 'API 调用频率超限，请稍后重试', 429)
    return upstream(c, '梦境解析失败，请稍后重试')
  }

  const parsed = parseJsonResponse<RawDreamInterpretation>(result.text)
  if (!parsed.ok) return upstream(c, parsed.error)

  const value2 = parsed.value
  if (!value2.symbols || !value2.themes || !value2.summary) {
    return upstream(c, 'AI 返回数据格式不完整')
  }

  const symbols = normalizeSymbols(value2.symbols)
  const analysis: DreamAnalysis = {
    symbols,
    themes: asStringArray(value2.themes),
    emotions: asStringArray(value2.emotions),
    summary: String(value2.summary),
    suggestion: String(value2.suggestion ?? ''),
    interpreterMessage: String(value2.interpreterMessage ?? ''),
  }
  const keywords = asStringArray(value2.keywords)

  const data: DreamInterpretationData = { analysis, keywords }
  return ok(c, data)
}

function normalizeSymbols(raw: RawDreamInterpretation['symbols']): readonly DreamSymbol[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((s): s is NonNullable<typeof s> => s != null)
    .map((s) => {
      const category = VALID_CATEGORIES.has(s.category as SymbolCategory)
        ? (s.category as SymbolCategory)
        : 'object'
      return {
        name: String(s.name ?? ''),
        icon: String(s.icon ?? ''),
        meaning: String(s.meaning ?? ''),
        category,
        keywords: asStringArray(s.keywords),
      } satisfies DreamSymbol
    })
    .filter((s) => s.name.length > 0)
}

interface InterpretBody {
  readonly content: unknown
  readonly tags: unknown
  readonly emotion: unknown
  readonly clarity: unknown
}

async function readJsonBody(
  c: AppContext,
): Promise<{ readonly ok: true; readonly value: InterpretBody } | { readonly ok: false; readonly error: string }> {
  let value: InterpretBody
  try {
    value = (await c.req.json()) as InterpretBody
  } catch {
    return { ok: false, error: '请求体格式错误' }
  }
  return { ok: true, value }
}
