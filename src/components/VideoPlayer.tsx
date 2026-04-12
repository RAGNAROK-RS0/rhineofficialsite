import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Film } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  autoplay?: boolean;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export interface VideoPlayerRef {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
}

const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(function VideoPlayer(
  { src, poster, title, autoplay = false, onEnded, onTimeUpdate },
  ref
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [quality, setQuality] = useState('auto');
  const [showSettings, setShowSettings] = useState(false);
  const [buffered, setBuffered] = useState(0);

  useImperativeHandle(ref, () => ({
    play: () => videoRef.current?.play(),
    pause: () => videoRef.current?.pause(),
    seek: (time: number) => {
      if (videoRef.current) videoRef.current.currentTime = time;
    },
    setVolume: (vol: number) => {
      setVolume(vol);
      if (videoRef.current) videoRef.current.volume = vol;
    },
  }));

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onTimeUpdate?.(video.currentTime, video.duration);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onEnded, onTimeUpdate]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) video.pause();
    else video.play();
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * duration;
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const qualities = ['auto', '1080p', '720p', '480p', '360p'];

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-xl overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isPlaying && setShowControls(true)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full aspect-video"
        playsInline
        onClick={togglePlay}
      />

      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {title && (
          <div className="absolute top-4 left-4 text-white font-medium">{title}</div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
          <div
            className="relative h-1 bg-white/20 rounded-full cursor-pointer group/progress"
            onClick={handleSeek}
          >
            <div
              className="absolute h-full bg-white/40 rounded-full"
              style={{ width: `${(buffered / duration) * 100}%` }}
            />
            <div
              className="absolute h-full rounded-full"
              style={{ 
                width: `${(currentTime / duration) * 100}%`,
                backgroundColor: '#0082D8'
              }}
            />
            <div
              className="absolute w-3 h-3 bg-white rounded-full -top-1 transform -translate-x-1/2 opacity-0 group-hover/progress:opacity-100 transition-opacity"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white ml-0.5" />
                )}
              </button>

              <button
                onClick={toggleMute}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </button>

              <span className="text-white/80 text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                >
                  <Settings className="w-4 h-4 text-white" />
                </button>
                
                {showSettings && (
                  <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-lg border border-white/10 rounded-lg p-2 min-w-[120px]">
                    <div className="text-white/50 text-xs px-2 py-1">Quality</div>
                    {qualities.map((q) => (
                      <button
                        key={q}
                        onClick={() => { setQuality(q); setShowSettings(false); }}
                        className={`w-full text-left px-2 py-1 rounded text-sm ${
                          quality === q ? 'text-[#0082D8]' : 'text-white hover:bg-white/10'
                        }`}
                      >
                        {q === 'auto' ? 'Auto' : q}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={toggleFullscreen}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                <Maximize className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {!isPlaying && currentTime === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="w-20 h-20 flex items-center justify-center rounded-full bg-[#0082D8]/80 hover:bg-[#0082D8] transition-colors"
          >
            <Play className="w-8 h-8 text-white ml-1" />
          </button>
        </div>
      )}
    </div>
  );
});

export default VideoPlayer;