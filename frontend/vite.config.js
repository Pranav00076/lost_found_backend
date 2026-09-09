import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        target: 'https://lost-found-backend-xz82.onrender.com',
        changeOrigin: true
      }
    }
  }
})