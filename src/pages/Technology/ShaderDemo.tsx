import React, { useEffect, useRef, useState } from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';
import AdvancedParticles from '../../components/AdvancedParticles';
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities';

export default function ShaderDemo() {
  const { themeColor } = useThemeHue();
  const { hasWebGPU, hasWebGL, gpuTier, renderer, supportsWebGPU, isLowEnd, isMobile } = useDeviceCapabilities();
  const [activeShader, setActiveShader] = useState<'particles' | 'wave' | 'grid'>('particles');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const shaders = [
    { id: 'particles', name: 'Particle Field', description: 'GPU-accelerated particle system with custom shaders' },
    { id: 'wave', name: 'Wave Grid', description: 'Animated wave distortion effect' },
    { id: 'grid', name: 'Neon Grid', description: 'Retro-futuristic grid visualization' },
  ];

  return (
    <Layout themeColor={themeColor} showAuthButtons={true} onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div className="relative">
        <AdvancedParticles count={3000} color={themeColor} style={activeShader} />
        
        <div className="relative z-10 min-h-screen">
          <section className="py-12 md:py-40 px-4 md:px-10">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-[2px]" style={{ backgroundColor: themeColor }}></div>
                <h3 className="text-[10px] uppercase tracking-[0.8em]" style={{ color: themeColor }}>Advanced 3D</h3>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">Shader Playground</h1>
              <p className="text-white/70 text-lg max-w-2xl mb-8">
                Explore custom WebGL shaders and GPU-accelerated visual effects. 
                Powered by {supportsWebGPU ? 'WebGPU' : 'WebGL'}.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                {shaders.map((shader) => (
                  <button
                    key={shader.id}
                    onClick={() => setActiveShader(shader.id as any)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      activeShader === shader.id
                        ? 'bg-[#0082D8] text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {shader.name}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">GPU Capabilities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/60 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                  <div className="text-sm text-white/50 mb-2">WebGPU Support</div>
                  <div className="text-2xl font-bold" style={{ color: hasWebGPU ? '#10b981' : '#f59e0b' }}>
                    {hasWebGPU ? 'Available' : 'Not Available'}
                  </div>
                </div>
                <div className="bg-black/60 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                  <div className="text-sm text-white/50 mb-2">WebGL Support</div>
                  <div className="text-2xl font-bold" style={{ color: hasWebGL ? '#10b981' : '#ef4444' }}>
                    {hasWebGL ? 'Available' : 'Not Available'}
                  </div>
                </div>
                <div className="bg-black/60 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                  <div className="text-sm text-white/50 mb-2">GPU Tier</div>
                  <div className="text-2xl font-bold capitalize" style={{ color: themeColor }}>
                    {gpuTier}
                  </div>
                </div>
                <div className="bg-black/60 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                  <div className="text-sm text-white/50 mb-2">Device</div>
                  <div className="text-lg font-medium text-white truncate">
                    {renderer !== 'unknown' ? renderer : 'Detecting...'}
                  </div>
                </div>
              </div>

              {(isLowEnd || isMobile) && (
                <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-amber-400 text-sm">
                    ⚠️ Performance optimized for your device. Some effects may be reduced.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="py-12 md:py-20 px-4 md:px-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Shader Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                  <div className="w-12 h-12 rounded-lg bg-[#0082D8]/20 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">GPU Accelerated</h3>
                  <p className="text-white/60 text-sm">
                    Custom vertex and fragment shaders optimized for GPU compute
                  </p>
                </div>
                <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                  <div className="w-12 h-12 rounded-lg bg-[#0082D8]/20 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Adaptive Quality</h3>
                  <p className="text-white/60 text-sm">
                    Automatically adjusts based on device capabilities and GPU tier
                  </p>
                </div>
                <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                  <div className="w-12 h-12 rounded-lg bg-[#0082D8]/20 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">WebGPU Ready</h3>
                  <p className="text-white/60 text-sm">
                    Falls back gracefully to WebGL when WebGPU is unavailable
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}