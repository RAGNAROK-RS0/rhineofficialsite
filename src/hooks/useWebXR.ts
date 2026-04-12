import { useState, useCallback, useEffect } from 'react';

export interface WebXRStatus {
  supported: boolean;
  vrSupported: boolean;
  arSupported: boolean;
  immersiveVR: boolean;
  immersiveAR: boolean;
}

export function useWebXR() {
  const [status, setStatus] = useState<WebXRStatus>({
    supported: false,
    vrSupported: false,
    arSupported: false,
    immersiveVR: false,
    immersiveAR: false,
  });
  const [isInSession, setIsInSession] = useState(false);

  useEffect(() => {
    const checkSupport = async () => {
      if (!navigator.xr) {
        setStatus(s => ({ ...s, supported: false }));
        return;
      }

      const vrSupported = await navigator.xr.isSessionSupported('immersive-vr').catch(() => false);
      const arSupported = await navigator.xr.isSessionSupported('immersive-ar').catch(() => false);

      setStatus({
        supported: true,
        vrSupported,
        arSupported,
        immersiveVR: vrSupported,
        immersiveAR: arSupported,
      });
    };

    checkSupport();
  }, []);

  const enterVR = useCallback(async () => {
    if (!status.immersiveVR) return false;
    try {
      const session = await navigator.xr!.requestSession('immersive-vr', {
        requiredFeatures: ['local-floor'],
      });
      setIsInSession(true);
      session.addEventListener('end', () => setIsInSession(false));
      return true;
    } catch {
      return false;
    }
  }, [status.immersiveVR]);

  const enterAR = useCallback(async () => {
    if (!status.immersiveAR) return false;
    try {
      const session = await navigator.xr!.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test', 'dom-overlay'],
      });
      setIsInSession(true);
      session.addEventListener('end', () => setIsInSession(false));
      return true;
    } catch {
      return false;
    }
  }, [status.immersiveAR]);

  return { status, isInSession, enterVR, enterAR };
}

export function useARViewer(modelUrl: string) {
  const [isARSupported, setIsARSupported] = useState(false);
  const [isARActive, setIsARActive] = useState(false);

  useEffect(() => {
    const checkAR = async () => {
      if (!navigator.xr) {
        setIsARSupported(false);
        return;
      }
      const supported = await navigator.xr.isSessionSupported('immersive-ar').catch(() => false);
      setIsARSupported(supported);
    };
    checkAR();
  }, []);

  const startAR = useCallback(async () => {
    if (!isARSupported || !navigator.xr) return false;
    try {
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test', 'dom-overlay'],
        domOverlay: { root: document.body },
      });
      setIsARActive(true);
      session.addEventListener('end', () => setIsARActive(false));
      return true;
    } catch {
      return false;
    }
  }, [isARSupported]);

  return { isARSupported, isARActive, startAR, modelUrl };
}

export function useModelViewer(modelUrl: string) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoaded(false);
    setError(null);
  }, [modelUrl]);

  const handleLoad = useCallback(() => setLoaded(true), []);
  const handleError = useCallback((e: Error) => setError(e.message), []);

  return { loaded, error, handleLoad, handleError };
}