import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/AuthContext';
import { ToastProvider } from './utils/ToastContext';
import ErrorBoundary from './components/error/ErrorBoundary';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import NetworkStatusIndicator from './components/NetworkStatusIndicator';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load heavy pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ClientsPage = lazy(() => import('./pages/ClientsPage'));
const ClientListPage = lazy(() => import('./pages/ClientListPage'));
const ClientDetailPage = lazy(() => import('./pages/ClientDetailPage'));
const ClientEditPage = lazy(() => import('./pages/ClientEditPage'));
const LessonTrackingPage = lazy(() => import('./pages/LessonTrackingPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ToastDemoPage = lazy(() => import('./pages/ToastDemoPage'));

// Protected Route bileşeni
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  );
};

// Ana App bileşeni
const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Network Status Indicator - Her zaman görünür */}
      <NetworkStatusIndicator />
      
      {/* PWA Install Prompt - sadece login olduktan sonra göster */}
      {isAuthenticated && <PWAInstallPrompt />}
      
      <Routes>
        {/* Ana sayfa - login durumuna göre yönlendirme */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          } 
        />
        
        {/* Login sayfası */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
          } 
        />
        
        {/* Register sayfası */}
        <Route 
          path="/register" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />
          } 
        />
        
        {/* Korumalı sayfalar */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
        </Route>
        
        <Route 
          path="/lessons" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<LessonTrackingPage />} />
        </Route>
        
        <Route 
          path="/clients" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="new" element={<ClientsPage />} />
          <Route path="list" element={<ClientListPage />} />
          <Route path=":id" element={<ClientDetailPage />} />
          <Route path=":id/edit" element={<ClientEditPage />} />
          <Route index element={<Navigate to="new" replace />} />
        </Route>
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfilePage />} />
        </Route>
        
        <Route 
          path="/toast-demo" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ToastDemoPage />} />
        </Route>
        
        {/* 404 - tüm diğer route'lar */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;