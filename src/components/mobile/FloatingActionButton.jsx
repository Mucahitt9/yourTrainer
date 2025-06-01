import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import useMobile from '../../hooks/useMobile';

const FloatingActionButton = ({ 
  actions = [], 
  mainAction,
  position = 'bottom-right',
  disabled = false,
  className = '' 
}) => {
  const { isMobile } = useMobile();
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't show on desktop
  if (!isMobile) {
    return null;
  }

  const handleMainClick = () => {
    if (actions.length > 0) {
      setIsExpanded(!isExpanded);
    } else if (mainAction) {
      mainAction();
    }
  };

  const handleActionClick = (action) => {
    action.onClick();
    setIsExpanded(false);
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  // Adjust bottom position to account for mobile bottom nav
  const mobileBottomOffset = 'bottom-24'; // Above bottom navigation

  return (
    <>
      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40 transition-opacity duration-300"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* FAB Container */}
      <div className={`fixed ${position.includes('bottom') ? mobileBottomOffset : positionClasses[position]} right-6 z-50 ${className}`}>
        {/* Action Buttons */}
        {actions.length > 0 && (
          <div className="flex flex-col-reverse space-y-reverse space-y-3 mb-3">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleActionClick(action)}
                  disabled={disabled}
                  className={`
                    transform transition-all duration-300 ease-out
                    ${isExpanded 
                      ? 'scale-100 opacity-100 translate-y-0' 
                      : 'scale-0 opacity-0 translate-y-4'
                    }
                    w-12 h-12 rounded-full shadow-lg flex items-center justify-center
                    ${action.color || 'bg-white'} ${action.textColor || 'text-gray-700'}
                    hover:shadow-xl active:scale-95 touch-manipulation
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                  style={{ 
                    transitionDelay: isExpanded ? `${index * 50}ms` : '0ms'
                  }}
                  title={action.label}
                >
                  <Icon className="h-5 w-5" />
                </button>
              );
            })}
          </div>
        )}

        {/* Main FAB */}
        <button
          onClick={handleMainClick}
          disabled={disabled}
          className={`
            btn-fab group
            ${isExpanded ? 'rotate-45' : 'rotate-0'}
            disabled:opacity-50 disabled:cursor-not-allowed
            active:scale-95
          `}
        >
          {actions.length > 0 ? (
            <>
              <Plus className={`h-6 w-6 transition-transform duration-300 ${
                isExpanded ? 'rotate-45' : 'rotate-0'
              }`} />
              {isExpanded && (
                <X className="h-6 w-6 absolute transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
              )}
            </>
          ) : (
            <>  
              {mainAction?.icon ? (
                <mainAction.icon className="h-6 w-6" />
              ) : (
                <Plus className="h-6 w-6" />
              )}
            </>
          )}
        </button>

        {/* Label */}
        {(mainAction?.label || (actions.length > 0 && !isExpanded)) && (
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {mainAction?.label || 'Seçenekler'}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FloatingActionButton;
