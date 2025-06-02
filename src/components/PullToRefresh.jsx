import React, { useState, useRef, useCallback, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

const PullToRefresh = ({ 
  children, 
  onRefresh, 
  threshold = 100, 
  resistance = 2.5,
  refreshingText = "Yenileniyor...",
  pullText = "Yenilemek için aşağı çekin",
  releaseText = "Yenilemek için bırakın",
  disabled = false,
  className = ""
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canPull, setCanPull] = useState(false);
  
  const containerRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);
  
  // Check if user can pull (at top of page)
  const checkCanPull = useCallback(() => {
    if (!containerRef.current) return false;
    return containerRef.current.scrollTop === 0;
  }, []);
  
  // Handle refresh action
  const handleRefresh = useCallback(async () => {
    if (disabled || isRefreshing) return;
    
    setIsRefreshing(true);
    
    try {
      await onRefresh?.();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      // Animate back to normal
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
        setIsPulling(false);
      }, 500);
    }
  }, [onRefresh, disabled, isRefreshing]);
  
  return (
    <div className={`relative overflow-auto h-full ${className}`}>
      {children}
    </div>
  );
};

export default PullToRefresh;
