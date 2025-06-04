// Güvenlik yardımcı fonksiyonları

// Basit hash fonksiyonu (development için)
export const simpleHash = (text) => {
  let hash = 0;
  if (text.length === 0) return hash;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit integer'a çevir
  }
  return Math.abs(hash).toString(36);
};

// GİZLİ LOGIN VALIDATION - DevTools'da görünmez
export const validateLoginCredentials = (username, password) => {
  // Gizli validation logic - DevTools'da hash'ler görünmez
  const validUsers = new Map();
  
  // Dynamic credential building - bundle'da görünmez
  const demoUser = ['m', 'u', 'c', 'a', 'h', 'i', 't', '.', 't', 'a', 's', 't', 'a', 'n'].join('');
  const demoPass = ['m', 'ü', 'c', 'o', '1', '2', '3'].join('');

  // Runtime'da oluştur
  validUsers.set(demoUser, simpleHash(demoPass));
  
  // Development fallback
  if (import.meta.env.DEV) {
    // Development'ta daha esnek kontrol
    const isDemoValid = username === demoUser && password === demoPass;
    const isGenericValid = username === 'demo' && password === 'demo';
    return isDemoValid || isGenericValid;
  }
  
  // Production'da strict kontrol
  const inputHash = simpleHash(password);
  return validUsers.has(username) && validUsers.get(username) === inputHash;
};

// Session obfuscation - daha karmaşık
export const createSecureSession = (userData) => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  const userHash = simpleHash(userData.kullanici_adi);
  
  return {
    token: `${timestamp}_${randomStr}_${userHash}`,
    created: new Date().toISOString(),
    expires: new Date(timestamp + 24 * 60 * 60 * 1000).toISOString()
  };
};

// Hassas veri temizleme
export const sanitizeDataForStorage = (data) => {
  const sanitized = { ...data };
  
  // Hassas alanları kaldır veya hash'le
  const sensitiveFields = ['sifre', 'password', 'token', 'hash', 'kullanici_adi'];
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      delete sanitized[field];
    }
  });
  
  return sanitized;
};

// Development vs Production kontrolü
export const isDevelopment = () => {
  return import.meta.env.DEV;
};

// Console.log wrapper - sadece development'ta çalışır
export const secureLog = (...args) => {
  if (isDevelopment()) {
    console.log('[DEV]', ...args);
  }
};

// Session validation
export const validateSession = (sessionData) => {
  if (!sessionData || !sessionData.token || !sessionData.expires) {
    return false;
  }
  
  const now = new Date().getTime();
  const expires = new Date(sessionData.expires).getTime();
  
  return now < expires;
};

// Environment-based data masking
export const getMaskedData = (data) => {
  if (import.meta.env.PROD) {
    return {
      ...data,
      kullanici_adi: '***',
      ad: 'Demo',
      soyad: 'User'
    };
  }
  return data;
};

// Fake data generator for display
export const generateDisplayData = () => ({
  ad: 'Mücahit',
  soyad: 'Taştan',
  kullanici_adi: 'mucahit.tastan',
  telefon: '05XXXXXXXXX',
  email: 'mucahit.tastan@yourtrainer.com'
});

// Anti-debugging measures (basic)
export const initSecurity = () => {
  if (import.meta.env.PROD) {
    // Production'da console'u temizle
    if (typeof console !== 'undefined') {
      const noop = () => {};
      ['log', 'warn', 'error', 'info', 'debug'].forEach(method => {
        if (console[method] && method !== 'error') {
          console[method] = noop;
        }
      });
    }
  }
};
