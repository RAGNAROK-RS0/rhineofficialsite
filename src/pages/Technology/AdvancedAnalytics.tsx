import React, { useEffect } from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';
import AnalyticsDashboard from '../../components/AnalyticsDashboard';
import { ABTestProvider } from '../../hooks/useABTest';

export default function AdvancedAnalytics() {
  const { themeColor } = useThemeHue();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const experiments = [
    {
      id: 'hero_cta_test',
      name: 'Hero CTA Button Test',
      variants: { control: 50, variant_a: 50 },
      active: true,
    },
    {
      id: 'pricing_layout_test',
      name: 'Pricing Page Layout',
      variants: { control: 33, variant_a: 33, variant_b: 34 },
      active: true,
    },
  ];

  return (
    <ABTestProvider>
      <Layout themeColor={themeColor} showAuthButtons={true} onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <div className="relative z-10 min-h-screen">
          <section className="py-12 md:py-40 px-4 md:px-10">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-[2px]" style={{ backgroundColor: themeColor }}></div>
                <h3 className="text-[10px] uppercase tracking-[0.8em]" style={{ color: themeColor }}>Advanced Analytics</h3>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">Analytics & Insights</h1>
              <p className="text-white/70 text-lg max-w-2xl mb-8">
                A/B testing, conversion funnels, and heatmap analytics to optimize user experience 
                and maximize conversion rates.
              </p>
            </div>
          </section>

          <section className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Active Experiments</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {experiments.map((exp) => (
                  <div key={exp.id} className="bg-black/60 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-medium">{exp.name}</h3>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Active</span>
                    </div>
                    <div className="flex gap-2">
                      {Object.entries(exp.variants).map(([variant, weight]) => (
                        <div key={variant} className="flex-1 text-center">
                          <div className="text-white/50 text-xs capitalize">{variant}</div>
                          <div className="text-white font-medium">{weight}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-12 md:py-20 px-4 md:px-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Analytics Dashboard</h2>
              <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <AnalyticsDashboard funnelId="main_conversion" />
              </div>
            </div>
          </section>

          <section className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                  <div className="text-3xl mb-4">🔬</div>
                  <h3 className="text-lg font-bold text-white mb-2">A/B Testing</h3>
                  <p className="text-white/60 text-sm">
                    Test different variants and track conversions to optimize outcomes
                  </p>
                </div>
                <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                  <div className="text-3xl mb-4">📈</div>
                  <h3 className="text-lg font-bold text-white mb-2">Conversion Funnels</h3>
                  <p className="text-white/60 text-sm">
                    Visualize user journey and identify drop-off points
                  </p>
                </div>
                <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                  <div className="text-3xl mb-4">🗺️</div>
                  <h3 className="text-lg font-bold text-white mb-2">Heatmaps</h3>
                  <p className="text-white/60 text-sm">
                    Understand user behavior with click and interaction data
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </ABTestProvider>
  );
}