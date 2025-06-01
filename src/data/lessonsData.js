// Mock Lessons Data
// Lesson status types
export const LESSON_STATUS = {
  PLANNED: 'planlandi',
  COMPLETED: 'tamamlandi', 
  CANCELLED: 'iptal',
  NO_SHOW: 'gelmedi'
};

// Mock lessons - başlangıçta boş, kullanıcı ders ekledikçe dolacak
export const mockLessonsData = [
  {
    id: "lesson_1",
    musteri_id: 1, // Ayşe Demir
    pt_id: 1,
    
    // Planlanan bilgiler
    planlanan_tarih: "2024-05-15",
    planlanan_saat: "14:00",
    planlanan_gun: "Çarşamba",
    
    // Gerçek bilgiler 
    gercek_tarih: "2024-05-15",
    gercek_saat: "14:15",
    
    // Ders durumu
    durum: LESSON_STATUS.COMPLETED,
    
    // İçerik
    ders_notlari: "İlk ders, temel hareketleri öğrettik. Motivasyonu çok yüksek!",
    egzersizler: ["Squat", "Push-up", "Plank"],
    zorluk_seviyesi: 5, // 1-10
    performance_rating: 8, // 1-10
    
    // Metadata
    created_at: "2024-05-15T14:00:00Z",
    updated_at: "2024-05-15T15:30:00Z"
  },
  {
    id: "lesson_2", 
    musteri_id: 1, // Ayşe Demir
    pt_id: 1,
    
    planlanan_tarih: "2024-05-17",
    planlanan_saat: "14:00", 
    planlanan_gun: "Cuma",
    
    gercek_tarih: "2024-05-17",
    gercek_saat: "14:00",
    
    durum: LESSON_STATUS.COMPLETED,
    
    ders_notlari: "Squat tekniği gelişiyor, deadlift eklendi. Harika bir seans!",
    egzersizler: ["Squat", "Deadlift", "Romanian Deadlift", "Walking"],
    zorluk_seviyesi: 6,
    performance_rating: 9,
    
    created_at: "2024-05-17T14:00:00Z",
    updated_at: "2024-05-17T15:45:00Z"
  },
  {
    id: "lesson_3",
    musteri_id: 2, // Can Yılmaz  
    pt_id: 1,
    
    planlanan_tarih: "2024-05-16",
    planlanan_saat: "16:00",
    planlanan_gun: "Perşembe",
    
    gercek_tarih: null,
    gercek_saat: null,
    
    durum: LESSON_STATUS.NO_SHOW,
    
    ders_notlari: "Gelmeyen müşteri - telefon edildi, hastalık nedeniyle",
    egzersizler: [],
    zorluk_seviyesi: null,
    performance_rating: null,
    
    created_at: "2024-05-16T16:00:00Z", 
    updated_at: "2024-05-16T16:30:00Z"
  },
  {
    id: "lesson_4",
    musteri_id: 1, // Ayşe Demir - bugünkü ders
    pt_id: 1,
    
    planlanan_tarih: "2024-06-01", // Bugün
    planlanan_saat: "14:00",
    planlanan_gun: "Cumartesi",
    
    gercek_tarih: null,
    gercek_saat: null,
    
    durum: LESSON_STATUS.PLANNED,
    
    ders_notlari: "",
    egzersizler: [],
    zorluk_seviyesi: null,
    performance_rating: null,
    
    created_at: "2024-06-01T10:00:00Z",
    updated_at: "2024-06-01T10:00:00Z"
  },
  {
    id: "lesson_5",
    musteri_id: 2, // Can Yılmaz - yarınki ders
    pt_id: 1,
    
    planlanan_tarih: "2024-06-02", // Yarın
    planlanan_saat: "10:00",
    planlanan_gun: "Pazar",
    
    gercek_tarih: null,
    gercek_saat: null,
    
    durum: LESSON_STATUS.PLANNED,
    
    ders_notlari: "",
    egzersizler: [],
    zorluk_seviyesi: null,
    performance_rating: null,
    
    created_at: "2024-06-01T10:00:00Z",
    updated_at: "2024-06-01T10:00:00Z"
  }
];

// Lesson status display mapping
export const lessonStatusDisplay = {
  [LESSON_STATUS.PLANNED]: {
    label: 'Planlandı',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200'
  },
  [LESSON_STATUS.COMPLETED]: {
    label: 'Tamamlandı', 
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-200'
  },
  [LESSON_STATUS.CANCELLED]: {
    label: 'İptal Edildi',
    color: 'yellow', 
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200'
  },
  [LESSON_STATUS.NO_SHOW]: {
    label: 'Gelmedi',
    color: 'red',
    bgColor: 'bg-red-100', 
    textColor: 'text-red-800',
    borderColor: 'border-red-200'
  }
};

// Common exercises list for quick selection
export const commonExercises = [
  "Squat",
  "Deadlift", 
  "Bench Press",
  "Push-up",
  "Pull-up",
  "Plank",
  "Romanian Deadlift",
  "Lunges",
  "Shoulder Press",
  "Bent-over Row",
  "Dips",
  "Mountain Climbers",
  "Burpees",
  "Bicep Curls",
  "Tricep Extensions",
  "Leg Press",
  "Leg Curls", 
  "Calf Raises",
  "Lat Pulldown",
  "Chest Fly",
  "Walking",
  "Treadmill",
  "Cycling",
  "Stretching"
];

// Rating labels
export const ratingLabels = {
  1: "Çok Zor",
  2: "Zor", 
  3: "Orta-Zor",
  4: "Orta",
  5: "Normal",
  6: "Orta-Kolay",
  7: "Kolay",
  8: "Çok Kolay",
  9: "Mükemmel", 
  10: "Harika"
};

export const performanceLabels = {
  1: "Çok Kötü",
  2: "Kötü",
  3: "Zayıf", 
  4: "Orta-Zayıf",
  5: "Orta",
  6: "Orta-İyi",
  7: "İyi",
  8: "Çok İyi",
  9: "Mükemmel",
  10: "Harika"
};
