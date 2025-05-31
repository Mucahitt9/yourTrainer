import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, User } from 'lucide-react';

const ProfilePhotoUpload = ({ currentPhoto, onPhotoChange, disabled = false, theme = 'default' }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(currentPhoto);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Desteklenen dosya formatları
  const SUPPORTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_DIMENSION = 1000; // 1000px max width/height

  // currentPhoto prop'u değiştiğinde previewPhoto'yu güncelle
  useEffect(() => {
    setPreviewPhoto(currentPhoto);
  }, [currentPhoto]);

  const handleFileSelect = (file) => {
    if (!file) return;

    // Dosya formatı kontrolü
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      alert('Lütfen JPEG, PNG veya WebP formatında bir fotoğraf seçin.');
      return;
    }

    // Dosya boyutu kontrolü
    if (file.size > MAX_FILE_SIZE) {
      alert('Fotoğraf boyutu 5MB\'den küçük olmalıdır.');
      return;
    }

    processImage(file);
  };

  const processImage = (file) => {
    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Resmi resize et ve optimize et
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Aspect ratio'yu koru ve boyutu sınırla
        let { width, height } = img;
        
        if (width > height) {
          if (width > MAX_DIMENSION) {
            height = (height * MAX_DIMENSION) / width;
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width = (width * MAX_DIMENSION) / height;
            height = MAX_DIMENSION;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Resmi canvas'a çiz
        ctx.drawImage(img, 0, 0, width, height);
        
        // Base64 formatında data URL'i al
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.8); // %80 kalite
        
        setPreviewPhoto(optimizedDataUrl);
        setIsUploading(false);
        
        // Parent component'e fotoğrafı gönder
        if (onPhotoChange) {
          onPhotoChange(optimizedDataUrl);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleRemovePhoto = () => {
    setPreviewPhoto(null);
    if (onPhotoChange) {
      onPhotoChange(null);
    }
    // Input'u temizle
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Theme'e göre stil sınıfları
  const getThemeClasses = () => {
    if (theme === 'profile') {
      return {
        border: 'border-white border-opacity-60',
        borderHover: 'hover:border-opacity-100',
        borderDrag: 'border-white bg-white bg-opacity-20',
        text: 'text-white',
        spinner: 'border-white border-t-transparent',
        photoBackground: 'bg-white',
        fallbackIcon: 'text-gray-400'
      };
    }
    
    // Default theme
    return {
      border: 'border-gray-300',
      borderHover: 'hover:border-primary-400',
      borderDrag: 'border-primary-500 bg-primary-50',
      text: 'text-gray-500',
      spinner: 'border-primary-600 border-t-transparent',
      photoBackground: 'bg-gray-200',
      fallbackIcon: 'text-gray-400'
    };
  };

  const themeClasses = getThemeClasses();

  return (
    <div className="space-y-4">
      {/* Mevcut/Preview Fotoğraf */}
      {previewPhoto ? (
        <div className="relative group">
          <div className={`w-32 h-32 mx-auto rounded-full overflow-hidden border-4 ${themeClasses.photoBackground} p-1 shadow-lg hover-lift`}>
            <img 
              src={previewPhoto} 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          
          {/* Remove Button */}
          {!disabled && (
            <button
              onClick={handleRemovePhoto}
              className="absolute top-0 right-1/2 transform translate-x-8 -translate-y-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 shadow-lg opacity-0 group-hover:opacity-100"
              title="Fotoğrafı Kaldır"
            >
              <X className="h-4 w-4 mx-auto" />
            </button>
          )}
          
          {/* Change Photo Button */}
          {!disabled && (
            <button
              onClick={openFileDialog}
              className="absolute bottom-0 right-1/2 transform translate-x-8 translate-y-2 w-8 h-8 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors duration-200 shadow-lg opacity-0 group-hover:opacity-100"
              title="Fotoğrafı Değiştir"
            >
              <Camera className="h-4 w-4 mx-auto" />
            </button>
          )}
        </div>
      ) : (
        /* Upload Area */
        <div className="relative">
          {/* Fallback Avatar */}
          <div className={`w-32 h-32 mx-auto rounded-full ${themeClasses.photoBackground} p-1 mb-4`}>
            <div className={`w-full h-full rounded-full ${themeClasses.photoBackground} flex items-center justify-center`}>
              <User className={`h-12 w-12 ${themeClasses.fallbackIcon}`} />
            </div>
          </div>
          
          {!disabled && (
            <div
              className={`absolute inset-0 w-32 h-32 mx-auto rounded-full border-2 border-dashed transition-all duration-200 hover-lift ${
                isDragOver 
                  ? themeClasses.borderDrag
                  : `${themeClasses.border} ${themeClasses.borderHover}`
              } ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={!disabled ? openFileDialog : undefined}
            >
              {isUploading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-8 h-8 border-2 ${themeClasses.spinner} rounded-full animate-spin`}></div>
                </div>
              ) : (
                <div className={`absolute inset-0 flex flex-col items-center justify-center ${themeClasses.text}`}>
                  <Camera className="h-6 w-6 mb-1" />
                  <span className="text-xs text-center px-2">
                    {isDragOver ? 'Bırak' : 'Değiştir'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />
      
      {/* Upload Instructions - sadece default theme'de göster */}
      {!disabled && theme === 'default' && (
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">
            JPEG, PNG veya WebP • Max 5MB
          </p>
          <button
            onClick={openFileDialog}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200"
          >
            <Upload className="h-3 w-3 mr-1" />
            Dosya Seç
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoUpload;