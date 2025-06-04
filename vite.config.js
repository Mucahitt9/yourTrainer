import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Minimal Vite config for Vercel deployment
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
})
