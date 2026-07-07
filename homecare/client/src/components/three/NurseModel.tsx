import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows, Float, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// ── Preload model immediately ─────────────────────────────────────────────────
useGLTF.preload('/nurse.glb');

// ── Inner model component (must be inside Canvas) ─────────────────────────────
function Model({ hovered }: { hovered: boolean }) {
  const ref = useRef<THREE.Group>(null!);
  const { scene } = useGLTF('/nurse.glb') as any;

  // Enhance materials for quality
  scene.traverse((child: any) => {
    if (child.isMesh) {
      child.castShadow    = true;
      child.receiveShadow = true;
      if (child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m: any) => {
          if (m.isMeshStandardMaterial) {
            m.roughness         = 0.5;
            m.metalness         = 0.05;
            m.envMapIntensity   = 1.4;
          }
        });
      }
    }
  });

  // Animate on every frame
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    // Gentle Y-axis sway
    ref.current.rotation.y = Math.sin(t * 0.4) * 0.22;
    // Smooth scale on hover
    const target = hovered ? 1.05 : 1.0;
    ref.current.scale.x += (target - ref.current.scale.x) * 0.07;
    ref.current.scale.y += (target - ref.current.scale.y) * 0.07;
    ref.current.scale.z += (target - ref.current.scale.z) * 0.07;
  });

  return (
    <group ref={ref} dispose={null}>
      <primitive
        object={scene}
        scale={2.0}
        position={[0, -1.55, 0]}
        rotation={[0, 0.15, 0]}
      />
    </group>
  );
}

// ── Loading spinner inside canvas ─────────────────────────────────────────────
function Loader() {
  return (
    <Html center>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          border: '3px solid rgba(255,255,255,0.15)',
          borderTopColor: '#2563EB',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontFamily: 'Inter,sans-serif', letterSpacing: '0.05em' }}>
          Loading model…
        </p>
      </div>
    </Html>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  className?: string;
  height?: number;
  interactive?: boolean;
}

// ── Main exported component ───────────────────────────────────────────────────
export default function NurseModel({ className = '', height = 500, interactive = true }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className={`relative select-none ${className}`}
      style={{ height, cursor: interactive ? (hovered ? 'grabbing' : 'grab') : 'default' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Ambient glow behind model */}
      <div style={{
        position: 'absolute', bottom: '10%', left: '50%',
        transform: 'translateX(-50%)',
        width: 280, height: 280, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.6, 5.2], fov: 36 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent', zIndex: 1 }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.55} />
        <directionalLight
          position={[4, 8, 5]}
          intensity={1.6}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-3, 3, -2]} intensity={0.35} color="#14B8A6" />
        <pointLight position={[0, 3, 3]} intensity={0.5} color="#2563EB" />
        <hemisphereLight args={['#e0f2fe', '#f0fdf9', 0.4]} />

        {/* HDR environment for reflections */}
        <Environment preset="city" />

        {/* Contact shadow on ground */}
        <ContactShadows
          position={[0, -1.6, 0]}
          opacity={0.3}
          scale={5}
          blur={2}
          far={3.5}
          color="#1e3a5f"
        />

        {/* Float for organic motion */}
        <Float speed={1.0} rotationIntensity={0.06} floatIntensity={0.25}>
          <Suspense fallback={<Loader />}>
            <Model hovered={hovered} />
          </Suspense>
        </Float>

        {/* Drag controls */}
        {interactive && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 2.6}
            maxPolarAngle={Math.PI / 1.9}
            dampingFactor={0.07}
            enableDamping
          />
        )}
      </Canvas>

      {/* Hint text */}
      {interactive && (
        <p style={{
          position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
          fontSize: '11px', color: 'rgba(100,116,139,0.7)', fontFamily: 'Inter,sans-serif',
          letterSpacing: '0.04em', whiteSpace: 'nowrap', pointerEvents: 'none',
          opacity: hovered ? 0 : 1, transition: 'opacity 0.3s',
        }}>
          ↔ Drag to rotate
        </p>
      )}
    </motion.div>
  );
}
