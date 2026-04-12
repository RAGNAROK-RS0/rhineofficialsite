import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthModalProvider } from './auth/AuthModalProvider';
import ErrorBoundary from './components/ErrorBoundary';
import SecurityHeaders from './components/SecurityHeaders';
import { Analytics, initSentry, trackPageView, SentryErrorBoundary } from './lib/analytics';

export default function App() {
  useEffect(() => {
    initSentry();
  }, []);

  useEffect(() => {
    const handleLocationChange = () => {
      trackPageView(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  return (
    <BrowserRouter>
      <SecurityHeaders />
      <Analytics />
      <SentryErrorBoundary>
        <AuthModalProvider>
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </AuthModalProvider>
      </SentryErrorBoundary>
    </BrowserRouter>
  );
}
