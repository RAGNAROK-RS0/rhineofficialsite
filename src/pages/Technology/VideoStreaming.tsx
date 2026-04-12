import React, { useEffect, useState, useRef } from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';
import VideoPlayer, { VideoPlayerRef } from '../../components/VideoPlayer';
import { Film, Wifi, Monitor, Smartphone, Layers, Zap, Settings, Play } from 'lucide-react';

export default function VideoStreaming() {
  const { themeColor } = useThemeHue();
  const playerRef = useRef<VideoPlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const sampleVideos = [
    {
      title: 'Product Demo',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      poster: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    },
    {
      title: 'Tech Showcase',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      poster: '',
    },
  ];

  const features = [
    {
      icon: <Wifi className="w-6 h-6" />,
      title: 'Adaptive Streaming',
      description: 'Automatic quality adjustment based on network speed',
    },
    {
      icon: <Monitor className="w-6 h-6" />,
      title: 'Multi-Device Support',
      description: 'Works seamlessly on desktop, tablet, and mobile',
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: 'Offline Playback',
      description: 'Download videos for offline viewing',
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: 'HLS & DASH Support',
      description: 'Industry-standard streaming protocols',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Low Latency',
      description: 'Sub-second delay for live streaming',
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: 'DRM Protected',
      description: 'Widevine, FairPlay, and PlayReady support',
    },
  ];

  const qualities = [
    { label: '4K Ultra HD', bitrate: '12 Mbps', resolution: '3840x2160' },
    { label: '1080p Full HD', bitrate: '5 Mbps', resolution: '1920x1080' },
    { label: '720p HD', bitrate: '2.5 Mbps', resolution: '1280x720' },
    { label: '480p SD', bitrate: '1 Mbps', resolution: '854x480' },
    { label: '360p Low', bitrate: '500 Kbps', resolution: '640x360' },
  ];

  return (
    <Layout themeColor={themeColor} showAuthButtons={true} onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div className="relative z-10 min-h-screen">
        <section className="py-12 md:py-40 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-[2px]" style={{ backgroundColor: themeColor }}></div>
              <h3 className="text-[10px] uppercase tracking-[0.8em]" style={{ color: themeColor }}>Video Streaming</h3>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">Video Platform</h1>
            <p className="text-white/70 text-lg max-w-2xl mb-8">
              Professional video streaming with HLS adaptive bitrate, multi-device support, 
              and enterprise-grade DRM protection.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Demo Player</h2>
            <VideoPlayer
              ref={playerRef}
              src={sampleVideos[0].src}
              poster={sampleVideos[0].poster}
              title={sampleVideos[0].title}
              onEnded={() => setIsPlaying(false)}
              onTimeUpdate={(time, dur) => {
                // Track video progress for analytics
              }}
            />
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Streaming Features</h2>
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
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Quality Levels</h2>
            <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-3 p-4 bg-white/5 text-white/50 text-sm font-medium">
                <div>Resolution</div>
                <div>Bitrate</div>
                <div>Use Case</div>
              </div>
              {qualities.map((q, i) => (
                <div key={i} className="grid grid-cols-3 p-4 border-t border-white/10 text-sm">
                  <div className="text-white font-medium">{q.label}</div>
                  <div className="text-white/60">{q.bitrate}</div>
                  <div className="text-white/60">{q.resolution}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Integration</h2>
            <div className="bg-black/80 border border-white/10 rounded-2xl p-6 font-mono text-sm">
              <div className="text-white/50 mb-4">// Video.js integration</div>
              <div className="text-[#0082D8]">npm install video.js @videojs/hlsjs-adapter</div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}