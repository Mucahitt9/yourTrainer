import React, { useState } from 'react';
import { useToast } from '../utils/ToastContext';
import { 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Play, 
  RotateCcw,
  Loader2,
  X
} from 'lucide-react';

const ToastDemoPage = () => {
  const { toast, clearAllToasts } = useToast();
  const [customMessage, setCustomMessage] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [loadingToastId, setLoadingToastId] = useState(null);

  const showSuccessToast = () => {
    toast.success('İşlem başarıyla tamamlandı!', {
      title: 'Harika!',
      duration: 4000
    });
  };

  const showErrorToast = () => {
    toast.error('Bir hata oluştu. Lütfen tekrar deneyin.', {
      title: 'Hata!',
      duration: 6000
    });
  };

  const showWarningToast = () => {
    toast.warning('Bu işlem geri alınamaz. Emin misiniz?', {
      title: 'Dikkat!',
      duration: 5000
    });
  };

  const showInfoToast = () => {
    toast.info('Sistem güncellemesi 5 dakika sonra başlayacak.', {
      title: 'Bilgi',
      duration: 4000
    });
  };

  const showPersistentToast = () => {
    toast.persistent('Bu bildirim manuel olarak kapatılmalıdır.', 'warning', {
      title: 'Kalıcı Bildirim'
    });
  };

  const showLoadingToast = () => {
    const id = toast.loading('Veriler yükleniyor...', {
      title: 'Lütfen Bekleyin'
    });
    setLoadingToastId(id);
    
    // 3 saniye sonra loading toast'ı success'e çevir
    setTimeout(() => {
      toast.success('Veriler başarıyla yüklendi!', {
        title: 'Tamamlandı!'
      });
      setLoadingToastId(null);
    }, 3000);
  };

  const showCustomToast = () => {
    if (!customMessage.trim()) {
      toast.warning('Lütfen bir mesaj girin!');
      return;
    }
    
    toast.info(customMessage, {
      title: customTitle || 'Özel Mesaj',
      duration: 5000
    });
    
    setCustomMessage('');
    setCustomTitle('');
  };

  const showMultipleToasts = () => {
    toast.success('İlk bildirim');
    setTimeout(() => toast.info('İkinci bildirim'), 500);
    setTimeout(() => toast.warning('Üçüncü bildirim'), 1000);
    setTimeout(() => toast.error('Dördüncü bildirim'), 1500);
  };

  const toastButtons = [
    {
      label: 'Success Toast',
      action: showSuccessToast,
      icon: CheckCircle,
      color: 'bg-green-600 hover:bg-green-700',
      description: 'Başarılı işlem bildirimi'
    },
    {
      label: 'Error Toast',
      action: showErrorToast,
      icon: AlertCircle,
      color: 'bg-red-600 hover:bg-red-700',
      description: 'Hata bildirimi'
    },
    {
      label: 'Warning Toast',
      action: showWarningToast,
      icon: AlertTriangle,
      color: 'bg-yellow-600 hover:bg-yellow-700',
      description: 'Uyarı bildirimi'
    },
    {
      label: 'Info Toast',
      action: showInfoToast,
      icon: Info,
      color: 'bg-blue-600 hover:bg-blue-700',
      description: 'Bilgi bildirimi'
    },
    {
      label: 'Persistent Toast',
      action: showPersistentToast,
      icon: X,
      color: 'bg-purple-600 hover:bg-purple-700',
      description: 'Manuel kapatmalı kalıcı bildirim'
    },
    {
      label: 'Loading Toast',
      action: showLoadingToast,
      icon: Loader2,
      color: 'bg-indigo-600 hover:bg-indigo-700',
      description: 'Yükleme bildirimi (3sn sonra başarılı olur)'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Sayfa Başlığı */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Toast Bildirim Demo</h1>
        <p className="text-gray-600">
          Geliştirilmiş toast bildirim sisteminin tüm özelliklerini test edin.
        </p>
      </div>

      {/* Özellikler */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">🚀 Yeni Özellikler:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Progress Bar:</strong> Kalan süreyi gösteren ilerleme çubuğu</li>
          <li>• <strong>Mobile Responsive:</strong> Tüm cihazlarda mükemmel görünüm</li>
          <li>• <strong>Toast Stacking:</strong> Birden fazla toast için akıllı düzenleme</li>
          <li>• <strong>Accessibility:</strong> Screen reader desteği</li>
          <li>• <strong>Max Limit:</strong> En fazla 5 toast (eski olanlar otomatik kapanır)</li>
          <li>• <strong>Persistent & Loading:</strong> Özel toast türleri</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Panel - Toast Butonları */}
        <div className="lg:col-span-2 space-y-6">
          {/* Temel Toast'lar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Temel Toast Türleri</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {toastButtons.map((button, index) => {
                const Icon = button.icon;
                return (
                  <button
                    key={index}
                    onClick={button.action}
                    className={`p-4 rounded-lg text-white font-medium transition-all duration-200 transform hover:scale-105 ${button.color}`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5" />
                      <span>{button.label}</span>
                    </div>
                    <p className="text-xs opacity-90 mt-1">{button.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Özel Toast */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Özel Toast Oluştur</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başlık (isteğe bağlı)
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Özel başlık..."
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mesaj *
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Toast mesajınızı yazın..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
              <button
                onClick={showCustomToast}
                disabled={!customMessage.trim()}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Özel Toast Göster
              </button>
            </div>
          </div>

          {/* Test Butonları */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Senaryoları</h2>
            <div className="space-y-3">
              <button
                onClick={showMultipleToasts}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Play className="h-5 w-5" />
                <span>Çoklu Toast Testi (4 toast)</span>
              </button>
              
              <button
                onClick={clearAllToasts}
                className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <RotateCcw className="h-5 w-5" />
                <span>Tüm Toast'ları Temizle</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sağ Panel - Açıklamalar */}
        <div className="space-y-6">
          {/* API Referansı */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">API Referansı</h3>
            <div className="space-y-3 text-sm">
              <div>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  toast.success(message, options)
                </code>
                <p className="text-gray-600 mt-1">Başarı bildirimi</p>
              </div>
              <div>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  toast.error(message, options)
                </code>
                <p className="text-gray-600 mt-1">Hata bildirimi</p>
              </div>
              <div>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  toast.warning(message, options)
                </code>
                <p className="text-gray-600 mt-1">Uyarı bildirimi</p>
              </div>
              <div>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  toast.info(message, options)
                </code>
                <p className="text-gray-600 mt-1">Bilgi bildirimi</p>
              </div>
              <div>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  toast.persistent(message, type)
                </code>
                <p className="text-gray-600 mt-1">Kalıcı bildirim</p>
              </div>
              <div>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  toast.loading(message, options)
                </code>
                <p className="text-gray-600 mt-1">Yükleme bildirimi</p>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Options Parametresi</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">title:</span>
                <span className="text-gray-600 ml-1">Toast başlığı</span>
              </div>
              <div>
                <span className="font-medium">duration:</span>
                <span className="text-gray-600 ml-1">Süre (ms)</span>
              </div>
              <div className="text-xs text-gray-500 mt-3">
                Örnek: <br/>
                <code className="bg-gray-100 px-1 rounded">
                  {`{ title: 'Başlık', duration: 5000 }`}
                </code>
              </div>
            </div>
          </div>

          {/* İstatistikler */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 İpuçları</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• Mobil cihazlarda toast'lar tam genişlik alır</p>
              <p>• En fazla 5 toast aynı anda gösterilebilir</p>
              <p>• Progress bar otomatik kapanma süresini gösterir</p>
              <p>• Persistent toast'lar manuel kapatılmalıdır</p>
              <p>• Loading toast'lar duration: 0 ile oluşturulur</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastDemoPage;
