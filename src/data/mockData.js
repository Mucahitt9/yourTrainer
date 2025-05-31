// Mock PT (Personal Trainer) verileri
export const mockPTData = {
  id: 1,
  kullanici_adi: "faruktastan",
  ad: "Faruk",
  soyad: "Taştan",
  uzmanlik_alani: "Fonksiyonel Antrenman, Kilo Verme, Postür Düzeltme",
  yas: 26,
  profil_resmi_url: "/profile-placeholder.jpg",
  ders_basina_ucret: 850, // TL
  kayit_tarihi: "2024-01-15",
  aktif_mi: true
};

// Mock Üye verileri - başlangıçta boş, eklendikçe dolacak
export const mockMusteriData = [
  {
    id: 1,
    pt_id: 1,
    ad: "Ayşe",
    soyad: "Demir",
    yas: 25,
    alinan_ders_sayisi: 40,
    ders_basina_ucret: 200,
    toplam_ucret: 8000,
    ders_baslangic_tarihi: "2024-02-01",
    tahmini_bitis_tarihi: "2024-05-15",
    haftalik_ders_gunleri: ["Pazartesi", "Çarşamba", "Cuma"],
    vucut_olculeri: {
      boy: 165,
      kilo: 70,
      bel: 75,
      kalca: 95,
      gogus: 85
    },
    kayit_tarihi: "2024-01-20",
    aktif_mi: true,
    notlar: "İlk PT deneyimi, motivasyonu yüksek"
  },
  {
    id: 2,
    pt_id: 1,
    ad: "Can",
    soyad: "Yılmaz",
    yas: 32,
    alinan_ders_sayisi: 20,
    ders_basina_ucret: 200,
    toplam_ucret: 4000,
    ders_baslangic_tarihi: "2024-02-15",
    tahmini_bitis_tarihi: "2024-04-10",
    haftalik_ders_gunleri: ["Salı", "Perşembe"],
    vucut_olculeri: {
      boy: 180,
      kilo: 85,
      bel: 90,
      kalca: 100,
      gogus: 105
    },
    kayit_tarihi: "2024-02-10",
    aktif_mi: true,
    notlar: "Kas gelişimi odaklı program"
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
