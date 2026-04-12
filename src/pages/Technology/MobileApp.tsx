import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';
import { Smartphone, Download, Bell, Zap, Globe, Lock } from 'lucide-react';

export default function MobileApp() {
  const { themeColor } = useThemeHue();
  const [activePlatform, setActivePlatform] = useState<'ios' | 'android'>('ios');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const features = [
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: 'Cross-Platform',
      description: 'Built with React Native for both iOS and Android from a single codebase',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Native Performance',
      description: 'Optimized native components for smooth 60fps animations',
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: 'Push Notifications',
      description: 'Real-time notifications with custom sounds and badges',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Offline Support',
      description: 'Work offline with automatic sync when connection is restored',
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Secure',
      description: 'Biometric authentication and encrypted local storage',
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: 'Easy Updates',
      description: 'Over-the-air updates without app store review delays',
    },
  ];

  return (
    <Layout themeColor={themeColor} showAuthButtons={true} onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div className="relative z-10 min-h-screen">
        <section className="py-12 md:py-40 px-4 md:px-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-[2px]" style={{ backgroundColor: themeColor }}></div>
              <h3 className="text-[10px] uppercase tracking-[0.8em]" style={{ color: themeColor }}>Mobile App</h3>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">Rhine Mobile</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
              Native mobile experience powered by React Native. Available for iOS and Android 
              with full feature parity and real-time sync.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={() => setActivePlatform('ios')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activePlatform === 'ios' ? 'text-white' : 'bg-white/10 text-white/70'
                }`}
                style={activePlatform === 'ios' ? { backgroundColor: themeColor } : {}}
              >
                📱 iOS App
              </button>
              <button
                onClick={() => setActivePlatform('android')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activePlatform === 'android' ? 'text-white' : 'bg-white/10 text-white/70'
                }`}
                style={activePlatform === 'android' ? { backgroundColor: themeColor } : {}}
              >
                🤖 Android App
              </button>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-white/80 text-sm">Coming Soon</span>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider text-center">Mobile Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors"
                >
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${themeColor}20` }}
                  >
                    <span style={{ color: themeColor }}>{feature.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/60 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider text-center">Technical Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h3 className="text-lg font-bold text-white mb-4">Core Technologies</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></span>
                    <span className="text-white/70">React Native 0.76+</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></span>
                    <span className="text-white/70">TypeScript 5.x</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></span>
                    <span className="text-white/70">React Navigation 7</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></span>
                    <span className="text-white/70">Redux Toolkit</span>
                  </li>
                </ul>
              </div>
              <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h3 className="text-lg font-bold text-white mb-4">Integrations</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></span>
                    <span className="text-white/70">Supabase Auth</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></span>
                    <span className="text-white/70">Push Notifications (Expo)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></span>
                    <span className="text-white/70">CodePush Updates</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></span>
                    <span className="text-white/70">Sentry Monitoring</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">Stay Updated</h2>
            <p className="text-white/60 mb-6">
              Sign up to be notified when the mobile app launches
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30"
              />
              <button
                className="px-6 py-3 rounded-lg font-medium text-white transition-all hover:opacity-90"
                style={{ backgroundColor: themeColor }}
              >
                Notify Me
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}