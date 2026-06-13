import { useMemo } from 'react';
import { Instances, Instance } from '@react-three/drei';

interface PillarsProps {
  rows: number;
  cols: number;
  spacing?: number;
  height?: number;
  radius?: number;
  color?: string;
  /** Leave the central area open (e.g. a courtyard) by skipping inner pillars */
  hollow?: boolean;
  y?: number;
}

/**
 * An instanced colonnade — a grid of carved-looking pillars with a base and a
 * capital. Used for temple halls (Modhera, Somnath).
 */
export default function Pillars({
  rows,
  cols,
  spacing = 2.2,
  height = 4,
  radius = 0.28,
  color = '#c79a55',
  hollow = false,
  y = 0,
}: PillarsProps) {
  const positions = useMemo(() => {
    const out: [number, number, number][] = [];
    const ox = ((cols - 1) * spacing) / 2;
    const oz = ((rows - 1) * spacing) / 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (hollow && r > 0 && r < rows - 1 && c > 0 && c < cols - 1) continue;
        out.push([c * spacing - ox, y, r * spacing - oz]);
      }
    }
    return out;
  }, [rows, cols, spacing, hollow, y]);

  return (
    <group>
      {/* Shafts */}
      <Instances range={positions.length} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius * 1.15, height, 10]} />
        <meshStandardMaterial color={color} roughness={0.85} metalness={0.05} />
        {positions.map((p, i) => (
          <Instance key={i} position={[p[0], p[1] + height / 2, p[2]]} />
        ))}
      </Instances>

      {/* Bases */}
      <Instances range={positions.length}>
        <boxGeometry args={[radius * 2.8, 0.4, radius * 2.8]} />
        <meshStandardMaterial color={color} roughness={0.9} />
        {positions.map((p, i) => (
          <Instance key={i} position={[p[0], p[1] + 0.2, p[2]]} />
        ))}
      </Instances>

      {/* Capitals */}
      <Instances range={positions.length}>
        <boxGeometry args={[radius * 3, 0.5, radius * 3]} />
        <meshStandardMaterial color={color} roughness={0.8} />
        {positions.map((p, i) => (
          <Instance key={i} position={[p[0], p[1] + height + 0.1, p[2]]} />
        ))}
      </Instances>
    </group>
  );
}
