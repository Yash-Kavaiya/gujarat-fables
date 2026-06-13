import { useMemo } from 'react';
import WaterPlane from './WaterPlane';

interface SteppedTankProps {
  levels?: number;
  outerSize?: number;
  stepWidth?: number;
  stepHeight?: number;
  color?: string;
  position?: [number, number, number];
  /** Render an animated water square at the bottom */
  water?: boolean;
  waterColor?: string;
  waterHighlight?: string;
}

interface Bar {
  args: [number, number, number];
  pos: [number, number, number];
}

/**
 * A concentric stepped tank descending into the ground — an inverted pyramid of
 * square terraces. Models Modhera's Surya Kund and works for any kund/ghat.
 */
export default function SteppedTank({
  levels = 7,
  outerSize = 22,
  stepWidth = 1.1,
  stepHeight = 0.7,
  color = '#b98f4e',
  position = [0, 0, 0],
  water = true,
  waterColor = '#2e5664',
  waterHighlight = '#cfe6e6',
}: SteppedTankProps) {
  const bars = useMemo(() => {
    const out: Bar[] = [];
    for (let i = 0; i < levels; i++) {
      const S = outerSize - i * stepWidth * 2;
      if (S <= stepWidth * 2) break;
      const y = -i * stepHeight - stepHeight / 2;
      const half = S / 2;
      const inset = half - stepWidth / 2;
      const sideLen = S - stepWidth * 2;
      // North & south bars (run along X)
      out.push({ args: [S, stepHeight, stepWidth], pos: [0, y, inset] });
      out.push({ args: [S, stepHeight, stepWidth], pos: [0, y, -inset] });
      // East & west bars (run along Z)
      out.push({ args: [stepWidth, stepHeight, sideLen], pos: [inset, y, 0] });
      out.push({ args: [stepWidth, stepHeight, sideLen], pos: [-inset, y, 0] });
    }
    return out;
  }, [levels, outerSize, stepWidth, stepHeight]);

  const bottomY = -levels * stepHeight + stepHeight * 0.3;
  const innerSize = Math.max(outerSize - levels * stepWidth * 2, stepWidth * 2);

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
        <boxGeometry args={[innerSize + 0.4, 0.2, innerSize + 0.4]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>

      {water && (
        <WaterPlane
          size={innerSize}
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
