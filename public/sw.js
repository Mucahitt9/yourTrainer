// Service Worker for YourTrainer PWA - Optimized v1.4.0
const CACHE_VERSION = '1.4.0';
const STATIC_CACHE_NAME = `yourtrainer-static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `yourtrainer-dynamic-v${CACHE_VERSION}`;
const IMAGE_CACHE_NAME = `yourtrainer-images-v${CACHE_VERSION}`;

// Cache stratejileri
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Önbellek konfigürasyonları
const CACHE_CONFIGS = {
  STATIC: {
    name: STATIC_CACHE_NAME,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 gün
    maxEntries: 50
  },
  DYNAMIC: {
    name: DYNAMIC_CACHE_NAME,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    maxAge: 24 * 60 * 60 * 1000, // 1 gün
    maxEntries: 30
  },
  IMAGES: {
    name: IMAGE_CACHE_NAME,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
    maxEntries: 100
  }
};

// Kritik statik dosyalar (hemen cache'lenecek)
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg'
];

// Runtime cache pattern'leri
const CACHE_PATTERNS = [
  { 
    pattern: /\.(js|css)$/,
    config: CACHE_CONFIGS.STATIC
  },
  { 
    pattern: /\.(png|jpg|jpeg|svg|gif|webp|ico)$/i,
    config: CACHE_CONFIGS.IMAGES
  },
  { 
    pattern: /\/(dashboard|clients|profile)/,
    config: CACHE_CONFIGS.DYNAMIC
  }
];

// Service Worker Install Event
self.addEventListener('install', (event) => {
  console.log(`[SW] Installing service worker v${CACHE_VERSION}...`);
  
  event.waitUntil(
    Promise.all([
      // Kritik dosyaları cache'le
      caches.open(STATIC_CACHE_NAME)
        .then((cache) => {
          console.log('[SW] Caching critical assets...');
          return cache.addAll(CRITICAL_ASSETS);
        }),
      // Hemen aktif hale getir
      self.skipWaiting()
    ])
    .then(() => {
      console.log('[SW] Critical assets cached successfully');
    })
    .catch((error) => {
      console.error('[SW] Failed to cache critical assets:', error);
    })
  );
});

// Service Worker Activate Event
self.addEventListener('activate', (event) => {
  console.log(`[SW] Activating service worker v${CACHE_VERSION}...`);
  
  event.waitUntil(
    Promise.all([
      // Eski cache'leri temizle
      cleanupOldCaches(),
      // Tüm clientları kontrol et
      self.clients.claim()
    ])
  );
});

// Eski cache'leri temizleme
async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const validCacheNames = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME, IMAGE_CACHE_NAME];
  
  const deletePromises = cacheNames
    .filter(cacheName => 
      cacheName.startsWith('yourtrainer-') && 
      !validCacheNames.includes(cacheName)
    )
    .map(cacheName => {
      console.log('[SW] Deleting old cache:', cacheName);
      return caches.delete(cacheName);
    });
  
  return Promise.all(deletePromises);
}

// Fetch Event - İstek yakalama ve cache stratejileri
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Sadece aynı origin isteklerini handle et
  if (url.origin !== location.origin || request.method !== 'GET') {
    return;
  }

  event.respondWith(handleRequest(request));
});

// Ana istek handling fonksiyonu
async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Cache pattern'ine göre strateji belirle
    const cacheConfig = getCacheConfig(url.pathname);
    
    switch (cacheConfig.strategy) {
      case CACHE_STRATEGIES.CACHE_FIRST:
        return await cacheFirst(request, cacheConfig);
      
      case CACHE_STRATEGIES.NETWORK_FIRST:
        return await networkFirst(request, cacheConfig);
      
      case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      default:
        return await staleWhileRevalidate(request, cacheConfig);
    }
  } catch (error) {
    console.error('[SW] Error handling request:', error);
    return handleOfflineFallback(request);
  }
}

// Cache konfigürasyonu belirleme
function getCacheConfig(pathname) {
  for (const { pattern, config } of CACHE_PATTERNS) {
    if (pattern.test(pathname)) {
      return config;
    }
  }
  return CACHE_CONFIGS.DYNAMIC; // Default
}

// Cache First Stratejisi
async function cacheFirst(request, config) {
  const cache = await caches.open(config.name);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse && !isExpired(cachedResponse, config.maxAge)) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
      await limitCacheSize(config.name, config.maxEntries);
    }
    return networkResponse;
  } catch (error) {
    if (cachedResponse) {
      console.log('[SW] Serving stale cache due to network error');
      return cachedResponse;
    }
    return handleOfflineFallback(request);
  }
}

// Network First Stratejisi
async function networkFirst(request, config) {
  try {
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), 3000)
      )
    ]);
    
    if (networkResponse.ok) {
      const cache = await caches.open(config.name);
      await cache.put(request, networkResponse.clone());
      await limitCacheSize(config.name, config.maxEntries);
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache...');
    const cache = await caches.open(config.name);
    const cachedResponse = await cache.match(request);
    return cachedResponse || handleOfflineFallback(request);
  }
}

// Stale While Revalidate Stratejisi
async function staleWhileRevalidate(request, config) {
  const cache = await caches.open(config.name);
  const cachedResponse = await cache.match(request);
  
  // Arka planda güncelleme
  const fetchPromise = fetch(request)
    .then(async (networkResponse) => {
      if (networkResponse.ok) {
        await cache.put(request, networkResponse.clone());
        await limitCacheSize(config.name, config.maxEntries);
      }
      return networkResponse;
    })
    .catch((error) => {
      console.log('[SW] Background fetch failed:', error);
    });
  
  // Cache varsa onu döndür, yoksa network'ü bekle
  if (cachedResponse && !isExpired(cachedResponse, config.maxAge)) {
    return cachedResponse;
  }
  
  try {
    return await fetchPromise;
  } catch (error) {
    return cachedResponse || handleOfflineFallback(request);
  }
}

// Cache expiry kontrolü
function isExpired(response, maxAge) {
  if (!maxAge) return false;
  
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return false;
  
  const cacheDate = new Date(dateHeader);
  const now = new Date();
  return (now.getTime() - cacheDate.getTime()) > maxAge;
}

// Offline fallback handling
async function handleOfflineFallback(request) {
  const url = new URL(request.url);
  
  // SPA rotaları için index.html döndür
  if (url.pathname.startsWith('/dashboard') || 
      url.pathname.startsWith('/clients') || 
      url.pathname.startsWith('/profile')) {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const fallback = await cache.match('/index.html');
    if (fallback) return fallback;
  }
  
  // Resimler için placeholder
  if (/\.(png|jpg|jpeg|svg|gif|webp)$/i.test(url.pathname)) {
    return new Response(
      '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" fill="#9ca3af">Çevrimdışı</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
  
  // Genel hata response
  return new Response(
    JSON.stringify({
      error: 'Çevrimdışı',
      message: 'Bu sayfa çevrimdışı modda kullanılamıyor.'
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    }
  );
}

// Cache boyut sınırlama (LRU)
async function limitCacheSize(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxEntries) {
    const deleteCount = keys.length - maxEntries;
    const deletePromises = keys
      .slice(0, deleteCount)
      .map(key => cache.delete(key));
    
    await Promise.all(deletePromises);
    console.log(`[SW] Cache ${cacheName} cleaned up: ${deleteCount} items removed`);
  }
}

// Background Sync (gelecek özellik)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Offline'da yapılan değişiklikleri senkronize et
  console.log('[SW] Background sync completed');
}

// Message handling
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log(`[SW] Service Worker v${CACHE_VERSION} loaded successfully`);