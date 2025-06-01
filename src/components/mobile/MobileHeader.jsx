import React from 'react';
import { ArrowLeft, MoreVertical, Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import useMobile from '../../hooks/useMobile';
import TouchRipple from './TouchRipple';

const MobileHeader = ({ 
  title, 
  subtitle,
  showBack = true, 
  onBack,
  actions = [],
  searchable = false,
  onSearch,
  className = '',
  elevation = true
}) => {
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show mobile header on desktop or login page
  if (!isMobile || location.pathname === '/login') {
    return null;
  }

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const shouldShowBack = showBack && location.pathname !== '/dashboard';

  return (
    <header className={`mobile-header ${
      elevation ? 'shadow-sm' : ''
    } ${className}`}>
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {shouldShowBack && (
            <TouchRipple
              className="touch-target text-gray-600 hover:text-gray-900 rounded-lg shrink-0"
              onClick={handleBack}
            >
              <ArrowLeft className="h-6 w-6" />
            </TouchRipple>
          )}
          
          <div className="min-w-0 flex-1">
            <h1 className="mobile-title text-gray-900 truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-gray-600 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2 shrink-0">
          {searchable && (
            <TouchRipple
              className="touch-target text-gray-600 hover:text-gray-900 rounded-lg"
              onClick={onSearch}
            >
              <Search className="h-6 w-6" />
            </TouchRipple>
          )}
          
          {actions.slice(0, 2).map((action, index) => {
            const Icon = action.icon;
            return (
              <TouchRipple
                key={index}
                className={`touch-target rounded-lg transition-colors duration-200 ${
                  action.primary 
                    ? 'bg-primary-600 text-white hover:bg-primary-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                } ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={action.disabled ? undefined : action.onClick}
                disabled={action.disabled}
              >
                {action.icon ? (
                  <Icon className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium px-2">
                    {action.label}
                  </span>
                )}
              </TouchRipple>
            );
          })}
          
          {/* More Actions Overflow */}
          {actions.length > 2 && (
            <TouchRipple
              className="touch-target text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
              onClick={() => {
                // Could implement dropdown menu here
                console.log('More actions clicked');
              }}
            >
              <MoreVertical className="h-6 w-6" />
            </TouchRipple>
          )}
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
