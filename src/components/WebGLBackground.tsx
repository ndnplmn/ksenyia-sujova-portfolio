'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { Environment, Float } from '@react-three/drei';

function AbstractShape() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} scale={2}>
        <icosahedronGeometry args={[1.5, 2]} />
        <meshStandardMaterial
          color="#96C0D4"
          wireframe={true}
          transparent
          opacity={0.2}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

export default function WebGLBackground() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, background: 'radial-gradient(circle at center, #ffffff 0%, #f4f4f9 100%)' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <fog attach="fog" args={['#f4f4f9', 3, 15]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#96C0D4" />
        <AbstractShape />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
