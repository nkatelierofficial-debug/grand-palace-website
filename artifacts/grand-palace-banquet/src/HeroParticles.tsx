import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function GoldField() {
  const ref = useRef<THREE.Points>(null);
  const pointer = useRef(new THREE.Vector2());
  const positions = useMemo(() => {
    const arr = new Float32Array(420 * 3);
    for (let i = 0; i < 420; i++) {
      arr[i * 3] = (Math.random() - .5) * 18;
      arr[i * 3 + 1] = (Math.random() - .5) * 10;
      arr[i * 3 + 2] = (Math.random() - .5) * 5;
    }
    return arr;
  }, []);
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth - .5) * .35;
      pointer.current.y = -(event.clientY / window.innerHeight - .5) * .25;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y += (pointer.current.x - ref.current.rotation.y) * .018;
    ref.current.rotation.x += (pointer.current.y - ref.current.rotation.x) * .018;
    const material = ref.current.material as THREE.PointsMaterial;
    material.size = .025 + Math.sin(state.clock.elapsedTime * .7) * .002;
  });
  return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial color="#D4AF37" size={.025} transparent opacity={.64} sizeAttenuation depthWrite={false} /></points>;
}

function canUseWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2');
    if (!context) return false;
    context.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

const webglSupported = canUseWebGL();

export default function HeroParticles() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  if (!webglSupported) {
    return <div className="particle-canvas particle-fallback" aria-hidden="true" />;
  }
  return <div className="particle-canvas" aria-hidden="true"><Canvas dpr={[1, 1.25]} camera={{ position: [0, 0, 7], fov: 55 }}><GoldField /></Canvas></div>;
}
