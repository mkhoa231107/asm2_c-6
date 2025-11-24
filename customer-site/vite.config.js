import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    strictPort: true,
    host: true, // để truy cập bằng mạng nội bộ nếu cần
    proxy: {
      // Quan trọng: tất cả /api sẽ tự chuyển sang backend port 5234
      '^/api': {
        target: 'http://localhost:5234',   // đúng port backend của bạn
        changeOrigin: true,
        secure: false
      },
      // Nếu bạn có Swagger
      '/swagger': {
        target: 'http://localhost:5234',
        changeOrigin: true,
        secure: false
      }
    }
  }
})