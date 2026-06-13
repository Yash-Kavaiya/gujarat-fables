import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import SceneCanvas from './three/SceneCanvas';
import Ground from './three/Ground';
import ShikharaTower from './three/primitives/ShikharaTower';
import Particles from './three/primitives/Particles';
import { useUIStore } from '../store/useUIStore';

const HERO_PALETTE = {
  sky: '#f4cb86',
  ground: '#e7ddc6',
  accent: '#ff8a3d',
  fog: '#ecc98f',
};

function DriftingWorld() {
  const group = useRef<Group>(null);
  const reduced = useUIStore((s) => s.reducedMotion);

  useFrame((state) => {
    if (!group.current || reduced) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.06) * 0.2;
    group.current.position.y = Math.sin(t * 0.3) * 0.15;
  });

  return (
    <group ref={group}>
      {/* low sun on the horizon */}
      <mesh position={[14, 5, -60]}>
        <sphereGeometry args={[6, 24, 24]} />
        <meshBasicMaterial color="#ffd27a" />
      </mesh>
      <pointLight position={[14, 8, -40]} intensity={2.2} color="#ffb259" distance={200} />
      <directionalLight position={[10, 12, 6]} intensity={1.1} color="#ffe6bf" />

      {/* salt-flat ground */}
      <Ground color="#efe7d2" size={400} roughness={0.95} />

      {/* a little skyline of temple silhouettes */}
      <ShikharaTower position={[-10, 0, -22]} height={9} baseRadius={1.8} color="#caa05a" />
      <ShikharaTower position={[-4, 0, -30]} height={6.5} baseRadius={1.3} color="#b98f4e" />
      <ShikharaTower position={[6, 0, -26]} height={11} baseRadius={2.1} color="#d9b673" />
      <ShikharaTower position={[16, 0, -34]} height={7.5} baseRadius={1.5} color="#caa05a" />

      <Particles
        count={160}
        area={[120, 30, 80]}
        center={[0, 12, -20]}
        color="#ffce86"
        size={0.6}
        speed={0.25}
      />
    </group>
  );
}

function CameraSway() {
  const reduced = useUIStore((s) => s.reducedMotion);
  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(t * 0.08) * 3;
    state.camera.position.y = 5 + Math.sin(t * 0.12) * 0.6;
    state.camera.lookAt(0, 4, -28);
  });
  return null;
}

export default function HeroScene() {
  return (
    <SceneCanvas
      palette={HERO_PALETTE}
      cameraPosition={[0, 5, 18]}
      fov={55}
      fog={[20, 160]}
      controls={false}
      bloomIntensity={0.9}
    >
      <DriftingWorld />
      <CameraSway />
    </SceneCanvas>
  );
}
