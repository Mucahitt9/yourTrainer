import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { Dumbbell, Eye, EyeOff, User, Lock } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    kullaniciAdi: '',
    sifre: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      const result = await login(formData.kullaniciAdi, formData.sifre);
      
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
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
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

          {/* Demo Bilgileri */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Giriş Bilgileri:</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Kullanıcı Adı:</strong> faruktastan</p>
              <p><strong>Şifre:</strong>pt123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* <div className="logo-font text-xl text-white bg-black flex items-center justify-center gap-2 py-4 mt-8 rounded-lg">
  <span className="text-purple-500 text-2xl">{'{'}</span>
  <span className="font-bold">CONSOLE</span>
  <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
  <span className="font-bold">TECH</span>
  <span className="text-purple-500 text-2xl">{'}'}</span>
</div> */}
        <div className="text-center text-sm text-gray-500 mt-4">
          &copy; {new Date().getFullYear()} YourTrainer. Tüm hakları saklıdır.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
