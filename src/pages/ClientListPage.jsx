import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, Plus, UserPlus, Calendar, DollarSign, Phone, Mail, Eye, Edit, Trash2, Filter } from 'lucide-react';
import { getFromLocalStorage, formatDate } from '../utils/helpers';
import { useToast } from '../utils/ToastContext';

const ClientListPage = () => {
  const [musteriler, setMusteriler] = useState([]);
  const [filteredMusteriler, setFilteredMusteriler] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'completed'
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Müşterileri yükle
  useEffect(() => {
    const loadMusteriler = () => {
      try {
        const kayitliMusteriler = getFromLocalStorage('musteriler', []);
        setMusteriler(kayitliMusteriler);
        setFilteredMusteriler(kayitliMusteriler);
      } catch (error) {
        toast.error('Müşteri verileri yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    loadMusteriler();
  }, [toast]);

  // Arama ve filtreleme
  useEffect(() => {
    let filtered = musteriler;

    // Arama
    if (searchTerm) {
      filtered = filtered.filter(musteri => 
        `${musteri.ad} ${musteri.soyad}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        musteri.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        musteri.soyad.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Durum filtresi
    if (statusFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(musteri => {
        if (!musteri.tahmini_bitis_tarihi) return statusFilter === 'active';
        const bitisTarihi = new Date(musteri.tahmini_bitis_tarihi);
        
        if (statusFilter === 'active') {
          return bitisTarihi > now;
        } else if (statusFilter === 'completed') {
          return bitisTarihi <= now;
        }
        return true;
      });
    }

    setFilteredMusteriler(filtered);
  }, [searchTerm, statusFilter, musteriler]);

  const handleDelete = (musteriId) => {
    if (window.confirm('Bu müşteriyi silmek istediğinizden emin misiniz?')) {
      try {
        const yeniListe = musteriler.filter(m => m.id !== musteriId);
        setMusteriler(yeniListe);
        localStorage.setItem('musteriler', JSON.stringify(yeniListe));
        toast.success('Müşteri başarıyla silindi');
      } catch (error) {
        toast.error('Müşteri silinirken hata oluştu');
      }
    }
  };

  const getStatusBadge = (musteri) => {
    if (!musteri.tahmini_bitis_tarihi) {
      return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Belirsiz</span>;
    }

    const now = new Date();
    const bitisTarihi = new Date(musteri.tahmini_bitis_tarihi);
    
    if (bitisTarihi > now) {
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Aktif</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Tamamlandı</span>;
    }
  };

  const getRemainingDays = (bitisTarihi) => {
    if (!bitisTarihi) return null;
    const now = new Date();
    const bitis = new Date(bitisTarihi);
    const diffTime = bitis - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return `${diffDays} gün kaldı`;
    } else if (diffDays === 0) {
      return 'Bugün bitiyor';
    } else {
      return `${Math.abs(diffDays)} gün önce bitti`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Müşteri verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Sayfa Başlığı */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <Users className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Müşteri Listesi</h1>
              <p className="text-gray-600">
                Toplam {musteriler.length} müşteri • {filteredMusteriler.length} görüntüleniyor
              </p>
            </div>
          </div>
          
          <Link
            to="/clients/new"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Yeni Müşteri Ekle
          </Link>
        </div>
      </div>

      {/* Arama ve Filtreler */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Arama */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Müşteri ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Durum Filtresi */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field pl-10 appearance-none"
            >
              <option value="all">Tüm Müşteriler</option>
              <option value="active">Aktif Müşteriler</option>
              <option value="completed">Tamamlanan Müşteriler</option>
            </select>
          </div>

          {/* İstatistikler */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-100 rounded-full"></div>
              <span>Aktif: {musteriler.filter(m => {
                if (!m.tahmini_bitis_tarihi) return false;
                return new Date(m.tahmini_bitis_tarihi) > new Date();
              }).length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-100 rounded-full"></div>
              <span>Tamamlanan: {musteriler.filter(m => {
                if (!m.tahmini_bitis_tarihi) return false;
                return new Date(m.tahmini_bitis_tarihi) <= new Date();
              }).length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Müşteri Listesi */}
      {filteredMusteriler.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          {musteriler.length === 0 ? (
            <div>
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz müşteri eklenmemiş</h3>
              <p className="text-gray-500 mb-6">İlk müşterinizi ekleyerek başlayın.</p>
              <Link
                to="/clients/new"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                İlk Müşteriyi Ekle
              </Link>
            </div>
          ) : (
            <div>
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sonuç bulunamadı</h3>
              <p className="text-gray-500">Arama kriterlerinize uygun müşteri bulunmuyor.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMusteriler.map((musteri) => (
            <div key={musteri.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              {/* Müşteri Kartı Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {musteri.ad} {musteri.soyad}
                    </h3>
                    <p className="text-sm text-gray-500">{musteri.yas} yaşında</p>
                    <div className="mt-2">
                      {getStatusBadge(musteri)}
                    </div>
                  </div>
                  
                  {/* Aksiyonlar */}
                  <div className="flex items-center space-x-1">
                    <Link
                      to={`/clients/${musteri.id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      title="Detayları Görüntüle"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      to={`/clients/${musteri.id}/edit`}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                      title="Düzenle"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(musteri.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Müşteri Kartı Body */}
              <div className="p-6 space-y-4">
                {/* Ders Bilgileri */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                      <Calendar className="h-4 w-4" />
                      <span>Toplam Ders</span>
                    </div>
                    <p className="font-medium text-gray-900">{musteri.alinan_ders_sayisi} ders</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                      <DollarSign className="h-4 w-4" />
                      <span>Toplam Ücret</span>
                    </div>
                    <p className="font-medium text-gray-900">{musteri.toplam_ucret?.toLocaleString('tr-TR')} ₺</p>
                  </div>
                </div>

                {/* Tarih Bilgileri */}
                <div>
                  <div className="text-sm text-gray-600 mb-2">Program Tarihleri</div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Başlangıç:</span>
                      <span className="font-medium">{formatDate(musteri.ders_baslangic_tarihi)}</span>
                    </div>
                    {musteri.tahmini_bitis_tarihi && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Bitiş:</span>
                        <span className="font-medium">{formatDate(musteri.tahmini_bitis_tarihi)}</span>
                      </div>
                    )}
                  </div>
                  
                  {musteri.tahmini_bitis_tarihi && (
                    <div className="mt-2 text-xs text-gray-500">
                      {getRemainingDays(musteri.tahmini_bitis_tarihi)}
                    </div>
                  )}
                </div>

                {/* Haftalık Program */}
                {musteri.haftalik_ders_gunleri && musteri.haftalik_ders_gunleri.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Haftalık Program</div>
                    <div className="flex flex-wrap gap-1">
                      {musteri.haftalik_ders_gunleri.map((gun, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded"
                        >
                          {gun.slice(0, 3)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notlar */}
                {musteri.notlar && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Notlar</div>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-2 line-clamp-2">
                      {musteri.notlar}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientListPage;
