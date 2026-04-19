import React from 'react';
import Layout from '../../components/Layout';
import DeviceManager from '../../components/DeviceManager';
import useThemeHue from '../../hooks/useThemeHue';
import { useMQTT } from '../../lib/iot';

export default function IoTIntegration() {
  const { themeColor } = useThemeHue();
  const { isConnected, messages, connect, publish, disconnect } = useMQTT({
    topics: ['rhine/test', 'rhine/devices/#'],
  });

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const sendTestMessage = () => {
    publish('rhine/test', JSON.stringify({ message: 'Hello from Rhine!', timestamp: Date.now() }));
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
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">IoT Integration</h1>
            <p className="text-white/70 text-lg max-w-2xl mb-8">
              MQTT-based device management, real-time sensor data, and IoT gateway integration.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-6 md:p-8">
              <div className="w-12 h-12 rounded-lg bg-[#0082D8]/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">MQTT Protocol</h3>
              <p className="text-white/60">Lightweight messaging for low-bandwidth IoT devices.</p>
            </div>
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-6 md:p-8">
              <div className="w-12 h-12 rounded-lg bg-[#0082D8]/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Device Management</h3>
              <p className="text-white/60">Register, monitor, and control IoT devices remotely.</p>
            </div>
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-6 md:p-8">
              <div className="w-12 h-12 rounded-lg bg-[#0082D8]/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Real-time Data</h3>
              <p className="text-white/60">Live sensor readings with WebSocket streaming.</p>
            </div>
            <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-6 md:p-8">
              <div className="w-12 h-12 rounded-lg bg-[#0082D8]/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Edge Computing</h3>
              <p className="text-white/60">Process data locally before cloud transmission.</p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Device Manager</h2>
            <DeviceManager />
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">MQTT Connection</h2>
            <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-white">{isConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
                <button
                  onClick={isConnected ? disconnect : connect}
                  className={`px-4 py-2 rounded-lg text-sm ${isConnected ? 'bg-red-500/20 text-red-400' : 'bg-[#0082D8] text-white'}`}
                >
                  {isConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
              <p className="text-white/40 text-sm">Broker: wss://broker.hivemq.com:8884/mqtt</p>
            </div>

            {isConnected && (
              <div className="mb-4">
                <button onClick={sendTestMessage} className="bg-[#0082D8] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#0082D8]/80">
                  Send Test Message
                </button>
              </div>
            )}

            {messages.length > 0 && (
              <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                <h3 className="text-white font-bold mb-4">Recent Messages</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {messages.slice(-5).reverse().map((msg, i) => (
                    <div key={i} className="text-sm border-b border-white/5 pb-2">
                      <span className="text-[#0082D8]">{msg.topic}</span>
                      <span className="text-white/40 ml-2">{msg.payload}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}