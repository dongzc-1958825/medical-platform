// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // 修改为根路径，确保路由正确
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'docs', // GitHub Pages 部署目录
    sourcemap: false,
  },
  server: {
    port: 5173,
    open: true,
  }
})