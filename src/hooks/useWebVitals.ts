import { useState, useEffect, useCallback, useRef } from 'react';

export interface CoreWebVitals {
  LCP: number | null;
  FID: number | null;
  CLS: number | null;
  FCP: number | null;
  TTFB: number | null;
}

export interface VitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
}

export function useWebVitals() {
  const [vitals, setVitals] = useState<CoreWebVitals>({
    LCP: null,
    FID: null,
    CLS: null,
    FCP: null,
    TTFB: null,
  });
  const [metrics, setMetrics] = useState<VitalMetric[]>([]);
  const reported = useRef<Set<string>>(new Set());

  const reportMetric = useCallback((metric: VitalMetric) => {
    if (reported.current.has(metric.name)) return;
    reported.current.add(metric.name);

    setMetrics(prev => [...prev, metric]);

    setVitals(prev => ({
      ...prev,
      [metric.name]: metric.value,
    }));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePerfEntry = (entries: PerformanceObserverEntryList) => {
      const perfEntries = entries.getEntries() as PerformanceEntry[];
      const getRating = (value: number, thresholds: { good: number; poor: number }): 'good' | 'needs-improvement' | 'poor' => {
        if (value <= thresholds.good) return 'good';
        if (value <= thresholds.poor) return 'needs-improvement';
        return 'poor';
      };

      perfEntries.forEach((entry) => {
        if (entry.name === 'LCP') {
          const value = entry.startTime;
          reportMetric({
            name: 'LCP',
            value,
            rating: getRating(value, { good: 2500, poor: 4000 }),
            delta: value,
          });
        } else if (entry.name === 'FID' || entry.name === 'first-input') {
          const value = entry.duration;
          reportMetric({
            name: 'FID',
            value,
            rating: getRating(value, { good: 100, poor: 300 }),
            delta: value,
          });
        } else if (entry.name === 'CLS') {
          const value = (entry as any).value;
          reportMetric({
            name: 'CLS',
            value,
            rating: getRating(value, { good: 0.1, poor: 0.25 }),
            delta: value,
          });
        } else if (entry.name === 'FCP') {
          const value = entry.startTime;
          reportMetric({
            name: 'FCP',
            value,
            rating: getRating(value, { good: 1800, poor: 3000 }),
            delta: value,
          });
        }
      });
    };

    const po = new PerformanceObserver(handlePerfEntry);
    try {
      po.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift', 'first-contentful-paint'] });
    } catch {}

    if ('performance' in window && 'timing' in performance) {
      const ttfb = performance.timing.responseStart - performance.timing.requestStart;
      reportMetric({
        name: 'TTFB',
        value: ttfb,
        rating: ttfb <= 800 ? 'good' : ttfb <= 1800 ? 'needs-improvement' : 'poor',
        delta: ttfb,
      });
    }

    return () => po.disconnect();
  }, [reportMetric]);

  return { vitals, metrics };
}

export function getVitalIcon(rating: string) {
  switch (rating) {
    case 'good': return '🟢';
    case 'needs-improvement': return '🟡';
    case 'poor': return '🔴';
    default: return '⚪';
  }
}

export function formatVitalValue(name: string, value: number): string {
  if (name === 'CLS') return value.toFixed(3);
  return `${Math.round(value)}ms`;
}