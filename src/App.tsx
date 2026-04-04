import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthModalProvider } from './auth/AuthModalProvider';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <BrowserRouter>
      <AuthModalProvider themeColor="#4f46e5">
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </AuthModalProvider>
    </BrowserRouter>
  );
}
