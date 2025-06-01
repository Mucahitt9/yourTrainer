import React, { useState, useRef } from 'react';
import { Trash2, Edit, Phone, MessageCircle } from 'lucide-react';
import useSwipe from '../../hooks/useSwipe';
import useMobile from '../../hooks/useMobile';

const SwipeableCard = ({ 
  children, 
  onEdit, 
  onDelete, 
  onCall,
  onMessage,
  deleteThreshold = 120,
  className = '',
  disabled = false 
}) => {
  const { isMobile } = useMobile();
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [isActionTriggered, setIsActionTriggered] = useState(false);
  const cardRef = useRef(null);

  const { updateHandlers } = useSwipe({
    threshold: 30,
    trackTouch: true,
    trackMouse: false
  });

  // Don't enable swipe on desktop or when disabled
  if (!isMobile || disabled) {
    return (
      <div className={`mobile-card ${className}`}>
        {children}
      </div>
    );
  }

  // Configure swipe handlers
  React.useEffect(() => {
    updateHandlers({
      onSwiping: (e, { deltaX }) => {
        if (deltaX < 0) { // Left swipe
          const distance = Math.abs(deltaX);
          setSwipeDistance(Math.min(distance, deleteThreshold + 50));
          
          // Trigger action if threshold is reached
          if (distance >= deleteThreshold && !isActionTriggered) {
            setIsActionTriggered(true);
            // Haptic feedback for mobile
            if (navigator.vibrate) {
              navigator.vibrate(50);
            }
          } else if (distance < deleteThreshold && isActionTriggered) {
            setIsActionTriggered(false);
          }
        }
      },
      onSwipeEnd: () => {
        if (isActionTriggered && onDelete) {
          // Trigger delete action
          onDelete();
        }
        
        // Reset state
        setSwipeDistance(0);
        setIsActionTriggered(false);
      }
    });
  }, [updateHandlers, deleteThreshold, isActionTriggered, onDelete]);

  const actions = [
    onCall && {
      icon: Phone,
      label: 'Ara',
      color: 'bg-blue-500',
      action: onCall
    },
    onMessage && {
      icon: MessageCircle,
      label: 'Mesaj',
      color: 'bg-green-500',
      action: onMessage
    },
    onEdit && {
      icon: Edit,
      label: 'Düzenle',
      color: 'bg-orange-500',
      action: onEdit
    },
    onDelete && {
      icon: Trash2,
      label: 'Sil',
      color: 'bg-red-500',
      action: onDelete
    }
  ].filter(Boolean);

  return (
    <div className="relative overflow-hidden">
      {/* Action Buttons Background */}
      <div className="absolute inset-y-0 right-0 flex items-center bg-gray-100">
        {actions.map((action, index) => {
          const Icon = action.icon;
          const opacity = Math.min(swipeDistance / 60, 1);
          const scale = Math.min(swipeDistance / 80, 1);
          
          return (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                action.action();
              }}
              className={`w-16 h-full flex flex-col items-center justify-center text-white text-xs font-medium transition-all duration-200 ${action.color}`}
              style={{ 
                opacity,
                transform: `scale(${scale})`
              }}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Card */}
      <div
        ref={cardRef}
        className={`mobile-card relative z-10 transition-transform duration-200 ${
          isActionTriggered ? 'bg-red-50 border-red-200' : ''
        } ${className}`}
        style={{
          transform: `translateX(-${swipeDistance}px)`,
          transition: swipeDistance === 0 ? 'transform 0.3s ease-out' : 'none'
        }}
        {...(isMobile ? {
          onTouchStart: (e) => cardRef.current?.onTouchStart?.(e),
          onTouchMove: (e) => cardRef.current?.onTouchMove?.(e),
          onTouchEnd: (e) => cardRef.current?.onTouchEnd?.(e)
        } : {})}
      >
        {children}
        
        {/* Swipe Indicator */}
        {swipeDistance > 20 && (
          <div className="absolute top-2 right-2">
            <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              isActionTriggered ? 'bg-red-500' : 'bg-gray-400'
            }`} />
          </div>
        )}
      </div>

      {/* Swipe Hint (show only on first few interactions) */}
      {swipeDistance === 0 && (
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 opacity-30">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" />
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SwipeableCard;
