import { useState, useRef } from 'react';

/**
 * Simple swipe gesture detection hook
 * @param {Object} options Swipe configuration options
 * @returns {Object} Swipe handlers and state
 */
const useSwipe = (options = {}) => {
  const {
    onSwipeLeft = () => {},
    onSwipeRight = () => {},
    onSwipeUp = () => {},
    onSwipeDown = () => {},
    threshold = 50
  } = options;

  const [isSwiping, setIsSwiping] = useState(false);
  const touchStart = useRef({ x: 0, y: 0 });

  const onTouchStart = (e) => {
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY
    };
    setIsSwiping(true);
  };

  const onTouchMove = (e) => {
    if (!isSwiping) return;
    
    // Prevent default to avoid scrolling while swiping
    if (e.cancelable) {
      e.preventDefault();
    }
  };

  const onTouchEnd = (e) => {
    if (!isSwiping) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    // Only trigger swipe if movement is above threshold
    if (absX > threshold || absY > threshold) {
      // Horizontal swipe is dominant
      if (absX > absY) {
        if (deltaX > 0) {
          onSwipeRight();
        } else {
          onSwipeLeft();
        }
      }
      // Vertical swipe is dominant
      else {
        if (deltaY > 0) {
          onSwipeDown();
        } else {
          onSwipeUp();
        }
      }
    }
    
    setIsSwiping(false);
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isSwiping
  };
};

export default useSwipe;
