import { useMemo } from 'react';
import { Vector2 } from 'three';

interface ShikharaTowerProps {
  height?: number;
  baseRadius?: number;
  color?: string;
  /** Finial / kalasha glow color */
  accent?: string;
  position?: [number, number, number];
  /** Cross-section facets: 4 = square temple tower, 8 = rounded */
  facets?: number;
  emissiveFinial?: boolean;
}

/**
 * A stylized Nagara-style temple spire (shikhara): a curved tapering tower with
 * an amalaka disc and a glowing kalasha finial. Used for Somnath, Dwarka, and
 * as a motif elsewhere.
 */
export default function ShikharaTower({
  height = 8,
  baseRadius = 1.6,
  color = '#d9b673',
  accent = '#ffcf6b',
  position = [0, 0, 0],
  facets = 4,
  emissiveFinial = true,
}: ShikharaTowerProps) {
  const points = useMemo(() => {
    const N = 24;
    const pts: Vector2[] = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      // Concave shikhara curve: wide foot, gentle inward sweep to a point.
      const r = baseRadius * Math.pow(1 - t, 1.45) + 0.04;
      pts.push(new Vector2(Math.max(r, 0.03), t * height));
    }
    return pts;
  }, [height, baseRadius]);

  const rot = facets === 4 ? Math.PI / 4 : 0;

  return (
    <group position={position}>
      {/* Plinth */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[baseRadius * 2.4, 0.8, baseRadius * 2.4]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>

      {/* Curved spire */}
      <mesh position={[0, 0.8, 0]} rotation={[0, rot, 0]} castShadow>
        <latheGeometry args={[points, facets]} />
        <meshStandardMaterial color={color} roughness={0.7} flatShading />
      </mesh>

      {/* Amalaka (ribbed disc near the top) */}
      <mesh position={[0, height * 0.86 + 0.8, 0]}>
        <torusGeometry args={[baseRadius * 0.26, baseRadius * 0.12, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>

      {/* Kalasha finial */}
      <mesh position={[0, height + 0.95, 0]}>
        <sphereGeometry args={[baseRadius * 0.14, 12, 12]} />
        <meshStandardMaterial
          color={accent}
          emissive={emissiveFinial ? accent : '#000000'}
          emissiveIntensity={emissiveFinial ? 1.4 : 0}
          roughness={0.4}
          metalness={0.5}
        />
      </mesh>
    </group>
  );
}
