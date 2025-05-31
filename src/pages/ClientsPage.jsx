import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useToast } from '../utils/ToastContext';
import { UserPlus, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import Step1TemelBilgiler from '../components/client-form/Step1TemelBilgiler';
import Step2VucutOlculeri from '../components/client-form/Step2VucutOlculeri';
import Step3Onizleme from '../components/client-form/Step3Onizleme';
import SuccessModal from '../components/SuccessModal';
import { validateMusteriForm, saveToLocalStorage, getFromLocalStorage } from '../utils/helpers';

const ClientsPage = () => {
  const { currentPT } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Adım 1 - Temel Bilgiler
    ad: '',
    soyad: '',
    yas: '',
    alinan_ders_sayisi: '',
    ders_basina_ucret: currentPT?.ders_basina_ucret || 200,
    toplam_ucret: 0,
    ders_baslangic_tarihi: '',
    tahmini_bitis_tarihi: null,
    haftalik_ders_gunleri: [],
    
    // Adım 2 - Vücut Ölçüleri
    vucut_olculeri: {
      boy: '',
      kilo: '',
      bel: '',
      kalca: '',
      gogus: ''
    },
    
    // Meta veriler
    pt_id: currentPT?.id,
    kayit_tarihi: new Date().toISOString(),
    aktif_mi: true,
    notlar: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedCustomer, setSavedCustomer] = useState(null);

  // Form verisini güncelleme
  const updateFormData = (newData) => {
    setFormData(prev => ({
      ...prev,
      ...newData
    }));
  };

  // Adım ilerletme
  const nextStep = () => {
    // Mevcut adımı validate et
    const validation = validateMusteriForm(formData);
    
    if (currentStep === 1) {
      // Adım 1 validasyonu
      const step1Errors = {};
      if (!formData.ad) step1Errors.ad = validation.errors.ad;
      if (!formData.soyad) step1Errors.soyad = validation.errors.soyad;
      if (!formData.yas) step1Errors.yas = validation.errors.yas;
      if (!formData.alinan_ders_sayisi) step1Errors.alinan_ders_sayisi = validation.errors.alinan_ders_sayisi;
      if (!formData.ders_baslangic_tarihi) step1Errors.ders_baslangic_tarihi = validation.errors.ders_baslangic_tarihi;
      if (!formData.haftalik_ders_gunleri?.length) step1Errors.haftalik_ders_gunleri = validation.errors.haftalik_ders_gunleri;
      
      if (Object.keys(step1Errors).length > 0) {
        setErrors(step1Errors);
        toast.warning('Lütfen tüm zorunlu alanları eksiksiz doldurun.', {
          title: 'Eksik Bilgiler!',
          duration: 4000
        });
        return;
      }
    }
    
    setErrors({});
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  // Form sıfırlama fonksiyonu
  const resetForm = () => {
    setFormData({
      ad: '',
      soyad: '',
      yas: '',
      alinan_ders_sayisi: '',
      ders_basina_ucret: currentPT?.ders_basina_ucret || 200,
      toplam_ucret: 0,
      ders_baslangic_tarihi: '',
      tahmini_bitis_tarihi: null,
      haftalik_ders_gunleri: [],
      vucut_olculeri: {
        boy: '',
        kilo: '',
        bel: '',
        kalca: '',
        gogus: ''
      },
      pt_id: currentPT?.id,
      kayit_tarihi: new Date().toISOString(),
      aktif_mi: true,
      notlar: ''
    });
    
    setCurrentStep(1);
    setErrors({});
  };

  // Success modal kapatıldığında
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setSavedCustomer(null);
    resetForm();
  };

  // Adım geri alma
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setErrors({});
  };

  // Form gönderme (Adım 3'te)
  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Final validation
      const validation = validateMusteriForm(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        toast.error('Lütfen formı kontrol edin. Bazı alanlar eksik veya hatalı girilmiş.', {
          title: 'Form Hatası!',
          duration: 6000
        });
        setLoading(false);
        return;
      }

      // Müşteri verilerini local storage'a kaydet
      const mevcutMusteriler = getFromLocalStorage('musteriler', []);
      const yeniMusteri = {
        ...formData,
        id: Date.now(), // Basit ID üretimi
        kayit_tarihi: new Date().toISOString()
      };
      
      mevcutMusteriler.push(yeniMusteri);
      saveToLocalStorage('musteriler', mevcutMusteriler);
      
      // Başarılı müşteri bilgisini sakla
      setSavedCustomer(yeniMusteri);
      
      // Success modal'ı göster
      setShowSuccessModal(true);
      
      // Toast notification
      toast.success(`${yeniMusteri.ad} ${yeniMusteri.soyad} adlı üye başarıyla sisteme eklendi!`, {
        title: 'Üyelik Tamamlandı!',
        duration: 5000
      });
      
    } catch (error) {
      console.error('Üye kayıt hatası:', error);
      toast.error('Müşteri kaydı sırasında beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.', {
        title: 'Kayıt Hatası!',
        duration: 7000
      });
    } finally {
      setLoading(false);
    }
  };

  // Adım başlıkları
  const steps = [
    { number: 1, title: 'Temel Bilgiler', description: 'Ad, soyad ve ders bilgileri' },
    { number: 2, title: 'Vücut Ölçüleri', description: 'Boy, kilo ve ölçüler' },
    { number: 3, title: 'Önizleme', description: 'Bilgileri kontrol et ve kaydet' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Sayfa Başlığı */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <UserPlus className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Yeni Üye Ekle</h1>
        </div>
        <p className="text-gray-600">
          Yeni Üyenizin bilgilerini 3 adımda kolayca kaydedin.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex-1">
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-200 ${
                  currentStep >= step.number
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.number ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.number}</span>
                  )}
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-primary-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`hidden sm:block h-0.5 mt-4 ${
                  currentStep > step.number ? 'bg-primary-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Form Content */}
        <div className="p-6">
          {currentStep === 1 && (
            <Step1TemelBilgiler
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              setErrors={setErrors}
            />
          )}
          
          {currentStep === 2 && (
            <Step2VucutOlculeri
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}
          
          {currentStep === 3 && (
            <Step3Onizleme
              formData={formData}
              loading={loading}
            />
          )}
        </div>

        {/* Form Actions */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri
          </button>

          <div className="text-sm text-gray-500">
            Adım {currentStep} / {steps.length}
          </div>

          {currentStep < 3 ? (
            <button
              onClick={nextStep}
              className="inline-flex items-center px-6 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              Devam Et
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Üyeliği Tamamla
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Üyelik Başarıyla Oluşturuldu!"
        message={savedCustomer ? `${savedCustomer.ad} ${savedCustomer.soyad} adlı Üye sisteme başarıyla eklendi.` : 'Üyelik işlemi tamamlandı.'}
        duration={4000}
      />
    </div>
  );
};

export default ClientsPage;
