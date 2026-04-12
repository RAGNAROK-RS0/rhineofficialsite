import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';
import { Zap, Shield, Globe, Server, Database, Clock } from 'lucide-react';

interface EdgeFunction {
  name: string;
  description: string;
  location: string;
  executionTime: string;
}

export default function EdgeComputing() {
  const { themeColor } = useThemeHue();
  const [activeTab, setActiveTab] = useState<'functions' | 'caching' | 'ddos'>('functions');
  const [functions, setFunctions] = useState<EdgeFunction[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setFunctions([
      { name: 'auth-verify', description: 'JWT token validation', location: 'Frankfurt', executionTime: '12ms' },
      { name: 'geo-redirect', description: 'Regional routing', location: 'Amsterdam', executionTime: '8ms' },
      { name: 'rate-limit', description: 'API throttling', location: 'London', executionTime: '5ms' },
    ]);
  }, []);

  const tabs = [
    { id: 'functions', label: 'Edge Functions', icon: <Zap className="w-4 h-4" /> },
    { id: 'caching', label: 'Caching', icon: <Database className="w-4 h-4" /> },
    { id: 'ddos', label: 'DDoS Protection', icon: <Shield className="w-4 h-4" /> },
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Global Edge Network',
      description: 'Deploy functions to 300+ edge locations worldwide',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Low Latency',
      description: 'Sub-50ms response times globally',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Built-in Security',
      description: 'DDoS protection, WAF, and Bot management',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Geo-routing',
      description: 'Route users to nearest edge location automatically',
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: 'Serverless',
      description: 'No server management - just deploy your code',
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: 'KV Storage',
      description: 'Distributed key-value store at the edge',
    },
  ];

  return (
    <Layout themeColor={themeColor} showAuthButtons={true} onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div className="relative z-10 min-h-screen">
        <section className="py-12 md:py-40 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-[2px]" style={{ backgroundColor: themeColor }}></div>
              <h3 className="text-[10px] uppercase tracking-[0.8em]" style={{ color: themeColor }}>Edge Computing</h3>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">Edge & Serverless</h1>
            <p className="text-white/70 text-lg max-w-2xl mb-8">
              Deploy serverless functions to the edge with Cloudflare Workers. 
              Global distribution, built-in security, and zero infrastructure management.
            </p>

            <div className="flex flex-wrap gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
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
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Deployed Functions</h2>
            <div className="space-y-4">
              {functions.map((func, index) => (
                <div 
                  key={index}
                  className="bg-black/60 backdrop-blur-lg border border-white/10 rounded-xl p-6 flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-white font-medium mb-1">{func.name}</h3>
                    <p className="text-white/50 text-sm">{func.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-white/60 text-xs">{func.location}</div>
                    <div className="text-white font-medium" style={{ color: themeColor }}>{func.executionTime}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-400 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                All functions healthy - 99.99% uptime
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Edge Features</h2>
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

        <section className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Quick Start</h2>
            <div className="bg-black/80 border border-white/10 rounded-2xl p-6 font-mono text-sm">
              <div className="text-white/50 mb-4"># Install Wrangler CLI</div>
              <div className="text-[#0082D8] mb-6">npm install -g wrangler</div>
              
              <div className="text-white/50 mb-4"># Create new edge function</div>
              <div className="text-[#0082D8] mb-6">wrangler generate my-edge-function</div>
              
              <div className="text-white/50 mb-4"># Deploy to edge</div>
              <div className="text-[#0082D8]">wrangler deploy</div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}