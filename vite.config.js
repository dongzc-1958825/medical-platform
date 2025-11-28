import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 关键修复：base路径配置
  base: process.env.NODE_ENV === 'production' ? '/medical-platform/' : '/',
  
  // 构建配置
  build: {
    // 关键修复：输出目录改为docs以兼容GitHub Pages
    outDir: 'docs',
    
    // 其他优化配置
    sourcemap: false,
    minify: 'esbuild',
    target: 'esnext',
    
    // 移除有问题的手动分块，让Vite自动优化
    // rollupOptions: {
    //   output: {
    //     manualChunks: undefined // 让Vite自动决定分块策略
    //   }
    // }
  },
  
  // 开发服务器配置
  server: {
    port: 3000,
    open: true,
    host: true
  },
  
  // 预览配置
  preview: {
    port: 3000,
    host: true
  },
  
  // 解析配置
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})