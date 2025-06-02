# Assets Klasör Yapısı

Bu klasör projedeki tüm statik varlıkları (assets) organize eder.

## 📁 Klasör Yapısı

```
src/assets/
├── index.js          # Ana export dosyası
├── images/           # Resim dosyaları
│   └── avatars/      # Profil fotoğrafları
├── icons/            # Icon dosyaları
└── constants/        # Sabit değerler
```

## 🔧 Kullanım

### 1. Images Import Etme
```javascript
import { IMAGES } from '../assets';

// Kullanım
<img src={IMAGES.PROFILE_MUCAHIT} alt="Profile" />
<img src={IMAGES.LOGO} alt="Logo" />
```

### 2. Helper Functions
```javascript
import { getProfileImage, getAssetPath } from '../assets';

// Profil resmi almak için
const profileSrc = getProfileImage('mucahit.tastan.jpg');

// Genel asset path almak için  
const iconSrc = getAssetPath('icons', 'star.svg');
```

### 3. Constants
```javascript
import { ASSETS_PATHS } from '../assets';

// Base path'ler
console.log(ASSETS_PATHS.AVATARS); // "/assets/images/avatars/"
console.log(ASSETS_PATHS.ICONS);   // "/assets/icons/"
```

## 📝 Yeni Asset Ekleme

1. **Dosyayı uygun klasöre koyun**
2. **`index.js`'e ekleyin:**
```javascript
export const IMAGES = {
  // Mevcut olanlar...
  NEW_IMAGE: '/assets/images/new-image.jpg'
};
```

## 🎯 Best Practices

- ✅ Tüm asset'leri `index.js`'ten export edin
- ✅ Anlamlı isimler kullanın (`PROFILE_MUCAHIT`, `LOGO`)
- ✅ Helper function'ları kullanın
- ✅ Kategorilere göre klasörlere ayırın
- ❌ Direct path kullanmayın (`/assets/...`)
- ❌ Component içinde hard-coded path yazmayın

## 🚀 Avantajları

- **Merkezi Yönetim**: Tüm asset'ler tek yerden kontrol
- **Type Safety**: IDE autocomplete desteği
- **Refactoring**: Kolay path değişiklikleri
- **Performance**: Vite optimizasyonları
- **Organization**: Temiz dosya yapısı
