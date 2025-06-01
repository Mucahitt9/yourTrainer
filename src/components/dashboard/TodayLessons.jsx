import React, { useMemo } from 'react';
import { Clock, CheckCircle, ArrowRight, Calendar } from 'lucide-react';
import { useAuth } from '../../utils/AuthContext';
import { getTodaysLessons, formatLessonTime } from '../../utils/lessonHelpers';
import { getFromLocalStorage } from '../../utils/helpers';
import { LESSON_STATUS, lessonStatusDisplay } from '../../data/lessonsData';

const TodayLessons = ({ onLessonClick, onQuickComplete, onViewAll }) => {
  const { currentPT } = useAuth();

  const todaysLessons = useMemo(() => {
    return getTodaysLessons(currentPT?.id);
  }, [currentPT?.id]);

  const clients = useMemo(() => {
    const clientsData = getFromLocalStorage('musteriler', []);
    return clientsData.reduce((acc, client) => {
      acc[client.id] = client;
      return acc;
    }, {});
  }, []);

  const completedToday = todaysLessons.filter(l => l.durum === LESSON_STATUS.COMPLETED).length;
  const totalToday = todaysLessons.length;

  const handleQuickComplete = (lessonId, event) => {
    event.stopPropagation();
    onQuickComplete && onQuickComplete(lessonId);
  };

  if (todaysLessons.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-600" />
            Bugünkü Dersler
          </h3>
        </div>
        
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Bugün için planlanmış ders yok</p>
          <p className="text-sm text-gray-500 mt-1">Güzel bir dinlenme günü! 😊</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover-lift">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-blue-600" />
          Bugünkü Dersler
        </h3>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {completedToday}/{totalToday} tamamlandı
          </span>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
            >
              Tümünü Gör
              <ArrowRight className="h-3 w-3 ml-1" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">İlerleme</span>
          <span className="text-gray-900 font-medium">
            {totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${totalToday > 0 ? (completedToday / totalToday) * 100 : 0}%` 
            }}
          />
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-3">
        {todaysLessons.slice(0, 4).map((lesson) => {
          const client = clients[lesson.musteri_id];
          const statusInfo = lessonStatusDisplay[lesson.durum];
          const isCompleted = lesson.durum === LESSON_STATUS.COMPLETED;

          return (
            <div
              key={lesson.id}
              onClick={() => onLessonClick && onLessonClick(lesson)}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  isCompleted ? 'bg-green-500' : 'bg-blue-500'
                }`} />
                
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {client ? `${client.ad} ${client.soyad}` : 'Bilinmeyen Müşteri'}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <Clock className="h-3 w-3" />
                    <span>{formatLessonTime(lesson.planlanan_saat)}</span>
                    <span className={`px-2 py-0.5 rounded-full ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>
              </div>

              {lesson.durum === LESSON_STATUS.PLANNED && onQuickComplete && (
                <button
                  onClick={(e) => handleQuickComplete(lesson.id, e)}
                  className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                  <CheckCircle className="h-3 w-3" />
                  <span>Tamamla</span>
                </button>
              )}
            </div>
          );
        })}

        {todaysLessons.length > 4 && (
          <div className="text-center pt-2">
            <button
              onClick={onViewAll}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              +{todaysLessons.length - 4} ders daha
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayLessons;
