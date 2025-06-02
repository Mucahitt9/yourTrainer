import { useState, useCallback } from 'react';

// Validation rules
const validationRules = {
  ad: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZşğıüöçİĞÜŞÇÖ\s]+$/,
    message: 'Ad 2-50 karakter arası olmalı ve sadece harf içermelidir'
  },
  soyad: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZşğıüöçİĞÜŞÇÖ\s]+$/,
    message: 'Soyad 2-50 karakter arası olmalı ve sadece harf içermelidir'
  },
  yas: {
    required: true,
    min: 16,
    max: 80,
    type: 'number',
    message: 'Yaş 14-80 arasında olmalı'
  },
  alinan_ders_sayisi: {
    required: true,
    min: 1,
    max: 200,
    type: 'number',
    message: 'Ders sayısı 1-200 arasında olmalı'
  },
  ders_baslangic_tarihi: {
    required: true,
    type: 'date',
    message: 'Başlangıç tarihi seçilmeli'
  },
  haftalik_ders_gunleri: {
    required: true,
    minLength: 1,
    message: 'En az bir ders günü seçilmeli'
  }
};

export const useFormValidation = () => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((name, value) => {
    const rule = validationRules[name];
    if (!rule) return null;

    // Required check
    if (rule.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return rule.message || `${name} zorunludur`;
    }

    // Skip other validations if value is empty and not required
    if (!value && !rule.required) return null;

    // Type checks
    if (rule.type === 'number') {
      const num = parseFloat(value);
      if (isNaN(num)) return 'Geçerli bir sayı giriniz';
      if (rule.min !== undefined && num < rule.min) return rule.message;
      if (rule.max !== undefined && num > rule.max) return rule.message;
    }

    // String length checks
    if (typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) return rule.message;
      if (rule.maxLength && value.length > rule.maxLength) return rule.message;
      if (rule.pattern && !rule.pattern.test(value)) return rule.message;
    }

    // Array length checks
    if (Array.isArray(value)) {
      if (rule.minLength && value.length < rule.minLength) return rule.message;
    }

    return null;
  }, []);

  const validateForm = useCallback((formData) => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validateField]);

  const validateSingleField = useCallback((name, value) => {
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  }, [validateField]);

  const setFieldTouched = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  return {
    errors,
    touched,
    validateForm,
    validateSingleField,
    setFieldTouched,
    clearErrors
  };
};
