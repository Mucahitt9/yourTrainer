// Güvenlik yardımcı fonksiyonları - Supabase Authentication ile kullanım

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

// Environment-based data masking
export const getMaskedData = (data) => {
  if (import.meta.env.PROD) {
    return {
      ...data,
      email: '***@***.com',
      telefon: '05** *** ** **'
    };
  }
  return data;
};

// Fake data generator for display (development)
export const generateDisplayData = () => ({
  ad: 'Demo',
  soyad: 'User',
  email: 'demo@yourtrainer.com',
  telefon: '05XX XXX XX XX'
});

// Anti-debugging measures (basic)
export const initSecurity = () => {
  if (import.meta.env.PROD) {
    // Production'da console'u temizle
    if (typeof console !== 'undefined') {
      const noop = () => {};
      ['log', 'warn', 'info', 'debug'].forEach(method => {
        if (console[method] && method !== 'error') {
          console[method] = noop;
        }
      });
    }
  }
};

// Kullanıcı adı validation
export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9._-]+$/;
  return usernameRegex.test(username) && username.length >= 3 && username.length <= 30;
};

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength check
export const validatePassword = (password) => {
  return {
    isValid: password.length >= 6,
    length: password.length >= 6,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /\d/.test(password),
    strength: password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password) ? 'strong' : 
              password.length >= 6 ? 'medium' : 'weak'
  };
};

// Form data sanitization
export const sanitizeFormData = (data) => {
  const sanitized = {};
  
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      // String değerleri trim et
      if (typeof data[key] === 'string') {
        sanitized[key] = data[key].trim();
      } else {
        sanitized[key] = data[key];
      }
    }
  });
  
  return sanitized;
};

// XSS protection
export const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

// Safe JSON parse
export const safeJsonParse = (text, defaultValue = null) => {
  try {
    return JSON.parse(text);
  } catch (error) {
    console.warn('JSON parse error:', error);
    return defaultValue;
  }
};

// Input rate limiting (simple)
export const createRateLimiter = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map();
  
  return (identifier) => {
    const now = Date.now();
    const userAttempts = attempts.get(identifier) || { count: 0, firstAttempt: now };
    
    // Reset if window expired
    if (now - userAttempts.firstAttempt > windowMs) {
      userAttempts.count = 0;
      userAttempts.firstAttempt = now;
    }
    
    userAttempts.count++;
    attempts.set(identifier, userAttempts);
    
    return {
      allowed: userAttempts.count <= maxAttempts,
      remaining: Math.max(0, maxAttempts - userAttempts.count),
      resetTime: userAttempts.firstAttempt + windowMs
    };
  };
};

// Session validation for client-side
export const validateClientSession = (sessionData) => {
  if (!sessionData || typeof sessionData !== 'object') {
    return false;
  }
  
  const required = ['isAuthenticated', 'ptData', 'loginTime'];
  return required.every(field => sessionData.hasOwnProperty(field));
};

// Generate secure random string
export const generateSecureRandom = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

// Client-side data encryption (simple obfuscation)
export const obfuscateData = (data) => {
  const key = 'yourtrainer_key_2024';
  const jsonString = JSON.stringify(data);
  
  return btoa(jsonString + key).split('').reverse().join('');
};

// Client-side data decryption
export const deobfuscateData = (obfuscatedData) => {
  try {
    const key = 'yourtrainer_key_2024';
    const reversed = obfuscatedData.split('').reverse().join('');
    const decoded = atob(reversed);
    const jsonString = decoded.replace(key, '');
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('Deobfuscation error:', error);
    return null;
  }
};

export default {
  simpleHash,
  isDevelopment,
  secureLog,
  getMaskedData,
  generateDisplayData,
  initSecurity,
  validateUsername,
  validateEmail,
  validatePassword,
  sanitizeFormData,
  escapeHtml,
  safeJsonParse,
  createRateLimiter,
  validateClientSession,
  generateSecureRandom,
  obfuscateData,
  deobfuscateData
};
