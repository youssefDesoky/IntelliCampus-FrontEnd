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
    https: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5122',
        changeOrigin: true,
        secure: false,
      },
    },
  }
})