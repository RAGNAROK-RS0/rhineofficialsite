import React from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';
import { useWebVitals, getVitalIcon, formatVitalValue } from '../../hooks/useWebVitals';
import { CoreWebVitals } from '../../hooks/useWebVitals';

export default function PerformanceMonitoring() {
  const { themeColor } = useThemeHue();
  const { vitals, metrics } = useWebVitals();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Layout themeColor={themeColor} showAuthButtons={true} onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div className="relative z-10 min-h-screen">
        <section className="py-12 md:py-40 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <a href="/technology" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              Back to Technology
            </a>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-[2px]" style={{ backgroundColor: themeColor }}></div>
              <h3 className="text-[10px] uppercase tracking-[0.8em]" style={{ color: themeColor }}>Technology</h3>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">Performance Monitoring</h1>
            <p className="text-white/70 text-lg max-w-2xl mb-8">
              Real-time Core Web Vitals monitoring, Real User Monitoring (RUM), and performance optimization.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-6 md:p-8">
              <div className="w-12 h-12 rounded-lg bg-[#0082D8]/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Core Web Vitals</h3>
              <p className="text-white/60">LCP, FID, CLS tracking aligned with Google ranking signals.</p>
            </div>
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-6 md:p-8">
              <div className="w-12 h-12 rounded-lg bg-[#0082D8]/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">RUM Dashboard</h3>
              <p className="text-white/60">Real user monitoring with global performance insights.</p>
            </div>
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-6 md:p-8">
              <div className="w-12 h-12 rounded-lg bg-[#0082D8]/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Real-time</h3>
              <p className="text-white/60">Live performance metrics with alerting thresholds.</p>
            </div>
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-6 md:p-8">
              <div className="w-12 h-12 rounded-lg bg-[#0082D8]/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Optimization</h3>
              <p className="text-white/60">Actionable recommendations for performance improvements.</p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Live Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {['LCP', 'FID', 'CLS', 'FCP', 'TTFB'].map(metric => {
                const value = vitals[metric as keyof CoreWebVitals];
                return (
                  <div key={metric} className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-white/40 text-xs mb-1">{metric}</div>
                    <div className="text-white font-bold text-lg">
                      {value !== null ? formatVitalValue(metric, value) : '--'}
                    </div>
                    <div className="text-white/40 text-xs mt-1">
                      {value === null ? 'Awaiting...' : value <= (metric === 'CLS' ? 0.1 : metric === 'FID' ? 100 : 2500) ? 'Good' : 'Needs Work'}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">All Recorded Metrics</h3>
              {metrics.length === 0 ? (
                <p className="text-white/40 text-center py-8">Metrics will appear as the page loads...</p>
              ) : (
                <div className="space-y-2">
                  {metrics.map((m, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span>{getVitalIcon(m.rating)}</span>
                        <span className="text-white font-medium">{m.name}</span>
                      </div>
                      <span className="text-white/60">{formatVitalValue(m.name, m.value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Thresholds</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-green-500 font-bold mb-2">LCP (Largest Contentful Paint)</div>
                  <div className="text-white/60 text-sm">Good: &lt;2.5s | Poor: &gt;4s</div>
                </div>
                <div>
                  <div className="text-green-500 font-bold mb-2">FID (First Input Delay)</div>
                  <div className="text-white/60 text-sm">Good: &lt;100ms | Poor: &gt;300ms</div>
                </div>
                <div>
                  <div className="text-green-500 font-bold mb-2">CLS (Cumulative Layout Shift)</div>
                  <div className="text-white/60 text-sm">Good: &lt;0.1 | Poor: &gt;0.25</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}