import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '192.168.1.132', // 👈 Bilgisayar IP'sinden erişim için bu şart
    port: 1997,       // 👈 Port numarası (telefon tarayıcısında da bu port kullanılacak)
    open: true        // Projeyi otomatik açar
  },
  build: {
    // PWA için optimizasyonlar
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          icons: ['lucide-react']
        }
      }
    },
    // Gzip sıkıştırma için chunk boyut limiti
    chunkSizeWarningLimit: 1000
  },
  // PWA için static asset handling
  publicDir: 'public',
  // Service Worker için base path
  base: '/'
})
