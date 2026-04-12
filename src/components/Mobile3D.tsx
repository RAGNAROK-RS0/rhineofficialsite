import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

interface Mobile3DProps {
  children?: React.ReactNode;
  particleCount?: number;
  color?: string;
}

export default function Mobile3D({ 
  children, 
  particleCount = 1000, 
  color = '#0082D8' 
}: Mobile3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile, isLowEnd, gpuTier } = useDeviceCapabilities();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isMobile && !isLowEnd) {
      setIsReady(true);
      return;
    }

    if (!containerRef.current) return;

    const container = containerRef.current;
    const reducedCount = Math.floor(particleCount * (gpuTier === 'low' ? 0.2 : 0.4));
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: false,
      powerPreference: 'low-power'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(reducedCount * 3);

    for (let i = 0; i < reducedCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: 1.5,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      particles.rotation.y += 0.001;
      renderer.render(scene, camera);
    };

    animate();

    setIsReady(true);

    return () => {
      cancelAnimationFrame(animationId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [isMobile, isLowEnd, gpuTier, particleCount, color]);

  if (!isReady) return null;

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      {children}
    </div>
  );
}

export function useMobileOptimizedGPU() {
  const { isMobile, isLowEnd, gpuTier } = useDeviceCapabilities();

  return {
    shouldReduceParticles: isMobile || isLowEnd,
    shouldDisablePostProcessing: isMobile || isLowEnd,
    shouldUseSimpleShaders: isMobile || gpuTier === 'low',
    recommendedParticleCount: isMobile ? 500 : isLowEnd ? 300 : 2000,
    recommendedFPS: isMobile ? 30 : 60,
  };
}