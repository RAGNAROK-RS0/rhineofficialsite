import { useEffect } from 'react';
import * as Sentry from '@sentry/react';

const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN || 'rhine-solution.com';
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

export function initSentry() {
  if (!SENTRY_DSN) {
    console.warn('Sentry DSN not configured - error tracking disabled');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: import.meta.env.MODE,
    release: `rhine-solution@${import.meta.env.VITE_APP_VERSION || '1.0.0'}`,
  });
}

export function Analytics() {
  useEffect(() => {
    const script = document.createElement('script');
    script.defer = true;
    script.dataset.domain = PLAUSIBLE_DOMAIN;
    script.dataset.api = import.meta.env.VITE_PLAUSIBLE_API || 'https://plausible.io/api/event';
    script.src = 'https://plausible.io/js/script.js';
    script.id = 'plausible-analytics';
    
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('plausible-analytics');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null;
}

export function trackEvent(eventName: string, props?: Record<string, string | number | boolean>) {
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible(eventName, { props });
  }
}

export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible('pageview', { url });
  }
}

export const SentryErrorBoundary = Sentry.ErrorBoundary;