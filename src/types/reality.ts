/** 现实事件标签 */
export enum RealityEventTag {
  WORK = 'work',
  STUDY = 'study',
  LOVE = 'love',
  MONEY = 'money',
  FAMILY = 'family',
  HEALTH = 'health',
  HAPPY_EVENT = 'happy_event',
  ANXIOUS = 'anxious',
  CONFLICT = 'conflict',
  UNEXPECTED = 'unexpected',
  IMPORTANT_DECISION = 'important_decision',
}

/** 现实事件标签中文映射 */
export const RealityEventTagLabel: Record<RealityEventTag, string> = {
  [RealityEventTag.WORK]: '💼 工作',
  [RealityEventTag.STUDY]: '📚 学习',
  [RealityEventTag.LOVE]: '❤️ 感情',
  [RealityEventTag.MONEY]: '💰 财运',
  [RealityEventTag.FAMILY]: '👨‍👩‍👧 家庭',
  [RealityEventTag.HEALTH]: '🏥 健康',
  [RealityEventTag.HAPPY_EVENT]: '🎉 开心',
  [RealityEventTag.ANXIOUS]: '😰 焦虑',
  [RealityEventTag.CONFLICT]: '😡 冲突',
  [RealityEventTag.UNEXPECTED]: '🆕 意外事件',
  [RealityEventTag.IMPORTANT_DECISION]: '⚡ 重要决定',
}

/** 现实记录 */
export interface RealityRecord {
  readonly id: string
  readonly dreamId: string
  readonly date: string
  readonly eventTags: readonly RealityEventTag[]
  readonly content: string
  readonly selfScore: number
  readonly aiScore?: number
  readonly finalScore?: number
  readonly aiComment?: string
  readonly createdAt: number
}
