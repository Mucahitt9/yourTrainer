import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '192.168.1.132', // 👈 Bilgisayar IP'sinden erişim için bu şart
    port: 1997,       // 👈 Port numarası (telefon tarayıcısında da bu port kullanılacak)
    open: true        // Projeyi otomatik açar
  }
})
