// Assets Export File
// Tüm asset'leri buradan import/export ediyoruz

// Constants
export * from './constants/app.js';

// Images
export const IMAGES = {
  // Profile Images
  PROFILE_MUCAHIT: '/assets/images/avatars/mucahit.tastan.jpg',
  
  // Placeholder Images
  PROFILE_PLACEHOLDER: '/assets/images/profile-placeholder.png',
  CLIENT_PLACEHOLDER: '/assets/images/client-placeholder.png',
  
  // App Images
  LOGO: '/logo.svg',
  ICON: '/icons/icon.svg'
};

// Icons
export const ICONS = {
  APP_ICON: '/icons/icon.svg',
  MANIFEST_ICONS: {
    ICON_72: '/icons/icon-72x72.png',
    ICON_144: '/icons/icon-144x144.png',
    ICON_192: '/icons/icon-192x192.png',
    ICON_512: '/icons/icon-512x512.png'
  }
};

// Constants
export const ASSETS_PATHS = {
  IMAGES: '/assets/images/',
  AVATARS: '/assets/images/avatars/',
  ICONS: '/assets/icons/',
  PUBLIC: '/assets/'
};

// Helper Functions
export const getProfileImage = (filename) => {
  if (!filename) return IMAGES.PROFILE_PLACEHOLDER;
  if (filename.startsWith('http') || filename.startsWith('/')) return filename;
  return `${ASSETS_PATHS.AVATARS}${filename}`;
};

export const getAssetPath = (category, filename) => {
  const basePath = ASSETS_PATHS[category.toUpperCase()] || ASSETS_PATHS.PUBLIC;
  return `${basePath}${filename}`;
};
