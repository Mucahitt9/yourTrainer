import React from 'react';
import { Ruler, Scale, Activity } from 'lucide-react';

const Step2VucutOlculeri = ({ formData, updateFormData, errors }) => {
  
  const handleOlcuChange = (e) => {
    const { name, value } = e.target;
    updateFormData({
      vucut_olculeri: {
        ...formData.vucut_olculeri,
        [name]: value
      }
    });
  };

  const olcuAlanlari = [
    {
      name: 'boy',
      label: 'Boy (cm)',
      icon: Ruler,
      placeholder: '170',
      min: 140,
      max: 220,
      required: true
    },
    {
      name: 'kilo',
      label: 'Kilo (kg)',
      icon: Scale,
      placeholder: '70',
      min: 40,
      max: 200,
      required: true
    },
    {
      name: 'bel',
      label: 'Bel Çevresi (cm)',
      icon: Activity,
      placeholder: '80',
      min: 50,
      max: 150,
      required: false
    },
    {
      name: 'kalca',
      label: 'Kalça Çevresi (cm)',
      icon: Activity,
      placeholder: '95',
      min: 60,
      max: 160,
      required: false
    },
    {
      name: 'gogus',
      label: 'Göğüs Çevresi (cm)',
      icon: Activity,
      placeholder: '85',
      min: 60,
      max: 150,
      required: false
    }
  ];

  // BMI hesaplama
  const hesaplaBMI = () => {
    const boy = parseFloat(formData.vucut_olculeri?.boy);
    const kilo = parseFloat(formData.vucut_olculeri?.kilo);
    
    if (boy && kilo && boy > 0) {
      const boyMetre = boy / 100;
      const bmi = kilo / (boyMetre * boyMetre);
      return bmi.toFixed(1);
    }
    return null;
  };

  const getBMIKategori = (bmi) => {
    if (!bmi) return null;
    const bmiNum = parseFloat(bmi);
    
    if (bmiNum < 18.5) return { kategori: 'Zayıf', renk: 'text-blue-600' };
    if (bmiNum < 25) return { kategori: 'Normal', renk: 'text-green-600' };
    if (bmiNum < 30) return { kategori: 'Fazla Kilolu', renk: 'text-yellow-600' };
    return { kategori: 'Obez', renk: 'text-red-600' };
  };

  const bmi = hesaplaBMI();
  const bmiKategori = getBMIKategori(bmi);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Üye Vücut Ölçüleri</h2>
        <p className="text-gray-600">
          Üyenizin başlangıç vücut ölçülerini girin. Bu bilgiler ilerleme takibi için kullanılacaktır.
        </p>
      </div>

      {/* Ölçü Alanları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {olcuAlanlari.map((alan) => {
          const Icon = alan.icon;
          return (
            <div key={alan.name}>
              <label htmlFor={alan.name} className="block text-sm font-medium text-gray-700 mb-2">
                {alan.label} {alan.required && '*'}
              </label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  id={alan.name}
                  name={alan.name}
                  min={alan.min}
                  max={alan.max}
                  step="0.1"
                  value={formData.vucut_olculeri?.[alan.name] || ''}
                  onChange={handleOlcuChange}
                  className={`input-field pl-10 ${errors[alan.name] ? 'border-red-300 focus:ring-red-500' : ''}`}
                  placeholder={alan.placeholder}
                />
              </div>
              {errors[alan.name] && <p className="mt-1 text-sm text-red-600">{errors[alan.name]}</p>}
            </div>
          );
        })}

        {/* BMI Hesaplama Kartı */}
        {bmi && (
          <div className="md:col-span-2">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Vücut Kitle İndeksi (BMI)</h4>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">{bmi}</span>
                    {bmiKategori && (
                      <span className={`text-sm font-medium ${bmiKategori.renk}`}>
                        ({bmiKategori.kategori})
                      </span>
                    )}
                  </div>
                </div>
                <Scale className="h-8 w-8 text-gray-400" />
              </div>
              <div className="mt-3 text-xs text-gray-500">
                BMI = Kilo (kg) ÷ Boy² (m²)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bilgi Notları */}
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800">Ölçüm İpuçları</h4>
              <div className="mt-1 text-sm text-blue-700 space-y-1">
                <p>• Boy ve kilo ölçüleri zorunludur</p>
                <p>• Çevre ölçüleri opsiyoneldir, ancak takip için önerilir</p>
                <p>• Ölçümler sabah, aç karnına alınmalıdır</p>
                <p>• Çevre ölçüleri için esnemeyen mezura kullanın</p>
              </div>
            </div>
          </div>
        </div>

        {/* BMI Bilgi Kartı */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Scale className="h-5 w-5 text-green-600 mt-0.5" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-green-800">BMI Kategorileri</h4>
              <div className="mt-1 text-sm text-green-700 space-y-1">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>Zayıf: &lt; 18.5</div>
                  <div>Normal: 18.5 - 24.9</div>
                  <div>Fazla Kilolu: 25.0 - 29.9</div>
                  <div>Obez: ≥ 30.0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Opsiyonel Notlar */}
      <div>
        <label htmlFor="notlar" className="block text-sm font-medium text-gray-700 mb-2">
          Ek Notlar (Opsiyonel)
        </label>
        <textarea
          id="notlar"
          name="notlar"
          rows={3}
          value={formData.notlar || ''}
          onChange={(e) => updateFormData({ notlar: e.target.value })}
          className="input-field resize-none"
          placeholder="Üyeyle ilgili özel notlar, sağlık durumu, hedefler vb..."
        />
        <p className="mt-1 text-xs text-gray-500">
          Üyenin hedefleri, sağlık durumu veya dikkat edilmesi gereken özel durumlar
        </p>
      </div>
    </div>
  );
};

export default Step2VucutOlculeri;
