import type { Emotion } from '@/types/dream'
import { DreamTag } from '@/types/dream'

/** 解梦师开场白模板 */
const GREETINGS = [
  '你的潜意识正在向你传递信息——',
  '这个梦境蕴含着深层的含义——',
  '让我们一起走进你的内心世界——',
  '你的梦境揭示了一些有趣的东西——',
  '梦是灵魂的语言，让我来为你解读——',
] as const

/** 按情绪分类的解读模板 */
const EMOTION_INTERPRETATIONS: Record<Emotion, string[]> = {
  happy: [
    '这个梦境带来了温暖的能量，暗示你的内心正处于一个积极的状态。',
    '美好的梦境往往是内心的阳光投射，说明你潜意识里充满了希望。',
    '这样的美梦是内心力量的体现，你的乐观正在滋养你的灵魂。',
  ],
  calm: [
    '平静的梦境反映了你内心深处的一种安宁感，这是很难得的。',
    '这份平静可能是你潜意识在告诉你可以放松下来。',
    '宁静的梦境往往出现在心灵需要休息的时刻。',
  ],
  fear: [
    '恐惧的梦境通常是潜意识在提醒你关注某些被忽略的问题。',
    '这样的梦境虽然令人不安，但它其实在帮助你面对内心深处的担忧。',
    '噩梦是一种情绪的释放机制，醒来后，那些恐惧已经没有那么可怕了。',
  ],
  sad: [
    '悲伤的梦境可能是你内心深处需要被关注的情感在寻求出口。',
    '这样的梦境提醒你，是时候好好关心一下自己的情感需求了。',
    '梦中的悲伤往往是现实中未被充分表达的感伤。',
  ],
  angry: [
    '愤怒的梦境可能暗示你有一些压抑的情绪需要找到健康的出口。',
    '这样的梦境表明你的潜意识正在处理一些未解决的冲突。',
    '梦中的怒火往往是现实中克制的情感在寻找释放。',
  ],
  cool: [
    '这个梦境充满了冒险精神，暗示你的内心渴望突破常规。',
    '酷炫的梦境往往代表你潜意识中的创造力正在觉醒。',
    '这样的梦说明你的内心充满了探索未知的勇气。',
  ],
} as const

/** 主题模板 */
const THEME_POOL: Record<string, string[]> = {
  anxiety: ['压力与焦虑', '自我审视', '能力质疑', '时间紧迫感'],
  growth: ['自我成长', '内在转变', '潜能觉醒', '意识扩展'],
  relationship: ['人际关系', '情感连接', '信任议题', '亲密渴望'],
  adventure: ['探索未知', '突破限制', '勇气与自由', '生命动力'],
  mystery: ['潜意识信息', '直觉感应', '隐藏的真相', '灵性觉醒'],
} as const

/** 建议模板 */
const SUGGESTIONS = [
  '建议你在接下来的一天中留意与梦境相关的线索，看看现实是否会给你一些呼应。',
  '可以尝试在睡前冥想几分钟，帮助你更好地与潜意识对话。',
  '建议你记录下醒来后的第一感受，这往往包含着梦境最重要的信息。',
  '这个梦境值得你反复回味，看看是否有新的感悟浮现。',
  '建议关注今天可能出现的关键人物或场景，看看是否与梦境有关联。',
  '可以在今天做一些放松的活动，让潜意识的信息自然浮现。',
] as const

/** 梦迹对照评语模板 */
const COMPARISON_COMMENTS = {
  high: [
    '你的梦境与现实出现了高度的吻合！潜意识似乎已经提前感知到了即将发生的事情。',
    '这个吻合度令人惊叹！你的直觉能力比想象中更加强大。',
    '梦境与现实的紧密关联表明，你的潜意识正在积极地处理现实信息。',
  ],
  medium: [
    '梦境与现实存在一些有趣的关联，虽然不是完全对应，但某些元素确实呼应了。',
    '这种中等程度的吻合暗示你的潜意识在接收某些信号，只是还不够清晰。',
    '有些关联值得玩味，这可能是你的直觉正在尝试告诉你什么。',
  ],
  low: [
    '这次的梦境与现实关联不大，但这并不代表梦没有意义——它可能反映的是你内心深处的情感状态。',
    '吻合度不高说明这个梦可能更多是内心情绪的投射，而非对现实的预感。',
    '即使关联性不强，这个梦境仍然是你潜意识活动的珍贵记录。',
  ],
} as const

/** 随机选取数组中的一个元素 */
function randomPick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** 生成解梦师开场白 */
export function getGreeting(): string {
  return randomPick(GREETINGS)
}

/** 根据情绪获取解读文本 */
export function getEmotionInterpretation(emotion: Emotion): string {
  return randomPick(EMOTION_INTERPRETATIONS[emotion])
}

/** 根据标签选择主题 */
export function getThemes(tags: DreamTag[]): string[] {
  const themeKeys: string[] = []
  if (tags.includes(DreamTag.NIGHTMARE)) themeKeys.push('anxiety')
  if (tags.includes(DreamTag.SWEET)) themeKeys.push('growth')
  if (tags.includes(DreamTag.RECURRING)) themeKeys.push('mystery')
  if (tags.includes(DreamTag.LUCID)) themeKeys.push('adventure')
  if (themeKeys.length === 0) themeKeys.push('relationship', 'growth')

  const themes: string[] = []
  for (const key of themeKeys) {
    const pool = THEME_POOL[key]
    if (pool) themes.push(randomPick(pool))
  }
  return themes.slice(0, 3)
}

/** 获取建议 */
export function getSuggestion(): string {
  return randomPick(SUGGESTIONS)
}

/** 根据吻合度等级获取评语 */
export function getComparisonComment(level: 'high' | 'medium' | 'low'): string {
  return randomPick(COMPARISON_COMMENTS[level])
}

/** 吻合度等级判断 */
export function getScoreLevel(score: number): 'high' | 'medium' | 'low' {
  if (score >= 0.7) return 'high'
  if (score >= 0.4) return 'medium'
  return 'low'
}
