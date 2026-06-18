# Dream Verify API — Cloudflare Workers

Hono + Gemini 2.0 Flash，部署到 Cloudflare Workers 全球边缘节点。

## 本地开发

```bash
cd workers
npm install
npm run dev          # 启动 wrangler dev（http://localhost:8787）
```

创建 `workers/.dev.vars` 文件配置本地密钥（**不要提交**）：

```
GEMINI_API_KEY=your_key_here
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 类型检查

```bash
npm run type-check
```

## 部署

详见仓库根目录的 `DEPLOY.md`（任务 #4 产出）。要点：

```bash
npm run deploy      # wrangler deploy
wrangler secret put GEMINI_API_KEY   # 配置生产 API Key
```

## 目录结构

```
src/
  index.ts                  Hono 入口（CORS、路由、错误处理）
  types.ts                  Env + 共享类型
  response.ts               标准化响应（ok/fail/upstream）
  validation.ts             输入清洗（系统边界校验）
  prompts.ts                所有 system prompt + 用户 prompt 构造
  gemini.ts                 零依赖 fetch-based Gemini client
  routes/
    health.ts               GET /api/health
    interpret-dream.ts      POST /api/interpret-dream
    match-dream-reality.ts  POST /api/match-dream-reality
```

## 与原 server/ 的关系

`workers/` 是生产部署版本（Cloudflare Workers + Gemini）。
`server/` 是历史 Express + Anthropic SDK 版本，仅作参考保留。
