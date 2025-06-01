import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/AuthContext';
import { ToastProvider } from './utils/ToastContext';
import ErrorBoundary from './components/error/ErrorBoundary';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load heavy pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ClientsPage = lazy(() => import('./pages/ClientsPage'));
const ClientListPage = lazy(() => import('./pages/ClientListPage'));
const ClientDetailPage = lazy(() => import('./pages/ClientDetailPage'));
const ClientEditPage = lazy(() => import('./pages/ClientEditPage'));
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
      {/* PWA Install Prompt - sadece login olduktan sonra göster */}
      {isAuthenticated && <PWAInstallPrompt />}
      
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
          } 
        />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="clients">
            <Route path="new" element={<ClientsPage />} />
            <Route path="list" element={<ClientListPage />} />
            <Route path=":id" element={<ClientDetailPage />} />
            <Route path=":id/edit" element={<ClientEditPage />} />
            <Route index element={<Navigate to="new" replace />} />
          </Route>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="toast-demo" element={<ToastDemoPage />} />
        </Route>
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