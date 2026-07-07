"use client";
import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows, Float, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// ── Preload ───────────────────────────────────────────────────────────────────
useGLTF.preload('/nurse.glb');

// ── The 3D model ──────────────────────────────────────────────────────────────
function Model({ hovered }: { hovered: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const { scene } = useGLTF('/nurse.glb');

  // Clone scene so it's not shared between renders
  const cloned = scene.clone(true);

  // Smooth materials — enhance quality
  cloned.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.castShadow    = true;
      mesh.receiveShadow = true;
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(m => {
          if (m instanceof THREE.MeshStandardMaterial) {
            m.roughness  = 0.45;
            m.metalness  = 0.05;
            m.envMapIntensity = 1.2;
          }
        });
      } else if (mesh.material instanceof THREE.MeshStandardMaterial) {
        mesh.material.roughness  = 0.45;
        mesh.material.metalness  = 0.05;
        mesh.material.envMapIntensity = 1.2;
      }
    }
  });

  // Gentle auto-rotation + slight bob
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t * 0.35) * 0.25;       // gentle sway
    group.current.position.y = Math.sin(t * 0.8) * 0.04 - 0.1;  // soft float
    // Scale up slightly on hover
    const target = hovered ? 1.04 : 1.0;
    group.current.scale.lerp(
      new THREE.Vector3(target, target, target),
      0.08
    );
  });

  return (
    <group ref={group} dispose={null}>
      <primitive
        object={cloned}
        scale={2.1}
        position={[0, -1.6, 0]}
        rotation={[0, 0.2, 0]}
      />
    </group>
  );
}

// ── Loading placeholder ───────────────────────────────────────────────────────
function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full border-3 border-white/20 border-t-white animate-spin"
          style={{ borderWidth: '3px' }} />
        <p className="text-white/60 text-xs font-medium tracking-wide">Loading 3D Model...</p>
      </div>
    </Html>
  );
}

// ── Main exported component ───────────────────────────────────────────────────
interface Props {
  className?: string;
  height?: number;
  autoRotate?: boolean;
  interactive?: boolean;
}

export default function NurseModel({
  className = '',
  height = 520,
  autoRotate = false,
  interactive = true,
}: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ height, cursor: hovered ? 'grab' : 'default' }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow behind the model */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
        <div className="w-72 h-72 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, #2563EB, #14B8A6)' }} />
      </div>

      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.5, 5], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[3, 8, 4]}
          intensity={1.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-near={0.5}
          shadow-camera-far={30}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
        />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#14B8A6" />
        <pointLight position={[0, 4, 2]} intensity={0.6} color="#2563EB" />
        <hemisphereLight
          args={['#EFF6FF', '#F0FDFB', 0.5]}
        />

        {/* Environment for reflections */}
        <Environment preset="city" />

        {/* Ground shadow */}
        <ContactShadows
          position={[0, -1.65, 0]}
          opacity={0.35}
          scale={6}
          blur={2.5}
          far={4}
          color="#1E3A5F"
        />

        {/* Float wrapping for extra depth */}
        <Float
          speed={1.2}
          rotationIntensity={0.08}
          floatIntensity={0.3}
          floatingRange={[-0.05, 0.05]}
        >
          <Suspense fallback={<Loader />}>
            <Model hovered={hovered} />
          </Suspense>
        </Float>

        {/* Orbit controls — only allow horizontal drag */}
        {interactive && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 2.4}
            maxPolarAngle={Math.PI / 1.8}
            autoRotate={autoRotate}
            autoRotateSpeed={1.2}
            dampingFactor={0.08}
            enableDamping
          />
        )}
      </Canvas>

      {/* Drag hint */}
      {interactive && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 0 : 0.5 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-medium pointer-events-none whitespace-nowrap"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          ↔ Drag to rotate
        </motion.p>
      )}
    </motion.div>
  );
}
