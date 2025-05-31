import React, { useEffect } from 'react';
import { Calendar, DollarSign, Clock, Users } from 'lucide-react';
import { haftaninGunleri } from '../../data/mockData';
import { hesaplaTahminiBitisTarihi, hesaplaToplamUcret, formatDate } from '../../utils/helpers';

const Step1TemelBilgiler = ({ formData, updateFormData, errors, setErrors }) => {
  
  // Toplam ücret hesaplama (ders sayısı değiştiğinde)
  useEffect(() => {
    if (formData.alinan_ders_sayisi && formData.ders_basina_ucret) {
      const toplam = hesaplaToplamUcret(
        parseInt(formData.alinan_ders_sayisi), 
        formData.ders_basina_ucret
      );
      updateFormData({ toplam_ucret: toplam });
    }
  }, [formData.alinan_ders_sayisi, formData.ders_basina_ucret]);

  // Tahmini bitiş tarihi hesaplama
  useEffect(() => {
    if (
      formData.ders_baslangic_tarihi && 
      formData.alinan_ders_sayisi && 
      formData.haftalik_ders_gunleri.length > 0
    ) {
      const bitisTarihi = hesaplaTahminiBitisTarihi(
        formData.ders_baslangic_tarihi,
        parseInt(formData.alinan_ders_sayisi),
        formData.haftalik_ders_gunleri
      );
      updateFormData({ tahmini_bitis_tarihi: bitisTarihi });
    }
  }, [formData.ders_baslangic_tarihi, formData.alinan_ders_sayisi, formData.haftalik_ders_gunleri]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
    
    // Error'ı temizle
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleGunSecimi = (gunValue) => {
    const mevcutGunler = formData.haftalik_ders_gunleri || [];
    let yeniGunler;
    
    if (mevcutGunler.includes(gunValue)) {
      // Çıkar
      yeniGunler = mevcutGunler.filter(gun => gun !== gunValue);
    } else {
      // Ekle
      yeniGunler = [...mevcutGunler, gunValue];
    }
    
    updateFormData({ haftalik_ders_gunleri: yeniGunler });
    
    // Error'ı temizle
    if (errors.haftalik_ders_gunleri) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.haftalik_ders_gunleri;
        return newErrors;
      });
    }
  };

  // Bugünün tarihi (minimum tarih için)
  const bugun = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Üye Temel Bilgileri</h2>
        <p className="text-gray-600">Üyenizin kişisel ve ders bilgilerini girin.</p>
      </div>

      {/* Ad Soyad Satırı */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ad" className="block text-sm font-medium text-gray-700 mb-2">
            Üye Adı *
          </label>
          <input
            type="text"
            id="ad"
            name="ad"
            value={formData.ad}
            onChange={handleInputChange}
            className={`input-field ${errors.ad ? 'border-red-300 focus:ring-red-500' : ''}`}
            placeholder="Örn: Ayşe"
          />
          {errors.ad && <p className="mt-1 text-sm text-red-600">{errors.ad}</p>}
        </div>

        <div>
          <label htmlFor="soyad" className="block text-sm font-medium text-gray-700 mb-2">
            Üye Soyadı *
          </label>
          <input
            type="text"
            id="soyad"
            name="soyad"
            value={formData.soyad}
            onChange={handleInputChange}
            className={`input-field ${errors.soyad ? 'border-red-300 focus:ring-red-500' : ''}`}
            placeholder="Örn: Demir"
          />
          {errors.soyad && <p className="mt-1 text-sm text-red-600">{errors.soyad}</p>}
        </div>
      </div>

      {/* Yaş */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="yas" className="block text-sm font-medium text-gray-700 mb-2">
            Üye Yaşı *
          </label>
          <input
            type="number"
            id="yas"
            name="yas"
            min="16"
            max="80"
            value={formData.yas}
            onChange={handleInputChange}
            className={`input-field ${errors.yas ? 'border-red-300 focus:ring-red-500' : ''}`}
            placeholder="25"
          />
          {errors.yas && <p className="mt-1 text-sm text-red-600">{errors.yas}</p>}
        </div>

        <div>
          <label htmlFor="alinan_ders_sayisi" className="block text-sm font-medium text-gray-700 mb-2">
            Satın Alınan Özel Ders Sayısı *
          </label>
          <input
            type="number"
            id="alinan_ders_sayisi"
            name="alinan_ders_sayisi"
            min="1"
            max="200"
            value={formData.alinan_ders_sayisi}
            onChange={handleInputChange}
            className={`input-field ${errors.alinan_ders_sayisi ? 'border-red-300 focus:ring-red-500' : ''}`}
            placeholder="40"
          />
          {errors.alinan_ders_sayisi && <p className="mt-1 text-sm text-red-600">{errors.alinan_ders_sayisi}</p>}
        </div>
      </div>

      {/* Ücret Bilgileri */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ders_basina_ucret" className="block text-sm font-medium text-gray-700 mb-2">
            Ders Başına Ücret (TL)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              id="ders_basina_ucret"
              name="ders_basina_ucret"
              min="50"
              max="1000"
              value={formData.ders_basina_ucret}
              onChange={handleInputChange}
              className="input-field pl-10"
              placeholder="200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Özel Ders Toplam Ücreti
          </label>
          <div className="input-field bg-gray-50 text-gray-700 font-medium">
            {formData.toplam_ucret ? `${formData.toplam_ucret.toLocaleString('tr-TR')} TL` : '0 TL'}
          </div>
        </div>
      </div>

      {/* Tarih Bilgileri */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ders_baslangic_tarihi" className="block text-sm font-medium text-gray-700 mb-2">
            Özel Ders Başlangıç Tarihi *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="date"
              id="ders_baslangic_tarihi"
              name="ders_baslangic_tarihi"
              min={bugun}
              value={formData.ders_baslangic_tarihi}
              onChange={handleInputChange}
              className={`input-field pl-10 ${errors.ders_baslangic_tarihi ? 'border-red-300 focus:ring-red-500' : ''}`}
            />
          </div>
          {errors.ders_baslangic_tarihi && <p className="mt-1 text-sm text-red-600">{errors.ders_baslangic_tarihi}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tahmini Özel Ders Bitiş Tarihi
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <div className="input-field pl-10 bg-gray-50 text-gray-700">
              {formData.tahmini_bitis_tarihi 
                ? formatDate(formData.tahmini_bitis_tarihi)
                : 'Otomatik hesaplanacak'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Haftalık Ders Günleri */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Haftalık Ders Günleri Seçimi *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {haftaninGunleri.map((gun) => {
            const isSelected = formData.haftalik_ders_gunleri?.includes(gun.value);
            return (
              <button
                key={gun.value}
                type="button"
                onClick={() => handleGunSecimi(gun.value)}
                className={`p-3 text-sm font-medium rounded-lg border-2 transition-colors duration-200 ${
                  isSelected
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-primary-300 hover:bg-primary-50'
                }`}
              >
                {gun.label}
              </button>
            );
          })}
        </div>
        {errors.haftalik_ders_gunleri && <p className="mt-2 text-sm text-red-600">{errors.haftalik_ders_gunleri}</p>}
        
        {formData.haftalik_ders_gunleri?.length > 0 && (
          <div className="mt-3 flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            Seçilen günler: {formData.haftalik_ders_gunleri.join(', ')} 
            <span className="ml-2 text-gray-500">
              (Haftada {formData.haftalik_ders_gunleri.length} gün)
            </span>
          </div>
        )}
      </div>

      {/* Bilgi Notu */}
      {formData.alinan_ders_sayisi && formData.haftalik_ders_gunleri?.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800">Ders Programı Özeti</h4>
              <div className="mt-1 text-sm text-blue-700 space-y-1">
                <p>• Toplam {formData.alinan_ders_sayisi} ders alınacak</p>
                <p>• Haftada {formData.haftalik_ders_gunleri.length} gün ders</p>
                <p>• Yaklaşık {Math.ceil(formData.alinan_ders_sayisi / formData.haftalik_ders_gunleri.length)} hafta sürecek</p>
                {formData.tahmini_bitis_tarihi && (
                  <p>• Tahmini bitiş: {formatDate(formData.tahmini_bitis_tarihi)}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step1TemelBilgiler;
