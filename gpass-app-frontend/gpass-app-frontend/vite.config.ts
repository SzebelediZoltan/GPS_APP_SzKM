import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    devtools(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    viteReact(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: false
      }
    },
    // Optimalizálás
    middlewareMode: false,
    preTransformRequests: ['node_modules/.vite/deps'],
  },
  optimizeDeps: {
    // Fontosabb függőségek előre betöltése
    include: [
      'react',
      'react-dom',
      '@tanstack/react-router',
      '@tanstack/react-query',
      'axios',
      'tailwindcss',
      'sonner',
      'lucide-react',
    ],
    // Google Generative AI kimarad az optimizálásból
    exclude: ['@google/generative-ai'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 2000,
    // Build optimalizálás
    minify: 'terser',
    sourcemap: false,
  }
})
