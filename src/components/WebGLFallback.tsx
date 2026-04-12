import { useEffect, useState } from 'react';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

interface WebGLFallbackProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function WebGLFallback({ children, fallback }: WebGLFallbackProps) {
  const { hasWebGL, hasWebGPU, isLowEnd } = useDeviceCapabilities();
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (!hasWebGL && !hasWebGPU) {
      setShowFallback(true);
    } else if (isLowEnd) {
      const timer = setTimeout(() => setShowFallback(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [hasWebGL, hasWebGPU, isLowEnd]);

  if (showFallback) {
    return fallback || <DefaultFallback />;
  }

  return <>{children}</>;
}

function DefaultFallback() {
  return (
    <div 
      className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-900 via-black to-gray-800"
      aria-hidden="true"
    />
  );
}

export function WebGLErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleWebGLError = (event: ErrorEvent) => {
      if (event.message?.includes('WebGL') || event.message?.includes('GPU')) {
        setHasError(true);
      }
    };

    window.addEventListener('error', handleWebGLError);
    return () => window.removeEventListener('error', handleWebGLError);
  }, []);

  if (hasError) {
    return <DefaultFallback />;
  }

  return <>{children}</>;
}