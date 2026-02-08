import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    mkcert(),
    tailwindcss()
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    https: true,
    proxy: {
      '/api': {
        target: 'https://192.168.1.15:5123',
        changeOrigin: true,
        secure: false,
      },
      '/materials': {
        target: 'https://192.168.1.15:5123',
        changeOrigin: true,
        secure: false,
      },
    },
  }
})