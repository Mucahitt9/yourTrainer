import React, { useState, useMemo } from 'react';
import { 
  X, MessageCircle, Send, Clock, Target, Users, 
  Zap, Search, Filter, Eye, Edit3, Copy, Smartphone
} from 'lucide-react';
import { 
  WORKOUT_TEMPLATES, 
  CATEGORY_LABELS, 
  DIFFICULTY_LABELS,
  QUICK_PROGRAMS,
  formatWorkoutForWhatsApp,
  createWhatsAppURL 
} from '../../data/workoutTemplates';
import { getFromLocalStorage } from '../../utils/helpers';
import { useToast } from '../../utils/ToastContext';

const WhatsAppModal = ({ isOpen, onClose, selectedClient = null, selectedDate = null }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('templates'); // 'templates', 'custom', 'preview'
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(selectedClient?.id || '');
  const [customProgram, setCustomProgram] = useState({
    name: '',
    duration: 30,
    exercises: ['']
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [previewMessage, setPreviewMessage] = useState('');

  // Müşterileri localStorage'dan al
  const clients = useMemo(() => {
    return getFromLocalStorage('musteriler', []).filter(client => {
      // Sadece aktif müşterileri göster
      if (!client.tahmini_bitis_tarihi) return true;
      return new Date(client.tahmini_bitis_tarihi) > new Date();
    });
  }, []);

  // Seçilen müşteriyi bul
  const selectedClientData = useMemo(() => {
    return clients.find(client => client.id === parseInt(selectedClientId));
  }, [clients, selectedClientId]);

  // Template'leri filtrele
  const filteredTemplates = useMemo(() => {
    return WORKOUT_TEMPLATES.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.exercises.some(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
      const matchesDifficulty = filterDifficulty === 'all' || template.difficulty.toString() === filterDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchTerm, filterCategory, filterDifficulty]);

  // Preview mesajını güncelle
  React.useEffect(() => {
    if (selectedTemplate && selectedClientData) {
      const lessonDate = selectedDate ? 
        new Date(selectedDate).toLocaleDateString('tr-TR') : 
        new Date().toLocaleDateString('tr-TR');
      
      const message = formatWorkoutForWhatsApp(
        selectedTemplate,
        `${selectedClientData.ad} ${selectedClientData.soyad}`,
        lessonDate,
        '' // Saat bilgisi şimdilik boş
      );
      setPreviewMessage(message);
    } else if (customProgram.name && customProgram.exercises.filter(ex => ex.trim()).length > 0 && selectedClientData) {
      // Custom program için mesaj oluştur
      const lessonDate = selectedDate ? 
        new Date(selectedDate).toLocaleDateString('tr-TR') : 
        new Date().toLocaleDateString('tr-TR');
      
      let message = `💪 *BUGÜNÜN ANTRENMANI*\n`;
      message += `📅 ${lessonDate}\n`;
      message += `👤 ${selectedClientData.ad} ${selectedClientData.soyad}\n\n`;
      message += `🔥 *${customProgram.name}* - ${customProgram.duration} dk\n\n`;
      message += `💪 *EGZERSIZLER:*\n`;
      
      customProgram.exercises.filter(ex => ex.trim()).forEach((exercise, index) => {
        message += `${index + 1}. ${exercise}\n`;
      });
      
      message += `\n📍 *YourTrainer Gym*\n`;
      message += `💬 Sorularınız için mesaj atın!\n`;
      message += `🎯 Başarılar! 💪`;
      
      setPreviewMessage(message);
    } else {
      setPreviewMessage('');
    }
  }, [selectedTemplate, selectedClientData, selectedDate, customProgram]);

  if (!isOpen) return null;

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setActiveTab('preview');
  };

  const handleQuickProgramSelect = (quickProgram) => {
    setCustomProgram({
      name: quickProgram.name,
      duration: 20,
      exercises: quickProgram.exercises
    });
    setActiveTab('preview');
  };

  const handleCustomExerciseChange = (index, value) => {
    const newExercises = [...customProgram.exercises];
    newExercises[index] = value;
    setCustomProgram(prev => ({ ...prev, exercises: newExercises }));
  };

  const addCustomExercise = () => {
    setCustomProgram(prev => ({
      ...prev,
      exercises: [...prev.exercises, '']
    }));
  };

  const removeCustomExercise = (index) => {
    setCustomProgram(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const handleSendWhatsApp = () => {
    if (!selectedClientData || !previewMessage) {
      toast.warning('Lütfen müşteri ve program seçin.');
      return;
    }
    
    try {
      // Telefon numarasını kontrol et
      const phoneNumber = selectedClientData.telefon;
      
      if (!phoneNumber || phoneNumber.trim().length < 10) {
        toast.warning('Müşteri telefon numarası kayıtlı değil. Müşteri bilgilerini düzenleyip telefon ekleyin.');
        return;
      }
      
      const whatsappURL = createWhatsAppURL(phoneNumber, previewMessage);
      
      // URL'yi güvenli bir şekilde aç
      const newWindow = window.open(whatsappURL, '_blank', 'noopener,noreferrer');
      
      if (!newWindow) {
        // Popup engellendiyse
        toast.warning('Popup engellendi. Tarayıcı ayarlarınızdan popup izni verin.');
        // Alternatif olarak URL'yi kopyala
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(whatsappURL);
          toast.info('WhatsApp linki panoya kopyalandı. Yeni sekmede açabilirsiniz.');
        }
      } else {
        toast.success('WhatsApp açılıyor... 📱');
        // Modal'y kapat (isteğe bağlı)
        // onClose();
      }
    } catch (error) {
      console.error('WhatsApp URL error:', error);
      if (error.message.includes('Geçersiz telefon')) {
        toast.error('Geçersiz telefon numarası. Müşteri bilgilerini kontrol edin.');
      } else {
        toast.error('WhatsApp açılırken hata oluştu.');
      }
    }
  };

  const copyToClipboard = async () => {
    try {
      // Modern clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(previewMessage);
        toast.success('Metin panoya kopyalandı! 📋');
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = previewMessage;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        textArea.style.pointerEvents = 'none';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            toast.success('Metin panoya kopyalandı! 📋');
          } else {
            throw new Error('Copy command failed');
          }
        } catch (err) {
          console.error('Fallback copy failed:', err);
          toast.warning('Kopyalama başarısız. Metni manuel seçip kopyalayın.');
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      console.error('Copy to clipboard failed:', error);
      toast.warning('Kopyalama başarısız. Metni manuel seçip kopyalayın.');
    }
  };

  const TabButton = ({ id, label, icon: Icon, isActive, onClick, isMobile = false }) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors flex-1 sm:flex-none ${
        isActive
          ? 'bg-primary-100 text-primary-700 border border-primary-200'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      <Icon className={`h-3 w-3 sm:h-4 sm:w-4 ${isMobile ? 'flex-shrink-0' : ''}`} />
      <span className={isMobile ? 'truncate' : ''}>{label}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-6xl sm:w-full h-[90vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
              <div>
                <h2 className="text-lg sm:text-xl font-bold">WhatsApp Programı İlet</h2>
                <p className="text-green-100 text-xs sm:text-sm">
                  Antrenman programını müşterinizle paylaşın
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row h-[calc(90vh-80px)] sm:h-[600px]">
          {/* Left Panel - Content */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Tabs */}
            <div className="flex items-center p-3 sm:p-4 border-b border-gray-200 bg-white">
              <div className="flex space-x-1 sm:space-x-2 w-full">
                <TabButton
                  id="templates"
                  label="Hazır"
                  icon={Target}
                  isActive={activeTab === 'templates'}
                  onClick={() => setActiveTab('templates')}
                  isMobile={true}
                />
                <TabButton
                  id="custom"
                  label="Özel"
                  icon={Edit3}
                  isActive={activeTab === 'custom'}
                  onClick={() => setActiveTab('custom')}
                  isMobile={true}
                />
                <TabButton
                  id="preview"
                  label="Önizleme"
                  icon={Eye}
                  isActive={activeTab === 'preview'}
                  onClick={() => setActiveTab('preview')}
                  isMobile={true}
                />
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
              {/* Templates Tab */}
              {activeTab === 'templates' && (
                <div className="space-y-4">
                  {/* Search and Filters - Mobile optimized */}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Program ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 input-field text-sm"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="input-field text-sm"
                      >
                        <option value="all">Tüm Kategoriler</option>
                        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                      
                      <select
                        value={filterDifficulty}
                        onChange={(e) => setFilterDifficulty(e.target.value)}
                        className="input-field text-sm"
                      >
                        <option value="all">Tüm Zorluklar</option>
                        {Object.entries(DIFFICULTY_LABELS).map(([key, label]) => (
                          <option key={key} value={key}>{label.split(' ')[0]}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Quick Programs */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                      Hızlı Programlar
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {QUICK_PROGRAMS.map(program => (
                        <button
                          key={program.id}
                          onClick={() => handleQuickProgramSelect(program)}
                          className="p-3 text-left border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                        >
                          <h4 className="font-medium text-gray-900 text-sm">{program.name}</h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {program.exercises.length} egzersiz
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Template Grid */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Detaylı Programlar ({filteredTemplates.length})
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {filteredTemplates.map(template => (
                        <div
                          key={template.id}
                          className="border border-gray-200 rounded-lg p-3 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
                          onClick={() => handleTemplateSelect(template)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 text-sm leading-tight">{template.name}</h4>
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded ml-2 flex-shrink-0">
                              {CATEGORY_LABELS[template.category]}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-3 text-xs text-gray-600 mb-2">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {template.duration} dk
                            </span>
                            <span className="flex items-center">
                              <Target className="h-3 w-3 mr-1" />
                              {DIFFICULTY_LABELS[template.difficulty].split(' ')[0]}
                            </span>
                          </div>
                          
                          <div className="text-xs text-gray-500 line-clamp-2">
                            {template.exercises.slice(0, 2).map(ex => ex.name).join(', ')}
                            {template.exercises.length > 2 && ` +${template.exercises.length - 2} daha`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Tab */}
              {activeTab === 'custom' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Özel Program Oluştur</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Program Adı
                        </label>
                        <input
                          type="text"
                          value={customProgram.name}
                          onChange={(e) => setCustomProgram(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Örn: Özel Üst Vücut Antrenmani"
                          className="input-field text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Süre (dakika)
                        </label>
                        <input
                          type="number"
                          value={customProgram.duration}
                          onChange={(e) => setCustomProgram(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                          min="5"
                          max="120"
                          className="input-field text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Egzersizler
                        </label>
                        <div className="space-y-2">
                          {customProgram.exercises.map((exercise, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500 w-6 flex-shrink-0">{index + 1}.</span>
                              <input
                                type="text"
                                value={exercise}
                                onChange={(e) => handleCustomExerciseChange(index, e.target.value)}
                                placeholder="Örn: 3x12 Push-up (30sn ara)"
                                className="flex-1 input-field text-sm"
                              />
                              {customProgram.exercises.length > 1 && (
                                <button
                                  onClick={() => removeCustomExercise(index)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded flex-shrink-0"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          
                          <button
                            onClick={addCustomExercise}
                            className="btn-secondary text-sm w-full"
                          >
                            + Egzersiz Ekle
                          </button>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200">
                        <button
                          onClick={() => setActiveTab('preview')}
                          disabled={!customProgram.name || customProgram.exercises.filter(ex => ex.trim()).length === 0}
                          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed w-full"
                        >
                          Önizlemeyi Gör
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview Tab */}
              {activeTab === 'preview' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">WhatsApp Mesaj Önizlemesi</h3>
                    <button
                      onClick={copyToClipboard}
                      className="btn-secondary flex items-center space-x-2 text-sm px-3 py-2"
                    >
                      <Copy className="h-4 w-4" />
                      <span className="hidden sm:inline">Kopyala</span>
                    </button>
                  </div>
                  
                  {previewMessage ? (
                    <div className="bg-gray-50 rounded-lg p-3 border">
                      <div className="bg-white rounded-lg p-3 border border-gray-200 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
                        {previewMessage}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <Smartphone className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 text-sm">Önizleme için program ve müşteri seçin</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Client Selection & Actions */}
          <div className="w-full sm:w-80 border-t sm:border-t-0 sm:border-l border-gray-200 bg-gray-50 p-3 sm:p-4 space-y-4 min-h-0 overflow-y-auto">
            {/* Client Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Müşteri Seç
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="input-field text-sm"
              >
                <option value="">Müşteri seçin...</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.ad} {client.soyad}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Client Info */}
            {selectedClientData && (
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                  {selectedClientData.ad} {selectedClientData.soyad}
                </h4>
                <div className="space-y-1 text-xs text-gray-600">
                  <p>Yaş: {selectedClientData.yas}</p>
                  <p className={selectedClientData.telefon ? 'text-gray-600' : 'text-red-500'}>
                    Telefon: {selectedClientData.telefon || 'Kayıtlı değil ⚠️'}
                  </p>
                  <p>Kalan Ders: {selectedClientData.alinan_ders_sayisi - (selectedClientData.completed_lessons || 0)}</p>
                </div>
              </div>
            )}

            {/* Date Info */}
            {selectedDate && (
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Ders Tarihi</h4>
                <p className="text-xs text-gray-600">
                  {new Date(selectedDate).toLocaleDateString('tr-TR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleSendWhatsApp}
                disabled={!selectedClientData || !previewMessage || !selectedClientData.telefon}
                className="w-full btn-success flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                title={!selectedClientData?.telefon ? 'Müşteri telefon numarası gerekli' : 'WhatsApp\'a Gönder'}
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp'a Gönder</span>
              </button>
              
              {!selectedClientData?.telefon && selectedClientData && (
                <p className="text-xs text-red-500 text-center px-2">
                  ⚠️ Müşteri telefon numarası eksik. Düzenle sayfasından telefon ekleyin.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppModal;
