import React, { useEffect, useRef, useState } from "react";
import { Root } from "../lib/Root";
import WebGPU from "three/examples/jsm/capabilities/WebGPU.js";

export default function ThreeRoot(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [initError, setInitError] = useState<Error | null>(null);

  useEffect(() => {
    let scene: Root | null = null;

    const setup = async () => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) {
          // If canvas missing, abort gracefully.
          console.warn('ThreeRoot: canvas not found, aborting init');
          return;
        }

        // Ensure the visual stacking and pointer behavior: canvas stays behind UI and does not block pointer
        Object.assign(canvas.style, {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          zIndex: '0',
          pointerEvents: 'none',
        } as Partial<CSSStyleDeclaration>);

        // WebGPU.isAvailable can be asynchronous. Await it and handle fallback.
        let available = false;
        try {
          if (typeof WebGPU?.isAvailable === 'function') {
            // isAvailable may return a Promise<boolean> or boolean
            const res = WebGPU.isAvailable();
            available = (res instanceof Promise) ? await res : res;
          }
        } catch (e) {
          console.warn('ThreeRoot: WebGPU availability check failed', e);
          available = false;
        }

        if (!available) {
          console.warn('ThreeRoot: WebGPU not available. Skipping renderer initialization.');
          return;
        }

        scene = new Root(canvas);
        await scene.init();

        // If the renderer/scene needs to accept pointer interaction in future, toggle pointerEvents here.
        // e.g. canvas.style.pointerEvents = 'auto'; -- intentionally left disabled to preserve UI interactivity.
      } catch (err: any) {
        const error = err instanceof Error ? err : new Error(String(err));
        setInitError(error);
        // eslint-disable-next-line no-console
        console.error('ThreeRoot init failed:', err);
      }
    };

    setup();

    return () => {
      try {
        // Prefer calling the Root.dispose method if available for full cleanup
        if ((Root as any).instance && typeof (Root as any).instance.dispose === 'function') {
          (Root as any).instance.dispose();
        } else if (scene && (scene as any).renderer && typeof (scene as any).renderer.setAnimationLoop === 'function') {
          (scene as any).renderer.setAnimationLoop(null);
        }
      } catch (e) {
        // ignore cleanup errors
      }
    };
  }, []);

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <>
      <canvas ref={canvasRef} id="threecanvas" data-engine="three.js r167 webgpu" />
      {initError && (
        <div role="alert" aria-hidden className="sr-only">
          {initError.message}
        </div>
      )}
    </>
  );
}
