import React from 'react';
import { Clock, Calendar, User, CheckCircle, XCircle, AlertCircle, Minus } from 'lucide-react';
import { LESSON_STATUS, lessonStatusDisplay } from '../../data/lessonsData';
import { formatLessonDate, formatLessonTime, isLessonToday } from '../../utils/lessonHelpers';
import useMobile from '../../hooks/useMobile';

const LessonCard = ({ 
  lesson, 
  client, 
  onComplete, 
  onCancel, 
  onMarkNoShow, 
  onEdit,
  showClientName = true,
  compact = false 
}) => {
  const { isMobile } = useMobile();
  const statusInfo = lessonStatusDisplay[lesson.durum];
  const isToday = isLessonToday(lesson.planlanan_tarih);
  
  const getStatusIcon = (status) => {
    switch (status) {
      case LESSON_STATUS.COMPLETED:
        return <CheckCircle className="h-4 w-4" />;
      case LESSON_STATUS.CANCELLED:
        return <Minus className="h-4 w-4" />;
      case LESSON_STATUS.NO_SHOW:
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleQuickComplete = (e) => {
    e.stopPropagation();
    onComplete && onComplete(lesson.id);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    onCancel && onCancel(lesson.id);
  };

  const handleNoShow = (e) => {
    e.stopPropagation();
    onMarkNoShow && onMarkNoShow(lesson.id);
  };

  const handleEdit = () => {
    onEdit && onEdit(lesson);
  };

  if (compact) {
    return (
      <div 
        className={`${isMobile ? 'p-3' : 'p-4'} border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md active:scale-95 touch-manipulation ${
          isToday ? 'border-primary-300 bg-primary-50' : 'border-gray-200 bg-white'
        }`}
        onClick={handleEdit}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-1.5 rounded-full ${statusInfo.bgColor}`}>
              <div className={statusInfo.textColor}>
                {getStatusIcon(lesson.durum)}
              </div>
            </div>
            
            <div>
              {showClientName && client && (
                <p className="text-sm font-medium text-gray-900">
                  {client.ad} {client.soyad}
                </p>
              )}
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <Calendar className="h-3 w-3" />
                <span>{formatLessonTime(lesson.planlanan_saat)}</span>
                {isToday && (
                  <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                    Bugün
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
            {statusInfo.label}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-white border-2 rounded-xl ${isMobile ? 'p-4' : 'p-6'} cursor-pointer transition-all duration-200 hover:shadow-lg hover-lift active:scale-95 touch-manipulation ${
        isToday ? 'border-primary-300 shadow-md' : 'border-gray-200'
      }`}
      onClick={handleEdit}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${statusInfo.bgColor}`}>
            <div className={statusInfo.textColor}>
              {getStatusIcon(lesson.durum)}
            </div>
          </div>
          
          <div>
            {showClientName && client && (
              <h3 className="text-lg font-semibold text-gray-900">
                {client.ad} {client.soyad}
              </h3>
            )}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{formatLessonDate(lesson.planlanan_tarih)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.textColor} ${statusInfo.borderColor} border`}>
            {statusInfo.label}
          </span>
          
          {isToday && (
            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
              Bugün
            </span>
          )}
        </div>
      </div>

      {/* Time and Details */}
      <div className="space-y-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              Planlanan: {formatLessonTime(lesson.planlanan_saat)}
            </span>
          </div>
          
          {lesson.gercek_saat && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                Gerçek: {formatLessonTime(lesson.gercek_saat)}
              </span>
            </div>
          )}
        </div>

        {/* Exercise List */}
        {lesson.egzersizler && lesson.egzersizler.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Egzersizler:</p>
            <div className="flex flex-wrap gap-1">
              {lesson.egzersizler.slice(0, 3).map((exercise, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                >
                  {exercise}
                </span>
              ))}
              {lesson.egzersizler.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                  +{lesson.egzersizler.length - 3} daha
                </span>
              )}
            </div>
          </div>
        )}

        {/* Notes Preview */}
        {lesson.ders_notlari && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-700 line-clamp-2">
              {lesson.ders_notlari}
            </p>
          </div>
        )}

        {/* Performance Ratings */}
        {lesson.durum === LESSON_STATUS.COMPLETED && (lesson.performance_rating || lesson.zorluk_seviyesi) && (
          <div className="flex items-center space-x-4 pt-2 border-t border-gray-100">
            {lesson.performance_rating && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Performans:</span>
                <div className="flex items-center space-x-1">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < lesson.performance_rating ? 'bg-green-400' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-600 ml-1">
                    {lesson.performance_rating}/10
                  </span>
                </div>
              </div>
            )}
            
            {lesson.zorluk_seviyesi && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Zorluk:</span>
                <div className="flex items-center space-x-1">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < lesson.zorluk_seviyesi ? 'bg-orange-400' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-600 ml-1">
                    {lesson.zorluk_seviyesi}/10
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons - Only for planned lessons */}
      {lesson.durum === LESSON_STATUS.PLANNED && (onComplete || onCancel || onMarkNoShow) && (
        <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-100">
          {onComplete && (
            <button
              onClick={handleQuickComplete}
              className={`flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-medium rounded-lg transition-colors duration-200 touch-manipulation ${
                isMobile ? 'text-sm py-3 px-2' : 'text-sm py-2 px-3'
              }`}
            >
              Tamamla
            </button>
          )}
          
          {onCancel && (
            <button
              onClick={handleCancel}
              className={`flex-1 bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 text-white font-medium rounded-lg transition-colors duration-200 touch-manipulation ${
                isMobile ? 'text-sm py-3 px-2' : 'text-sm py-2 px-3'
              }`}
            >
              İptal
            </button>
          )}
          
          {onMarkNoShow && (
            <button
              onClick={handleNoShow}
              className={`flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium rounded-lg transition-colors duration-200 touch-manipulation ${
                isMobile ? 'text-sm py-3 px-2' : 'text-sm py-2 px-3'
              }`}
            >
              Gelmedi
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default LessonCard;
