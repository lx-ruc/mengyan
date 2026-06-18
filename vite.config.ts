import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { resolve } from 'path'

export default defineConfig({
  plugins: [uni()],
  // 独立域名部署到 Cloudflare Pages 时用根路径。
  // 若仍要部署到 GitHub Pages 子路径，构建时设 VITE_BASE_PATH=/repo-name/ 即可。
  base: (process.env.VITE_BASE_PATH as `/${string}/` | undefined) ?? '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
