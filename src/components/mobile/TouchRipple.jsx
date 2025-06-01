import React, { useState, useRef } from 'react';
import useMobile from '../../hooks/useMobile';

const TouchRipple = ({ 
  children, 
  disabled = false, 
  rippleColor = 'rgba(0, 0, 0, 0.1)',
  rippleDuration = 600,
  className = '',
  as: Component = 'button',
  ...props 
}) => {
  const { isMobile, hasTouch } = useMobile();
  const [ripples, setRipples] = useState([]);
  const rippleContainer = useRef(null);

  // Don't add ripple effect if not mobile or no touch support
  if (!isMobile || !hasTouch || disabled) {
    return (
      <Component className={className} {...props}>
        {children}
      </Component>
    );
  }

  const createRipple = (event) => {
    const container = rippleContainer.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = {
      id: Date.now(),
      x,
      y,
      size
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, rippleDuration);
  };

  const handleInteraction = (event) => {
    createRipple(event);
    
    // Call original onClick if provided
    if (props.onClick) {
      props.onClick(event);
    }
  };

  return (
    <Component
      ref={rippleContainer}
      className={`relative overflow-hidden ${className}`}
      {...props}
      onClick={handleInteraction}
      style={{
        ...props.style,
        WebkitTapHighlightColor: 'transparent' // Remove default mobile highlight
      }}
    >
      {children}
      
      {/* Ripple Effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full animate-ping pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: rippleColor,
            animation: `ripple ${rippleDuration}ms ease-out`
          }}
        />
      ))}
    </Component>
  );
};

export default TouchRipple;
