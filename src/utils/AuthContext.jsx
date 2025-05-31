import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockPTData } from '../data/mockData';
import { getFromLocalStorage, saveToLocalStorage } from './helpers';

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

  // Sayfa yüklendiğinde local storage'dan session kontrolü
  useEffect(() => {
    const savedSession = getFromLocalStorage('pt_session');
    if (savedSession && savedSession.isAuthenticated) {
      setIsAuthenticated(true);
      setCurrentPT(savedSession.ptData);
    }
    setLoading(false);
  }, []);

  // Login fonksiyonu
  const login = async (kullaniciAdi, sifre) => {
    // Mock authentication - gerçek uygulamada API call olacak
    if (kullaniciAdi === mockPTData.kullanici_adi && sifre === 'pt123') {
      const sessionData = {
        isAuthenticated: true,
        ptData: mockPTData,
        loginTime: new Date().toISOString()
      };
      
      setIsAuthenticated(true);
      setCurrentPT(mockPTData);
      saveToLocalStorage('pt_session', sessionData);
      
      return { success: true };
    } else {
      return { 
        success: false, 
        error: 'Kullanıcı adı veya şifre hatalı' 
      };
    }
  };

  // Logout fonksiyonu
  const logout = () => {
    setIsAuthenticated(false);
    setCurrentPT(null);
    localStorage.removeItem('pt_session');
  };

  // PT profil güncelleme
  const updatePTProfile = (updatedData) => {
    const newPTData = { ...currentPT, ...updatedData };
    setCurrentPT(newPTData);
    
    // Session'ı güncelle
    const currentSession = getFromLocalStorage('pt_session');
    if (currentSession) {
      currentSession.ptData = newPTData;
      saveToLocalStorage('pt_session', currentSession);
    }
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
