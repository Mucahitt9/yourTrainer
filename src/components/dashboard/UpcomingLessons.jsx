import React, { useMemo } from 'react';
import { TrendingUp, Calendar, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../utils/AuthContext';
import { getUpcomingLessons, formatLessonDate, formatLessonTime } from '../../utils/lessonHelpers';
import { getFromLocalStorage } from '../../utils/helpers';
import { lessonStatusDisplay } from '../../data/lessonsData';

const UpcomingLessons = ({ onLessonClick, onViewAll, days = 7 }) => {
  const { currentPT } = useAuth();

  const upcomingLessons = useMemo(() => {
    return getUpcomingLessons(currentPT?.id, days);
  }, [currentPT?.id, days]);

  const clients = useMemo(() => {
    const clientsData = getFromLocalStorage('musteriler', []);
    return clientsData.reduce((acc, client) => {
      acc[client.id] = client;
      return acc;
    }, {});
  }, []);

  const getDaysUntil = (dateString) => {
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDaysUntil = (days) => {
    if (days === 0) return 'Bugün';
    if (days === 1) return 'Yarın';
    if (days <= 7) return `${days} gün sonra`;
    return formatLessonDate(dateString);
  };

  if (upcomingLessons.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
            Yaklaşan Dersler
          </h3>
        </div>
        
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Yaklaşan ders planlanmamış</p>
          <p className="text-sm text-gray-500 mt-1">Yeni dersler planlamayı unutmayın!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover-lift">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
          Yaklaşan Dersler
        </h3>
        
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

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-purple-600">{upcomingLessons.length}</p>
          <p className="text-xs text-purple-600">Toplam Ders</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {new Set(upcomingLessons.map(l => l.musteri_id)).size}
          </p>
          <p className="text-xs text-blue-600">Farklı Müşteri</p>
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-3">
        {upcomingLessons.slice(0, 5).map((lesson) => {
          const client = clients[lesson.musteri_id];
          const daysUntil = getDaysUntil(lesson.planlanan_tarih);
          
          return (
            <div
              key={lesson.id}
              onClick={() => onLessonClick && onLessonClick(lesson)}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {client ? `${client.ad} ${client.soyad}` : 'Bilinmeyen Müşteri'}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <Clock className="h-3 w-3" />
                    <span>{formatLessonTime(lesson.planlanan_saat)}</span>
                    <span>•</span>
                    <span>{formatDaysUntil(daysUntil)}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className={`text-xs px-2 py-1 rounded-full ${
                  daysUntil <= 1 
                    ? 'bg-orange-100 text-orange-700' 
                    : daysUntil <= 3 
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {daysUntil === 0 ? 'Bugün' : daysUntil === 1 ? 'Yarın' : `${daysUntil} gün`}
                </div>
              </div>
            </div>
          );
        })}

        {upcomingLessons.length > 5 && (
          <div className="text-center pt-2">
            <button
              onClick={onViewAll}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              +{upcomingLessons.length - 5} ders daha
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingLessons;
