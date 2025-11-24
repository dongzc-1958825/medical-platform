// vite.config.js - 修改base配置
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // 关键修改：对于GitHub Pages使用绝对路径
  base: '/medical-platform/',
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    
    rollupOptions: {
      output: {
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
    
    chunkSizeWarningLimit: 1000
  },
  
  server: {
    port: 3000,
    open: true
  },
  
  preview: {
    port: 3001,
    host: true
  }
})