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
        target: 'http://localhost:5122',
        changeOrigin: true,
        secure: false,
      },
      '/materials': {
        target: 'http://localhost:5122',
        changeOrigin: true,
        secure: false,
      },
      '/images': {
        target: 'http://localhost:5122',
        changeOrigin: true,
        secure: false,
        bypass(req) {
          if (req.url.match(/\.(png|jpg|jpeg|svg|gif|webp)$/)) {
            return req.url;
          }
        }
      },
      '/hubs': {
        target: 'http://localhost:5122',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  }
})