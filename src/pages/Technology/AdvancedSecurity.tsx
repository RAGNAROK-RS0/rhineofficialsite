import React from 'react';
import Layout from '../../components/Layout';
import SecurityDashboard from '../../components/SecurityDashboard';
import useThemeHue from '../../hooks/useThemeHue';
import { logSecurityEvent } from '../../lib/security';

export default function AdvancedSecurity() {
  const { themeColor } = useThemeHue();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    logSecurityEvent('data_access', 'Accessed Advanced Security page', 'low');
  }, []);

  const triggerDemo = (type: string, severity: 'low' | 'medium' | 'high' | 'critical') => {
    logSecurityEvent(type as any, `Demo: ${type} event triggered`, severity);
  };

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
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">Advanced Security</h1>
            <p className="text-white/70 text-lg max-w-2xl mb-8">
              Enterprise-grade security with SSO, audit logging, rate limiting, and real-time threat detection.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-6 md:p-8">
              <div className="w-12 h-12 rounded-lg bg-[#0082D8]/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">SSO / SAML</h3>
              <p className="text-white/60">Enterprise identity providers with OIDC and SAML 2.0 support.</p>
            </div>
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-6 md:p-8">
              <div className="w-12 h-12 rounded-lg bg-[#0082D8]/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Audit Logging</h3>
              <p className="text-white/60">Complete trail of all user actions with tamper-proof logging.</p>
            </div>
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-6 md:p-8">
              <div className="w-12 h-12 rounded-lg bg-[#0082D8]/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Rate Limiting</h3>
              <p className="text-white/60">Configurable per-user, per-IP rate limits with sliding windows.</p>
            </div>
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-6 md:p-8">
              <div className="w-12 h-12 rounded-lg bg-[#0082D8]/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Threat Detection</h3>
              <p className="text-white/60">Real-time anomaly detection with automated responses.</p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Security Event Log</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <button onClick={() => triggerDemo('login', 'low')} className="bg-black/60 border border-white/10 rounded-lg p-4 text-left hover:border-[#0082D8] transition-colors">
                <span className="text-white font-medium">Simulate Login</span>
                <span className="text-white/40 text-sm block">Log a successful login event</span>
              </button>
              <button onClick={() => triggerDemo('failed_login', 'high')} className="bg-black/60 border border-white/10 rounded-lg p-4 text-left hover:border-[#0082D8] transition-colors">
                <span className="text-white font-medium">Simulate Failed Login</span>
                <span className="text-white/40 text-sm block">Log a failed login attempt</span>
              </button>
            </div>
            <SecurityDashboard maxEvents={15} />
          </div>
        </section>
      </div>
    </Layout>
  );
}