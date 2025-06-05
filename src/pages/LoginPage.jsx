import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { Dumbbell, Eye, EyeOff, Mail, Lock, Info } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemoInfo, setShowDemoInfo] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Register'dan gelen success message'ı kontrol et
  useEffect(() => {
    if (location.state?.message) {
      setError(''); // Clear any existing errors
      // Register'dan gelen email'i form'a doldur
      if (location.state?.email) {
        setFormData(prev => ({ ...prev, email: location.state.email }));
      }
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Error'ı temizle
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password, rememberMe);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Giriş sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Demo bilgilerini sadece development'ta göster (şu an kapalı)
  const isDevelopment = false; // import.meta.env.DEV;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo ve Başlık */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center">
            <Dumbbell className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            YourTrainer
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Personal Trainer Üye Kayıt Sistemi
          </p>
        </div>

        {/* Login Formu */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Adresi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="email@example.com"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Şifre */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10"
                  placeholder="Şifrenizi girin"
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Beni Hatırla Checkbox */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                  Beni hatırla
                </label>
              </div>
              <div className="text-sm">
                <span className="text-gray-500 text-xs">
                  🔒 Güvenli giriş
                </span>
              </div>
            </div>

            {/* Success Message (Register'dan gelirse) */}
            {location.state?.message && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-600">{location.state.message}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Giriş yapılıyor...
                </div>
              ) : (
                'Giriş Yap'
              )}
            </button>
            {/* Register Link */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Henüz hesabınız yok mu?{' '}
                <Link 
                  to="/register" 
                  className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
                >
                  Hesap Oluşturun
                </Link>
              </p>
            </div>
          </form>

          {/* Demo Bilgileri - Sadece Development */}
          {isDevelopment && (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowDemoInfo(!showDemoInfo)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
              >
                <Info className="h-4 w-4" />
                Demo Bilgileri
              </button>
              
              {showDemoInfo && (
                <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Development Demo:</h3>
                  <div className="text-sm text-blue-700 space-y-3">
                    <div className="p-2 bg-white rounded border">
                      <p><strong>Demo Hesap (Supabase):</strong></p>
                      <p><strong>Email:</strong> demo@yourtrainer.com</p>
                      <p><strong>Şifre:</strong> demo123456</p>
                      <p className="text-xs text-blue-600 mt-1">
                        * Bu hesapla test edebilirsiniz
                      </p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded border border-gray-200">
                      <p className="text-xs text-gray-600">
                        <strong>Not:</strong> Gerçek hesap oluşturmak için Supabase'i yapılandırın ve demo PT hesapları ekleyin.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Güvenlik Bildirimi */}
          <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start gap-2">
              <Lock className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-green-700">
                Verileriniz Supabase ile güvenli şekilde şifrelenerek korunmaktadır.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-4">
          &copy; {new Date().getFullYear()} YourTrainer. Tüm hakları saklıdır.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;