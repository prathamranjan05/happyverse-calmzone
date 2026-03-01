import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import Portal from "./portal";
import "./portalbackground.css";

export default function PortalBackground() {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices for performance optimization
  useEffect(() => {
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }, []);

  return (
    <div className="portal-background">
      <Canvas 
        camera={{ position: [0, 0, 12], fov: 60 }}
        gl={{ 
          antialias: true,
          powerPreference: "high-performance",
          alpha: false,
          stencil: false, // Disable stencil buffer for performance
          depth: true
        }}
        style={{ background: 'black' }} // Fallback color while loading
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          
          {/* Optimize stars based on device */}
          <Stars 
            radius={100} 
            depth={50} 
            count={isMobile ? 2000 : 5000} // Fewer stars on mobile
            factor={4} 
            saturation={0} 
            fade 
            speed={0.5} // Slower star movement
          />
          
          <Portal />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            enableRotate={false} // Disable rotation to keep portal centered
            autoRotate={false} // Disable auto-rotate since portal handles its own animation
          />
        </Suspense>
      </Canvas>
    </div>
  );
}