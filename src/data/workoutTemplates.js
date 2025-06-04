// Antrenman Template'leri
export const WORKOUT_CATEGORIES = {
  UPPER_BODY: 'upper_body',
  LOWER_BODY: 'lower_body', 
  CARDIO: 'cardio',
  FULL_BODY: 'full_body',
  HIIT: 'hiit',
  STRENGTH: 'strength',
  FLEXIBILITY: 'flexibility'
};

export const WORKOUT_TEMPLATES = [
  {
    id: 'upper_1',
    category: WORKOUT_CATEGORIES.UPPER_BODY,
    name: 'Üst Vücut - Başlangıç',
    duration: 45,
    difficulty: 3,
    exercises: [
      { name: 'Push-up', sets: 3, reps: 12, rest: 30, notes: 'Dizlerde yapabilirsiniz' },
      { name: 'Plank', sets: 3, duration: 30, rest: 15, notes: 'Karın sıkı tutun' },
      { name: 'Dumbbell Press', sets: 3, reps: 10, rest: 45, notes: '2-3kg ağırlık' },
      { name: 'Tricep Dips', sets: 2, reps: 8, rest: 30, notes: 'Sandalye kullanın' },
      { name: 'Bicep Curls', sets: 3, reps: 12, rest: 30, notes: 'Kontrollü hareket' }
    ],
    warmup: 'Kol çevirme (2dk), omuz şinirleri (1dk)',
    cooldown: 'Üst vücut germe (5dk)'
  },
  {
    id: 'upper_2', 
    category: WORKOUT_CATEGORIES.UPPER_BODY,
    name: 'Üst Vücut - İleri',
    duration: 60,
    difficulty: 7,
    exercises: [
      { name: 'Pull-ups', sets: 4, reps: 8, rest: 60, notes: 'Yardımcı bant kullanabilirsiniz' },
      { name: 'Bench Press', sets: 4, reps: 10, rest: 90, notes: 'Ağır ağırlık' },
      { name: 'Overhead Press', sets: 4, reps: 8, rest: 60, notes: 'Core aktivasyonu' },
      { name: 'Barbell Rows', sets: 4, reps: 10, rest: 60, notes: 'Sırt düz' },
      { name: 'Dips', sets: 3, reps: 12, rest: 45, notes: 'Tam range of motion' },
      { name: 'Face Pulls', sets: 3, reps: 15, rest: 30, notes: 'Omuz sağlığı için' }
    ],
    warmup: 'Dinamik ısınma (5dk), hafif cardio (3dk)',
    cooldown: 'Üst vücut deep stretch (8dk)'
  },
  {
    id: 'lower_1',
    category: WORKOUT_CATEGORIES.LOWER_BODY, 
    name: 'Alt Vücut - Başlangıç',
    duration: 40,
    difficulty: 4,
    exercises: [
      { name: 'Squat', sets: 3, reps: 15, rest: 45, notes: 'Dizler ayak parmakları hizasında' },
      { name: 'Lunges', sets: 3, reps: 10, rest: 30, notes: 'Her bacak için' },
      { name: 'Glute Bridge', sets: 3, reps: 12, rest: 30, notes: 'Kalça sıkın' },
      { name: 'Wall Sit', sets: 3, duration: 30, rest: 45, notes: 'Sırt duvarda düz' },
      { name: 'Calf Raises', sets: 3, reps: 20, rest: 30, notes: 'Kontrollü hareket' }
    ],
    warmup: 'Bacak salınımları (2dk), diz çevirme (1dk)',
    cooldown: 'Alt vücut germe (5dk)'
  },
  {
    id: 'lower_2',
    category: WORKOUT_CATEGORIES.LOWER_BODY,
    name: 'Alt Vücut - İleri', 
    duration: 55,
    difficulty: 8,
    exercises: [
      { name: 'Deadlift', sets: 4, reps: 8, rest: 90, notes: 'Teknik çok önemli' },
      { name: 'Bulgarian Split Squat', sets: 3, reps: 12, rest: 60, notes: 'Her bacak için' },
      { name: 'Hip Thrust', sets: 4, reps: 12, rest: 60, notes: 'Ağırlık kullanın' },
      { name: 'Single Leg RDL', sets: 3, reps: 10, rest: 45, notes: 'Denge önemli' },
      { name: 'Goblet Squat', sets: 4, reps: 15, rest: 45, notes: 'Dumbbell ile' },
      { name: 'Lateral Lunges', sets: 3, reps: 10, rest: 30, notes: 'Her yön için' }
    ],
    warmup: 'Dinamik bacak ısınması (5dk)',
    cooldown: 'Derin alt vücut germe (8dk)'
  },
  {
    id: 'cardio_1',
    category: WORKOUT_CATEGORIES.CARDIO,
    name: 'Cardio - Fat Burn',
    duration: 30,
    difficulty: 5,
    exercises: [
      { name: 'Jumping Jacks', sets: 4, duration: 30, rest: 15, notes: 'Tempolu yapın' },
      { name: 'High Knees', sets: 4, duration: 20, rest: 10, notes: 'Dizleri yükseğe' },
      { name: 'Burpees', sets: 3, reps: 8, rest: 45, notes: 'Tam hareket' },
      { name: 'Mountain Climbers', sets: 4, duration: 30, rest: 15, notes: 'Hızlı tempo' },
      { name: 'Jump Rope', sets: 5, duration: 45, rest: 15, notes: 'Hayali ip de olur' }
    ],
    warmup: 'Hafif yürüyüş (3dk), eklem hareketleri (2dk)',
    cooldown: 'Yavaş yürüyüş (3dk), soluma (2dk)'
  },
  {
    id: 'hiit_1',
    category: WORKOUT_CATEGORIES.HIIT,
    name: 'HIIT - Power',
    duration: 25,
    difficulty: 9,
    exercises: [
      { name: 'Sprint', sets: 8, duration: 20, rest: 10, notes: 'Maksimum hız' },
      { name: 'Burpee Box Jump', sets: 6, reps: 5, rest: 15, notes: 'Güvenli atlama' },
      { name: 'Kettlebell Swing', sets: 6, duration: 30, rest: 15, notes: 'Kalça hareketi' },
      { name: 'Battle Ropes', sets: 5, duration: 30, rest: 15, notes: 'Core aktif' },
      { name: 'Plyometric Push-ups', sets: 4, reps: 6, rest: 20, notes: 'Patlayıcı güç' }
    ],
    warmup: 'Dinamik ısınma (5dk), tempo artırma (3dk)',
    cooldown: 'Yavaşlama (3dk), derin soluma (2dk)'
  },
  {
    id: 'full_1',
    category: WORKOUT_CATEGORIES.FULL_BODY,
    name: 'Full Body - Functional',
    duration: 50,
    difficulty: 6,
    exercises: [
      { name: 'Squat to Press', sets: 3, reps: 12, rest: 45, notes: 'Dumbbell ile' },
      { name: 'Renegade Rows', sets: 3, reps: 8, rest: 60, notes: 'Core sabit' },
      { name: 'Thrusters', sets: 4, reps: 10, rest: 60, notes: 'Kombinasyon hareketi' },
      { name: 'Turkish Get-ups', sets: 2, reps: 3, rest: 90, notes: 'Her taraf için' },
      { name: 'Bear Crawl', sets: 3, duration: 30, rest: 45, notes: 'Kontrollü hareket' },
      { name: 'Farmers Walk', sets: 3, duration: 45, rest: 60, notes: 'Ağır ağırlık' }
    ],
    warmup: 'Dynamic warm-up (5dk)',
    cooldown: 'Full body stretch (8dk)'
  },
  {
    id: 'flexibility_1',
    category: WORKOUT_CATEGORIES.FLEXIBILITY,
    name: 'Esneklik & Mobilite',
    duration: 35,
    difficulty: 2,
    exercises: [
      { name: 'Cat-Cow Stretch', sets: 3, reps: 10, rest: 15, notes: 'Yavaş ve kontrollü' },
      { name: 'Downward Dog', sets: 3, duration: 30, rest: 15, notes: 'Nefes alın' },
      { name: 'Pigeon Pose', sets: 2, duration: 45, rest: 30, notes: 'Her bacak için' },
      { name: 'Spinal Twist', sets: 3, duration: 30, rest: 15, notes: 'Her yana' },
      { name: 'Hamstring Stretch', sets: 3, duration: 30, rest: 15, notes: 'Her bacak' },
      { name: 'Shoulder Rolls', sets: 3, reps: 10, rest: 15, notes: 'Her yöne' }
    ],
    warmup: 'Hafif hareket (3dk)',
    cooldown: 'Meditasyon (5dk)'
  }
];

// Template kategorileri için display isimleri
export const CATEGORY_LABELS = {
  [WORKOUT_CATEGORIES.UPPER_BODY]: 'Üst Vücut',
  [WORKOUT_CATEGORIES.LOWER_BODY]: 'Alt Vücut', 
  [WORKOUT_CATEGORIES.CARDIO]: 'Cardio',
  [WORKOUT_CATEGORIES.FULL_BODY]: 'Full Body',
  [WORKOUT_CATEGORIES.HIIT]: 'HIIT',
  [WORKOUT_CATEGORIES.STRENGTH]: 'Strength',
  [WORKOUT_CATEGORIES.FLEXIBILITY]: 'Esneklik'
};

// Zorluk seviyeleri
export const DIFFICULTY_LABELS = {
  1: '😌 Çok Kolay',
  2: '😊 Kolay', 
  3: '🙂 Kolay-Orta',
  4: '😐 Orta',
  5: '😤 Orta-Zor',
  6: '😰 Zor',
  7: '😤 Çok Zor',
  8: '🔥 İleri',
  9: '💀 Expert',
  10: '👹 Brutal'
};

// Template'i WhatsApp mesajına çeviren helper
export const formatWorkoutForWhatsApp = (template, clientName = '', lessonDate = '', lessonTime = '') => {
  const date = lessonDate || new Date().toLocaleDateString('tr-TR');
  const time = lessonTime || '';
  const difficulty = DIFFICULTY_LABELS[template.difficulty] || '';
  
  let message = `💪 *BUGÜNÜN ANTRENMANI*\n`;
  message += `📅 ${date}${time ? ` | ⏰ ${time}` : ''}\n`;
  if (clientName) message += `👤 ${clientName}\n`;
  message += `\n`;
  
  message += `🔥 *${template.name}* - ${template.duration} dk\n`;
  message += `📊 Zorluk: ${difficulty}\n\n`;
  
  if (template.warmup) {
    message += `🔥 *ISINMA:*\n${template.warmup}\n\n`;
  }
  
  message += `💪 *EGZERSIZLER:*\n`;
  template.exercises.forEach((exercise, index) => {
    message += `${index + 1}. *${exercise.name}*\n`;
    
    if (exercise.sets && exercise.reps) {
      message += `   • ${exercise.sets}x${exercise.reps}`;
    } else if (exercise.sets && exercise.duration) {
      message += `   • ${exercise.sets}x${exercise.duration}sn`;
    } else if (exercise.duration) {
      message += `   • ${exercise.duration}sn`;
    }
    
    if (exercise.rest) {
      message += ` (${exercise.rest}sn ara)`;
    }
    message += `\n`;
    
    if (exercise.notes) {
      message += `   💡 ${exercise.notes}\n`;
    }
    message += `\n`;
  });
  
  if (template.cooldown) {
    message += `🧘 *SOĞUMA:*\n${template.cooldown}\n\n`;
  }
  
  message += `📍 *YourTrainer Gym*\n`;
  message += `💬 Sorularınız için mesaj atın!\n`;
  message += `🎯 Başarılar! 💪`;
  
  return message;
};

// WhatsApp URL oluşturucu
export const createWhatsAppURL = (phoneNumber, message) => {
  try {
    // Telefon numarasını temizle (sadece rakamlar)
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Telefon numarası geçerli mi kontrol et
    if (!cleanPhone || cleanPhone.length < 10) {
      throw new Error('Geçersiz telefon numarası');
    }
    
    // Türkiye için format kontrolü (90 ile başlayıp başlamadığını kontrol et)
    let formattedPhone = cleanPhone;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '90' + formattedPhone.slice(1);
    } else if (!formattedPhone.startsWith('90')) {
      formattedPhone = '90' + formattedPhone;
    }
    
    // Mesajı URL encode et
    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp Web URL'si oluştur
    return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  } catch (error) {
    console.error('WhatsApp URL oluşturma hatası:', error);
    throw new Error('WhatsApp linki oluşturulamadı: ' + error.message);
  }
};

// Hızlı program örnekleri
export const QUICK_PROGRAMS = [
  {
    id: 'quick_1',
    name: 'Hızlı Cardio (15dk)',
    exercises: [
      '5dk koşu bandı',
      '3x30sn plank',
      '3x15 jumping jacks', 
      '3x10 burpee',
      '2dk soğuma'
    ]
  },
  {
    id: 'quick_2', 
    name: 'Üst Vücut Hızlı (20dk)',
    exercises: [
      '3x12 push-up',
      '3x10 dumbbell press',
      '3x12 tricep dips',
      '3x10 bicep curls',
      '5dk germe'
    ]
  },
  {
    id: 'quick_3',
    name: 'Alt Vücut Hızlı (20dk)', 
    exercises: [
      '3x15 squat',
      '3x10 lunges (her bacak)',
      '3x12 glute bridge',
      '3x30sn wall sit',
      '5dk germe'
    ]
  }
];
