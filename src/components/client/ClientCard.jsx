import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, DollarSign, Eye, Edit, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const ClientCard = memo(({ 
  client, 
  onDeleteClick,
  className = '' 
}) => {
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

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 hover-lift card-animate transition-all duration-300 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {client.ad} {client.soyad}
            </h3>
            <p className="text-sm text-gray-500">{client.yas} yaşında</p>
            <div className="mt-2">
              {getStatusBadge(client)}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
            <Link
              to={`/clients/${client.id}`}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 touch-manipulation hover-scale"
              title="Detayları Görüntüle"
            >
              <Eye className="h-4 w-4" />
            </Link>
            <Link
              to={`/clients/${client.id}/edit`}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 touch-manipulation hover-scale"
              title="Düzenle"
            >
              <Edit className="h-4 w-4" />
            </Link>
            <button
              onClick={() => onDeleteClick(client)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 touch-manipulation hover-scale"
              title="Sil"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
              <Calendar className="h-4 w-4" />
              <span>Toplam Ders</span>
            </div>
            <p className="font-medium text-gray-900">{client.alinan_ders_sayisi} ders</p>
          </div>
          
          <div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
              <DollarSign className="h-4 w-4" />
              <span>Toplam Ücret</span>
            </div>
            <p className="font-medium text-gray-900">{client.toplam_ucret?.toLocaleString('tr-TR')} ₺</p>
          </div>
        </div>

        {/* Dates */}
        <div>
          <div className="text-sm text-gray-600 mb-2">Program Tarihleri</div>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Başlangıç:</span>
              <span className="font-medium">{formatDate(client.ders_baslangic_tarihi)}</span>
            </div>
            {client.tahmini_bitis_tarihi && (
              <div className="flex justify-between">
                <span className="text-gray-500">Bitiş:</span>
                <span className="font-medium">{formatDate(client.tahmini_bitis_tarihi)}</span>
              </div>
            )}
          </div>
          
          {client.tahmini_bitis_tarihi && (
            <div className="mt-2 text-xs text-gray-500">
              {getRemainingDays(client.tahmini_bitis_tarihi)}
            </div>
          )}
        </div>

        {/* Weekly Schedule */}
        {client.haftalik_ders_gunleri && client.haftalik_ders_gunleri.length > 0 && (
          <div>
            <div className="text-sm text-gray-600 mb-2">Haftalık Program</div>
            <div className="flex flex-wrap gap-1">
              {client.haftalik_ders_gunleri.map((gun, index) => (
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

        {/* Notes */}
        {client.notlar && (
          <div>
            <div className="text-sm text-gray-600 mb-1">Notlar</div>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-2 line-clamp-2">
              {client.notlar}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for optimization
  return (
    prevProps.client.id === nextProps.client.id &&
    prevProps.client.ad === nextProps.client.ad &&
    prevProps.client.soyad === nextProps.client.soyad &&
    prevProps.client.yas === nextProps.client.yas &&
    prevProps.client.alinan_ders_sayisi === nextProps.client.alinan_ders_sayisi &&
    prevProps.client.toplam_ucret === nextProps.client.toplam_ucret &&
    prevProps.client.tahmini_bitis_tarihi === nextProps.client.tahmini_bitis_tarihi
  );
});

ClientCard.displayName = 'ClientCard';

export default ClientCard;
