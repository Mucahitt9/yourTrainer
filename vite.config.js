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
    // PWA ve performance için optimizasyonlar
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Console.log'ları production'da kaldır
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.warn']
      }
    },
    rollupOptions: {
      output: {
        // Chunk splitting strategies
        manualChunks: {
          // Vendor libraries
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'icons-vendor': ['lucide-react'],
          
          // App chunks
          'auth': ['./src/utils/AuthContext.jsx', './src/utils/ToastContext.jsx'],
          'pages': [
            './src/pages/DashboardPage.jsx',
            './src/pages/ClientListPage.jsx'
          ]
        },
        // Better chunk names
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name)) {
            return `css/[name]-[hash].${ext}`;
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `img/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        }
      }
    },
    // Chunk boyut uyarılarını azalt
    chunkSizeWarningLimit: 600,
    // Sourcemap'leri production'da kapat
    sourcemap: false,
    // CSS kod splitting
    cssCodeSplit: true,
    // Asset inlining limiti
    assetsInlineLimit: 4096,
    // Rollup plugin'leri optimize et
    reportCompressedSize: false
  },
  // PWA için static asset handling
  publicDir: 'public',
  // Service Worker için base path
  base: '/',
  // CSS ön işleme optimizasyonu
  css: {
    devSourcemap: false
  },
  // Dependency pre-bundling optimizasyonu
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react'
    ],
    exclude: []
  }
})
