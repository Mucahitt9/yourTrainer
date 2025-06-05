import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, auth, db, storage } from './supabase';
import { secureLog, initSecurity } from './security';

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
  const [session, setSession] = useState(null);

  // Security initialization
  useEffect(() => {
    initSecurity();
  }, []);

  // Initialize authentication state
  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await auth.getCurrentSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          setSession(session);
          await loadUserProfile(session.user.id);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      secureLog('Auth state changed:', event, session?.user?.email);
      
      if (session?.user) {
        setSession(session);
        await loadUserProfile(session.user.id);
        setIsAuthenticated(true);
      } else {
        setSession(null);
        setCurrentPT(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Load user profile from database
  const loadUserProfile = async (userId) => {
    try {
      const { data: ptUser, error } = await db.ptUsers.getById(userId);
      
      if (error) {
        console.error('Error loading PT profile:', error);
        return;
      }

      if (ptUser) {
        setCurrentPT(ptUser);
        secureLog('PT profile loaded:', ptUser.ad, ptUser.soyad);
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    }
  };

  // Login function
  const login = async (email, password, rememberMe = false) => {
    try {
      setLoading(true);
      
      const { data, error } = await auth.signIn(email, password);
      
      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      // Session will be handled by onAuthStateChange
      secureLog('Login successful for:', email);
      return { success: true };
      
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Giriş sırasında bir hata oluştu'
      };
    } finally {
      setLoading(false);
    }
  };

  // Register function (for creating new PT accounts)
  const register = async (userData) => {
    try {
      setLoading(true);
      
      const { email, password, ...profileData } = userData;
      
      // Create auth user with metadata
      const { data: authData, error: authError } = await auth.signUp(email, password, {
        ad: profileData.ad,
        soyad: profileData.soyad,
        kullanici_adi: profileData.kullanici_adi,
        telefon: profileData.telefon,
        uzmanlik_alani: profileData.uzmanlik_alani,
        yas: profileData.yas,
        ders_basina_ucret: profileData.ders_basina_ucret
      });
      
      if (authError) {
        return {
          success: false,
          error: authError.message
        };
      }

      if (authData.user) {
        // Kullanıcı oluşturuldu, trigger otomatik pt_users'a ekleyecek
        // Ama ek profil verilerini manuel güncelleyelim
        if (authData.user.id) {
          // Kısa bir bekleme sonrası profili güncelle
          setTimeout(async () => {
            try {
              await db.ptUsers.update(authData.user.id, {
                telefon: profileData.telefon,
                uzmanlik_alani: profileData.uzmanlik_alani || 'Genel Fitness',
                yas: profileData.yas,
                ders_basina_ucret: profileData.ders_basina_ucret || 0
              });
            } catch (updateError) {
              console.log('Profile update error (non-critical):', updateError);
            }
          }, 1000);
        }

        secureLog('Registration successful for:', email);
        return { 
          success: true,
          message: 'Hesap başarıyla oluşturuldu! Giriş yapabilirsiniz.'
        };
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Kayıt sırasında bir hata oluştu'
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const { error } = await auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      
      // Clear local state
      setIsAuthenticated(false);
      setCurrentPT(null);
      setSession(null);
      
      secureLog('User logged out successfully');
      
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Update PT profile
  const updatePTProfile = async (updatedData) => {
    try {
      if (!currentPT?.id) return { success: false, error: 'Kullanıcı bulunamadı' };

      const { data, error } = await db.ptUsers.update(currentPT.id, updatedData);
      
      if (error) {
        return { success: false, error: error.message };
      }

      setCurrentPT(data);
      secureLog('PT profile updated successfully');
      return { success: true, data };
      
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Profil güncellenirken hata oluştu' };
    }
  };

  // Upload profile image
  const uploadProfileImage = async (file) => {
    try {
      if (!currentPT?.id) return { success: false, error: 'Kullanıcı bulunamadı' };

      // Upload to Supabase Storage
      const publicUrl = await storage.uploadProfileImage(file, currentPT.id);
      
      // Update profile with new image URL
      const { data, error } = await db.ptUsers.update(currentPT.id, {
        profil_resmi_url: publicUrl
      });
      
      if (error) {
        return { success: false, error: error.message };
      }

      setCurrentPT(data);
      secureLog('Profile image uploaded successfully');
      return { success: true, url: publicUrl };
      
    } catch (error) {
      console.error('Image upload error:', error);
      return { success: false, error: 'Resim yüklenirken hata oluştu' };
    }
  };

  const value = {
    // State
    isAuthenticated,
    currentPT,
    loading,
    session,
    
    // Methods
    login,
    register,
    logout,
    updatePTProfile,
    uploadProfileImage,
    
    // Supabase client access
    supabase
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
