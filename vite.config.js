import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  base: "/medical-platform/",
  build: {
    outDir: "docs",
    assetsDir: "assets",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // 添加时间戳到文件名，强制新版本
        assetFileNames: "assets/[name]-[hash]-[timestamp][extname]",
        chunkFileNames: "assets/[name]-[hash]-[timestamp].js",
        entryFileNames: "assets/[name]-[hash]-[timestamp].js"
      }
    }
  }
})
