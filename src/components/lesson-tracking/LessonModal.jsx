import React, { useState, useEffect } from 'react';
import { 
  X, Save, Calendar, Clock, User, FileText, Activity, Target, 
  Edit3, CheckCircle, XCircle, AlertCircle, Trash2 
} from 'lucide-react';
import { LESSON_STATUS, lessonStatusDisplay, commonExercises } from '../../data/lessonsData';
import { updateLesson, deleteLesson, formatLessonDate, formatLessonTime } from '../../utils/lessonHelpers';

const LessonModal = ({ 
  lesson, 
  client, 
  isOpen, 
  onClose, 
  onUpdate, 
  onDelete,
  mode = 'view' // 'view', 'edit'
}) => {
  const [editMode, setEditMode] = useState(mode === 'edit');
  const [formData, setFormData] = useState({
    planlanan_tarih: '',
    planlanan_saat: '',
    gercek_tarih: '',
    gercek_saat: '',
    durum: LESSON_STATUS.PLANNED,
    ders_notlari: '',
    egzersizler: [],
    zorluk_seviyesi: 5,
    performance_rating: 7
  });
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [customExercise, setCustomExercise] = useState('');

  useEffect(() => {
    if (lesson) {
      setFormData({
        planlanan_tarih: lesson.planlanan_tarih || '',
        planlanan_saat: lesson.planlanan_saat || '',
        gercek_tarih: lesson.gercek_tarih || '',
        gercek_saat: lesson.gercek_saat || '',
        durum: lesson.durum || LESSON_STATUS.PLANNED,
        ders_notlari: lesson.ders_notlari || '',
        egzersizler: lesson.egzersizler || [],
        zorluk_seviyesi: lesson.zorluk_seviyesi || 5,
        performance_rating: lesson.performance_rating || 7
      });
    }
  }, [lesson]);

  if (!isOpen || !lesson) return null;

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  const handleExerciseToggle = (exercise) => {
    setFormData(prev => ({
      ...prev,
      egzersizler: prev.egzersizler.includes(exercise)
        ? prev.egzersizler.filter(ex => ex !== exercise)
        : [...prev.egzersizler, exercise]
    }));
  };

  const handleAddCustomExercise = () => {
    if (customExercise.trim() && !formData.egzersizler.includes(customExercise.trim())) {
      setFormData(prev => ({
        ...prev,
        egzersizler: [...prev.egzersizler, customExercise.trim()]
      }));
      setCustomExercise('');
    }
  };

  const handleRemoveExercise = (exercise) => {
    setFormData(prev => ({
      ...prev,
      egzersizler: prev.egzersizler.filter(ex => ex !== exercise)
    }));
  };

  const handleSave = async () => {
    try {
      const updatedLesson = updateLesson(lesson.id, formData);
      onUpdate && onUpdate(updatedLesson);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating lesson:', error);
      // Toast error message
    }
  };

  const handleDelete = async () => {
    try {
      deleteLesson(lesson.id);
      onDelete && onDelete(lesson.id);
      onClose();
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

  const statusInfo = lessonStatusDisplay[formData.durum];

  const getStatusIcon = (status) => {
    switch (status) {
      case LESSON_STATUS.COMPLETED:
        return <CheckCircle className="h-5 w-5" />;
      case LESSON_STATUS.CANCELLED:
        return <XCircle className="h-5 w-5" />;
      case LESSON_STATUS.NO_SHOW:
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${statusInfo.bgColor}`}>
                <div className={statusInfo.textColor}>
                  {getStatusIcon(formData.durum)}
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {client ? `${client.ad} ${client.soyad}` : 'Ders Detayları'}
                </h2>
                <p className="text-gray-600">
                  {formatLessonDate(formData.planlanan_tarih)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Düzenle</span>
                </button>
              )}
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Basic Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Date and Time */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Tarih ve Saat Bilgileri
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Planlanan Tarih
                    </label>
                    {editMode ? (
                      <input
                        type="date"
                        name="planlanan_tarih"
                        value={formData.planlanan_tarih}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    ) : (
                      <p className="text-gray-900">{formatLessonDate(formData.planlanan_tarih)}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Planlanan Saat
                    </label>
                    {editMode ? (
                      <input
                        type="time"
                        name="planlanan_saat"
                        value={formData.planlanan_saat}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    ) : (
                      <p className="text-gray-900">{formatLessonTime(formData.planlanan_saat)}</p>
                    )}
                  </div>
                  
                  {formData.durum === LESSON_STATUS.COMPLETED && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gerçek Tarih
                        </label>
                        {editMode ? (
                          <input
                            type="date"
                            name="gercek_tarih"
                            value={formData.gercek_tarih}
                            onChange={handleInputChange}
                            className="input-field"
                          />
                        ) : (
                          <p className="text-gray-900">
                            {formData.gercek_tarih ? formatLessonDate(formData.gercek_tarih) : '-'}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gerçek Saat
                        </label>
                        {editMode ? (
                          <input
                            type="time"
                            name="gercek_saat"
                            value={formData.gercek_saat}
                            onChange={handleInputChange}
                            className="input-field"
                          />
                        ) : (
                          <p className="text-gray-900">
                            {formData.gercek_saat ? formatLessonTime(formData.gercek_saat) : '-'}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Exercises */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Egzersizler
                </h3>
                
                {editMode ? (
                  <div className="space-y-4">
                    {/* Common Exercises */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {commonExercises.map(exercise => (
                        <button
                          key={exercise}
                          type="button"
                          onClick={() => handleExerciseToggle(exercise)}
                          className={`p-2 text-sm rounded-lg border transition-colors ${
                            formData.egzersizler.includes(exercise)
                              ? 'bg-primary-100 border-primary-300 text-primary-700'
                              : 'bg-white border-gray-300 text-gray-700 hover:border-primary-300'
                          }`}
                        >
                          {exercise}
                        </button>
                      ))}
                    </div>
                    
                    {/* Custom Exercise */}
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={customExercise}
                        onChange={(e) => setCustomExercise(e.target.value)}
                        placeholder="Özel egzersiz ekle..."
                        className="flex-1 input-field"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomExercise())}
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomExercise}
                        className="btn-primary px-4 py-2"
                      >
                        Ekle
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {formData.egzersizler.length > 0 ? (
                      formData.egzersizler.map((exercise, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                        >
                          {exercise}
                          {editMode && (
                            <button
                              type="button"
                              onClick={() => handleRemoveExercise(exercise)}
                              className="ml-2 text-primary-500 hover:text-primary-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">Henüz egzersiz eklenmemiş</p>
                    )}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Ders Notları
                </h3>
                
                {editMode ? (
                  <textarea
                    name="ders_notlari"
                    value={formData.ders_notlari}
                    onChange={handleInputChange}
                    rows={6}
                    className="input-field resize-none"
                    placeholder="Bu derste neler oldu? Müşteri nasıl performans gösterdi?"
                  />
                ) : (
                  <div className="bg-white rounded-lg p-4 min-h-[120px]">
                    {formData.ders_notlari ? (
                      <p className="text-gray-900 whitespace-pre-wrap">{formData.ders_notlari}</p>
                    ) : (
                      <p className="text-gray-500 italic">Henüz not eklenmemiş</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Status and Ratings */}
            <div className="space-y-6">
              {/* Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Durum
                </h3>
                
                {editMode ? (
                  <select
                    name="durum"
                    value={formData.durum}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    {Object.entries(lessonStatusDisplay).map(([value, info]) => (
                      <option key={value} value={value}>
                        {info.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.textColor} ${statusInfo.borderColor} border`}>
                    {statusInfo.label}
                  </span>
                )}
              </div>

              {/* Ratings */}
              {(formData.durum === LESSON_STATUS.COMPLETED || editMode) && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Değerlendirme
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Performance Rating */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Performans ({formData.performance_rating}/10)
                      </label>
                      
                      {editMode ? (
                        <input
                          type="range"
                          name="performance_rating"
                          min="1"
                          max="10"
                          value={formData.performance_rating}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                      ) : (
                        <div className="flex items-center space-x-1">
                          {[...Array(10)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full ${
                                i < formData.performance_rating ? 'bg-green-400' : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Difficulty Rating */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Zorluk Seviyesi ({formData.zorluk_seviyesi}/10)
                      </label>
                      
                      {editMode ? (
                        <input
                          type="range"
                          name="zorluk_seviyesi"
                          min="1"
                          max="10"
                          value={formData.zorluk_seviyesi}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                      ) : (
                        <div className="flex items-center space-x-1">
                          {[...Array(10)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full ${
                                i < formData.zorluk_seviyesi ? 'bg-orange-400' : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Client Info (if available) */}
              {client && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Müşteri Bilgileri
                  </h3>
                  
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Yaş:</span> {client.yas}</p>
                    <p><span className="text-gray-600">Toplam Ders:</span> {client.alinan_ders_sayisi}</p>
                    <p><span className="text-gray-600">Kayıt Tarihi:</span> {client.kayit_tarihi ? formatLessonDate(client.kayit_tarihi) : '-'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
            <div>
              {editMode && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn-danger flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Sil</span>
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {editMode ? (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="btn-secondary"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Kaydet</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Kapat
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Dersi Sil</h3>
            <p className="text-gray-600 mb-4">
              Bu dersi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary"
              >
                İptal
              </button>
              <button
                onClick={handleDelete}
                className="btn-danger"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonModal;
