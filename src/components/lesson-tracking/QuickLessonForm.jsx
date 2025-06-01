import React, { useState } from 'react';
import { Clock, CheckCircle, X, Plus, Minus } from 'lucide-react';
import { commonExercises, ratingLabels, performanceLabels } from '../../data/lessonsData';
import { quickCompleteLesson } from '../../utils/lessonHelpers';

const QuickLessonForm = ({ lesson, onComplete, onCancel, isOpen = false }) => {
  const [formData, setFormData] = useState({
    ders_notlari: '',
    egzersizler: [],
    zorluk_seviyesi: 5,
    performance_rating: 7,
    gercek_saat: new Date().toTimeString().slice(0, 5)
  });
  
  const [customExercise, setCustomExercise] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  const handleCustomExercise = () => {
    if (customExercise.trim()) {
      setFormData(prev => ({
        ...prev,
        egzersizler: [...prev.egzersizler, customExercise.trim()]
      }));
      setCustomExercise('');
      setShowCustomInput(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const updatedLesson = quickCompleteLesson(lesson.id, formData);
      onComplete && onComplete(updatedLesson);
    } catch (error) {
      console.error('Error completing lesson:', error);
      // Hata handling - toast mesajı gösterilebilir
    }
  };

  const adjustRating = (field, delta) => {
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(1, Math.min(10, prev[field] + delta))
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Dersi Tamamla</h2>
              <p className="text-sm text-gray-600">
                {lesson.planlanan_tarih} - {lesson.planlanan_saat}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Actual Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gerçek Ders Saati
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="time"
                  name="gercek_saat"
                  value={formData.gercek_saat}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Exercises */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Yapılan Egzersizler
              </label>
              
              {/* Common Exercises */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                {commonExercises.slice(0, 12).map(exercise => (
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

              {/* Custom Exercise Input */}
              {showCustomInput ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={customExercise}
                    onChange={(e) => setCustomExercise(e.target.value)}
                    placeholder="Özel egzersiz adı..."
                    className="flex-1 input-field"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleCustomExercise())}
                  />
                  <button
                    type="button"
                    onClick={handleCustomExercise}
                    className="btn-primary px-3 py-2"
                  >
                    Ekle
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(false)}
                    className="btn-secondary px-3 py-2"
                  >
                    İptal
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700"
                >
                  <Plus className="h-4 w-4" />
                  <span>Özel egzersiz ekle</span>
                </button>
              )}

              {/* Selected Exercises */}
              {formData.egzersizler.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Seçilen egzersizler:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.egzersizler.map((exercise, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                      >
                        {exercise}
                        <button
                          type="button"
                          onClick={() => handleExerciseToggle(exercise)}
                          className="ml-2 text-primary-500 hover:text-primary-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Rating Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Performance Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Performans Değerlendirmesi
                </label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => adjustRating('performance_rating', -1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-lg font-semibold">
                      {formData.performance_rating}/10
                    </span>
                    <button
                      type="button"
                      onClick={() => adjustRating('performance_rating', 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.performance_rating}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      performance_rating: parseInt(e.target.value)
                    }))}
                    className="w-full"
                  />
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Kötü</span>
                    <span className="font-medium">
                      {performanceLabels[formData.performance_rating]}
                    </span>
                    <span>Harika</span>
                  </div>
                </div>
              </div>

              {/* Difficulty Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Zorluk Seviyesi
                </label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => adjustRating('zorluk_seviyesi', -1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-lg font-semibold">
                      {formData.zorluk_seviyesi}/10
                    </span>
                    <button
                      type="button"
                      onClick={() => adjustRating('zorluk_seviyesi', 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.zorluk_seviyesi}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      zorluk_seviyesi: parseInt(e.target.value)
                    }))}
                    className="w-full"
                  />
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Kolay</span>
                    <span className="font-medium">
                      {ratingLabels[formData.zorluk_seviyesi]}
                    </span>
                    <span>Zor</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ders Notları
              </label>
              <textarea
                name="ders_notlari"
                value={formData.ders_notlari}
                onChange={handleInputChange}
                rows={4}
                className="input-field resize-none"
                placeholder="Bu derste neler yaptınız? Müşteri nasıl performans gösterdi?"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary"
              >
                İptal
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Dersi Tamamla</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuickLessonForm;
