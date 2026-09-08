import { useMemo } from 'react';
import WaterPlane from './WaterPlane';

interface SteppedTankProps {
  levels?: number;
  /** Outer size along X. */
  outerSize?: number;
  /** Outer size along Z (defaults to `outerSize` for a square tank). */
  outerDepth?: number;
  stepWidth?: number;
  stepHeight?: number;
  color?: string;
  position?: [number, number, number];
  /** Render an animated water surface at the bottom */
  water?: boolean;
  waterColor?: string;
  waterHighlight?: string;
}

interface Bar {
  args: [number, number, number];
  pos: [number, number, number];
}

/**
 * A concentric stepped tank descending into the ground — an inverted pyramid
 * of rectangular terraces. Models Modhera's Surya Kund and works for any
 * kund/ghat.
 */
export default function SteppedTank({
  levels = 7,
  outerSize = 22,
  outerDepth,
  stepWidth = 1.1,
  stepHeight = 0.7,
  color = '#b98f4e',
  position = [0, 0, 0],
  water = true,
  waterColor = '#2e5664',
  waterHighlight = '#cfe6e6',
}: SteppedTankProps) {
  const D0 = outerDepth ?? outerSize;

  const bars = useMemo(() => {
    const out: Bar[] = [];
    for (let i = 0; i < levels; i++) {
      const W = outerSize - i * stepWidth * 2;
      const D = D0 - i * stepWidth * 2;
      if (W <= stepWidth * 2 || D <= stepWidth * 2) break;
      const y = -i * stepHeight - stepHeight / 2;
      const halfW = W / 2 - stepWidth / 2;
      const halfD = D / 2 - stepWidth / 2;
      // North & south rims (run along X)
      out.push({ args: [W, stepHeight, stepWidth], pos: [0, y, halfD] });
      out.push({ args: [W, stepHeight, stepWidth], pos: [0, y, -halfD] });
      // East & west rims (run along Z, shortened to avoid corner overlap)
      out.push({ args: [stepWidth, stepHeight, D - stepWidth * 2], pos: [halfW, y, 0] });
      out.push({ args: [stepWidth, stepHeight, D - stepWidth * 2], pos: [-halfW, y, 0] });
    }
    return out;
  }, [levels, outerSize, D0, stepWidth, stepHeight]);

  const bottomY = -levels * stepHeight + stepHeight * 0.3;
  const innerW = Math.max(outerSize - levels * stepWidth * 2, stepWidth * 2);
  const innerD = Math.max(D0 - levels * stepWidth * 2, stepWidth * 2);

  return (
    <group position={position}>
      {bars.map((b, i) => (
        <mesh key={i} position={b.pos} castShadow receiveShadow>
          <boxGeometry args={b.args} />
          <meshStandardMaterial
            color={color}
            roughness={0.9}
            // subtle striping so the terraces read clearly
            emissive={i % 8 < 4 ? '#000000' : '#1a1206'}
            emissiveIntensity={0.15}
          />
        </mesh>
      ))}

      {/* Flat floor at the bottom */}
      <mesh position={[0, bottomY - 0.05, 0]} receiveShadow>
        <boxGeometry args={[innerW + 0.4, 0.2, innerD + 0.4]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>

      {water && (
        <WaterPlane
          size={innerW}
          depth={innerD}
          segments={24}
          color={waterColor}
          highlight={waterHighlight}
          amplitude={0.05}
          position={[0, bottomY + 0.18, 0]}
        />
      )}
    </group>
  );
}
