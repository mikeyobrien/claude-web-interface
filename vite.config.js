// ABOUTME: Vite configuration for Vue.js development with API proxy
// ABOUTME: Configures Vue plugin, dev server settings, and build options

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5080',
        changeOrigin: true,
        secure: false
      }
    }
  },
  
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue']
        }
      }
    }
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src')
    }
  }
})