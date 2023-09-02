import dotenv from 'dotenv'
dotenv.config()

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const { PORT, HOST, VITE_PORT = 3000, API_ROUTES_PREFIX } = process.env

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './src/client',
  publicDir: '../../public',
  server: {
    host: HOST,
    port: +VITE_PORT,
    proxy: {
      '/api': {
        target: `http://api:${PORT}/${API_ROUTES_PREFIX}`,
        changeOrigin: true
      }
    }
  },
  build: {
    manifest: true,
    outDir: '../../dist/client'
  }
})
