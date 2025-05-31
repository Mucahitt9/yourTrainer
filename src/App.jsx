import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/AuthContext';
import { ToastProvider } from './utils/ToastContext';
import LoginPage from './pages/LoginPage';
import ClientsPage from './pages/ClientsPage';
import ClientListPage from './pages/ClientListPage';
import ClientDetailPage from './pages/ClientDetailPage';
import ClientEditPage from './pages/ClientEditPage';
import ProfilePage from './pages/ProfilePage';
import ToastDemoPage from './pages/ToastDemoPage';
import Layout from './components/Layout';

// Protected Route bileşeni
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Ana App bileşeni
const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/clients/new" replace /> : <LoginPage />
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
          <Route index element={<Navigate to="/clients/new" replace />} />
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
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
