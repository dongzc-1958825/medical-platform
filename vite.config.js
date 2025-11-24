import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 关键配置：基础路径 - 使用相对路径
  base: './',
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    
    // 构建优化配置
    rollupOptions: {
      output: {
        // 确保资源文件使用相对路径
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name.split('.')[1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return 'assets/images/[name]-[hash][extname]'
          }
          if (/css/i.test(extType)) {
            return 'assets/css/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    },
    
    // 构建大小警告阈值
    chunkSizeWarningLimit: 1000
  },
  
  server: {
    port: 3000,
    open: true // 开发服务器自动打开浏览器
  },
  
  // 预览配置（构建后本地预览）
  preview: {
    port: 3001,
    host: true
  }
})