import { useEffect, useState } from 'react';

interface DeviceCapabilities {
  hasWebGPU: boolean;
  hasWebGL: boolean;
  isMobile: boolean;
  isLowEnd: boolean;
  gpuTier: 'high' | 'medium' | 'low';
  maxTextureSize: number;
  renderer: string;
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    hasWebGPU: false,
    hasWebGL: false,
    isMobile: false,
    isLowEnd: false,
    gpuTier: 'medium',
    maxTextureSize: 4096,
    renderer: 'unknown',
  });

  useEffect(() => {
    const detectCapabilities = async () => {
      const ua = navigator.userAgent;
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      
      let hasWebGL = false;
      let hasWebGPU = false;
      let renderer = 'unknown';
      let maxTextureSize = 4096;

      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        
        if (gl) {
          hasWebGL = true;
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          renderer = debugInfo 
            ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
            : gl.getParameter(gl.RENDERER);
          maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        }
      } catch (e) {
        console.warn('WebGL detection failed:', e);
      }

      try {
        const webgpuModule = await import('three/examples/jsm/capabilities/WebGPU.js');
        if (webgpuModule && typeof webgpuModule.default?.isAvailable === 'function') {
          const isAvailable = await webgpuModule.default.isAvailable();
          hasWebGPU = isAvailable === true;
        }
      } catch (e) {
        console.warn('WebGPU detection failed:', e);
      }

      const lowEndGpuNames = ['mali-4', 'mali-t', 'adreno 3', 'adreno 4', 'intel hd', 'intel iris', 'swiftshader'];
      const isLowEnd = mobile || lowEndGpuNames.some(name => renderer.toLowerCase().includes(name));
      
      let gpuTier: 'high' | 'medium' | 'low' = 'medium';
      if (isLowEnd) {
        gpuTier = 'low';
      } else if (renderer.toLowerCase().includes('nvidia') || renderer.toLowerCase().includes('radeon rx')) {
        gpuTier = 'high';
      }

      setCapabilities({
        hasWebGPU,
        hasWebGL,
        isMobile: mobile,
        isLowEnd,
        gpuTier,
        maxTextureSize,
        renderer,
      });
    };

    detectCapabilities();
  }, []);

  return capabilities;
}

export function useAdaptiveQuality() {
  const { gpuTier, isMobile, isLowEnd } = useDeviceCapabilities();

  const getParticleCount = (base: number): number => {
    switch (gpuTier) {
      case 'high': return base;
      case 'medium': return Math.floor(base * 0.7);
      case 'low': return Math.floor(base * 0.3);
      default: return Math.floor(base * 0.5);
    }
  };

  const getLODLevel = (distance: number): number => {
    if (gpuTier === 'low' || isMobile) return 0;
    if (gpuTier === 'medium') return distance > 50 ? 0 : 1;
    return distance > 100 ? 0 : distance > 50 ? 1 : 2;
  };

  const shouldUsePostProcessing = (): boolean => {
    return !isLowEnd && !isMobile;
  };

  return {
    getParticleCount,
    getLODLevel,
    shouldUsePostProcessing,
    gpuTier,
    isMobile,
    isLowEnd,
  };
}