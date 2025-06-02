import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useToast } from '../utils/ToastContext';
import { User, Edit3, Save, X, Calendar, Award, DollarSign } from 'lucide-react';
import { formatDate, generateUsername } from '../utils/helpers';
import { IMAGES } from '../assets';
import ProfilePhotoUpload from '../components/ProfilePhotoUpload';
import ProfileFormField from '../components/form/ProfileFormField';

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
    profil_resmi_url: IMAGES.PROFILE_MUCAHIT
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
      profil_resmi_url: IMAGES.PROFILE_MUCAHIT
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
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="flex items-start space-x-3">
            <User className="h-6 w-6 lg:h-8 lg:w-8 text-primary-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 break-words">Profil Bilgileri</h1>
              <p className="text-sm lg:text-base text-gray-600">Kişisel bilgilerinizi görüntüleyin ve düzenleyin</p>
            </div>
          </div>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 btn-mobile w-full lg:w-auto"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Düzenle
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full lg:w-auto">
              <button
                onClick={handleCancel}
                className="inline-flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors duration-200 btn-mobile"
              >
                <X className="h-4 w-4 mr-2" />
                İptal
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200 btn-mobile"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Profil Kartı - Mobile'da yukarıda */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden lg:sticky lg:top-20">
            {/* Profil Resmi */}
            <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 p-6 text-center">
              {/* Profil Fotoğrafı Upload */}
              <div className="mb-4">
                <ProfilePhotoUpload
                  currentPhoto={IMAGES.PROFILE_MUCAHIT}
                  onPhotoChange={handlePhotoChange}
                  disabled={!isEditing}
                  theme="profile"
                />
              </div>
              
              <h2 className="mt-4 text-lg lg:text-xl font-bold text-white break-words">
                {isEditing ? `${editData.ad} ${editData.soyad}` : `${currentPT?.ad} ${currentPT?.soyad}`}
              </h2>
              <p className="text-primary-100 text-sm lg:text-base">Personal Trainer</p>
            </div>

            {/* Hızlı Bilgiler */}
            <div className="p-4 lg:p-6 space-y-3 lg:space-y-4">
              <div className="flex items-center space-x-3 text-gray-600">
                <Calendar className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                <span className="text-sm break-words">
                  Üyelik: {formatDate(currentPT?.kayit_tarihi)}
                </span>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-600">
                <Award className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                <span className="text-sm break-words">
                  Aktif Durum: {currentPT?.aktif_mi ? 'Aktif' : 'Pasif'}
                </span>
              </div>

              <div className="flex items-center space-x-3 text-gray-600">
                <DollarSign className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                <span className="text-sm break-words">
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
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Kişisel Bilgiler</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileFormField
                label="Ad"
                name="ad"
                value={editData.ad}
                onChange={handleInputChange}
                isEditing={isEditing}
                displayValue={currentPT?.ad}
                required
                placeholder="Adınızı girin"
                autoFocus={isEditing}
              />

              <ProfileFormField
                label="Soyad"
                name="soyad"
                value={editData.soyad}
                onChange={handleInputChange}
                isEditing={isEditing}
                displayValue={currentPT?.soyad}
                required
                placeholder="Soyadınızı girin"
              />

              <ProfileFormField
                label="Kullanıcı Adı"
                name="kullanici_adi"
                value={editData.kullanici_adi}
                onChange={handleInputChange}
                isEditing={isEditing}
                displayValue={currentPT?.kullanici_adi}
                required
                placeholder="Kullanıcı adınız"
                helpText={isEditing ? "Ad ve soyadı değiştirdiğinizde otomatik güncellenir" : undefined}
              />

              <ProfileFormField
                label="Yaş"
                name="yas"
                type="number"
                value={editData.yas}
                onChange={handleInputChange}
                isEditing={isEditing}
                displayValue={currentPT?.yas ? `${currentPT.yas} yaşında` : null}
                min="18"
                max="80"
                placeholder="Yaşınızı girin"
              />
            </div>
          </div>

          {/* Profesyonel Bilgiler */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Profesyonel Bilgiler</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileFormField
                  label="Ders Başına Ücret (TL)"
                  name="ders_basina_ucret"
                  type="number"
                  value={editData.ders_basina_ucret}
                  onChange={handleInputChange}
                  isEditing={isEditing}
                  displayValue={currentPT?.ders_basina_ucret ? `${currentPT.ders_basina_ucret} TL` : null}
                  required
                  min="50"
                  max="2000"
                  placeholder="200"
                  icon={DollarSign}
                  helpText="Yeni Üye kaydında kullanılır"
                />

                <ProfileFormField
                  label="Kayıt Tarihi"
                  isEditing={false}
                  displayValue={formatDate(currentPT?.kayit_tarihi)}
                />
              </div>

              <ProfileFormField
                label="Uzmanlık Alanı / Verdiği Dersler"
                name="uzmanlik_alani"
                type="textarea"
                value={editData.uzmanlik_alani}
                onChange={handleInputChange}
                isEditing={isEditing}
                displayValue={currentPT?.uzmanlik_alani}
                required
                rows={4}
                placeholder="Örn: Fonksiyonel Antrenman, Kilo Verme, Postür Düzeltme, Kas Geliştirme..."
                helpText="Üyelerinize sunduğunuz hizmetleri ve uzmanlık alanlarınızı belirtin"
              />
            </div>
          </div>

          {/* İstatistikler */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">İstatistikler</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center hover-lift">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-600">Aktif Üye</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center hover-lift">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-600">Bu Ay Verilen Ders</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center hover-lift">
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
