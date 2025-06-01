import { useState, useEffect } from 'react';

/**
 * Enhanced mobile device detection hook
 * @returns {Object} Mobile detection utilities and device info
 */
const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [orientation, setOrientation] = useState('portrait');
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setOrientation(width > height ? 'landscape' : 'portrait');
      
      if (!isInitialized) {
        setIsInitialized(true);
      }
    };

    // Initial check
    checkDevice();

    // Listen for resize and orientation changes
    const handleResize = () => {
      // Debounce resize events for performance
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(checkDevice, 100);
    };

    const handleOrientationChange = () => {
      // Small delay to ensure screen dimensions are updated
      setTimeout(checkDevice, 150);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Also listen for visual viewport changes (mobile keyboards, etc.)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', checkDevice);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', checkDevice);
      }
      
      if (window.resizeTimeout) {
        clearTimeout(window.resizeTimeout);
      }
    };
  }, [isInitialized]);

  // Enhanced device detection
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isPWA = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  
  // Device type detection
  const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
  
  // Screen size categories
  const isSmallMobile = screenSize.width < 375;
  const isMediumMobile = screenSize.width >= 375 && screenSize.width < 414;
  const isLargeMobile = screenSize.width >= 414 && screenSize.width < 768;
  
  // Utility functions
  const isPortrait = orientation === 'portrait';
  const isLandscape = orientation === 'landscape';
  const isSmallScreen = screenSize.width < 375;
  const isMediumScreen = screenSize.width >= 375 && screenSize.width < 768;
  const isLargeScreen = screenSize.width >= 768;
  const isDesktop = !isMobile && !isTablet;

  // Safe area detection for modern devices
  const hasSafeArea = isIOS && (
    window.screen.height === 812 || // iPhone X/XS
    window.screen.height === 896 || // iPhone XR/XS Max
    window.screen.height === 844 || // iPhone 12/12 Pro
    window.screen.height === 926    // iPhone 12 Pro Max
  );

  return {
    // Basic detection
    isMobile,
    isTablet,
    isDesktop,
    deviceType,
    
    // Screen info
    orientation,
    screenSize,
    isInitialized,
    
    // Device capabilities
    hasTouch,
    isPWA,
    isIOS,
    isAndroid,
    isSafari,
    hasSafeArea,
    
    // Screen size utilities
    isPortrait,
    isLandscape,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    isSmallMobile,
    isMediumMobile,
    isLargeMobile,
    
    // Responsive utilities
    breakpoint: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
    canHover: !isMobile && !isTablet,
    prefersReducedMotion: window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };
};

export default useMobile;
