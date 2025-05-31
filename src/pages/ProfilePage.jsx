import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useToast } from '../utils/ToastContext';
import { User, Edit3, Save, X, Camera, MapPin, Award, Calendar, DollarSign } from 'lucide-react';
import { formatDate, generateUsername } from '../utils/helpers';
import ProfilePhotoUpload from '../components/ProfilePhotoUpload';

const ProfilePage = () => {
  const { currentPT, updatePTProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    ad: currentPT?.ad || '',
    soyad: currentPT?.soyad || '',
    kullanici_adi: currentPT?.kullanici_adi || '',
    ders_basina_ucret: currentPT?.ders_basina_ucret || 200,
    uzmanlik_alani: currentPT?.uzmanlik_alani || '',
    yas: currentPT?.yas || '',
    profil_resmi_url: currentPT?.profil_resmi_url || ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // Ad veya soyad değiştiğinde kullanıcı adını otomatik güncelle
      if (name === 'ad' || name === 'soyad') {
        const ad = name === 'ad' ? value : prev.ad;
        const soyad = name === 'soyad' ? value : prev.soyad;
        if (ad && soyad) {
          newData.kullanici_adi = generateUsername(ad, soyad);
        }
      }
      
      return newData;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Validasyon
      if (!editData.ad.trim()) {
        toast.error('Ad boş bırakılamaz');
        setLoading(false);
        return;
      }

      if (!editData.soyad.trim()) {
        toast.error('Soyad boş bırakılamaz');
        setLoading(false);
        return;
      }

      if (!editData.kullanici_adi.trim()) {
        toast.error('Kullanıcı adı boş bırakılamaz');
        setLoading(false);
        return;
      }

      if (!editData.uzmanlik_alani.trim()) {
        toast.error('Uzmanlık alanı boş bırakılamaz');
        setLoading(false);
        return;
      }

      if (editData.yas && (editData.yas < 18 || editData.yas > 80)) {
        toast.error('Yaş 18-80 arasında olmalı');
        setLoading(false);
        return;
      }

      if (editData.ders_basina_ucret < 50 || editData.ders_basina_ucret > 2000) {
        toast.error('Ders başına ücret 50-2000 TL arasında olmalı');
        setLoading(false);
        return;
      }

      // Güncelleme
      updatePTProfile(editData);
      setIsEditing(false);
      toast.success('Profil bilgileriniz başarıyla güncellendi ve kaydedildi.', {
        title: 'Profil Güncellendi!',
        duration: 5000
      });
    } catch (error) {
      toast.error('Profil güncellenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      ad: currentPT?.ad || '',
      soyad: currentPT?.soyad || '',
      kullanici_adi: currentPT?.kullanici_adi || '',
      ders_basina_ucret: currentPT?.ders_basina_ucret || 200,
      uzmanlik_alani: currentPT?.uzmanlik_alani || '',
      yas: currentPT?.yas || '',
      profil_resmi_url: currentPT?.profil_resmi_url || ''
    });
    setIsEditing(false);
  };

  const handlePhotoChange = (photoDataUrl) => {
    setEditData(prev => ({
      ...prev,
      profil_resmi_url: photoDataUrl || ''
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Sayfa Başlığı */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <User className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profil Bilgileri</h1>
              <p className="text-gray-600">Kişisel bilgilerinizi görüntüleyin ve düzenleyin</p>
            </div>
          </div>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Düzenle
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                <X className="h-4 w-4 mr-2" />
                İptal
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Kaydet
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profil Kartı */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Profil Resmi */}
            <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 p-6 text-center">
              {/* Profil Fotoğrafı Upload */}
              <div className="mb-4">
                <ProfilePhotoUpload
                  currentPhoto={isEditing ? editData.profil_resmi_url : currentPT?.profil_resmi_url}
                  onPhotoChange={handlePhotoChange}
                  disabled={!isEditing}
                  theme="profile"
                />
              </div>
              
              <h2 className="mt-4 text-xl font-bold text-white">
                {isEditing ? `${editData.ad} ${editData.soyad}` : `${currentPT?.ad} ${currentPT?.soyad}`}
              </h2>
              <p className="text-primary-100">Personal Trainer</p>
            </div>

            {/* Hızlı Bilgiler */}
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3 text-gray-600">
                <Calendar className="h-5 w-5" />
                <span className="text-sm">
                  Üyelik: {formatDate(currentPT?.kayit_tarihi)}
                </span>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-600">
                <Award className="h-5 w-5" />
                <span className="text-sm">
                  Aktif Durum: {currentPT?.aktif_mi ? 'Aktif' : 'Pasif'}
                </span>
              </div>

              <div className="flex items-center space-x-3 text-gray-600">
                <DollarSign className="h-5 w-5" />
                <span className="text-sm">
                  Ders Ücreti: {isEditing ? editData.ders_basina_ucret : currentPT?.ders_basina_ucret} TL
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bilgi Detayları */}
        <div className="lg:col-span-2 space-y-6">
          {/* Kişisel Bilgiler */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kişisel Bilgiler</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="ad" className="block text-sm font-medium text-gray-700 mb-2">Ad *</label>
                {isEditing ? (
                  <input
                    type="text"
                    id="ad"
                    name="ad"
                    value={editData.ad}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Adınızı girin"
                  />
                ) : (
                  <div className="input-field bg-gray-50 text-gray-900">
                    {currentPT?.ad}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="soyad" className="block text-sm font-medium text-gray-700 mb-2">Soyad *</label>
                {isEditing ? (
                  <input
                    type="text"
                    id="soyad"
                    name="soyad"
                    value={editData.soyad}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Soyadınızı girin"
                  />
                ) : (
                  <div className="input-field bg-gray-50 text-gray-900">
                    {currentPT?.soyad}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="kullanici_adi" className="block text-sm font-medium text-gray-700 mb-2">
                  Kullanıcı Adı *
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="kullanici_adi"
                    name="kullanici_adi"
                    value={editData.kullanici_adi}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Kullanıcı adınız"
                  />
                ) : (
                  <div className="input-field bg-gray-50 text-gray-900">
                    {currentPT?.kullanici_adi}
                  </div>
                )}
                {isEditing && (
                  <p className="mt-1 text-xs text-gray-500">
                    Ad ve soyadı değiştirdiğinizde otomatik güncellenir
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="yas" className="block text-sm font-medium text-gray-700 mb-2">
                  Yaş
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    id="yas"
                    name="yas"
                    min="18"
                    max="80"
                    value={editData.yas}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Yaşınızı girin"
                  />
                ) : (
                  <div className="input-field bg-gray-50 text-gray-900">
                    {currentPT?.yas ? `${currentPT.yas} yaşında` : 'Belirtilmemiş'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profesyonel Bilgiler */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profesyonel Bilgiler</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="ders_basina_ucret" className="block text-sm font-medium text-gray-700 mb-2">
                    Ders Başına Ücret (TL) *
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        id="ders_basina_ucret"
                        name="ders_basina_ucret"
                        min="50"
                        max="2000"
                        value={editData.ders_basina_ucret}
                        onChange={handleInputChange}
                        className="input-field pl-10"
                        placeholder="200"
                      />
                    </div>
                  ) : (
                    <div className="input-field bg-gray-50 text-gray-900">
                      {currentPT?.ders_basina_ucret ? `${currentPT.ders_basina_ucret} TL` : 'Belirtilmemiş'}
                    </div>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Yeni Üye kaydında kullanılır</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kayıt Tarihi</label>
                  <div className="input-field bg-gray-50 text-gray-600">
                    {formatDate(currentPT?.kayit_tarihi)}
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="uzmanlik_alani" className="block text-sm font-medium text-gray-700 mb-2">
                  Uzmanlık Alanı / Verdiği Dersler *
                </label>
                {isEditing ? (
                  <textarea
                    id="uzmanlik_alani"
                    name="uzmanlik_alani"
                    rows={4}
                    value={editData.uzmanlik_alani}
                    onChange={handleInputChange}
                    className="input-field resize-none"
                    placeholder="Örn: Fonksiyonel Antrenman, Kilo Verme, Postür Düzeltme, Kas Geliştirme..."
                  />
                ) : (
                  <div className="input-field bg-gray-50 text-gray-900 min-h-[100px] whitespace-pre-wrap">
                    {currentPT?.uzmanlik_alani || 'Belirtilmemiş'}
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Üyelerinize sunduğunuz hizmetleri ve uzmanlık alanlarınızı belirtin
                </p>
              </div>
            </div>
          </div>

          {/* İstatistikler */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">İstatistikler</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-600">Aktif Üye</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-600">Bu Ay Verilen Ders</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">0 TL</div>
                <div className="text-sm text-gray-600">Bu Ay Kazanç</div>
              </div>
            </div>
            
            <p className="mt-4 text-xs text-gray-500 text-center">
              İstatistikler Üye ekledikçe güncellenecektir
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
