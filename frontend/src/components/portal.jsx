import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Portal() {
  const vortexRef = useRef();

  // 1. Create a "Soft Smoke" texture
  const cloudTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');      
    gradient.addColorStop(0.3, 'rgba(0, 100, 255, 0.4)');   
    gradient.addColorStop(0.7, 'rgba(0, 20, 100, 0.05)');    
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');           
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
  }, []);

  // 2. Create initial positions and store angles for animation
  const particleCount = 4000;
  const { positions, angles, radii } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const ang = new Float32Array(particleCount);
    const rad = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const angle = (i / particleCount) * Math.PI * 40;
      const radius = 1 + Math.pow(Math.random(), 2) * 12;
      
      // Store initial angles and radii for animation
      ang[i] = angle;
      rad[i] = radius;
      
      // Set initial positions
      pos[i3] = Math.cos(angle) * radius;
      pos[i3 + 1] = Math.sin(angle) * radius;
      pos[i3 + 2] = (Math.random() - 0.5) * 15;
    }
    
    return { positions: pos, angles: ang, radii: rad };
  }, []);

  useFrame((state) => {
    if (!vortexRef.current) return;
    
    const geometry = vortexRef.current.geometry;
    const positionAttribute = geometry.attributes.position;
    const positions = positionAttribute.array;
    
    // Update each particle's position to make it revolve around the center
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Increment the angle for this particle (each particle moves at the same speed)
      const newAngle = angles[i] + state.clock.getElapsedTime() * 0.2;
      
      // Calculate new position using the stored radius and new angle
      positions[i3] = Math.cos(newAngle) * radii[i];
      positions[i3 + 1] = Math.sin(newAngle) * radii[i];
      // Z position stays the same (no change)
    }
    
    // Mark the attribute as needing update
    positionAttribute.needsUpdate = true;
  });

  return (
    <points ref={vortexRef} position={[0, 0, -5]}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={particleCount} 
          array={positions} 
          itemSize={3} 
        />
      </bufferGeometry>
      <pointsMaterial
        size={2.5}
        map={cloudTexture}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        color="#4488ff"
      />
    </points>
  );
}