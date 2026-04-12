import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthModalProvider } from './auth/AuthModalProvider';
import ErrorBoundary from './components/ErrorBoundary';
import SecurityHeaders from './components/SecurityHeaders';

export default function App() {
  return (
    <BrowserRouter>
      <SecurityHeaders />
      <AuthModalProvider>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </AuthModalProvider>
    </BrowserRouter>
  );
}
