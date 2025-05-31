import React, { useState, useEffect } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  customerName = '', 
  loading = false 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setConfirmText(''); // Modal açıldığında text'i temizle
    }
  }, [isOpen]);

  const handleClose = () => {
    if (loading) return; // Loading sırasında kapanmasını engelle
    
    setIsVisible(false);
    setTimeout(() => {
      setConfirmText('');
      onClose();
    }, 300);
  };

  const handleConfirm = () => {
    if (loading) return;
    onConfirm();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Confirm text kontrolü
  const isConfirmValid = confirmText.toLowerCase() === 'sil';

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`relative bg-white rounded-2xl shadow-2xl transform transition-all duration-300 max-w-md w-full ${
            isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          {/* Close Button */}
          {!loading && (
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 z-10"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {/* Content */}
          <div className="p-6">
            {/* Warning Icon */}
            <div className="mx-auto mb-4">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
              Müşteriyi Sil
            </h3>

            {/* Warning Message */}
            <div className="mb-6">
              <p className="text-gray-600 text-center mb-4">
                <strong className="text-gray-900">{customerName}</strong> adlı müşteriyi silmek istediğinizden emin misiniz?
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="ml-3">
                    <h4 className="text-sm font-semibold text-red-800">Dikkat!</h4>
                    <div className="text-sm text-red-700 mt-1">
                      <p>Bu işlem geri alınamaz. Silinen veriler:</p>
                      <ul className="mt-2 space-y-1">
                        <li>• Tüm kişisel bilgiler</li>
                        <li>• Vücut ölçüleri</li>
                        <li>• Ders geçmişi</li>
                        <li>• Ödeme kayıtları</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Silmek için <strong>\"sil\"</strong> yazın:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="sil"
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200 disabled:bg-gray-100"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleClose}
                disabled={loading}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium min-w-0"
              >
                <span className="truncate">İptal</span>
              </button>
              
              <button
                onClick={handleConfirm}
                disabled={!isConfirmValid || loading}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 min-w-0 ${
                  isConfirmValid && !loading
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    <span className="truncate">Siliniyor...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Müşteriyi Sil</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer Warning */}
          <div className="bg-gray-50 px-6 py-3 rounded-b-2xl">
            <p className="text-xs text-gray-500 text-center">
              Bu işlem kalıcıdır ve geri alınamaz
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
