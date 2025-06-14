// Application Constants
export const APP_CONFIG = {
  NAME: 'YourTrainer',
  VERSION: '1.4.0',
  DESCRIPTION: 'Personal Trainer Üye Kayıt Sistemi',
  AUTHOR: 'YourTrainer Team'
};

// File Upload Constants
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGE_DIMENSION: 1000, // 1000px
  SUPPORTED_IMAGE_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  COMPRESSION_QUALITY: 0.8 // 80%
};

// UI Constants
export const UI_CONFIG = {
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  MAX_CONTENT_WIDTH: 1200,
  ANIMATION_DURATION: 300
};

// Business Logic Constants
export const BUSINESS_RULES = {
  MIN_AGE: 18,
  MAX_AGE: 80,
  MIN_LESSON_PRICE: 50,
  MAX_LESSON_PRICE: 2000,
  MIN_LESSON_COUNT: 1,
  MAX_LESSON_COUNT: 200
};

// Default Values
export const DEFAULTS = {
  LESSON_PRICE: 200,
  LESSON_TIME: '14:00',
  PERFORMANCE_RATING: 7,
  DIFFICULTY_LEVEL: 5
};

// Routes
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CLIENTS: '/clients',
  CLIENT_NEW: '/clients/new',
  CLIENT_LIST: '/clients/list',
  CLIENT_DETAIL: '/clients/:id',
  CLIENT_EDIT: '/clients/:id/edit',
  LESSONS: '/lessons',
  PROFILE: '/profile'
};

// Storage Keys
export const STORAGE_KEYS = {
  PT_SESSION: 'pt_session',
  CLIENTS: 'musteriler',
  LESSONS: 'lessons',
  THEME: 'theme_preference',
  LANGUAGE: 'language_preference'
};

// Status Values
export const STATUS = {
  ACTIVE: true,
  INACTIVE: false,
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Haftalık ders günleri seçenekleri
export const haftaninGunleri = [
  { value: "Pazartesi", label: "Pazartesi" },
  { value: "Salı", label: "Salı" },
  { value: "Çarşamba", label: "Çarşamba" },
  { value: "Perşembe", label: "Perşembe" },
  { value: "Cuma", label: "Cuma" },
  { value: "Cumartesi", label: "Cumartesi" },
  { value: "Pazar", label: "Pazar" }
];
