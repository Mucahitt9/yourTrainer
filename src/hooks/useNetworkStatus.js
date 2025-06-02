import { useState, useEffect } from 'react';

/**
 * Network durumunu takip eden custom hook
 * @returns {Object} Network durumu ve kontrol fonksiyonları
 */
const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const [connectionType, setConnectionType] = useState('unknown');
  const [effectiveType, setEffectiveType] = useState('unknown');

  useEffect(() => {
    // Network durumu değişikliklerini dinle
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setWasOffline(false);
        // Offline'dan online'a geçiş notification'ı
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'NETWORK_STATUS_CHANGE',
            isOnline: true
          });
        }
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      // Online'dan offline'a geçiş notification'ı
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'NETWORK_STATUS_CHANGE',
          isOnline: false
        });
      }
    };

    // Connection info güncelle
    const updateConnectionInfo = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
          setConnectionType(connection.type || 'unknown');
          setEffectiveType(connection.effectiveType || 'unknown');
        }
      }
    };

    // Event listeners ekle
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Connection API varsa dinle
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        connection.addEventListener('change', updateConnectionInfo);
        updateConnectionInfo(); // İlk değerleri set et
      }
    }

    // Temizlik
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
          connection.removeEventListener('change', updateConnectionInfo);
        }
      }
    };
  }, [wasOffline]);

  // Ping testi ile gerçek network durumu kontrol et
  const checkRealNetworkStatus = async () => {
    if (!isOnline) return false;
    
    try {
      const response = await fetch('/favicon.ico', {
        method: 'HEAD',
        cache: 'no-cache',
        timeout: 5000
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  // Network kalitesi belirleme
  const getNetworkQuality = () => {
    if (!isOnline) return 'offline';
    
    switch (effectiveType) {
      case '4g':
        return 'excellent';
      case '3g':
        return 'good';
      case '2g':
        return 'poor';
      case 'slow-2g':
        return 'very-poor';
      default:
        return 'unknown';
    }
  };

  // Slow connection check
  const isSlowConnection = () => {
    return ['2g', 'slow-2g'].includes(effectiveType);
  };

  return {
    isOnline,
    isOffline: !isOnline,
    wasOffline,
    connectionType,
    effectiveType,
    networkQuality: getNetworkQuality(),
    isSlowConnection: isSlowConnection(),
    checkRealNetworkStatus
  };
};

export default useNetworkStatus;
