import React, { memo, useId } from 'react';

const ProfileFormField = memo(({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  placeholder,
  icon: Icon,
  min,
  max,
  step,
  disabled = false,
  className = '',
  helpText,
  autoFocus = false,
  isEditing = false,
  displayValue,
  rows = 4,
  ...props
}) => {
  const fieldId = useId();
  const hasError = error && touched;
  const isTextarea = type === 'textarea';

  // Görüntüleme değerini belirle
  const finalDisplayValue = displayValue !== undefined ? displayValue : value;

  if (!isEditing) {
    // Read-only görünüm
    return (
      <div className={`space-y-2 ${className}`}>
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        <div className={`
          w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 relative
          ${isTextarea ? 'min-h-[100px] whitespace-pre-wrap' : ''}
          ${Icon ? 'pl-10' : ''}
        `}>
          {Icon && (
            <Icon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          )}
          <div className={Icon && !isTextarea ? 'ml-7' : ''}>
            {finalDisplayValue || 'Belirtilmemiş'}
          </div>
        </div>

        {helpText && (
          <p className="text-xs text-gray-500">
            {helpText}
          </p>
        )}
      </div>
    );
  }

  // Edit modu
  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        htmlFor={fieldId} 
        className="block text-sm font-medium text-gray-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        {Icon && !isTextarea && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        )}
        
        {isTextarea ? (
          <textarea
            id={fieldId}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            rows={rows}
            className={`
              w-full px-3 py-2.5 border rounded-lg transition-colors duration-200 resize-none
              ${hasError 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
              }
              ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
              focus:outline-none focus:ring-2 focus:ring-opacity-20
            `}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
            {...props}
          />
        ) : (
          <input
            id={fieldId}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            autoFocus={autoFocus}
            className={`
              w-full px-3 py-2.5 border rounded-lg transition-colors duration-200
              ${Icon ? 'pl-10' : ''}
              ${hasError 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
              }
              ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
              focus:outline-none focus:ring-2 focus:ring-opacity-20
            `}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
            {...props}
          />
        )}
      </div>

      {helpText && !hasError && (
        <p id={`${fieldId}-help`} className="text-xs text-gray-500">
          {helpText}
        </p>
      )}

      {hasError && (
        <p id={`${fieldId}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

ProfileFormField.displayName = 'ProfileFormField';

export default ProfileFormField;
