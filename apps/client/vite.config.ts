import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const { PORT, HOST, VITE_PORT = 3000 } = process.env;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: HOST,
    port: +VITE_PORT,
    proxy: {
      '/api/': {
        target: `http://${HOST}:${PORT}`,
        changeOrigin: true
      }
    },
    watch: {
      usePolling: true,
    },
  },
})
