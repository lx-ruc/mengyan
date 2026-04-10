import type { DreamAnalysis, DreamSymbol, Emotion, DreamTag } from '@/types/dream'
import { findSymbolsByKeywords, extractDreamKeywords } from '@/data/dream-symbols'
import {
  getGreeting,
  getEmotionInterpretation,
  getThemes,
  getSuggestion,
} from '@/data/interpreter-templates'
import { checkApiHealth, fetchDreamInterpretation } from '@/utils/api'

/** 梦境解析引擎（支持真实 AI + Mock 降级） */
export function useDreamInterpreter() {
  async function interpretDream(
    content: string,
    tags: DreamTag[],
    emotion: Emotion,
    clarity: number,
  ): Promise<{ analysis: DreamAnalysis; keywords: string[] }> {
    try {
      const available = await checkApiHealth()
      if (!available) {
        console.warn('[DreamInterpreter] API unavailable, using mock')
        return mockInterpretDream(content, tags, emotion, clarity)
      }
      return await fetchDreamInterpretation(content, tags, emotion, clarity)
    } catch (e) {
      console.warn('[DreamInterpreter] API error, using mock:', e)
      return mockInterpretDream(content, tags, emotion, clarity)
    }
  }

  return { interpretDream }
}

// ── Mock fallback（原有逻辑） ──

async function mockInterpretDream(
  content: string,
  tags: DreamTag[],
  emotion: Emotion,
  clarity: number,
): Promise<{ analysis: DreamAnalysis; keywords: string[] }> {
  const delay = 1000 + Math.random() * 1500
  await new Promise(resolve => setTimeout(resolve, delay))

  const keywords = extractDreamKeywords(content)
  const symbols = findSymbolsByKeywords(keywords)

  if (symbols.length < 2) {
    const extraSymbols = getFallbackSymbols(emotion)
    for (const s of extraSymbols) {
      if (!symbols.find(e => e.name === s.name)) {
        symbols.push(s)
      }
      if (symbols.length >= 3) break
    }
  }

  const themes = getThemes(tags)
  const emotions = [emotion]
  if (clarity >= 4) emotions.push('清醒感知')
  if (tags.includes('recurring' as DreamTag)) emotions.push('深层印记')

  const summary = generateSummary(content, symbols, emotion)
  const suggestion = getSuggestion()
  const interpreterMessage = buildInterpreterMessage(symbols, emotion, clarity)

  const analysis: DreamAnalysis = {
    symbols,
    themes,
    emotions,
    summary,
    suggestion,
    interpreterMessage,
  }

  return { analysis, keywords }
}

function generateSummary(content: string, symbols: DreamSymbol[], emotion: Emotion): string {
  const emotionText = getEmotionInterpretation(emotion)
  if (symbols.length > 0) {
    const mainSymbol = symbols[0]
    return `${emotionText} 梦中的「${mainSymbol.name}」是一个核心意象——${mainSymbol.meaning.slice(0, 30)}...`
  }
  return emotionText
}

function buildInterpreterMessage(symbols: DreamSymbol[], emotion: Emotion, clarity: number): string {
  const greeting = getGreeting()

  if (symbols.length > 0) {
    const names = symbols.slice(0, 3).map(s => `「${s.name}」`).join('、')
    const clarityNote = clarity >= 4
      ? '这个梦境非常清晰，说明潜意识传递的信息十分明确。'
      : clarity >= 2
        ? '梦境的清晰度适中，部分信息可能需要更多回味。'
        : '梦境比较模糊，但模糊本身也是潜意识的一种表达方式。'
    return `${greeting}你梦中的${names}各有深意。${clarityNote}今晚请留意是否会有相关的事件发生——我们将在"验梦"环节一起揭晓。`
  }

  return `${greeting}你的梦境蕴含着丰富的潜意识信息。建议仔细回味这个梦的感受，也许会找到更深层的含义。`
}

function getFallbackSymbols(emotion: Emotion): DreamSymbol[] {
  const fallbacks: Record<Emotion, DreamSymbol[]> = {
    happy: [
      { name: '阳光', icon: '☀️', meaning: '代表温暖与希望。', category: 'element', keywords: [] },
    ],
    calm: [
      { name: '平静的水面', icon: '🌊', meaning: '象征内心的安宁。', category: 'element', keywords: [] },
    ],
    fear: [
      { name: '阴影', icon: '👤', meaning: '代表未知的恐惧。', category: 'action', keywords: [] },
    ],
    sad: [
      { name: '雨天', icon: '🌧️', meaning: '象征悲伤与净化。', category: 'element', keywords: [] },
    ],
    angry: [
      { name: '风暴', icon: '⛈️', meaning: '代表内心的激荡。', category: 'element', keywords: [] },
    ],
    cool: [
      { name: '星空', icon: '✨', meaning: '代表无限可能与冒险。', category: 'element', keywords: [] },
    ],
  }
  return fallbacks[emotion] || []
}
