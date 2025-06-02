import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, AlertTriangle, CheckCircle, Signal } from 'lucide-react';
import useNetworkStatus from '../hooks/useNetworkStatus';
import useMobile from '../hooks/useMobile';

const NetworkStatusIndicator = () => {
  const { 
    isOnline, 
    isOffline, 
    wasOffline, 
    networkQuality, 
    isSlowConnection,
    effectiveType 
  } = useNetworkStatus();
  const { isMobile } = useMobile();
  
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('offline');
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (isOffline) {
      setNotificationType('offline');
      setShowNotification(true);
    } else if (wasOffline && isOnline) {
      setNotificationType('back-online');
      setShowNotification(true);
      // 3 saniye sonra gizle
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    } else if (isSlowConnection) {
      setNotificationType('slow');
      setShowNotification(true);
      // 5 saniye sonra gizle
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    } else {
      setShowNotification(false);
    }
  }, [isOnline, isOffline, wasOffline, isSlowConnection]);

  const handleRetry = async () => {
    setIsRetrying(true);
    
    // Service Worker'a cache temizleme mesajı gönder
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'FORCE_REFRESH_CACHE'
      });
    }
    
    // Sayfayı yenile
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleDismiss = () => {
    setShowNotification(false);
  };

  const getNotificationConfig = () => {
    switch (notificationType) {
      case 'offline':
        return {
          icon: WifiOff,
          title: 'Çevrimdışı Mod',
          message: 'İnternet bağlantınız yok. Veriler yerel olarak saklanıyor.',
          bgColor: 'bg-red-500',
          textColor: 'text-white',
          showRetry: true,
          persistent: true
        };
      
      case 'back-online':
        return {
          icon: CheckCircle,
          title: 'Tekrar Çevrimiçi!',
          message: 'İnternet bağlantınız restore edildi.',
          bgColor: 'bg-green-500',
          textColor: 'text-white',
          showRetry: false,
          persistent: false
        };
      
      case 'slow':
        return {
          icon: Signal,
          title: 'Yavaş Bağlantı',
          message: `Bağlantınız yavaş (${effectiveType.toUpperCase()}). Bazı özellikler sınırlı olabilir.`,
          bgColor: 'bg-yellow-500',
          textColor: 'text-white',
          showRetry: false,
          persistent: false
        };
      
      default:
        return null;
    }
  };

  if (!showNotification) {
    return (
      // Persistent status indicator (top-right corner)
      <div className={`fixed top-4 right-4 z-40 ${isMobile ? 'top-2 right-2' : ''}`}>
        <div className={`
          flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200
          ${isOnline 
            ? (isSlowConnection ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700')
            : 'bg-red-100 text-red-700'
          }
        `}>
          {isOnline ? (
            <Wifi className="h-3 w-3" />
          ) : (
            <WifiOff className="h-3 w-3" />
          )}
          {!isMobile && (
            <span>
              {isOnline 
                ? (isSlowConnection ? 'Yavaş' : 'Çevrimiçi')
                : 'Çevrimdışı'
              }
            </span>
          )}
        </div>
      </div>
    );
  }

  const config = getNotificationConfig();
  if (!config) return null;

  const IconComponent = config.icon;

  return (
    <div className={`
      fixed top-4 left-1/2 transform -translate-x-1/2 z-50 
      ${isMobile ? 'left-4 right-4 translate-x-0' : 'max-w-md'}
      animate-slide-up
    `}>
      <div className={`
        ${config.bgColor} ${config.textColor} rounded-xl shadow-xl p-4
        backdrop-blur-sm bg-opacity-95
      `}>
        <div className="flex items-start space-x-3">
          <IconComponent className="h-5 w-5 flex-shrink-0 mt-0.5" />
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm">{config.title}</h3>
            <p className="text-sm opacity-90 mt-1">{config.message}</p>
            
            {config.showRetry && (
              <div className="flex items-center space-x-2 mt-3">
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="
                    inline-flex items-center px-3 py-1.5 bg-white bg-opacity-20 
                    text-white text-xs font-medium rounded-lg 
                    hover:bg-opacity-30 transition-colors duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  <RefreshCw className={`h-3 w-3 mr-1.5 ${isRetrying ? 'animate-spin' : ''}`} />
                  {isRetrying ? 'Yenileniyor...' : 'Yeniden Dene'}
                </button>
                
                {!config.persistent && (
                  <button
                    onClick={handleDismiss}
                    className="text-white text-opacity-70 hover:text-opacity-100 text-xs"
                  >
                    Kapat
                  </button>
                )}
              </div>
            )}
          </div>
          
          {!config.persistent && (
            <button
              onClick={handleDismiss}
              className="text-white text-opacity-70 hover:text-opacity-100 transition-colors duration-200"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkStatusIndicator;
