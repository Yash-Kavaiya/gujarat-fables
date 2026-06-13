import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, BufferAttribute, Points } from 'three';

interface ParticlesProps {
  count?: number;
  /** Bounding box the particles drift within */
  area?: [number, number, number];
  center?: [number, number, number];
  color?: string;
  size?: number;
  /** Vertical drift speed; negative falls (petals), positive rises (embers) */
  speed?: number;
  additive?: boolean;
}

/**
 * Drifting point particles — floating lamps/embers (festival, aarti) or falling
 * petals (Mani Mandir). Cheap GPU points with gentle per-frame motion.
 */
export default function Particles({
  count = 220,
  area = [40, 18, 40],
  center = [0, 9, 0],
  color = '#ffcf6b',
  size = 0.5,
  speed = 0.5,
  additive = true,
}: ParticlesProps) {
  const ref = useRef<Points>(null);

  const { positions, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = center[0] + (Math.random() - 0.5) * area[0];
      positions[i * 3 + 1] = center[1] + (Math.random() - 0.5) * area[1];
      positions[i * 3 + 2] = center[2] + (Math.random() - 0.5) * area[2];
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, phases };
  }, [count, area, center]);

  useFrame((state, delta) => {
    const pts = ref.current;
    if (!pts) return;
    const attr = pts.geometry.getAttribute('position') as BufferAttribute;
    const arr = attr.array as Float32Array;
    const t = state.clock.elapsedTime;
    const lowY = center[1] - area[1] / 2;
    const highY = center[1] + area[1] / 2;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speed * delta;
      // gentle horizontal sway
      arr[i * 3] += Math.sin(t * 0.5 + phases[i]) * delta * 0.15;
      if (speed >= 0 && arr[i * 3 + 1] > highY) arr[i * 3 + 1] = lowY;
      if (speed < 0 && arr[i * 3 + 1] < lowY) arr[i * 3 + 1] = highY;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={additive ? AdditiveBlending : undefined}
      />
    </points>
  );
}
