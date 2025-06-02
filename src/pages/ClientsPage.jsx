import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useToast } from '../utils/ToastContext';
import { UserPlus, ArrowLeft, ArrowRight, Check, Save, AlertTriangle } from 'lucide-react';
import { useFormValidation } from '../hooks/useFormValidation';
import Step1TemelBilgiler from '../components/client-form/Step1TemelBilgiler';
import Step2VucutOlculeri from '../components/client-form/Step2VucutOlculeri';
import Step3Onizleme from '../components/client-form/Step3Onizleme';
import SuccessModal from '../components/SuccessModal';
import { validateMusteriForm, saveToLocalStorage, getFromLocalStorage } from '../utils/helpers';

const STEPS = [
  { 
    id: 1, 
    title: 'Temel Bilgiler', 
    description: 'Ad, soyad ve ders bilgileri',
    icon: '👤',
    color: 'bg-blue-100 text-blue-600'
  },
  { 
    id: 2, 
    title: 'Vücut Ölçüleri', 
    description: 'Boy, kilo ve ölçüler',
    icon: '📏',
    color: 'bg-green-100 text-green-600'
  },
  { 
    id: 3, 
    title: 'Önizleme', 
    description: 'Kontrol ve kaydet',
    icon: '✓',
    color: 'bg-purple-100 text-purple-600'
  }
];

const StepIndicator = ({ steps, currentStep, onStepClick }) => (
  <div className="relative mb-6 lg:mb-8">
    {/* Progress line */}
    <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200">
      <div 
        className="h-full bg-primary-600 transition-all duration-500"
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      />
    </div>
    
    {/* Steps */}
    <div className="relative flex justify-between">
      {steps.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        const isClickable = currentStep > step.id;
        
        return (
          <button
            key={step.id}
            onClick={() => isClickable && onStepClick(step.id)}
            disabled={!isClickable}
            className={`
              group flex flex-col items-center space-y-2 p-2 rounded-lg transition-all duration-200
              ${isClickable ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'}
            `}
          >
            <div className={`
              relative w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover-scale
              ${isCompleted 
                ? 'bg-primary-600 border-primary-600 text-white' 
                : isActive 
                  ? 'bg-primary-100 border-primary-600 text-primary-600'
                  : 'bg-white border-gray-300 text-gray-400'
              }
            `}>
              {isCompleted ? (
                <Check className="h-4 w-4 lg:h-5 lg:w-5" />
              ) : (
                <span className="text-sm lg:text-lg">{step.icon}</span>
              )}
            </div>
            
            <div className="text-center">
              <p className={`text-xs lg:text-sm font-medium break-words ${
                isActive ? 'text-primary-600' : isCompleted ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step.title}
              </p>
              <p className="text-xs text-gray-500 hidden sm:block break-words">
                {step.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

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

  const [isDirty, setIsDirty] = useState(false);
  const [hasShownAutoSave, setHasShownAutoSave] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedCustomer, setSavedCustomer] = useState(null);

  // Form validation hook
  const validation = useFormValidation();

  // Auto-save notification (only show once)
  useEffect(() => {
    if (isDirty && !hasShownAutoSave) {
      const timeoutId = setTimeout(() => {
        try {
          localStorage.setItem('form_draft_client', JSON.stringify(formData));
          toast.show('Taslak otomatik kaydedildi', 'info', 2000);
          setHasShownAutoSave(true);
        } catch (error) {
          console.warn('Auto-save failed:', error);
        }
      }, 2000);
      return () => clearTimeout(timeoutId);
    } else if (isDirty) {
      // Silent auto-save after first notification
      const timeoutId = setTimeout(() => {
        try {
          localStorage.setItem('form_draft_client', JSON.stringify(formData));
        } catch (error) {
          console.warn('Auto-save failed:', error);
        }
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [isDirty, formData, toast, hasShownAutoSave]);

  // Load draft on mount
  useEffect(() => {
    try {
      const draft = localStorage.getItem('form_draft_client');
      if (draft) {
        const parsedDraft = JSON.parse(draft);
        setFormData(prev => ({ ...prev, ...parsedDraft }));
        setIsDirty(true);
      }
    } catch (error) {
      console.warn('Failed to load draft:', error);
    }
  }, []);

  // Form verisini güncelleme
  const updateFormData = useCallback((newData) => {
    setFormData(prev => ({
      ...prev,
      ...newData
    }));
    setIsDirty(true);
  }, []);

  const canProceedToStep = useCallback((step) => {
    if (step === 2) {
      // Check required fields for step 1
      const requiredFields = ['ad', 'soyad', 'yas', 'alinan_ders_sayisi', 'ders_baslangic_tarihi', 'haftalik_ders_gunleri'];
      return requiredFields.every(field => {
        if (field === 'haftalik_ders_gunleri') {
          return formData[field] && formData[field].length > 0;
        }
        return formData[field] && formData[field].toString().trim() !== '';
      });
    }
    return true;
  }, [formData]);

  // Adım ilerletme
  const nextStep = useCallback(() => {
    if (!canProceedToStep(currentStep + 1)) {
      const isValid = validation.validateForm(formData);
      if (!isValid) {
        toast.warning('Lütfen tüm zorunlu alanları eksiksiz doldurun.', {
          title: 'Eksik Bilgiler!',
          duration: 4000
        });
        return;
      }
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 3));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep, canProceedToStep, validation, formData, toast]);

  // Adım geri alma
  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleStepClick = useCallback((stepId) => {
    if (stepId < currentStep) {
      setCurrentStep(stepId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  // Form sıfırlama fonksiyonu
  const resetForm = useCallback(() => {
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
    validation.clearErrors();
    setIsDirty(false);
    localStorage.removeItem('form_draft_client');
  }, [currentPT, validation]);

  // Form gönderme (Adım 3'te)
  const handleSubmit = useCallback(async () => {
    setLoading(true);
    
    try {
      // Final validation
      const isValid = validation.validateForm(formData);
      if (!isValid) {
        toast.error('Lütfen formu kontrol edin. Bazı alanlar eksik veya hatalı girilmiş.', {
          title: 'Form Hatası!',
          duration: 6000
        });
        setLoading(false);
        return;
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

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
      
      // Clear draft
      localStorage.removeItem('form_draft_client');
      
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
  }, [formData, validation, toast]);

  // Success modal kapatıldığında
  const handleSuccessModalClose = useCallback(() => {
    setShowSuccessModal(false);
    setSavedCustomer(null);
    resetForm();
  }, [resetForm]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8">
      {/* Sayfa Başlığı */}
      <div className="text-center mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4">
          <UserPlus className="h-6 w-6 lg:h-8 lg:w-8 text-primary-600 flex-shrink-0" />
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 break-words">Yeni Üye Ekle</h1>
        </div>
        <p className="text-sm lg:text-base text-gray-600 mb-4">
          Yeni üyenizin bilgilerini 3 adımda kolayca kaydedin.
        </p>
        {isDirty && (
          <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full animate-fade-in">
            <Save className="h-4 w-4 mr-1" />
            Taslak kaydedildi
          </div>
        )}
      </div>

      {/* Progress Steps */}
      <StepIndicator 
        steps={STEPS} 
        currentStep={currentStep} 
        onStepClick={handleStepClick}
      />

      {/* Form Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden card-animate">
        {/* Form Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {currentStep === 1 && (
            <Step1TemelBilgiler
              formData={formData}
              updateFormData={updateFormData}
              errors={validation.errors}
              setErrors={validation.clearErrors}
            />
          )}
          
          {currentStep === 2 && (
            <Step2VucutOlculeri
              formData={formData}
              updateFormData={updateFormData}
              errors={validation.errors}
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
        <div className="bg-gray-50 px-4 py-4 sm:px-6 lg:px-8 sm:py-6 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 border-t border-gray-200">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 btn-mobile"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri
          </button>

          <div className="text-sm text-gray-500 order-first sm:order-none">
            Adım {currentStep} / {STEPS.length}
          </div>

          {currentStep < 3 ? (
            <button
              onClick={nextStep}
              disabled={!canProceedToStep(currentStep + 1)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 btn-mobile"
            >
              Devam Et
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 btn-mobile"
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
        message={savedCustomer ? `${savedCustomer.ad} ${savedCustomer.soyad} adlı üye sisteme başarıyla eklendi.` : 'Üyelik işlemi tamamlandı.'}
        duration={4000}
      />
    </div>
  );
};

export default ClientsPage;
