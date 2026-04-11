import type { DreamRecord } from '@/types/dream'
import type { RealityRecord } from '@/types/reality'
import { RealityEventTag } from '@/types/reality'
import { extractDreamKeywords } from '@/data/dream-symbols'
import { getComparisonComment, getScoreLevel } from '@/data/interpreter-templates'
import { checkApiHealth, fetchDreamRealityMatch } from '@/utils/api'

/** 梦迹对照引擎（支持真实 AI + Mock 降级） */
export function useDreamRealityMatcher() {
  async function matchDreamReality(
    dream: DreamRecord,
    reality: RealityRecord,
  ): Promise<{ aiScore: number; finalScore: number; aiComment: string }> {
    try {
      const available = await checkApiHealth()
      if (!available) {
        console.warn('[DreamRealityMatcher] API unavailable, using mock')
        return mockMatchDreamReality(dream, reality)
      }
      return await fetchDreamRealityMatch(dream, reality)
    } catch (e) {
      console.warn('[DreamRealityMatcher] API error, using mock:', e)
      return mockMatchDreamReality(dream, reality)
    }
  }

  return { matchDreamReality }
}

// ── Mock fallback（原有逻辑） ──

async function mockMatchDreamReality(
  dream: DreamRecord,
  reality: RealityRecord,
): Promise<{ aiScore: number; finalScore: number; aiComment: string }> {
  const delay = 800 + Math.random() * 1200
  await new Promise(resolve => setTimeout(resolve, delay))

  const dreamKeywords = dream.keywords.length > 0
    ? [...dream.keywords]
    : extractDreamKeywords(dream.content)

  const realityText = reality.content + ' ' + reality.eventTags.join(' ')
  const realityKeywords = extractDreamKeywords(realityText)

  let matchCount = 0
  for (const dk of dreamKeywords) {
    for (const rk of realityKeywords) {
      if (dk === rk || dk.includes(rk) || rk.includes(dk)) {
        matchCount++
        break
      }
    }
  }

  const keywordScore = dreamKeywords.length > 0
    ? matchCount / dreamKeywords.length
    : 0

  let emotionBonus = 0
  if (dream.content.includes('焦虑') || dream.content.includes('紧张') || dream.content.includes('害怕')) {
    if (reality.eventTags.includes(RealityEventTag.ANXIOUS)) emotionBonus += 0.15
  }
  if (dream.content.includes('开心') || dream.content.includes('快乐')) {
    if (reality.eventTags.includes(RealityEventTag.HAPPY_EVENT)) emotionBonus += 0.15
  }

  const clarityBonus = dream.clarity >= 4 ? 0.1 : dream.clarity >= 3 ? 0.05 : 0

  let aiScore = Math.min(1, keywordScore + emotionBonus + clarityBonus)
  aiScore = Math.min(1, Math.max(0, aiScore + (Math.random() - 0.5) * 0.1))

  const finalScore = 0.6 * aiScore + 0.4 * (reality.selfScore / 5)

  const level = getScoreLevel(finalScore)
  const aiComment = getComparisonComment(level)

  return { aiScore, finalScore, aiComment }
}
