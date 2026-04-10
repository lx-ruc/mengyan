/** 梦境类型标签 */
export enum DreamTag {
  NIGHTMARE = 'nightmare',
  SWEET = 'sweet',
  LUCID = 'lucid',
  RECURRING = 'recurring',
  HALF_AWAKE = 'half_awake',
}

/** 梦境类型标签中文映射 */
export const DreamTagLabel: Record<DreamTag, string> = {
  [DreamTag.NIGHTMARE]: '噩梦',
  [DreamTag.SWEET]: '美梦',
  [DreamTag.LUCID]: '清明梦',
  [DreamTag.RECURRING]: '反复出现的梦',
  [DreamTag.HALF_AWAKE]: '半梦半醒',
}

/** 情绪类型 */
export enum Emotion {
  HAPPY = 'happy',
  CALM = 'calm',
  FEAR = 'fear',
  SAD = 'sad',
  ANGRY = 'angry',
  COOL = 'cool',
}

/** 情绪中文映射 */
export const EmotionLabel: Record<Emotion, string> = {
  [Emotion.HAPPY]: '开心',
  [Emotion.CALM]: '平静',
  [Emotion.FEAR]: '恐惧',
  [Emotion.SAD]: '悲伤',
  [Emotion.ANGRY]: '愤怒',
  [Emotion.COOL]: '酷',
}

/** 情绪 emoji 映射 */
export const EmotionEmoji: Record<Emotion, string> = {
  [Emotion.HAPPY]: '😊',
  [Emotion.CALM]: '😐',
  [Emotion.FEAR]: '😰',
  [Emotion.SAD]: '🥺',
  [Emotion.ANGRY]: '😠',
  [Emotion.COOL]: '😎',
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

/** 梦境记录 */
export interface DreamRecord {
  readonly id: string
  readonly date: string
  readonly content: string
  readonly voiceUrl?: string
  readonly tags: readonly DreamTag[]
  readonly emotion: Emotion
  readonly clarity: number
  readonly isRecurring: boolean
  readonly keywords: readonly string[]
  readonly aiAnalysis?: DreamAnalysis
  readonly realityMatchScore?: number
  readonly realityId?: string
  readonly createdAt: number
}
