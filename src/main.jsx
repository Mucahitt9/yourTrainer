import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/globals.css'

// Performance monitoring
if (typeof window !== 'undefined') {
  // Memory usage monitoring (dev only)
  if (import.meta.env.DEV) {
    setInterval(() => {
      if ('memory' in performance) {
        const memory = performance.memory;
        console.log('Memory usage:', {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + ' MB',
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + ' MB',
          limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + ' MB'
        });
      }
    }, 30000); // Every 30 seconds
  }
}

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Vite PWA plugin kendi service worker'ını register eder
      // Sadece manuel register etmemiz gereken durumlar için
      
      // Service Worker mesaj dinleme
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_UPDATE_AVAILABLE') {
          // Yeni versiyon mevcut, kullanıcıya bildir
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('YourTrainer güncellemesi mevcut!', {
              body: 'Yeni özellikler için sayfayı yenileyin.',
              icon: '/logo.svg',
              tag: 'app-update'
            });
          }
        }
      });
      
      console.log('✅ PWA Service Worker ready');
      
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  });
}

// PWA Install Prompt Handling
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('💾 PWA install prompt available');
  e.preventDefault();
  deferredPrompt = e;
});

// PWA Install Success
window.addEventListener('appinstalled', () => {
  console.log('🎉 PWA installed successfully');
  deferredPrompt = null;
  
  // Analytics event
  if ('gtag' in window) {
    window.gtag('event', 'pwa_install', {
      event_category: 'PWA',
      event_label: 'YourTrainer'
    });
  }
});

// Error boundary for unhandled promises
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

// Preload critical fonts
const preloadFont = (href) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'font';
  link.type = 'font/woff2';
  link.crossOrigin = 'anonymous';
  link.href = href;
  document.head.appendChild(link);
};

// Preload Inter font
preloadFont('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
