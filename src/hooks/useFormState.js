import { useState, useCallback, useEffect } from 'react';

export const useFormState = (initialData, autosaveKey = null) => {
  const [formData, setFormData] = useState(() => {
    // Auto-restore from localStorage if key provided
    if (autosaveKey && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`form_draft_${autosaveKey}`);
        return saved ? { ...initialData, ...JSON.parse(saved) } : initialData;
      } catch {
        return initialData;
      }
    }
    return initialData;
  });

  const [isDirty, setIsDirty] = useState(false);

  // Auto-save to localStorage
  useEffect(() => {
    if (autosaveKey && isDirty && typeof window !== 'undefined') {
      const timeoutId = setTimeout(() => {
        try {
          localStorage.setItem(`form_draft_${autosaveKey}`, JSON.stringify(formData));
        } catch (error) {
          console.warn('Form auto-save failed:', error);
        }
      }, 1000); // Debounce 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [formData, isDirty, autosaveKey]);

  const updateField = useCallback((field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      setIsDirty(true);
      return newData;
    });
  }, []);

  const updateNestedField = useCallback((parentField, childField, value) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: value
      }
    }));
    setIsDirty(true);
  }, []);

  const updateFormData = useCallback((updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
  }, []);

  const resetForm = useCallback((newData = initialData) => {
    setFormData(newData);
    setIsDirty(false);
    if (autosaveKey && typeof window !== 'undefined') {
      localStorage.removeItem(`form_draft_${autosaveKey}`);
    }
  }, [initialData, autosaveKey]);

  const clearDraft = useCallback(() => {
    if (autosaveKey && typeof window !== 'undefined') {
      localStorage.removeItem(`form_draft_${autosaveKey}`);
    }
  }, [autosaveKey]);

  return {
    formData,
    isDirty,
    updateField,
    updateNestedField,
    updateFormData,
    resetForm,
    clearDraft
  };
};
