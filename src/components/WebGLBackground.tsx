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
          color="#B6FF3B" 
          wireframe={true} 
          transparent 
          opacity={0.15} 
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

export default function WebGLBackground() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, background: 'radial-gradient(circle at center, #141414 0%, #070A0F 100%)' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <fog attach="fog" args={['#070A0F', 3, 15]} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#B6FF3B" />
        <AbstractShape />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
