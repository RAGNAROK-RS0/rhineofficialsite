import React from 'react';
import Layout from '../../components/Layout';
import TenantSelector from '../../components/TenantSelector';
import useThemeHue from '../../hooks/useThemeHue';
import { useTenant } from '../../lib/multiTenant';

export default function MultiTenant() {
  const { themeColor } = useThemeHue();
  const { tenant } = useTenant();

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
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">Multi-Tenant Architecture</h1>
            <p className="text-white/70 text-lg max-w-2xl mb-8">
              Scale your SaaS with complete tenant isolation, white-label customization, and per-tenant configuration.
            </p>
            <div className="inline-flex items-center gap-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg px-4 py-3">
              <span className="text-white/60 text-sm">Current Tenant:</span>
              <TenantSelector />
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-6 md:p-8">
              <div className="w-12 h-12 rounded-lg bg-[#0082D8]/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Data Isolation</h3>
              <p className="text-white/60">Row-level security ensures complete data separation between tenants with zero leakage.</p>
            </div>
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-6 md:p-8">
              <div className="w-12 h-12 rounded-lg bg-[#0082D8]/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">White-Label</h3>
              <p className="text-white/60">Custom branding, themes, and domain configuration for each tenant.</p>
            </div>
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-6 md:p-8">
              <div className="w-12 h-12 rounded-lg bg-[#0082D8]/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Feature Flags</h3>
              <p className="text-white/60">Per-tenant feature enablement with graceful degradation based on plan tier.</p>
            </div>
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-6 md:p-8">
              <div className="w-12 h-12 rounded-lg bg-[#0082D8]/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Usage Billing</h3>
              <p className="text-white/60">Track API calls, storage, and user counts with quota enforcement per tenant.</p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Tenant Configuration</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/60">Tenant ID</span>
                  <span className="text-white font-mono text-sm">{tenant?.id}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/60">Plan</span>
                  <span className="text-white font-medium uppercase">{tenant?.plan}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/60">Primary Color</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: tenant?.primaryColor }}></div>
                    <span className="text-white font-mono text-sm">{tenant?.primaryColor}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/60">Active Features</span>
                  <div className="flex gap-2">
                    {tenant?.features.map(f => (
                      <span key={f} className="px-2 py-1 bg-[#0082D8]/20 text-[#0082D8] text-xs rounded uppercase">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}