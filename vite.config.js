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
  
  // 构建配置 - 关键修改：outDir 改为 'docs' 以兼容 GitHub Pages
  build: {
    // ⚠️ 重要修改：GitHub Pages 要求 docs 或根目录
    outDir: 'docs', // 从 'dist' 改为 'docs'
    
    // 生产环境关闭sourcemap
    sourcemap: false,
    
    // 资源文件大小警告阈值
    chunkSizeWarningLimit: 1000,
    
    // 拆包配置
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
      }
    },
    
    // 构建目标
    target: 'es2020',
    
    // 最小化配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境移除console
        drop_debugger: true,
      },
    },
  },
  
  // 开发服务器配置
  server: {
    port: 3000,
    open: true, // 自动打开浏览器
    host: true, // 监听所有地址
    strictPort: false, // 端口被占用时自动尝试其他端口
  },
  
  // 预览配置（生产构建预览）
  preview: {
    port: 4173,
    host: true,
    open: true,
  },
  
  // 环境变量配置
  define: {
    // 定义全局常量
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