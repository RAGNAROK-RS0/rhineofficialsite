import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';
import APIDocs from '../../components/APIDocs';
import APIPlayground from '../../components/APIPlayground';
import { BookOpen, Terminal, Key, Copy, RefreshCw, Eye, EyeOff } from 'lucide-react';

type TabType = 'docs' | 'playground' | 'keys';

export default function DeveloperPlatform() {
  const { themeColor } = useThemeHue();
  const [activeTab, setActiveTab] = useState<TabType>('docs');
  const [apiKey, setApiKey] = useState('rhsk_live_xxxxxxxxxxxxxxxxxxxx');
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const regenerateKey = () => {
    const newKey = 'rhsk_live_' + Math.random().toString(36).substring(2, 26);
    setApiKey(newKey);
  };

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey.replace('x', ''));
  };

  const tabs = [
    { id: 'docs' as const, label: 'API Docs', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'playground' as const, label: 'Playground', icon: <Terminal className="w-4 h-4" /> },
    { id: 'keys' as const, label: 'API Keys', icon: <Key className="w-4 h-4" /> },
  ];

  const stats = {
    requests: 12543,
    errors: 12,
    avgResponse: '45ms',
  };

  return (
    <Layout themeColor={themeColor} showAuthButtons={true} onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div className="relative z-10 min-h-screen">
        <section className="py-12 md:py-40 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-[2px]" style={{ backgroundColor: themeColor }}></div>
              <h3 className="text-[10px] uppercase tracking-[0.8em]" style={{ color: themeColor }}>Developer Platform</h3>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">Developer API</h1>
            <p className="text-white/70 text-lg max-w-2xl mb-8">
              Complete API documentation, interactive playground, and API key management 
              for integrating with Rhine Solution services.
            </p>
          </div>
        </section>

        <section className="py-8 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{stats.requests.toLocaleString()}</div>
                <div className="text-white/50 text-sm">Total Requests</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{stats.errors}</div>
                <div className="text-white/50 text-sm">Errors</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{stats.avgResponse}</div>
                <div className="text-white/50 text-sm">Avg Response</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-3 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id ? 'text-white' : 'bg-white/10 text-white/70'
                  }`}
                  style={activeTab === tab.id ? { backgroundColor: themeColor } : {}}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              {activeTab === 'docs' && <APIDocs />}
              {activeTab === 'playground' && <APIPlayground />}
              {activeTab === 'keys' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-white font-medium mb-4">Your API Keys</h3>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white/60 text-sm">Production Key</span>
                        <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400">Active</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 bg-black/30 rounded px-3 py-2 text-white font-mono text-sm">
                          {showKey ? apiKey : apiKey.replace(/./g, '•')}
                        </code>
                        <button
                          onClick={() => setShowKey(!showKey)}
                          className="p-2 rounded hover:bg-white/10 text-white/40"
                        >
                          {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={copyKey}
                          className="p-2 rounded hover:bg-white/10 text-white/40"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={regenerateKey}
                        className="mt-3 flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Regenerate Key
                      </button>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <p className="text-yellow-400 text-sm">
                      ⚠️ Keep your API key secret. Do not share it in public repositories or client-side code.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-3">Rate Limits</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="text-white/60 text-sm mb-1">Requests/minute</div>
                        <div className="text-2xl font-bold text-white">60</div>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="text-white/60 text-sm mb-1">Requests/day</div>
                        <div className="text-2xl font-bold text-white">10,000</div>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="text-white/60 text-sm mb-1">Webhooks/min</div>
                        <div className="text-2xl font-bold text-white">30</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}