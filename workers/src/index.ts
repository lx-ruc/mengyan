import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Env } from './types'
import { health } from './routes/health'
import { interpretDream } from './routes/interpret-dream'
import { matchDreamReality } from './routes/match-dream-reality'

const app = new Hono<{ Bindings: Env }>()

// CORS：通过 ALLOWED_ORIGINS 控制白名单（逗号分隔）。
// 未配置时（如本地开发）允许所有来源。
app.use(
  '/api/*',
  cors({
    origin: (origin, c) => {
      const allowed = (c.env as Env).ALLOWED_ORIGINS
      if (!allowed) return origin ?? '*'
      const list = allowed
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      if (list.length === 0) return origin ?? '*'
      return list.includes(origin ?? '') ? origin : null
    },
  }),
)

app.get('/api/health', health)
app.post('/api/interpret-dream', interpretDream)
app.post('/api/match-dream-reality', matchDreamReality)

app.notFound((c) => c.json({ success: false, error: 'Not Found' }, 404))
app.onError((err, c) => {
  console.error('Unhandled error:', err)
  return c.json({ success: false, error: '服务器内部错误' }, 500)
})

export default app
