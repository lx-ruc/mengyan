/** Cloudflare Workers 绑定的环境变量（wrangler secret / vars） */
export interface Env {
  /** Google AI Studio 拿到的 Gemini API Key（secret，不入库） */
  readonly GEMINI_API_KEY: string
  /** 允许的 CORS 源，逗号分隔。未配置时允许所有 */
  readonly ALLOWED_ORIGINS?: string
}

/** 统一的 API 响应封装 */
export interface ApiResponse<T> {
  readonly success: boolean
  readonly data?: T
  readonly error?: string
}

/** 梦境符号分类 */
export type SymbolCategory = 'element' | 'animal' | 'person' | 'place' | 'action' | 'object'

/** AI 提取的梦境符号 */
export interface DreamSymbol {
  readonly name: string
  readonly icon: string
  readonly meaning: string
  readonly category: SymbolCategory
  readonly keywords: readonly string[]
}

/** AI 解析结果 */
export interface DreamAnalysis {
  readonly symbols: readonly DreamSymbol[]
  readonly themes: readonly string[]
  readonly emotions: readonly string[]
  readonly summary: string
  readonly suggestion: string
  readonly interpreterMessage: string
}

/** interpret-dream 响应体 */
export interface DreamInterpretationData {
  readonly analysis: DreamAnalysis
  readonly keywords: readonly string[]
}

/** match-dream-reality 响应体 */
export interface MatchDreamRealityData {
  readonly aiScore: number
  readonly finalScore: number
  readonly aiComment: string
}

/** Gemini 返回的梦境解析原始结构（来自 prompt 约束） */
export interface RawDreamInterpretation {
  readonly symbols?: ReadonlyArray<{
    readonly name?: unknown
    readonly icon?: unknown
    readonly meaning?: unknown
    readonly category?: unknown
    readonly keywords?: unknown
  }>
  readonly themes?: readonly unknown[]
  readonly emotions?: readonly unknown[]
  readonly summary?: unknown
  readonly suggestion?: unknown
  readonly interpreterMessage?: unknown
  readonly keywords?: readonly unknown[]
}

/** Gemini 返回的梦迹对照原始结构 */
export interface RawDreamRealityMatch {
  readonly aiScore?: unknown
  readonly aiComment?: unknown
}
