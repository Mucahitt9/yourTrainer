import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { Dumbbell, Eye, EyeOff, Mail, Lock, User, Phone, Award } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    ad: '',
    soyad: '',
    kullanici_adi: '',
    telefon: '',
    uzmanlik_alani: '',
    yas: '',
    ders_basina_ucret: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Error'ı temizle
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Geçerli bir email adresi girin');
      return false;
    }

    // Password validation
    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalı');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return false;
    }

    // Required fields
    if (!formData.ad || !formData.soyad || !formData.kullanici_adi) {
      setError('Ad, soyad ve kullanıcı adı zorunludur');
      return false;
    }

    // Username validation (no spaces, special chars)
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;
    if (!usernameRegex.test(formData.kullanici_adi)) {
      setError('Kullanıcı adı sadece harf, rakam, nokta, alt çizgi ve tire içerebilir');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const registrationData = {
        email: formData.email,
        password: formData.password,
        kullanici_adi: formData.kullanici_adi,
        ad: formData.ad,
        soyad: formData.soyad,
        telefon: formData.telefon || null,
        uzmanlik_alani: formData.uzmanlik_alani || 'Genel Fitness',
        yas: formData.yas ? parseInt(formData.yas) : null,
        ders_basina_ucret: formData.ders_basina_ucret ? parseFloat(formData.ders_basina_ucret) : 0,
        aktif_mi: true
      };

      const result = await register(registrationData);
      
      if (result.success) {
        setSuccess(result.message || 'Hesap başarıyla oluşturuldu!');
        
        // 2 saniye sonra login sayfasına yönlendir
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Hesap oluşturuldu! Şimdi giriş yapabilirsiniz.',
              email: formData.email 
            }
          });
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Kayıt sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Logo ve Başlık */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center">
            <Dumbbell className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            YourTrainer'a Katılın
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Personal Trainer hesabınızı oluşturun ve müşterilerinizi yönetmeye başlayın
          </p>
        </div>

        {/* Register Formu */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* İki Kolon Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Sol Kolon - Kişisel Bilgiler */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Kişisel Bilgiler</h3>
                
                {/* Ad */}
                <div>
                  <label htmlFor="ad" className="block text-sm font-medium text-gray-700 mb-1">
                    Ad *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="ad"
                      name="ad"
                      type="text"
                      required
                      value={formData.ad}
                      onChange={handleChange}
                      className="input-field pl-9"
                      placeholder="Adınız"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Soyad */}
                <div>
                  <label htmlFor="soyad" className="block text-sm font-medium text-gray-700 mb-1">
                    Soyad *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="soyad"
                      name="soyad"
                      type="text"
                      required
                      value={formData.soyad}
                      onChange={handleChange}
                      className="input-field pl-9"
                      placeholder="Soyadınız"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Yaş */}
                <div>
                  <label htmlFor="yas" className="block text-sm font-medium text-gray-700 mb-1">
                    Yaş
                  </label>
                  <input
                    id="yas"
                    name="yas"
                    type="number"
                    min="18"
                    max="70"
                    value={formData.yas}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Yaşınız"
                    disabled={loading}
                  />
                </div>

                {/* Telefon */}
                <div>
                  <label htmlFor="telefon" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="telefon"
                      name="telefon"
                      type="tel"
                      value={formData.telefon}
                      onChange={handleChange}
                      className="input-field pl-9"
                      placeholder="05XX XXX XX XX"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Sağ Kolon - Hesap Bilgileri */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Hesap Bilgileri</h3>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Adresi *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field pl-9"
                      placeholder="email@example.com"
                      disabled={loading}
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Kullanıcı Adı */}
                <div>
                  <label htmlFor="kullanici_adi" className="block text-sm font-medium text-gray-700 mb-1">
                    Kullanıcı Adı *
                  </label>
                  <input
                    id="kullanici_adi"
                    name="kullanici_adi"
                    type="text"
                    required
                    value={formData.kullanici_adi}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="kullanici.adi"
                    disabled={loading}
                    autoComplete="username"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Sadece harf, rakam, nokta, alt çizgi ve tire kullanın
                  </p>
                </div>

                {/* Şifre */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Şifre *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field pl-9 pr-9"
                      placeholder="En az 6 karakter"
                      disabled={loading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Şifre Tekrar */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Şifre Tekrar *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="input-field pl-9 pr-9"
                      placeholder="Şifrenizi tekrar girin"
                      disabled={loading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Profesyonel Bilgiler - Tam Genişlik */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Profesyonel Bilgiler</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Uzmanlık Alanı */}
                <div>
                  <label htmlFor="uzmanlik_alani" className="block text-sm font-medium text-gray-700 mb-1">
                    Uzmanlık Alanı
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Award className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="uzmanlik_alani"
                      name="uzmanlik_alani"
                      type="text"
                      value={formData.uzmanlik_alani}
                      onChange={handleChange}
                      className="input-field pl-9"
                      placeholder="Örn: Kilo Verme, Kas Geliştirme, Pilates"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Ders Başına Ücret */}
                <div>
                  <label htmlFor="ders_basina_ucret" className="block text-sm font-medium text-gray-700 mb-1">
                    Ders Başına Ücret (TL)
                  </label>
                  <input
                    id="ders_basina_ucret"
                    name="ders_basina_ucret"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.ders_basina_ucret}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="500.00"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Hesap oluşturuluyor...
                </div>
              ) : (
                'Hesap Oluştur'
              )}
            </button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Zaten hesabınız var mı?{' '}
                <Link 
                  to="/login" 
                  className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
                >
                  Giriş Yapın
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} YourTrainer. Tüm hakları saklıdır.
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;