// Lesson Helper Functions
import { LESSON_STATUS } from '../data/lessonsData';

// LocalStorage helper functions
export const getLessonsFromStorage = () => {
  try {
    const lessons = localStorage.getItem('lessons');
    return lessons ? JSON.parse(lessons) : [];
  } catch (error) {
    console.error('Error reading lessons from localStorage:', error);
    return [];
  }
};

export const saveLessonsToStorage = (lessons) => {
  try {
    localStorage.setItem('lessons', JSON.stringify(lessons));
    return true;
  } catch (error) {
    console.error('Error saving lessons to localStorage:', error);
    return false;
  }
};

// Lesson CRUD operations
export const createLesson = (lessonData) => {
  const lessons = getLessonsFromStorage();
  const newLesson = {
    id: generateLessonId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...lessonData
  };
  
  lessons.push(newLesson);
  saveLessonsToStorage(lessons);
  return newLesson;
};

export const updateLesson = (lessonId, updates) => {
  const lessons = getLessonsFromStorage();
  const lessonIndex = lessons.findIndex(lesson => lesson.id === lessonId);
  
  if (lessonIndex === -1) {
    throw new Error('Lesson not found');
  }
  
  lessons[lessonIndex] = {
    ...lessons[lessonIndex],
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  saveLessonsToStorage(lessons);
  return lessons[lessonIndex];
};

export const deleteLesson = (lessonId) => {
  const lessons = getLessonsFromStorage();
  const filteredLessons = lessons.filter(lesson => lesson.id !== lessonId);
  
  if (lessons.length === filteredLessons.length) {
    throw new Error('Lesson not found');
  }
  
  saveLessonsToStorage(filteredLessons);
  return true;
};

// Lesson filtering and querying
export const getLessonsByClient = (clientId) => {
  const lessons = getLessonsFromStorage();
  return lessons.filter(lesson => lesson.musteri_id === parseInt(clientId));
};

export const getLessonsByPT = (ptId) => {
  const lessons = getLessonsFromStorage();
  return lessons.filter(lesson => lesson.pt_id === parseInt(ptId));
};

export const getLessonsByStatus = (status) => {
  const lessons = getLessonsFromStorage();
  return lessons.filter(lesson => lesson.durum === status);
};

export const getLessonsByDateRange = (startDate, endDate) => {
  const lessons = getLessonsFromStorage();
  return lessons.filter(lesson => {
    const lessonDate = new Date(lesson.planlanan_tarih);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return lessonDate >= start && lessonDate <= end;
  });
};

// Today's lessons
export const getTodaysLessons = (ptId = null) => {
  const today = new Date().toISOString().split('T')[0];
  const lessons = getLessonsFromStorage();
  
  let todaysLessons = lessons.filter(lesson => lesson.planlanan_tarih === today);
  
  if (ptId) {
    todaysLessons = todaysLessons.filter(lesson => lesson.pt_id === parseInt(ptId));
  }
  
  return todaysLessons.sort((a, b) => {
    const timeA = a.planlanan_saat || '00:00';
    const timeB = b.planlanan_saat || '00:00';
    return timeA.localeCompare(timeB);
  });
};

// Upcoming lessons (next 7 days)
export const getUpcomingLessons = (ptId = null, days = 7) => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);
  
  const lessons = getLessonsFromStorage();
  let upcomingLessons = lessons.filter(lesson => {
    const lessonDate = new Date(lesson.planlanan_tarih);
    return lessonDate > today && lessonDate <= futureDate && lesson.durum === LESSON_STATUS.PLANNED;
  });
  
  if (ptId) {
    upcomingLessons = upcomingLessons.filter(lesson => lesson.pt_id === parseInt(ptId));
  }
  
  return upcomingLessons.sort((a, b) => {
    const dateA = new Date(`${a.planlanan_tarih}T${a.planlanan_saat || '00:00'}`);
    const dateB = new Date(`${b.planlanan_tarih}T${b.planlanan_saat || '00:00'}`);
    return dateA - dateB;
  });
};

// Statistics and analytics
export const getLessonStats = (clientId, ptId = null) => {
  let lessons = getLessonsFromStorage();
  
  if (clientId) {
    lessons = lessons.filter(lesson => lesson.musteri_id === parseInt(clientId));
  }
  
  if (ptId) {
    lessons = lessons.filter(lesson => lesson.pt_id === parseInt(ptId));
  }
  
  const total = lessons.length;
  const completed = lessons.filter(l => l.durum === LESSON_STATUS.COMPLETED).length;
  const cancelled = lessons.filter(l => l.durum === LESSON_STATUS.CANCELLED).length;
  const noShows = lessons.filter(l => l.durum === LESSON_STATUS.NO_SHOW).length;
  const planned = lessons.filter(l => l.durum === LESSON_STATUS.PLANNED).length;
  
  // Average performance rating (only for completed lessons)
  const completedLessons = lessons.filter(l => 
    l.durum === LESSON_STATUS.COMPLETED && l.performance_rating
  );
  const avgPerformance = completedLessons.length > 0 
    ? completedLessons.reduce((sum, l) => sum + l.performance_rating, 0) / completedLessons.length
    : 0;
  
  // Average difficulty level
  const avgDifficulty = completedLessons.length > 0
    ? completedLessons.reduce((sum, l) => sum + (l.zorluk_seviyesi || 0), 0) / completedLessons.length
    : 0;
  
  // Completion rate
  const completionRate = total > 0 ? (completed / (total - planned)) * 100 : 0;
  
  // No-show rate
  const noShowRate = total > 0 ? (noShows / total) * 100 : 0;
  
  return {
    total,
    completed,
    cancelled, 
    noShows,
    planned,
    avgPerformance: Math.round(avgPerformance * 10) / 10,
    avgDifficulty: Math.round(avgDifficulty * 10) / 10,
    completionRate: Math.round(completionRate * 10) / 10,
    noShowRate: Math.round(noShowRate * 10) / 10
  };
};

// Date and time utilities
export const formatLessonDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric', 
    month: 'long',
    day: 'numeric'
  });
};

export const formatLessonTime = (timeString) => {
  if (!timeString) return '';
  return timeString.slice(0, 5); // "14:00:00" -> "14:00"
};

export const formatLessonDateTime = (dateString, timeString) => {
  const date = formatLessonDate(dateString);
  const time = formatLessonTime(timeString);
  return time ? `${date}, ${time}` : date;
};

// Check if lesson is today
export const isLessonToday = (lessonDate) => {
  const today = new Date().toISOString().split('T')[0];
  return lessonDate === today;
};

// Check if lesson is this week
export const isLessonThisWeek = (lessonDate) => {
  const today = new Date();
  const lessonDateObj = new Date(lessonDate);
  
  // Get start of this week (Monday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);
  startOfWeek.setHours(0, 0, 0, 0);
  
  // Get end of this week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return lessonDateObj >= startOfWeek && lessonDateObj <= endOfWeek;
};

// Generate unique lesson ID
export const generateLessonId = () => {
  return `lesson_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Quick lesson completion
export const quickCompleteLesson = (lessonId, options = {}) => {
  const {
    ders_notlari = "",
    egzersizler = [],
    zorluk_seviyesi = 5,
    performance_rating = 7,
    gercek_saat = null
  } = options;
  
  const now = new Date();
  const updates = {
    durum: LESSON_STATUS.COMPLETED,
    gercek_tarih: now.toISOString().split('T')[0],
    gercek_saat: gercek_saat || now.toTimeString().slice(0, 5),
    ders_notlari,
    egzersizler,
    zorluk_seviyesi,
    performance_rating
  };
  
  return updateLesson(lessonId, updates);
};

// Mark lesson as no-show
export const markLessonNoShow = (lessonId, reason = "") => {
  const updates = {
    durum: LESSON_STATUS.NO_SHOW,
    ders_notlari: reason,
    gercek_tarih: new Date().toISOString().split('T')[0],
    gercek_saat: new Date().toTimeString().slice(0, 5)
  };
  
  return updateLesson(lessonId, updates);
};

// Cancel lesson
export const cancelLesson = (lessonId, reason = "") => {
  const updates = {
    durum: LESSON_STATUS.CANCELLED,
    ders_notlari: reason
  };
  
  return updateLesson(lessonId, updates);
};

// Get lesson status badge styles
export const getLessonStatusBadge = (status) => {
  const statusMap = {
    [LESSON_STATUS.PLANNED]: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-200'
    },
    [LESSON_STATUS.COMPLETED]: {
      bg: 'bg-green-100', 
      text: 'text-green-800',
      border: 'border-green-200'
    },
    [LESSON_STATUS.CANCELLED]: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800', 
      border: 'border-yellow-200'
    },
    [LESSON_STATUS.NO_SHOW]: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200'
    }
  };
  
  return statusMap[status] || statusMap[LESSON_STATUS.PLANNED];
};
