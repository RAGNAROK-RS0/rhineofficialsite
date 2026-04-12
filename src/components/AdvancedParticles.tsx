import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { vertexShaders, fragmentShaders, createUniforms, createShaderMaterial } from '../lib/shaders';
import { useDeviceCapabilities, useAdaptiveQuality } from '../hooks/useDeviceCapabilities';

interface AdvancedParticlesProps {
  count?: number;
  color?: string;
  style?: 'particles' | 'wave' | 'grid';
  autoRotate?: boolean;
}

export default function AdvancedParticles({
  count = 2000,
  color = '#0082D8',
  style = 'particles',
  autoRotate = true,
}: AdvancedParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const frameIdRef = useRef<number>(0);
  
  const { gpuTier, isLowEnd, isMobile } = useDeviceCapabilities();
  const { getParticleCount, shouldUsePostProcessing } = useAdaptiveQuality();
  const [isSupported, setIsSupported] = useState(false);

  const actualCount = getParticleCount(count);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 30;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: gpuTier !== 'low',
      powerPreference: isLowEnd ? 'low-power' : 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(actualCount * 3);
    const scales = new Float32Array(actualCount);
    const randoms = new Float32Array(actualCount * 3);

    for (let i = 0; i < actualCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      
      scales[i] = Math.random();
      randoms[i * 3] = Math.random();
      randoms[i * 3 + 1] = Math.random();
      randoms[i * 3 + 2] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3));

    const colorVec = new THREE.Color(color);
    const uniforms = createUniforms({
      uTime: 0,
      uColor: colorVec,
      uPixelRatio: Math.min(window.devicePixelRatio, 2),
      uSize: gpuTier === 'low' ? 20 : gpuTier === 'high' ? 40 : 30,
    });

    const material = createShaderMaterial(
      vertexShaders.particles,
      fragmentShaders.particles,
      uniforms
    );
    materialRef.current = material;

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const targetRotation = { x: 0, y: 0 };

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value += 0.01;
      }

      if (autoRotate) {
        targetRotation.y += 0.001;
        points.rotation.y = targetRotation.y;
        points.rotation.x = Math.sin(targetRotation.y * 0.5) * 0.1;
      }

      renderer.render(scene, camera);
    };

    setIsSupported(true);
    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (materialRef.current) {
        materialRef.current.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener('resize', handleResize);
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [actualCount, color, gpuTier, isLowEnd, isMobile, autoRotate]);

  if (!isSupported) {
    return null;
  }

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

export function useShaderAnimation(material: THREE.ShaderMaterial | null) {
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!material) return;

    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      if (material.uniforms?.uTime) {
        material.uniforms.uTime.value = elapsed;
      }
      requestAnimationFrame(animate);
    };

    const frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [material]);

  return {
    elapsed: (Date.now() - startTimeRef.current) / 1000,
  };
}