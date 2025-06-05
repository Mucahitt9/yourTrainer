import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockPTData } from '../data/mockData';
import { getFromLocalStorage, saveToLocalStorage } from './helpers';
import { 
  validateLoginCredentials, 
  createSecureSession, 
  sanitizeDataForStorage, 
  secureLog, 
  validateSession,
  initSecurity 
} from './security';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPT, setCurrentPT] = useState(null);
  const [loading, setLoading] = useState(true);

  // Security initialization
  useEffect(() => {
    initSecurity();
  }, []);

  // Sayfa yüklendiğinde session kontrolü
  useEffect(() => {
    // Önce localStorage, sonra sessionStorage kontrol et
    let savedSession = getFromLocalStorage('pt_session');
    let isRemembered = false;
    
    if (!savedSession) {
      // LocalStorage'da yoksa sessionStorage'a bak
      const sessionData = sessionStorage.getItem('pt_session');
      if (sessionData) {
        try {
          savedSession = JSON.parse(sessionData);
        } catch (error) {
          console.warn('Session data corrupted, clearing');
          sessionStorage.removeItem('pt_session');
        }
      }
    } else {
      isRemembered = true;
    }
    
    if (savedSession && savedSession.isAuthenticated) {
      // Session validation
      if (validateSession(savedSession)) {
        setIsAuthenticated(true);
        setCurrentPT(savedSession.ptData);
        secureLog(`Session restored successfully (${isRemembered ? 'remembered' : 'session only'})`);
      } else {
        secureLog('Session expired, clearing data');
        localStorage.removeItem('pt_session');
        sessionStorage.removeItem('pt_session');
      }
    }
    setLoading(false);
  }, []);

  // GÜVENLİ LOGIN - DevTools'da şifre görünmez
  const login = async (kullaniciAdi, sifre, rememberMe = false) => {
    try {
      // Rate limiting simulation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Gizli validation - DevTools'da hash'ler görünmez
      if (validateLoginCredentials(kullaniciAdi, sifre)) {
        // Secure session creation
        const secureSession = createSecureSession(mockPTData);
        
        const sessionData = {
          isAuthenticated: true,
          ptData: sanitizeDataForStorage(mockPTData),
          loginTime: new Date().toISOString(),
          ...secureSession
        };
        
        setIsAuthenticated(true);
        setCurrentPT(mockPTData);
        
        // Beni hatırla seçeneğine göre storage seç
        if (rememberMe) {
          saveToLocalStorage('pt_session', sessionData);
          secureLog('Login successful - session saved permanently');
        } else {
          sessionStorage.setItem('pt_session', JSON.stringify(sessionData));
          secureLog('Login successful - session saved for browser session only');
        }
        
        return { success: true };
      } else {
        secureLog('Login failed - invalid credentials');
        return { 
          success: false, 
          error: 'Kullanıcı adı veya şifre hatalı' 
        };
      }
    } catch (error) {
      secureLog('Login error:', error.message);
      return {
        success: false,
        error: 'Giriş sırasında bir hata oluştu'
      };
    }
  };

  // Güvenli logout
  const logout = () => {
    setIsAuthenticated(false);
    setCurrentPT(null);
    localStorage.removeItem('pt_session');
    sessionStorage.removeItem('pt_session');
    secureLog('User logged out successfully');
  };

  // PT profil güncelleme - Güvenli
  const updatePTProfile = (updatedData) => {
    // Hassas alanları filtrele
    const safeData = sanitizeDataForStorage(updatedData);
    delete safeData.id; // ID değiştirilemez
    
    const newPTData = { ...currentPT, ...safeData };
    setCurrentPT(newPTData);
    
    // Session'ı güvenli şekilde güncelle
    const currentSession = getFromLocalStorage('pt_session');
    if (currentSession && validateSession(currentSession)) {
      const secureSession = createSecureSession(newPTData);
      const updatedSession = {
        ...currentSession,
        ptData: sanitizeDataForStorage(newPTData),
        ...secureSession
      };
      saveToLocalStorage('pt_session', updatedSession);
    }
    
    secureLog('PT profile updated successfully');
  };

  const value = {
    isAuthenticated,
    currentPT,
    loading,
    login,
    logout,
    updatePTProfile
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
