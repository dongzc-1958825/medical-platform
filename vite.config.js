import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 🔧 HashRouter必须使用相对路径
  base: './',
  
  // 路径别名配置
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@types': resolve(__dirname, './src/types'),
      '@utils': resolve(__dirname, './src/utils'),
      '@assets': resolve(__dirname, './src/assets'),
    },
  },
  
  // 构建配置
  build: {
    outDir: 'dist',
    sourcemap: false,
    
    rollupOptions: {
      output: {
        // 资产文件命名
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1)
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'images'
          } else if (/woff2?|eot|ttf|otf/i.test(extType)) {
            extType = 'fonts'
          }
          return `assets/${extType}/[name]-[hash][extname]`
        },
        
        // chunk文件命名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        
        // 入口文件命名
        entryFileNames: 'assets/js/[name]-[hash].js',
        
        // ⚠️ 修复：移除有问题的manualChunks配置
        // manualChunks: undefined, // 保持单chunk或根据需要配置
      }
    },
    
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  
  // 开发服务器配置
  server: {
    port: 3000,
    open: true,
    host: true,
    strictPort: false,
  },
  
  // 预览配置
  preview: {
    port: 4173,
    host: true,
    open: true,
  },
  
  // 环境变量配置
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  
  // CSS配置
  css: {
    devSourcemap: false,
    modules: {
      localsConvention: 'camelCase',
    },
  },
  
  // 优化依赖预构建
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: [],
  },
})