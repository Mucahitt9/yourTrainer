// Service Worker for YourTrainer PWA
const CACHE_NAME = 'yourtrainer-v1.3.0';
const STATIC_CACHE_NAME = 'yourtrainer-static-v1.3.0';
const DYNAMIC_CACHE_NAME = 'yourtrainer-dynamic-v1.3.0';

// Cache stratejileri
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Önbelleğe alınacak statik dosyalar
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg'
];

// Dinamik önbelleğe alınacak rota pattern'leri
const DYNAMIC_ROUTES = [
  '/dashboard',
  '/clients',
  '/clients/new',
  '/clients/list',
  '/profile',
  '/login'
];

// Maximum cache boyutu
const MAX_CACHE_SIZE = 50;

// Service Worker Install Event
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting(); // Yeni SW'yi hemen aktif et
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Service Worker Activate Event
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    Promise.all([
      // Eski cache'leri temizle
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE_NAME &&
              cacheName.startsWith('yourtrainer-')
            ) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Tüm clientları kontrol et
      self.clients.claim()
    ])
  );
});

// Fetch Event - İstek yakalama ve cache stratejileri
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Sadece aynı origin isteklerini handle et
  if (url.origin !== location.origin) {
    return;
  }

  // GET isteklerini handle et
  if (request.method === 'GET') {
    event.respondWith(handleGetRequest(request));
  }
});

// GET isteklerini handle etme fonksiyonu
async function handleGetRequest(request) {
  const url = new URL(request.url);
  
  try {
    // 1. Statik dosyalar için Cache First stratejisi
    if (isStaticAsset(url.pathname)) {
      return await cacheFirst(request, STATIC_CACHE_NAME);
    }
    
    // 2. SPA rotaları için Stale While Revalidate
    if (isSPARoute(url.pathname)) {
      return await staleWhileRevalidate(request, DYNAMIC_CACHE_NAME);
    }
    
    // 3. API istekleri için Network First
    if (url.pathname.startsWith('/api/')) {
      return await networkFirst(request, DYNAMIC_CACHE_NAME);
    }
    
    // 4. Diğer istekler için varsayılan strateji
    return await staleWhileRevalidate(request, DYNAMIC_CACHE_NAME);
    
  } catch (error) {
    console.error('[SW] Error handling request:', error);
    return await handleOfflineFallback(request);
  }
}

// Cache First Stratejisi
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, no cache available');
    return await handleOfflineFallback(request);
  }
}

// Network First Stratejisi
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
      await limitCacheSize(cacheName, MAX_CACHE_SIZE);
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache...');
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    return cachedResponse || await handleOfflineFallback(request);
  }
}

// Stale While Revalidate Stratejisi
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Arka planda güncelleme yap
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
        limitCacheSize(cacheName, MAX_CACHE_SIZE);
      }
      return networkResponse;
    })
    .catch((error) => {
      console.log('[SW] Background update failed:', error);
    });
  
  // Cache varsa onu döndür, yoksa network'ü bekle
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    return await fetchPromise;
  } catch (error) {
    return await handleOfflineFallback(request);
  }
}

// Offline fallback handling
async function handleOfflineFallback(request) {
  const url = new URL(request.url);
  
  // SPA rotaları için index.html döndür
  if (isSPARoute(url.pathname)) {
    const cache = await caches.open(STATIC_CACHE_NAME);
    return await cache.match('/index.html') || new Response(
      'Çevrimdışı moddasınız. Lütfen internet bağlantınızı kontrol edin.',
      { 
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      }
    );
  }
  
  // Diğer istekler için hata mesajı
  return new Response(
    JSON.stringify({
      error: 'Çevrimdışı',
      message: 'Bu istek çevrimdışı modda kullanılamıyor.'
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    }
  );
}

// Helper Functions
function isStaticAsset(pathname) {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.svg', '.ico', '.woff', '.woff2'];
  return staticExtensions.some(ext => pathname.endsWith(ext)) ||
         STATIC_ASSETS.includes(pathname);
}

function isSPARoute(pathname) {
  return DYNAMIC_ROUTES.some(route => pathname.startsWith(route)) ||
         pathname === '/' ||
         pathname.startsWith('/clients/');
}

// Cache boyut limitlememk
async function limitCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxSize) {
    // En eski cache'leri sil
    const deletePromises = keys
      .slice(0, keys.length - maxSize)
      .map(key => cache.delete(key));
    
    await Promise.all(deletePromises);
    console.log(`[SW] Cache ${cacheName} cleaned up to ${maxSize} items`);
  }
}

// Background Sync için (gelecekte eklenebilir)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Background sync işlemleri burada yapılabilir
  // Örneğin: pending form submissions, data updates vb.
  console.log('[SW] Background sync completed');
}

// Push notifications için (gelecekte eklenebilir)
self.addEventListener('push', (event) => {
  console.log('[SW] Push message received:', event);
  
  // Push notification handling burada yapılabilir
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);
  
  event.notification.close();
  
  // Notification click'e göre uygun sayfaya yönlendirme
  event.waitUntil(
    self.clients.openWindow('/dashboard')
  );
});

console.log('[SW] Service Worker script loaded successfully');