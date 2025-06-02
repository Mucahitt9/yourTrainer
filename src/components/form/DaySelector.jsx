import React, { memo } from 'react';

const DAYS = [
  { key: 'Pazartesi', label: 'Pzt', fullLabel: 'Pazartesi' },
  { key: 'Salı', label: 'Sal', fullLabel: 'Salı' },
  { key: 'Çarşamba', label: 'Çar', fullLabel: 'Çarşamba' },
  { key: 'Perşembe', label: 'Per', fullLabel: 'Perşembe' },
  { key: 'Cuma', label: 'Cum', fullLabel: 'Cuma' },
  { key: 'Cumartesi', label: 'Cmt', fullLabel: 'Cumartesi' },
  { key: 'Pazar', label: 'Paz', fullLabel: 'Pazar' }
];

const DaySelector = memo(({ 
  selectedDays = [], 
  onChange, 
  error, 
  touched,
  className = '' 
}) => {
  const hasError = error && touched;

  const toggleDay = (day) => {
    const newSelection = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    onChange(newSelection);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        Haftalık Ders Günleri <span className="text-red-500">*</span>
      </label>
      
      {/* Mobile: 2 satır layout */}
      <div className="block sm:hidden">
        <div className="grid grid-cols-4 gap-2 mb-2">
          {DAYS.slice(0, 4).map((day) => {
            const isSelected = selectedDays.includes(day.key);
            return (
              <button
                key={day.key}
                type="button"
                onClick={() => toggleDay(day.key)}
                className={`
                  p-3 text-sm font-medium rounded-lg border-2 transition-all duration-200
                  ${isSelected
                    ? 'bg-primary-600 border-primary-600 text-white shadow-md'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-primary-300 hover:bg-primary-50'
                  }
                  ${hasError ? 'border-red-300' : ''}
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50
                  min-h-[60px] flex items-center justify-center
                `}
                title={day.fullLabel}
                aria-pressed={isSelected}
              >
                <div className="text-center">
                  <div className="font-bold text-xs">{day.label}</div>
                </div>
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {DAYS.slice(4).map((day) => {
            const isSelected = selectedDays.includes(day.key);
            return (
              <button
                key={day.key}
                type="button"
                onClick={() => toggleDay(day.key)}
                className={`
                  p-3 text-sm font-medium rounded-lg border-2 transition-all duration-200
                  ${isSelected
                    ? 'bg-primary-600 border-primary-600 text-white shadow-md'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-primary-300 hover:bg-primary-50'
                  }
                  ${hasError ? 'border-red-300' : ''}
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50
                  min-h-[60px] flex items-center justify-center
                `}
                title={day.fullLabel}
                aria-pressed={isSelected}
              >
                <div className="text-center">
                  <div className="font-bold text-xs">{day.label}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop: Tek satır layout */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-7 gap-2">
          {DAYS.map((day) => {
            const isSelected = selectedDays.includes(day.key);
            return (
              <button
                key={day.key}
                type="button"
                onClick={() => toggleDay(day.key)}
                className={`
                  p-3 text-sm font-medium rounded-lg border-2 transition-all duration-200 hover-scale
                  ${isSelected
                    ? 'bg-primary-600 border-primary-600 text-white shadow-lg scale-105'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-primary-300 hover:bg-primary-50'
                  }
                  ${hasError ? 'border-red-300' : ''}
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50
                  min-h-[70px] flex items-center justify-center
                `}
                title={day.fullLabel}
                aria-pressed={isSelected}
              >
                <div className="text-center">
                  <div className="text-xs opacity-75 mb-1">{day.fullLabel.slice(0, 3)}</div>
                  <div className="font-bold">{day.label}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedDays.length > 0 && (
        <div className="text-sm text-gray-600 flex items-center gap-2 flex-wrap">
          <span>Seçilen günler:</span>
          <div className="flex flex-wrap gap-1">
            {selectedDays.map(day => (
              <span key={day} className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
                {day}
              </span>
            ))}
          </div>
          <span className="text-gray-500">({selectedDays.length} gün)</span>
        </div>
      )}

      {hasError && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

DaySelector.displayName = 'DaySelector';

export default DaySelector;
