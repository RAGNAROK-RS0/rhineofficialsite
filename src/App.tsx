import { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthModalProvider } from './auth/AuthModalProvider';
import ErrorBoundary from './components/ErrorBoundary';
import SecurityHeaders from './components/SecurityHeaders';
import { Analytics, initSentry, trackPageView, SentryErrorBoundary } from './lib/analytics';
import SearchModal from './components/SearchModal';

const AIChatBot = lazy(() => import('./components/AIChatBot'));

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <BrowserRouter>
      <SecurityHeaders />
      <Analytics />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <Suspense fallback={null}>
        <AIChatBot />
      </Suspense>
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
