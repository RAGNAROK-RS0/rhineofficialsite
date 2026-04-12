import React, { useState, useRef, useEffect } from 'react';
import { useWebXR, useARViewer } from '../hooks/useWebXR';

interface ARViewerProps {
  modelUrl?: string;
  placeholderImage?: string;
}

export default function ARViewer({ modelUrl = '/models/chair.glb', placeholderImage }: ARViewerProps) {
  const { status, enterVR, enterAR } = useWebXR();
  const { isARSupported, startAR } = useARViewer(modelUrl);
  const [showARPrompt, setShowARPrompt] = useState(false);

  return (
    <div className="relative bg-black/40 rounded-xl overflow-hidden">
      <div className="aspect-square max-w-md mx-auto relative">
        {placeholderImage ? (
          <img src={placeholderImage} alt="3D Model" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-black/80 to-black/40">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-[#0082D8]/20 flex items-center justify-center">
                <svg className="w-12 h-12 text-[#0082D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-white/60 text-sm">3D Model Preview</p>
            </div>
          </div>
        )}
        
        {!isARSupported && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center p-6">
              <p className="text-white/60 mb-4">AR not supported on this device</p>
              <p className="text-white/40 text-sm">Use Chrome on Android or Safari on iOS</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 flex gap-2 justify-center">
        <button
          onClick={enterVR}
          disabled={!status.vrSupported}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            status.vrSupported 
              ? 'bg-[#0082D8] text-white hover:bg-[#0082D8]/80' 
              : 'bg-white/10 text-white/40 cursor-not-allowed'
          }`}
        >
          {status.vrSupported ? 'Enter VR' : 'VR Not Available'}
        </button>
        <button
          onClick={startAR}
          disabled={!isARSupported}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isARSupported 
              ? 'bg-green-600 text-white hover:bg-green-600/80' 
              : 'bg-white/10 text-white/40 cursor-not-allowed'
          }`}
        >
          {isARSupported ? 'View in AR' : 'AR Not Available'}
        </button>
      </div>

      <div className="px-4 pb-4 text-center">
        <div className="flex justify-center gap-4 text-xs text-white/40">
          <span>VR: {status.vrSupported ? '✓' : '✗'}</span>
          <span>AR: {status.arSupported ? '✓' : '✗'}</span>
        </div>
      </div>
    </div>
  );
}