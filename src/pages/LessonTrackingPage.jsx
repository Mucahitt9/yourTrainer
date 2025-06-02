import React, { useState, useMemo } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useToast } from '../utils/ToastContext';
import { 
  getTodaysLessons, 
  getUpcomingLessons, 
  getLessonsByPT,
  quickCompleteLesson,
  markLessonNoShow,
  cancelLesson,
  updateLesson
} from '../utils/lessonHelpers';
import { getFromLocalStorage } from '../utils/helpers';
import { loadDemoLessons, addSingleLesson } from '../utils/lessonGenerators';

// Components
import LessonCalendar from '../components/lesson-tracking/LessonCalendar';
import LessonModal from '../components/lesson-tracking/LessonModal';
import QuickLessonForm from '../components/lesson-tracking/QuickLessonForm';
import LessonCard from '../components/lesson-tracking/LessonCard';

// Mobile components
import { MobileHeader, FloatingActionButton } from '../components/mobile';
import useMobile from '../hooks/useMobile';

// Icons
import { Calendar, Clock, Users, Activity, TrendingUp, CheckCircle, Plus, UserPlus, CalendarPlus, Eye } from 'lucide-react';

const LessonTrackingPage = () => {
  const { currentPT } = useAuth();
  const { toast } = useToast();
  const { isMobile } = useMobile();
  
  // State management
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showQuickForm, setShowQuickForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [view, setView] = useState('calendar'); // 'calendar', 'today', 'upcoming'

  // Load demo data on first visit
  React.useEffect(() => {
    loadDemoLessons();
  }, []);

  // Get all data
  const clients = useMemo(() => {
    const clientsData = getFromLocalStorage('musteriler', []);
    return clientsData.reduce((acc, client) => {
      acc[client.id] = client;
      return acc;
    }, {});
  }, [refreshTrigger]);

  const todaysLessons = useMemo(() => {
    return getTodaysLessons(currentPT?.id);
  }, [currentPT?.id, refreshTrigger]);

  const upcomingLessons = useMemo(() => {
    return getUpcomingLessons(currentPT?.id, 7);
  }, [currentPT?.id, refreshTrigger]);

  const allLessons = useMemo(() => {
    return getLessonsByPT(currentPT?.id);
  }, [currentPT?.id, refreshTrigger]);

  // Event handlers
  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
    setShowLessonModal(true);
  };

  const handleQuickComplete = (lessonId) => {
    const lesson = allLessons.find(l => l.id === lessonId);
    if (lesson) {
      setSelectedLesson(lesson);
      setShowQuickForm(true);
    }
  };

  const handleQuickCompleteSubmit = (updatedLesson) => {
    setShowQuickForm(false);
    setSelectedLesson(null);
    setRefreshTrigger(prev => prev + 1);
    toast.success('Ders başarıyla tamamlandı! 🎉');
  };

  const handleMarkNoShow = async (lessonId) => {
    try {
      markLessonNoShow(lessonId, 'Müşteri gelmedi');
      setRefreshTrigger(prev => prev + 1);
      toast.warning('Ders "Gelmedi" olarak işaretlendi');
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const handleCancelLesson = async (lessonId) => {
    try {
      cancelLesson(lessonId, 'İptal edildi');
      setRefreshTrigger(prev => prev + 1);
      toast.info('Ders iptal edildi');
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const handleLessonUpdate = (updatedLesson) => {
    setShowLessonModal(false);
    setSelectedLesson(null);
    setRefreshTrigger(prev => prev + 1);
    toast.success('Ders güncellendi');
  };

  const handleLessonDelete = (lessonId) => {
    setShowLessonModal(false);
    setSelectedLesson(null);
    setRefreshTrigger(prev => prev + 1);
    toast.info('Ders silindi');
  };

  const handleAddLesson = (selectedDate) => {
    // Yeni ders ekleme modal'ını açabilir veya basit bir form gösterebiliriz
    const dateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : null;
    
    // İlk olarak mevcut müşteriler varsa onlardan birine ders ekleyebiliriz
    const availableClients = Object.values(clients).filter(client => {
      if (!client.tahmini_bitis_tarihi) return true;
      return new Date(client.tahmini_bitis_tarihi) > new Date();
    });
    
    if (availableClients.length === 0) {
      toast.warning('Aktif müşteriniz yok. Önce bir müşteri ekleyin.');
      return;
    }
    
    // Basit bir implementation - ilk aktif müşteriye ders ekle
    const firstClient = availableClients[0];
    const dayName = getDayNameFromDate(selectedDate || new Date());
    
    try {
      const newLesson = {
        musteri_id: firstClient.id,
        pt_id: currentPT?.id,
        planlanan_tarih: dateStr || new Date().toISOString().split('T')[0],
        planlanan_saat: '14:00',
        planlanan_gun: dayName
      };
      
      // addSingleLesson kullanarak ders ekle
      addSingleLesson(newLesson);
      
      setRefreshTrigger(prev => prev + 1);
      toast.success(`${firstClient.ad} ${firstClient.soyad} için ${dateStr || 'bugün'} tarihine ders eklendi`);
    } catch (error) {
      toast.error('Ders eklenirken bir hata oluştu');
    }
  };
  
  // Helper function for day name
  const getDayNameFromDate = (date) => {
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    return days[date.getDay()];
  };

  // Refresh function for pull-to-refresh
  const handleRefresh = async () => {
    try {
      setRefreshTrigger(prev => prev + 1);
      toast.success('Ders verileri yenilendi! 🔄');
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      toast.error('Yenileme sırasında hata oluştu');
    }
  };

  // Stats calculations
  const stats = useMemo(() => {
    const completed = allLessons.filter(l => l.durum === 'tamamlandi').length;
    const total = allLessons.length;
    const planned = allLessons.filter(l => l.durum === 'planlandi').length;
    const today = todaysLessons.length;
    
    return { completed, total, planned, today };
  }, [allLessons, todaysLessons]);

  const ViewToggle = () => (
    <div className="flex items-center bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => setView('calendar')}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          view === 'calendar' 
            ? 'bg-white text-gray-900 shadow-sm' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Calendar className="h-4 w-4 mr-2 inline" />
        {isMobile ? 'Takvim' : 'Takvim'}
      </button>
      <button
        onClick={() => setView('today')}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          view === 'today' 
            ? 'bg-white text-gray-900 shadow-sm' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Clock className="h-4 w-4 mr-2 inline" />
        {isMobile ? 'Bugün' : 'Bugün'}
      </button>
      <button
        onClick={() => setView('upcoming')}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          view === 'upcoming' 
            ? 'bg-white text-gray-900 shadow-sm' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <TrendingUp className="h-4 w-4 mr-2 inline" />
        {isMobile ? 'Yaklaşan' : 'Yaklaşan'}
      </button>
    </div>
  );

  return (
    <div>
      {/* Mobile Header */}
      <MobileHeader 
        title="Ders Takibi"
        subtitle={`${stats.total} toplam ders`}
        showBack={false}
      />

      <div className={`space-y-6 ${isMobile ? 'space-y-4' : 'space-y-8'}`}>
        {/* Header - Desktop Only */}
        {!isMobile && (
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ders Takip Sistemi</h1>
              <p className="text-gray-600 mt-1">
                Tüm derslerinizi takip edin, tamamlayın ve notlar ekleyin
              </p>
            </div>
            
            <ViewToggle />
          </div>
        )}

        {/* Mobile View Toggle */}
        {isMobile && (
          <div className="flex justify-center">
            <ViewToggle />
          </div>
        )}

        {/* Stats Cards */}
        <div className={`grid gap-4 ${
          isMobile 
            ? 'grid-cols-2' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
        }`}>
          <div className={`bg-white rounded-xl shadow-sm border border-gray-200 hover-lift ${
            isMobile ? 'p-4' : 'p-6'
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`bg-blue-100 rounded-xl flex items-center justify-center ${
                  isMobile ? 'w-10 h-10' : 'w-12 h-12'
                }`}>
                  <Calendar className={`text-blue-600 ${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
                </div>
              </div>
              <div className="ml-3">
                <p className={`font-medium text-gray-600 ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}>Bugünkü Dersler</p>
                <p className={`font-bold text-gray-900 ${
                  isMobile ? 'text-lg' : 'text-2xl'
                }`}>{stats.today}</p>
              </div>
            </div>
          </div>

          <div className={`bg-white rounded-xl shadow-sm border border-gray-200 hover-lift ${
            isMobile ? 'p-4' : 'p-6'
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`bg-green-100 rounded-xl flex items-center justify-center ${
                  isMobile ? 'w-10 h-10' : 'w-12 h-12'
                }`}>
                  <CheckCircle className={`text-green-600 ${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
                </div>
              </div>
              <div className="ml-3">
                <p className={`font-medium text-gray-600 ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}>Tamamlanan</p>
                <p className={`font-bold text-gray-900 ${
                  isMobile ? 'text-lg' : 'text-2xl'
                }`}>{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className={`bg-white rounded-xl shadow-sm border border-gray-200 hover-lift ${
            isMobile ? 'p-4' : 'p-6'
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`bg-orange-100 rounded-xl flex items-center justify-center ${
                  isMobile ? 'w-10 h-10' : 'w-12 h-12'
                }`}>
                  <Clock className={`text-orange-600 ${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
                </div>
              </div>
              <div className="ml-3">
                <p className={`font-medium text-gray-600 ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}>Planlanmış</p>
                <p className={`font-bold text-gray-900 ${
                  isMobile ? 'text-lg' : 'text-2xl'
                }`}>{stats.planned}</p>
              </div>
            </div>
          </div>

          <div className={`bg-white rounded-xl shadow-sm border border-gray-200 hover-lift ${
            isMobile ? 'p-4' : 'p-6'
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`bg-purple-100 rounded-xl flex items-center justify-center ${
                  isMobile ? 'w-10 h-10' : 'w-12 h-12'
                }`}>
                  <Activity className={`text-purple-600 ${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
                </div>
              </div>
              <div className="ml-3">
                <p className={`font-medium text-gray-600 ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}>Toplam Ders</p>
                <p className={`font-bold text-gray-900 ${
                  isMobile ? 'text-lg' : 'text-2xl'
                }`}>{stats.total}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {view === 'calendar' && (
            <LessonCalendar
              onLessonClick={handleLessonClick}
              onAddLesson={handleAddLesson}
              ptId={currentPT?.id}
              isMobile={isMobile}
            />
          )}

          {view === 'today' && (
            <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${
              isMobile ? 'p-4' : 'p-6'
            }`}>
              <h2 className={`font-bold text-gray-900 mb-4 flex items-center ${
                isMobile ? 'text-lg' : 'text-2xl'
              }`}>
                <Clock className={`mr-2 ${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
                Bugünkü Dersler ({todaysLessons.length})
              </h2>
              
              {todaysLessons.length > 0 ? (
                <div className="space-y-3">
                  {todaysLessons.map(lesson => (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      client={clients[lesson.musteri_id]}
                      onEdit={handleLessonClick}
                      onComplete={handleQuickComplete}
                      onCancel={handleCancelLesson}
                      onMarkNoShow={handleMarkNoShow}
                      compact={true}
                    />
                  ))}
                </div>
              ) : (
                <div className={`text-center ${isMobile ? 'py-8' : 'py-12'}`}>
                  <Clock className={`text-gray-400 mx-auto mb-4 ${
                    isMobile ? 'h-8 w-8' : 'h-12 w-12'
                  }`} />
                  <h3 className={`font-medium text-gray-900 mb-2 ${
                    isMobile ? 'text-base' : 'text-lg'
                  }`}>Bugün ders yok</h3>
                  <p className={`text-gray-600 ${
                    isMobile ? 'text-sm' : 'text-base'
                  }`}>Bugün için planlanmış bir ders bulunmuyor.</p>
                </div>
              )}
            </div>
          )}

          {view === 'upcoming' && (
            <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${
              isMobile ? 'p-4' : 'p-6'
            }`}>
              <h2 className={`font-bold text-gray-900 mb-4 flex items-center ${
                isMobile ? 'text-lg' : 'text-2xl'
              }`}>
                <TrendingUp className={`mr-2 ${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
                Yaklaşan Dersler (7 Gün) - {upcomingLessons.length}
              </h2>
              
              {upcomingLessons.length > 0 ? (
                <div className="space-y-4">
                  {upcomingLessons.map(lesson => (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      client={clients[lesson.musteri_id]}
                      onEdit={handleLessonClick}
                      onComplete={handleQuickComplete}
                      onCancel={handleCancelLesson}
                      onMarkNoShow={handleMarkNoShow}
                      compact={true}
                    />
                  ))}
                </div>
              ) : (
                <div className={`text-center ${isMobile ? 'py-8' : 'py-12'}`}>
                  <TrendingUp className={`text-gray-400 mx-auto mb-4 ${
                    isMobile ? 'h-8 w-8' : 'h-12 w-12'
                  }`} />
                  <h3 className={`font-medium text-gray-900 mb-2 ${
                    isMobile ? 'text-base' : 'text-lg'
                  }`}>Yaklaşan ders yok</h3>
                  <p className={`text-gray-600 ${
                    isMobile ? 'text-sm' : 'text-base'
                  }`}>Önümüzdeki 7 gün için planlanmış ders bulunmuyor.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Floating Action Button for Mobile */}
        <FloatingActionButton
          actions={[
            {
              icon: CalendarPlus,
              label: 'Ders Ekle',
              color: 'bg-blue-100',
              textColor: 'text-blue-600',
              onClick: () => handleAddLesson()
            },
            {
              icon: Eye,
              label: 'Takvim Görünümü',
              color: 'bg-purple-100',
              textColor: 'text-purple-600',
              onClick: () => setView('calendar')
            },
            {
              icon: Clock,
              label: 'Bugünkü Dersler',
              color: 'bg-green-100',
              textColor: 'text-green-600',
              onClick: () => setView('today')
            },
            {
              icon: TrendingUp,
              label: 'Yaklaşan Dersler',
              color: 'bg-orange-100',
              textColor: 'text-orange-600',
              onClick: () => setView('upcoming')
            }
          ]}
        />

        {/* Modals */}
        <LessonModal
          lesson={selectedLesson}
          client={selectedLesson ? clients[selectedLesson.musteri_id] : null}
          isOpen={showLessonModal}
          onClose={() => {
            setShowLessonModal(false);
            setSelectedLesson(null);
          }}
          onUpdate={handleLessonUpdate}
          onDelete={handleLessonDelete}
        />

        <QuickLessonForm
          lesson={selectedLesson}
          isOpen={showQuickForm}
          onComplete={handleQuickCompleteSubmit}
          onCancel={() => {
            setShowQuickForm(false);
            setSelectedLesson(null);
          }}
        />
      </div>
    </div>
  );
};

export default LessonTrackingPage;
