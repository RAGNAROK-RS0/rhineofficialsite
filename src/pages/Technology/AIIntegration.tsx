import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';
import AIChatBot from '../../components/AIChatBot';

export default function AIIntegration() {
  const { themeColor } = useThemeHue();
  const [activeDemo, setActiveDemo] = useState<'chatbot' | 'search' | 'content'>('chatbot');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const features = [
    {
      id: 'chatbot',
      name: 'AI Assistant',
      description: 'Intelligent chatbot with contextual responses',
      icon: '🤖',
    },
    {
      id: 'search',
      name: 'Smart Search',
      description: 'AI-powered search with intelligent suggestions',
      icon: '🔍',
    },
    {
      id: 'content',
      name: 'Content Generation',
      description: 'Automated content creation and summaries',
      icon: '✨',
    },
  ];

  return (
    <Layout themeColor={themeColor} showAuthButtons={true} onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div className="relative z-10 min-h-screen">
        <section className="py-12 md:py-40 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-[2px]" style={{ backgroundColor: themeColor }}></div>
              <h3 className="text-[10px] uppercase tracking-[0.8em]" style={{ color: themeColor }}>AI Integration</h3>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">Artificial Intelligence</h1>
            <p className="text-white/70 text-lg max-w-2xl mb-8">
              Intelligent AI-powered features including chatbot, smart search, and content generation 
              to enhance user experience and engagement.
            </p>

            <div className="flex flex-wrap gap-3">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => setActiveDemo(feature.id as any)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    activeDemo === feature.id
                      ? 'text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                  style={activeDemo === feature.id ? { backgroundColor: themeColor } : {}}
                >
                  <span>{feature.icon}</span>
                  <span>{feature.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Try the AI Assistant</h2>
            <p className="text-white/60 mb-6">
              Click the chat icon in the bottom right corner to interact with Rhine AI. 
              It can help with services, pricing, portfolio, and more!
            </p>

            <div className="bg-black/60 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">💬</div>
                  <h3 className="text-white font-medium mb-2">Contextual Chat</h3>
                  <p className="text-white/50 text-sm">Intelligent responses based on your questions</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🔎</div>
                  <h3 className="text-white font-medium mb-2">Smart Suggestions</h3>
                  <p className="text-white/50 text-sm">Search with AI-powered autocomplete</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">⚡</div>
                  <h3 className="text-white font-medium mb-2">Instant Answers</h3>
                  <p className="text-white/50 text-sm">Fast response times with cached knowledge</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Integration Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-2xl">
                  🔌
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Easy Integration</h3>
                <p className="text-white/60 text-sm">
                  Simple API integration with existing systems and workflows
                </p>
              </div>
              <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-2xl">
                  🔒
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Privacy First</h3>
                <p className="text-white/60 text-sm">
                  Secure and private - no data sent to external servers
                </p>
              </div>
              <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-2xl">
                  📊
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Analytics</h3>
                <p className="text-white/60 text-sm">
                  Track user interactions and improve responses
                </p>
              </div>
              <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-2xl">
                  🎨
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Customizable</h3>
                <p className="text-white/60 text-sm">
                  Match your brand with customizable colors and styles
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <AIChatBot position="bottom-right" accentColor={themeColor} />
    </Layout>
  );
}