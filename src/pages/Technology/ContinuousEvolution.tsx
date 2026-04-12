import React from 'react';
import Layout from '../../components/Layout';
import FeedbackWidget from '../../components/FeedbackWidget';
import useThemeHue from '../../hooks/useThemeHue';
import { useFeedback } from '../../lib/feedback';

export default function ContinuousEvolution() {
  const { themeColor } = useThemeHue();
  const { getAnalytics } = useFeedback();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const analytics = getAnalytics();

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
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">Continuous Evolution</h1>
            <p className="text-white/70 text-lg max-w-2xl mb-8">
              User feedback loops, analytics-driven development, and continuous improvement processes.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-6 md:p-8">
              <div className="w-12 h-12 rounded-lg bg-[#0082D8]/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Analytics-Driven</h3>
              <p className="text-white/60">Data-backed decisions with comprehensive usage analytics.</p>
            </div>
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-6 md:p-8">
              <div className="w-12 h-12 rounded-lg bg-[#0082D8]/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Feedback Loops</h3>
              <p className="text-white/60">Continuous user feedback collection and response system.</p>
            </div>
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-6 md:p-8">
              <div className="w-12 h-12 rounded-lg bg-[#0082D8]/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Continuous Delivery</h3>
              <p className="text-white/60">Frequent releases with automated testing and deployment.</p>
            </div>
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-6 md:p-8">
              <div className="w-12 h-12 rounded-lg bg-[#0082D8]/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Quality Assurance</h3>
              <p className="text-white/60">Automated testing, monitoring, and error tracking.</p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Share Your Feedback</h2>
            <div className="max-w-md">
              <FeedbackWidget pageUrl="/technology/continuous-evolution" />
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Feedback Analytics</h2>
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center">
                <div className="text-white/40 text-sm mb-1">Total Feedback</div>
                <div className="text-white text-2xl font-bold">{analytics.total}</div>
              </div>
              <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center">
                <div className="text-white/40 text-sm mb-1">Avg Rating</div>
                <div className="text-white text-2xl font-bold">{analytics.avgRating}</div>
              </div>
              <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center">
                <div className="text-white/40 text-sm mb-1">Feature Requests</div>
                <div className="text-white text-2xl font-bold">{analytics.byType.feature || 0}</div>
              </div>
              <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center">
                <div className="text-white/40 text-sm mb-1">Bug Reports</div>
                <div className="text-white text-2xl font-bold">{analytics.byType.bug || 0}</div>
              </div>
            </div>

            <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">Feedback by Type</h3>
              <div className="space-y-3">
                {Object.entries(analytics.byType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-white/80 capitalize">{type}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#0082D8] rounded-full" 
                          style={{ width: `${((count as number) / (analytics.total || 1)) * 100}%` }}
                        />
                      </div>
                      <span className="text-white/60 text-sm w-8">{count as number}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Join Our Evolution</h2>
              <p className="text-white/60 mb-6 max-w-xl mx-auto">
                Your feedback shapes our roadmap. Every suggestion is reviewed by our product team 
                and contributes to our quarterly planning cycle.
              </p>
              <a 
                href="https://github.com/rhine-solution/feedback" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-[#0082D8] hover:bg-[#0082D8]/80 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                View Public Roadmap
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}