import React, { memo, useId } from 'react';

const FormField = memo(({
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
  ...props
}) => {
  const fieldId = useId();
  const hasError = error && touched;

  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        htmlFor={fieldId} 
        className="block text-sm font-medium text-gray-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        )}
        
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

FormField.displayName = 'FormField';

export default FormField;
