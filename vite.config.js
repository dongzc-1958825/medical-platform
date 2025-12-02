import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // HashRouter配置：使用相对路径
  // 对于GitHub Pages，如果部署在项目子路径（如username.github.io/repo-name）
  // 应该设置为 '/repo-name/'，但如果使用HashRouter，'./' 通常也能工作
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
    outDir: 'dist', // 构建输出目录
    
    // 生产环境关闭sourcemap以提高性能
    sourcemap: false,
    
    // 拆包配置
    rollupOptions: {
      output: {
        // 资产文件命名
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'images';
          } else if (/woff2?|eot|ttf|otf/i.test(extType)) {
            extType = 'fonts';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        
        // chunk文件命名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        
        // 入口文件命名
        entryFileNames: 'assets/js/[name]-[hash].js',
        
        // 手动拆包（可选）
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['tailwindcss', '@heroicons/react'],
        }
      }
    },
    
    // 构建输出目标
    target: 'es2020',
    
    // 最小化配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境移除console
        drop_debugger: true,
      },
    },
    
    // 分块大小警告阈值
    chunkSizeWarningLimit: 1000,
  },
  
  // 开发服务器配置
  server: {
    port: 3000,
    open: true, // 自动打开浏览器
    host: true, // 监听所有地址
    strictPort: false, // 如果端口被占用，尝试其他端口
    
    // 代理配置（如果需要后端API）
    proxy: {
      // '/api': {
      //   target: 'http://localhost:5000',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, ''),
      // },
    },
    
    // 热更新配置
    hmr: {
      overlay: true, // 显示错误覆盖层
    },
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
    devSourcemap: false, // 开发环境CSS sourcemap
    modules: {
      localsConvention: 'camelCase',
    },
  },
  
  // 优化依赖预构建
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
    ],
    exclude: [],
  },
})