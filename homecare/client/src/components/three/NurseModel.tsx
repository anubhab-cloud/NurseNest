import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, ContactShadows, Float, Html, Stage } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// ─── Inner scene (must live inside <Canvas>) ──────────────────────────────────
function NurseScene({ hovered }: { hovered: boolean }) {
  const ref = useRef<THREE.Group>(null!);
  const { scene } = useGLTF('/nurse.glb') as { scene: THREE.Group };

  // Enhance materials once on mount
  useEffect(() => {
    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = mesh.receiveShadow = true;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m) => {
        if (m instanceof THREE.MeshStandardMaterial) {
          m.roughness       = 0.55;
          m.metalness       = 0.02;
          m.envMapIntensity = 1.0;
          m.needsUpdate     = true;
        }
      });
    });
  }, [scene]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    // Gentle sway
    ref.current.rotation.y = Math.sin(t * 0.4) * 0.18;
    // Smooth scale on hover
    const target = hovered ? 1.04 : 1.0;
    const curr = ref.current.scale.x;
    const next = curr + (target - curr) * 0.08;
    ref.current.scale.setScalar(next);
  });

  return (
    <group ref={ref}>
      <primitive object={scene} scale={2.0} position={[0, -1.55, 0]} />
    </group>
  );
}

// ─── Loading spinner inside canvas ───────────────────────────────────────────
function Loader() {
  return (
    <Html center>
      <div style={{ textAlign: 'center', minWidth: 120 }}>
        <div style={{
          width: 36, height: 36, margin: '0 auto 8px',
          borderRadius: '50%',
          border: '3px solid rgba(37,99,235,0.15)',
          borderTopColor: '#2563EB',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{
          fontSize: 11, color: '#94A3B8',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '0.04em',
        }}>
          Loading model…
        </p>
      </div>
    </Html>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────
export default function NurseModel({
  className = '',
  height = 500,
  interactive = true,
}: {
  className?: string;
  height?: number;
  interactive?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Preload after mount — never at module level (causes SSR/hydration crash)
  useEffect(() => {
    useGLTF.preload('/nurse.glb');
    setMounted(true);
  }, []);

  if (!mounted) return (
    <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        border: '3px solid #E2E8F0', borderTopColor: '#2563EB',
        animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  );

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ height, cursor: interactive ? (hovered ? 'grabbing' : 'grab') : 'default' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', bottom: '10%', left: '50%',
        transform: 'translateX(-50%)',
        width: 240, height: 240, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.5, 5.2], fov: 36 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[4, 8, 5]}
          intensity={1.6}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-3, 3, -3]} intensity={0.4} color="#14B8A6" />
        <pointLight position={[0, 4, 3]} intensity={0.5} color="#2563EB" />
        <pointLight position={[0, -1, 1]} intensity={0.2} color="#EFF6FF" />

        {/* Ground shadow */}
        <ContactShadows
          position={[0, -1.6, 0]}
          opacity={0.25}
          scale={5}
          blur={2}
          far={3}
          color="#1e3a5f"
        />

        {/* Float + model */}
        <Float speed={1.0} rotationIntensity={0.04} floatIntensity={0.18}>
          <Suspense fallback={<Loader />}>
            <NurseScene hovered={hovered} />
          </Suspense>
        </Float>

        {/* Orbit controls — horizontal rotation only */}
        {interactive && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 2.6}
            maxPolarAngle={Math.PI / 1.85}
            dampingFactor={0.07}
            enableDamping
          />
        )}
      </Canvas>

      {/* Drag hint */}
      {interactive && (
        <p style={{
          position: 'absolute', bottom: 8, left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 11, color: 'rgba(100,116,139,0.55)',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '0.04em', whiteSpace: 'nowrap',
          pointerEvents: 'none',
          opacity: hovered ? 0 : 1,
          transition: 'opacity 0.3s',
        }}>
          ↔ Drag to rotate
        </p>
      )}
    </motion.div>
  );
}
