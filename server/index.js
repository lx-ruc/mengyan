require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Anthropic = require('@anthropic-ai/sdk')

const app = express()

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean)
if (ALLOWED_ORIGINS.length > 0) {
  app.use(cors({ origin: ALLOWED_ORIGINS }))
} else {
  app.use(cors())
}
app.use(express.json({ limit: '10kb' }))

// Simple in-memory rate limiter
const rateLimitMap = new Map()
const RATE_LIMIT_WINDOW = 60_000 // 1 minute
const RATE_LIMIT_MAX = 10

function checkRateLimit(ip) {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now - entry.resetAt > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, resetAt: now })
    return true
  }
  if (entry.count >= RATE_LIMIT_MAX) return false
  entry.count++
  return true
}

// Clean up stale rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateLimitMap) {
    if (now - entry.resetAt > RATE_LIMIT_WINDOW * 2) rateLimitMap.delete(ip)
  }
}, 300_000)

app.use('/api/', (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ success: false, error: '请求过于频繁，请稍后重试' })
  }
  next()
})

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: 'https://open.bigmodel.cn/api/anthropic',
})
const MODEL = 'glm-5.1'
const PORT = process.env.PORT || 3001

// ── Health Check ──

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// ── Dream Interpretation ──

app.post('/api/interpret-dream', async (req, res) => {
  try {
    const { content, tags, emotion, clarity } = req.body
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ success: false, error: '缺少梦境内容' })
    }
    if (content.length > 2000) {
      return res.status(400).json({ success: false, error: '梦境内容过长（最多2000字）' })
    }
    const safeTags = Array.isArray(tags) ? tags.filter(t => typeof t === 'string').slice(0, 10) : []
    const safeEmotion = typeof emotion === 'string' ? emotion.slice(0, 20) : '未知'
    const safeClarity = typeof clarity === 'number' ? Math.max(1, Math.min(5, Math.round(clarity))) : 3

    const tagsText = safeTags.join('、') || '无'
    const clarityDesc = ['', '像雾一样模糊', '只能记住片段', '大致能回忆', '细节比较清晰', '栩栩如生'][safeClarity] || '未知'

    const systemPrompt = `你是一位专业的梦境分析师（验梦师），擅长从心理学和象征意义角度解读梦境。你的语气温暖、富有洞察力，喜欢用恰当的 emoji 点缀表达。

请根据用户提供的梦境信息，返回一个严格的 JSON 对象（不要包含任何其他文字），格式如下：
{
  "symbols": [
    {
      "name": "符号名称",
      "icon": "对应的emoji",
      "meaning": "该符号在梦境中的象征含义（一句话）",
      "category": "element|animal|person|place|action|object",
      "keywords": ["相关关键词1", "关键词2"]
    }
  ],
  "themes": ["主题1", "主题2"],
  "emotions": ["情绪标签1", "情绪标签2"],
  "summary": "对梦境的整体解读（2-3句话）",
  "suggestion": "基于梦境的建议（1-2句话）",
  "interpreterMessage": "验梦师的个性化留言，温暖而有洞察力，暗示梦境可能与现实有关联（2-3句话）",
  "keywords": ["提取的关键词1", "关键词2"]
}

要求：
- symbols 找出 2-5 个核心意象，category 必须是 element/animal/person/place/action/object 之一
- themes 给出 2-4 个心理主题
- emotions 给出 2-3 个情绪标签
- keywords 提取 3-8 个梦境关键词
- 所有文字用中文
- summary 和 interpreterMessage 要有洞察力，不要泛泛而谈
- interpreterMessage 中要提到梦境中的具体意象`

    const userPrompt = `请解读以下梦境：

【梦境内容】${content}
【梦境标签】${tagsText}
【主要情绪】${safeEmotion}
【清晰度】${clarityDesc}`

    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const text = message.content[0].text
    // Try to extract JSON from the response (handle potential markdown code blocks)
    let jsonStr = text
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim()
    }

    const parsed = JSON.parse(jsonStr)

    // Validate required fields
    if (!parsed.symbols || !parsed.themes || !parsed.summary) {
      return res.status(502).json({ success: false, error: 'AI 返回数据格式不完整' })
    }

    // Restructure: separate keywords from analysis fields
    const { keywords, ...analysis } = parsed
    res.json({ success: true, data: { analysis, keywords: keywords || [] } })
  } catch (e) {
    console.error('Dream interpretation error:', e.message)
    if (e.status === 429) {
      return res.status(429).json({ success: false, error: 'API 调用频率超限，请稍后重试' })
    }
    res.status(502).json({ success: false, error: '梦境解析失败，请稍后重试' })
  }
})

// ── Dream-Reality Matching ──

app.post('/api/match-dream-reality', async (req, res) => {
  try {
    const {
      dreamContent, dreamKeywords, dreamTags, dreamEmotion, dreamClarity,
      realityContent, realityEventTags, selfScore,
    } = req.body

    if (!dreamContent || !realityContent) {
      return res.status(400).json({ success: false, error: '缺少梦境或现实内容' })
    }
    if (dreamContent.length > 2000 || realityContent.length > 500) {
      return res.status(400).json({ success: false, error: '内容过长' })
    }

    const safeScore = Math.max(1, Math.min(5, Number(selfScore) || 3))
    const safeDreamKws = Array.isArray(dreamKeywords) ? dreamKeywords.filter((k: unknown) => typeof k === 'string').slice(0, 10) : []
    const safeDreamTags = Array.isArray(dreamTags) ? dreamTags.filter((t: unknown) => typeof t === 'string').slice(0, 10) : []
    const safeRealityTags = Array.isArray(realityEventTags) ? realityEventTags.filter((t: unknown) => typeof t === 'string').slice(0, 10) : []

    const systemPrompt = `你是一位专业的梦境验证师，负责对比梦境内容与现实发生的事件，判断它们之间的吻合程度。

请返回一个严格的 JSON 对象（不要包含任何其他文字），格式如下：
{
  "aiScore": 0.0到1.0之间的数字,
  "aiComment": "用中文写一段详细的对比分析（3-5句话），包括：梦境和现实有哪些关键词/主题重叠，情绪是否一致，以及你对这种吻合程度的解读"
}

评分标准：
- 0.0-0.2: 几乎没有关联
- 0.2-0.4: 有微弱的相似之处
- 0.4-0.6: 存在一些有意义的对应
- 0.6-0.8: 明显的吻合
- 0.8-1.0: 高度吻合

考虑以下维度：
1. 关键词和意象的重叠
2. 主题和情境的相似性
3. 情绪基调是否一致
4. 时间上的关联性（如果有的话）`

    const userPrompt = `请对比以下梦境与现实事件：

【梦境内容】${dreamContent}
【梦境关键词】${safeDreamKws.join('、') || '无'}
【梦境标签】${safeDreamTags.join('、') || '无'}
【梦境情绪】${typeof dreamEmotion === 'string' ? dreamEmotion.slice(0, 20) : '未知'}
【梦境清晰度】${dreamClarity || '未知'}

【现实事件】${realityContent}
【现实标签】${safeRealityTags.join('、') || '无'}
【用户自评吻合度】${safeScore}/5`

    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const text = message.content[0].text
    let jsonStr = text
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim()
    }

    const parsed = JSON.parse(jsonStr)

    if (typeof parsed.aiScore !== 'number' || !parsed.aiComment) {
      return res.status(502).json({ success: false, error: 'AI 返回数据格式不完整' })
    }

    // Compute finalScore using the same formula as the mock
    const finalScore = 0.6 * parsed.aiScore + 0.4 * (safeScore / 5)

    res.json({
      success: true,
      data: {
        aiScore: parsed.aiScore,
        finalScore,
        aiComment: parsed.aiComment,
      },
    })
  } catch (e) {
    console.error('Dream-reality matching error:', e.message)
    if (e.status === 429) {
      return res.status(429).json({ success: false, error: 'API 调用频率超限，请稍后重试' })
    }
    res.status(502).json({ success: false, error: '梦验对照失败，请稍后重试' })
  }
})

// ── Start ──

app.listen(PORT, () => {
  console.log(`Dream Verify API server running on http://localhost:${PORT}`)
})
