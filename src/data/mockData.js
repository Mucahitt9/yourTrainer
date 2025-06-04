import { IMAGES } from '../assets/index.js';

// Mock PT (Personal Trainer) verileri - GÜVENLİ FAKE DATA
export const mockPTData = {
  id: 1,
  kullanici_adi: "mucahit.tastan", // Fake kullanıcı adı
  ad: "Mücahit",
  soyad: "Taştan",
  uzmanlik_alani: "Fonksiyonel Antrenman, Kilo Verme, Postür Düzeltme",
  yas: 28,
  profil_resmi_url: IMAGES.PROFILE_MUCAHIT, // Image'i koruyabiliriz
  ders_basina_ucret: 850, // Fake ücret
  kayit_tarihi: "2024-01-15",
  aktif_mi: true
};

// Mock Üye verileri - FAKE DATA
export const mockMusteriData = [
  {
    id: 1,
    pt_id: 1,
    ad: "Zeynep",
    soyad: "Kaya",
    yas: 28,
    alinan_ders_sayisi: 24,
    ders_basina_ucret: 250,
    toplam_ucret: 6000,
    ders_baslangic_tarihi: "2024-03-01",
    tahmini_bitis_tarihi: "2024-06-15",
    haftalik_ders_gunleri: ["Pazartesi", "Çarşamba", "Cuma"],
    vucut_olculeri: {
      boy: 165,
      kilo: 68,
      bel: 72,
      kalca: 96,
      gogus: 86
    },
    kayit_tarihi: "2024-02-20",
    aktif_mi: true,
    notlar: "Motivasyonu yüksek, düzenli katılım",
    telefon: "05XXXXXXXXX"
  },
  {
    id: 2,
    pt_id: 1,
    ad: "Emre",
    soyad: "Özkan",
    yas: 35,
    alinan_ders_sayisi: 16,
    ders_basina_ucret: 250,
    toplam_ucret: 4000,
    ders_baslangic_tarihi: "2024-03-15",
    tahmini_bitis_tarihi: "2024-05-10",
    haftalik_ders_gunleri: ["Salı", "Perşembe"],
    vucut_olculeri: {
      boy: 178,
      kilo: 82,
      bel: 88,
      kalca: 98,
      gogus: 102
    },
    kayit_tarihi: "2024-03-10",
    aktif_mi: true,
    notlar: "Kas gelişimi odaklı program",
    telefon: "05XXXXXXXXX"
  },
  {
    id: 3,
    pt_id: 1,
    ad: "Selin",
    soyad: "Acar",
    yas: 29,
    alinan_ders_sayisi: 32,
    ders_basina_ucret: 250,
    toplam_ucret: 8000,
    ders_baslangic_tarihi: "2024-02-01",
    tahmini_bitis_tarihi: "2024-06-01",
    haftalik_ders_gunleri: ["Pazartesi", "Çarşamba"],
    vucut_olculeri: {
      boy: 170,
      kilo: 75,
      bel: 78,
      kalca: 100,
      gogus: 90
    },
    kayit_tarihi: "2024-01-25",
    aktif_mi: true,
    notlar: "Kilo verme hedefi, beslenme takibi",
    telefon: "05XXXXXXXXX"
  }
];

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

// Development/Production data control
export const getSecureData = () => {
  const isProduction = import.meta.env.PROD;
  
  if (isProduction) {
    // Production'da daha generic veriler
    return {
      ...mockPTData,
      ad: "Mücahit",
      soyad: "Taştan",
      kullanici_adi: "mucahit.tastan"
    };
  }
  
  return mockPTData;
};
