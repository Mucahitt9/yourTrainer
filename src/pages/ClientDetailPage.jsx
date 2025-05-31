import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { User, Calendar, DollarSign, Activity, Scale, Ruler, Edit, ArrowLeft, Trash2, Clock, Users, FileText, Phone, Mail } from 'lucide-react';
import { getFromLocalStorage, formatDate, saveToLocalStorage } from '../utils/helpers';
import { useToast } from '../utils/ToastContext';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [musteri, setMusteri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Müşteri bilgilerini yükle
  useEffect(() => {
    const loadMusteri = () => {
      try {
        const musteriler = getFromLocalStorage('musteriler', []);
        const bulunanMusteri = musteriler.find(m => m.id === parseInt(id));
        
        if (bulunanMusteri) {
          setMusteri(bulunanMusteri);
        } else {
          toast.error('Müşteri bulunamadı');
          navigate('/clients/list');
        }
      } catch (error) {
        toast.error('Müşteri verileri yüklenirken hata oluştu');
        navigate('/clients/list');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadMusteri();
    }
  }, [id, navigate, toast]);

  // Müşteri silme
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    
    try {
      // Kısa bir delay ekleyelim (gerçek API'da olacağı gibi)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const musteriler = getFromLocalStorage('musteriler', []);
      const yeniListe = musteriler.filter(m => m.id !== parseInt(id));
      saveToLocalStorage('musteriler', yeniListe);
      
      toast.success(`${musteri.ad} ${musteri.soyad} adlı müşteri başarıyla silindi.`, {
        title: 'Müşteri Silindi!',
        duration: 4000
      });
      
      // Modal'ı kapat ve anasayfaya yönlendir
      setShowDeleteModal(false);
      navigate('/clients/list');
    } catch (error) {
      toast.error('Müşteri silinirken beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.', {
        title: 'Silme Hatası!',
        duration: 5000
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  // Durum badge'i
  const getStatusInfo = () => {
    if (!musteri?.tahmini_bitis_tarihi) {
      return { status: 'Belirsiz', color: 'bg-gray-100 text-gray-800', icon: Clock };
    }

    const now = new Date();
    const bitisTarihi = new Date(musteri.tahmini_bitis_tarihi);
    
    if (bitisTarihi > now) {
      return { status: 'Aktif', color: 'bg-green-100 text-green-800', icon: Users };
    } else {
      return { status: 'Tamamlandı', color: 'bg-red-100 text-red-800', icon: Clock };
    }
  };

  // Kalan süre hesaplama
  const getRemainingInfo = () => {
    if (!musteri?.tahmini_bitis_tarihi) return null;
    
    const now = new Date();
    const bitis = new Date(musteri.tahmini_bitis_tarihi);
    const diffTime = bitis - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return { text: `${diffDays} gün kaldı`, color: 'text-green-600' };
    } else if (diffDays === 0) {
      return { text: 'Bugün bitiyor', color: 'text-yellow-600' };
    } else {
      return { text: `${Math.abs(diffDays)} gün önce bitti`, color: 'text-red-600' };
    }
  };

  // BMI hesaplama
  const calculateBMI = () => {
    if (musteri?.vucut_olculeri?.boy && musteri?.vucut_olculeri?.kilo) {
      const boy = parseFloat(musteri.vucut_olculeri.boy);
      const kilo = parseFloat(musteri.vucut_olculeri.kilo);
      const boyMetre = boy / 100;
      return (kilo / (boyMetre * boyMetre)).toFixed(1);
    }
    return null;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Müşteri bilgileri yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!musteri) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Müşteri Bulunamadı</h2>
          <p className="text-gray-600 mb-6">Aradığınız müşteri mevcut değil veya silinmiş olabilir.</p>
          <Link
            to="/clients/list"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Müşteri Listesine Dön
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo();
  const remainingInfo = getRemainingInfo();
  const bmi = calculateBMI();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        {/* Mobil: İlk satır - Geri buton ve başlık */}
        <div className="flex items-center space-x-4 mb-4">
          <Link
            to="/clients/list"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
              {musteri.ad} {musteri.soyad}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">{musteri.yas} yaşında • Kayıt: {formatDate(musteri.kayit_tarihi)}</p>
          </div>
        </div>
        
        {/* Mobil: İkinci satır - Status ve Aksiyonlar */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          {/* Status Badge */}
          <div className="flex-shrink-0">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
              <StatusIcon className="h-4 w-4 mr-1" />
              {statusInfo.status}
            </span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
            <Link
              to={`/clients/${id}/edit`}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 min-w-0"
            >
              <Edit className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Düzenle</span>
            </Link>
            
            <button
              onClick={handleDeleteClick}
              className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200 min-w-0"
            >
              <Trash2 className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Sil</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Kolon - Genel Bilgiler */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profil Kartı */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-white flex items-center justify-center mb-4">
                <User className="h-10 w-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-white">{musteri.ad} {musteri.soyad}</h2>
              <p className="text-primary-100">{musteri.yas} yaşında</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Durumu</span>
                <span className={`text-sm font-medium ${statusInfo.color.includes('green') ? 'text-green-600' : statusInfo.color.includes('red') ? 'text-red-600' : 'text-gray-600'}`}>
                  {statusInfo.status}
                </span>
              </div>
              
              {remainingInfo && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Kalan Süre</span>
                  <span className={`text-sm font-medium ${remainingInfo.color}`}>
                    {remainingInfo.text}
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Kayıt Tarihi</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(musteri.kayit_tarihi)}
                </span>
              </div>
            </div>
          </div>

          {/* İstatistikler */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Özet İstatistikler</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Toplam Ders</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{musteri.alinan_ders_sayisi}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">Toplam Ücret</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {musteri.toplam_ucret?.toLocaleString('tr-TR')} ₺
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Haftalık Ders</span>
                </div>
                <span className="text-lg font-bold text-purple-600">
                  {musteri.haftalik_ders_gunleri?.length || 0} gün
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-gray-600">Ders/Ücret</span>
                </div>
                <span className="text-lg font-bold text-orange-600">
                  {musteri.ders_basina_ucret} ₺
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Kolon - Detay Bilgiler */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ders Programı */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ders Programı</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlangıç Tarihi</label>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{formatDate(musteri.ders_baslangic_tarihi)}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tahmini Bitiş Tarihi</label>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">
                    {musteri.tahmini_bitis_tarihi ? formatDate(musteri.tahmini_bitis_tarihi) : 'Belirtilmemiş'}
                  </span>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Haftalık Ders Günleri</label>
                <div className="flex flex-wrap gap-2">
                  {musteri.haftalik_ders_gunleri?.map((gun, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full"
                    >
                      {gun}
                    </span>
                  )) || <span className="text-gray-500">Belirtilmemiş</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Vücut Ölçüleri */}
          {musteri.vucut_olculeri && Object.values(musteri.vucut_olculeri).some(value => value) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vücut Ölçüleri</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {musteri.vucut_olculeri.boy && (
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                      <Ruler className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{musteri.vucut_olculeri.boy}</div>
                    <div className="text-sm text-gray-600">Boy (cm)</div>
                  </div>
                )}
                
                {musteri.vucut_olculeri.kilo && (
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                      <Scale className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{musteri.vucut_olculeri.kilo}</div>
                    <div className="text-sm text-gray-600">Kilo (kg)</div>
                  </div>
                )}
                
                {bmi && (
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                      <Activity className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{bmi}</div>
                    <div className="text-sm text-gray-600">BMI</div>
                  </div>
                )}
              </div>
              
              {/* Diğer ölçüler */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {musteri.vucut_olculeri.bel && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Bel Çevresi:</span>
                    <span className="font-medium">{musteri.vucut_olculeri.bel} cm</span>
                  </div>
                )}
                
                {musteri.vucut_olculeri.kalca && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Kalça Çevresi:</span>
                    <span className="font-medium">{musteri.vucut_olculeri.kalca} cm</span>
                  </div>
                )}
                
                {musteri.vucut_olculeri.gogus && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Göğüs Çevresi:</span>
                    <span className="font-medium">{musteri.vucut_olculeri.gogus} cm</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notlar */}
          {musteri.notlar && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Notlar
              </h3>
              <p className="text-gray-700 leading-relaxed">{musteri.notlar}</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        customerName={musteri ? `${musteri.ad} ${musteri.soyad}` : ''}
        loading={deleteLoading}
      />
    </div>
  );
};

export default ClientDetailPage;
