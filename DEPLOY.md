# 部署手册 — Dream Verify

面向海外用户、服务器部署在海外、年预算 ~¥200（实际只需 ¥70 域名费）。

## 总览

```
                          ┌─────────────────────────────────┐
   用户浏览器             │  Cloudflare                      │
        │                 │   ┌──────────────┐               │
        └─── HTTPS ───────┼─▶│   Pages      │── yourdomain.com (前端 H5)
                          │   └──────────────┘               │
                          │   ┌──────────────┐               │
                          │   │   Workers    │── api.yourdomain.com (后端 API)
                          │   │   (Hono)     │               │
                          │   └──────┬───────┘               │
                          └──────────┼───────────────────────┘
                                     │ fetch
                                     ▼
                          ┌─────────────────────┐
                          │ Google Gemini API    │
                          │ (gemini-2.0-flash)   │
                          └─────────────────────┘
```

**域名规划**：
- `yourdomain.com` → Cloudflare Pages（前端）
- `api.yourdomain.com` → Cloudflare Workers（后端）

**全部费用**：
- 域名：~¥70/年（Cloudflare Registrar 零溢价）
- 其他全部免费（Pages/Workers/Gemini 免费档）

---

## 你需要准备的账号

| 账号 | 用途 | 链接 |
|---|---|---|
| GitHub | 仓库托管 + 触发自动部署 | https://github.com |
| Cloudflare | Pages + Workers + DNS + HTTPS | https://dash.cloudflare.com/sign-up |
| Google | Gemini API Key | https://aistudio.google.com |

---

## 步骤 1：把代码推到 GitHub

仓库地址：`git@github.com:lx-ruc/mengyan.git`（已配置好）

```bash
git push origin main
```

---

## 步骤 2：获取 Gemini API Key

1. 打开 https://aistudio.google.com/apikey
2. 点 **Create API key**
3. 复制保存（形如 `AIza...`，约 39 字符）

**免费档限制**：Gemini 2.0 Flash
- 每分钟 15 次请求
- 每天 1500 次请求
- 完全免费，无需信用卡

---

## 步骤 3：注册域名 + 接入 Cloudflare

### 3a. 在 Cloudflare 注册域名（推荐，零溢价）

1. 登录 https://dash.cloudflare.com
2. 左侧 **Domain Registration** → **Register Domain**
3. 搜索你想要的 .com（如 `dreamverify.com`）
4. 注册并支付（约 ¥70/年）
5. 注册完域名会自动用 Cloudflare 的 NS，无需改 NS

**或者**：在 Namecheap / Porkbun 买域名，然后：
- Cloudflare → **Add a Site** → 输入域名
- 按提示把注册商的 NS 改成 Cloudflare 给的两个 NS

### 3b. 记下你的 Account ID

Cloudflare Dashboard 首页右侧能看到 **Account ID**，复制保存。

---

## 步骤 4：部署前端（Cloudflare Pages）

1. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. 选 GitHub，授权，选 `lx-ruc/mengyan` 仓库
3. 配置：
   - **Project name**：`dream-verify`
   - **Production branch**：`main`
   - **Framework preset**：None
   - **Build command**：`npm ci && npm run build:h5`
   - **Build output directory**：`dist/build/h5`
   - **Environment variables (Production)**：
     - `VITE_API_BASE_URL` = `https://api.yourdomain.com`（替换为你的真实 api 子域名）
4. **Save and Deploy**，等 2-3 分钟构建完成
5. 此时拿到一个 `https://dream-verify.pages.dev` 的临时域名，先验证前端能打开

---

## 步骤 5：部署后端（Cloudflare Workers）

### 5a. 创建 API Token

1. https://dash.cloudflare.com/profile/api-tokens → **Create Token**
2. 选 **Edit Cloudflare Workers** 模板
3. Account Resources → Include → 你的账号
4. 创建后复制 token（只显示一次！）

### 5b. 用 Wrangler 部署（本地一次性操作）

```bash
cd workers

# 登录 Cloudflare（浏览器会弹窗授权）
npx wrangler login

# 配置生产 API Key（提示后粘贴步骤 2 拿到的 Key）
npx wrangler secret put GEMINI_API_KEY

# 部署
npm run deploy
```

部署完会得到一个 `https://dream-verify-api.<your-subdomain>.workers.dev` 地址。

### 5c. 测试

```bash
curl https://dream-verify-api.<your-subdomain>.workers.dev/api/health
# 期望：{"success":true,"data":{"status":"ok"}}
```

---

## 步骤 6：把域名绑上去

### 6a. 主域名 → Pages（前端）

1. Cloudflare Dashboard → **Workers & Pages** → `dream-verify` 项目 → **Custom domains**
2. **Set up a custom domain** → 输入 `yourdomain.com` → 继续
3. Cloudflare 自动配 DNS + HTTPS（一两条记录会自动加到 DNS 面板）
4. 同样再加 `www.yourdomain.com`

### 6b. api 子域名 → Workers（后端）

1. 打开 `workers/wrangler.toml`，取消 `routes` 段的注释，改成：
   ```toml
   routes = [
     { pattern = "api.yourdomain.com/*", custom_domain = true }
   ]
   ```
2. 也更新 `ALLOWED_ORIGINS`：
   ```toml
   [vars]
   ALLOWED_ORIGINS = "https://yourdomain.com,https://www.yourdomain.com"
   ```
3. 提交并 push：
   ```bash
   git add workers/wrangler.toml
   git commit -m "chore: configure custom api domain"
   git push
   ```
4. 等 GitHub Actions 跑完（或本地 `cd workers && npm run deploy`）

---

## 步骤 7：配置自动部署（GitHub Actions）

每次 push 到 `main` 会自动部署前后端。需要在 GitHub 配 4 个 Secrets：

仓库 → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**：

| Secret 名 | 值 | 用途 |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | 步骤 5a 拿到的 token | 部署 Pages + Workers |
| `CLOUDFLARE_ACCOUNT_ID` | 步骤 3b 拿到的 Account ID | 部署 Pages + Workers |
| `VITE_API_BASE_URL` | `https://api.yourdomain.com` | 前端构建时注入后端域名 |

> 注意：`GEMINI_API_KEY` **不要**配到 GitHub Secrets，只在 Cloudflare Dashboard / `wrangler secret put` 配。

---

## 步骤 8：限流（可选但推荐）

Cloudflare Dashboard → 你的域名 → **Security** → **WAF** → **Rate limiting rules**：

- **Rule name**：API rate limit
- **If incoming requests match**：
  - Field: `URI Path`
  - Operator: `starts with`
  - Value: `/api/`
- **When rate exceeds**：100 requests per 1 minute per IP
- **Take action**：Block

防止恶意刷你的 Gemini 配额。

---

## 验证清单

部署完成后逐项检查：

- [ ] 打开 `https://yourdomain.com`，看到梦验首页
- [ ] 浏览器 F12 → Network → 看请求 URL 是否为 `https://api.yourdomain.com/api/...`
- [ ] 输入梦境内容点解析，几秒后看到 AI 解读结果
- [ ] 健康检查：`curl https://api.yourdomain.com/api/health` 返回 `success: true`
- [ ] 限流：`for i in {1..200}; do curl https://api.yourdomain.com/api/health; done` 应该返回 429

---

## 常见问题

**Q: 本地怎么联调前后端？**
A: 两个终端：
```bash
# 终端 1：启动后端
cd workers && npm run dev   # http://localhost:8787

# 终端 2：启动前端
npm run dev:h5              # http://localhost:5173（已配置好代理到 8787）
```
创建 `workers/.dev.vars`：
```
GEMINI_API_KEY=your_dev_key
ALLOWED_ORIGINS=http://localhost:5173
```

**Q: Gemini 免费额度用完了怎么办？**
A: 升级到按量付费（约 $0.10/百万 token 输入，$0.40/百万 token 输出），个人小项目一个月通常 < $1。

**Q: 想换回 Node.js 部署（如 Fly.io / VPS）？**
A: 仓库里保留了 `server/` 目录（Express + Anthropic SDK），可以单独部署。

**Q: 微信小程序怎么办？**
A: H5 部署和微信小程序是独立的。小程序通过 `npm run build:mp-weixin` 构建，然后在微信公众平台提交审核。

---

## 总成本（一年）

| 项 | 金额 |
|---|---|
| 域名 .com | ¥70 |
| Cloudflare Pages | 免费 |
| Cloudflare Workers | 免费 |
| Gemini API | 免费（个人用量） |
| HTTPS 证书 | 免费（Cloudflare 自动） |
| **合计** | **¥70/年** |
