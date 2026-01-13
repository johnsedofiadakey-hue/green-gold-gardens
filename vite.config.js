import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This allows you to view the site on your phone if connected to the same WiFi
    host: true, 
    port: 5173,
  },
  build: {
    // Ensures clean builds for deployment
    outDir: 'dist',
    sourcemap: false
  }
})