import { useEffect, useState } from 'react';

interface DeviceCapabilities {
  hasWebGPU: boolean;
  hasWebGL: boolean;
  isMobile: boolean;
  isLowEnd: boolean;
  gpuTier: 'high' | 'medium' | 'low';
  maxTextureSize: number;
  renderer: string;
  supportsWebGPU: boolean;
  webGPUDevice: GPUDevice | null;
  shaderPrecision: 'high' | 'medium' | 'low';
  maxComputeWorkGroupSize: number;
  maxStorageBufferBindingSize: number;
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
    supportsWebGPU: false,
    webGPUDevice: null,
    shaderPrecision: 'medium',
    maxComputeWorkGroupSize: 256,
    maxStorageBufferBindingSize: 0,
  });

  useEffect(() => {
    const detectCapabilities = async () => {
      const ua = navigator.userAgent;
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      
      let hasWebGL = false;
      let hasWebGPU = false;
      let renderer = 'unknown';
      let maxTextureSize = 4096;
      let webGPUDevice: GPUDevice | null = null;
      let shaderPrecision: 'high' | 'medium' | 'low' = 'medium';
      let maxComputeWorkGroupSize = 256;
      let maxStorageBufferBindingSize = 0;

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
        if ('gpu' in navigator) {
          const gpu = (navigator as any).gpu;
          const adapter = await gpu.requestAdapter();
          if (adapter) {
            hasWebGPU = true;
            webGPUDevice = await adapter.requestDevice();
            
            const features = adapter.features;
            if (features.has('shader-f16')) shaderPrecision = 'high';
            else if (features.has('shader-int8')) shaderPrecision = 'medium';
            
            maxComputeWorkGroupSize = (adapter.limits as any).maxComputeWorkgroupSizeX || 256;
            maxStorageBufferBindingSize = (adapter.limits as any).maxStorageBufferBindingSize || 0;
          }
        }
      } catch (e) {
        console.warn('WebGPU detection failed:', e);
      }

      try {
        const webgpuModule = await import('three/examples/jsm/capabilities/WebGPU.js');
        if (webgpuModule && typeof webgpuModule.default?.isAvailable === 'function') {
          const isAvailable = await webgpuModule.default.isAvailable();
          hasWebGPU = hasWebGPU || isAvailable === true;
        }
      } catch (e) {
        console.warn('Three.js WebGPU detection failed:', e);
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
        supportsWebGPU: hasWebGPU,
        webGPUDevice,
        shaderPrecision,
        maxComputeWorkGroupSize,
        maxStorageBufferBindingSize,
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