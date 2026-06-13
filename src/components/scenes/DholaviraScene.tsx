import { useMemo } from 'react';
import { Instances, Instance } from '@react-three/drei';
import SceneCanvas from '../three/SceneCanvas';
import Ground from '../three/Ground';
import WaterPlane from '../three/primitives/WaterPlane';
import Hotspot from '../ui/Hotspot';
import { getPlace } from '../../data/places';
import { useSceneStore } from '../../store/useSceneStore';

const place = getPlace('dholavira')!;
const FULL = place.palette;
const DRY = { sky: '#cdb482', ground: '#9c7f50', accent: '#b98f54', fog: '#c4a877' };
const MUD = '#a8895a';

/** A sunken stepped reservoir; shows water only when the city is "alive". */
function Reservoir({
  position,
  size,
  full,
}: {
  position: [number, number, number];
  size: [number, number];
  full: boolean;
}) {
  const [w, d] = size;
  const depth = 3;
  return (
    <group position={position}>
      {/* pit floor */}
      <mesh position={[0, -depth, 0]} receiveShadow>
        <boxGeometry args={[w, 0.4, d]} />
        <meshStandardMaterial color="#6f5836" roughness={1} />
      </mesh>
      {/* stepped sides */}
      {[0, 1, 2].map((s) => (
        <group key={s}>
          <mesh position={[0, -depth + s + 0.5, d / 2 - s * 0.7 - 0.4]}>
            <boxGeometry args={[w - s * 1.4, 1, 0.7]} />
            <meshStandardMaterial color={MUD} roughness={1} />
          </mesh>
          <mesh position={[0, -depth + s + 0.5, -(d / 2 - s * 0.7 - 0.4)]}>
            <boxGeometry args={[w - s * 1.4, 1, 0.7]} />
            <meshStandardMaterial color={MUD} roughness={1} />
          </mesh>
        </group>
      ))}
      {full && (
        <WaterPlane
          size={Math.min(w, d) - 1.5}
          segments={20}
          color="#1f5060"
          highlight="#bfe2e6"
          amplitude={0.04}
          position={[0, -1, 0]}
        />
      )}
    </group>
  );
}

/** Grid of low ruin blocks — the master-planned town. */
function TownBlocks() {
  const blocks = useMemo(() => {
    const out: { pos: [number, number, number]; h: number; s: number }[] = [];
    let seed = 7;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 6; c++) {
        if (rand() < 0.18) continue;
        const h = 0.6 + rand() * 1.8;
        const s = 1 + rand() * 0.6;
        out.push({ pos: [4 + c * 2.4, h / 2, -7 + r * 2.4], h, s });
      }
    }
    return out;
  }, []);
  return (
    <Instances range={blocks.length} castShadow receiveShadow>
      <boxGeometry args={[1.6, 1, 1.6]} />
      <meshStandardMaterial color={MUD} roughness={1} />
      {blocks.map((b, i) => (
        <Instance key={i} position={b.pos} scale={[b.s, b.h, b.s]} />
      ))}
    </Instances>
  );
}

export default function DholaviraScene() {
  const full = useSceneStore((s) => s.reservoirFull);
  const palette = full ? FULL : DRY;

  return (
    <SceneCanvas
      palette={palette}
      cameraPosition={[20, 15, 24]}
      fov={50}
      fog={[44, 240]}
      controls={{ target: [0, 1, 0], minDistance: 12, maxDistance: 80, maxPolarAngle: Math.PI / 2.2 }}
    >
      <directionalLight position={[24, 34, 18]} intensity={1.6} color="#fff0d4" castShadow shadow-mapSize={[1024, 1024]} />
      <Ground color={palette.ground} size={400} />

      {/* Citadel — raised, fortified */}
      <group position={[-13, 0, 0]}>
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[15, 3, 18]} />
          <meshStandardMaterial color="#b1925f" roughness={1} />
        </mesh>
        {/* perimeter wall */}
        {[
          { p: [0, 3.6, 9] as [number, number, number], a: [15, 1.4, 0.8] as [number, number, number] },
          { p: [0, 3.6, -9] as [number, number, number], a: [15, 1.4, 0.8] as [number, number, number] },
          { p: [7.5, 3.6, 0] as [number, number, number], a: [0.8, 1.4, 18] as [number, number, number] },
          { p: [-7.5, 3.6, 0] as [number, number, number], a: [0.8, 1.4, 18] as [number, number, number] },
        ].map((w, i) => (
          <mesh key={i} position={w.p} castShadow>
            <boxGeometry args={w.a} />
            <meshStandardMaterial color="#9c7c4e" roughness={1} />
          </mesh>
        ))}
        <Hotspot position={[0, 6, 0]} label="The citadel — highest of three master-planned tiers" />
      </group>

      {/* The ten-sign signboard gateway */}
      <group position={[-3, 0, 9.5]}>
        {[-1.6, 1.6].map((x) => (
          <mesh key={x} position={[x, 2, 0]} castShadow>
            <boxGeometry args={[0.8, 4, 0.8]} />
            <meshStandardMaterial color={MUD} roughness={1} />
          </mesh>
        ))}
        <mesh position={[0, 4.4, 0]} castShadow>
          <boxGeometry args={[4.4, 0.9, 0.9]} />
          <meshStandardMaterial color="#b1925f" roughness={1} />
        </mesh>
        {/* ten signs */}
        <Instances range={10}>
          <boxGeometry args={[0.22, 0.4, 0.1]} />
          <meshStandardMaterial color="#ffcf6b" emissive="#ff9d4d" emissiveIntensity={1.4} />
          {Array.from({ length: 10 }).map((_, i) => (
            <Instance key={i} position={[-1.9 + i * 0.42, 4.4, 0.5]} />
          ))}
        </Instances>
      </group>

      <TownBlocks />

      <Reservoir position={[2, 0, 10]} size={[12, 5]} full={full} />
      <Reservoir position={[-13, 0, -13.5]} size={[14, 5]} full={full} />
    </SceneCanvas>
  );
}
