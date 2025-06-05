import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { Dumbbell, Eye, EyeOff, User, Lock, Info } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    kullaniciAdi: '',
    sifre: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemoInfo, setShowDemoInfo] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

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
      const result = await login(formData.kullaniciAdi, formData.sifre, rememberMe);
      
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

  // Demo bilgilerini sadece development'ta göster
  const isDevelopment = import.meta.env.DEV;

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
            {/* Kullanıcı Adı */}
            <div>
              <label htmlFor="kullaniciAdi" className="block text-sm font-medium text-gray-700 mb-2">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="kullaniciAdi"
                  name="kullaniciAdi"
                  type="text"
                  required
                  value={formData.kullaniciAdi}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Kullanıcı adınızı girin"
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Şifre */}
            <div>
              <label htmlFor="sifre" className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="sifre"
                  name="sifre"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.sifre}
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
                  <div className="text-sm text-blue-700 space-y-1">
                    <p><strong>Kullanıcı Adı:</strong>mucahit.tastan</p>
                    <p><strong>Şifre:</strong>müco123</p>
                    <p className="text-xs text-blue-600 mt-2">
                      * Bu bilgiler sadece geliştirme ortamında görünür
                    </p>
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
                Giriş bilgileriniz güvenli şekilde şifrelenerek korunmaktadır.
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
