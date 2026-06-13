import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance } from '@react-three/drei';
import { Vector3 } from 'three';
import SceneCanvas from '../three/SceneCanvas';
import WaterPlane from '../three/primitives/WaterPlane';
import { getPlace } from '../../data/places';
import { useSceneStore } from '../../store/useSceneStore';
import { RANI_MAX_LEVEL } from '../../lib/sceneConstants';

const place = getPlace('rani-ki-vav')!;
const palette = place.palette;

const LEVELS = RANI_MAX_LEVEL + 1; // 7 storeys
const DROP = 2.7;
const RUN = 4.4;
const HALF = 5;
const STONE = '#a07d49';

const center = (i: number): [number, number, number] => [0, -i * DROP, -i * RUN];

/** Carved side walls with instanced niche-figures, level by level. */
function Walls() {
  const niches = useMemo(() => {
    const out: { pos: [number, number, number]; rotY: number }[] = [];
    for (let i = 0; i < LEVELS; i++) {
      const [, cy, cz] = center(i);
      for (const side of [-1, 1] as const) {
        for (let n = 0; n < 3; n++) {
          out.push({
            pos: [side * (HALF - 0.35), cy + 1.4, cz + (n - 1) * 1.3],
            rotY: side > 0 ? -Math.PI / 2 : Math.PI / 2,
          });
        }
      }
    }
    return out;
  }, []);

  return (
    <group>
      {/* wall slabs */}
      {Array.from({ length: LEVELS }).map((_, i) => {
        const [, cy, cz] = center(i);
        return [-1, 1].map((side) => (
          <mesh key={`${i}-${side}`} position={[side * HALF, cy + 1.6, cz]} castShadow receiveShadow>
            <boxGeometry args={[0.7, DROP + 3.4, RUN + 0.3]} />
            <meshStandardMaterial color={STONE} roughness={0.95} />
          </mesh>
        ));
      })}

      {/* niche figures (apsaras / deities) — slightly warm so they read in the gloom */}
      <Instances range={niches.length}>
        <boxGeometry args={[0.4, 1.7, 0.7]} />
        <meshStandardMaterial color="#b6915a" emissive="#3a2a12" emissiveIntensity={0.5} roughness={0.8} />
        {niches.map((n, i) => (
          <Instance key={i} position={n.pos} rotation={[0, n.rotY, 0]} />
        ))}
      </Instances>
    </group>
  );
}

/** Stepped floors + connecting stairs descending into the earth. */
function Terraces() {
  return (
    <group>
      {Array.from({ length: LEVELS }).map((_, i) => {
        const [, cy, cz] = center(i);
        return (
          <group key={i}>
            <mesh position={[0, cy, cz]} receiveShadow>
              <boxGeometry args={[HALF * 2, 0.5, RUN]} />
              <meshStandardMaterial color="#8a6c3f" roughness={1} />
            </mesh>
            {/* framing pillars at the front of each gallery */}
            {[-1, 1].map((side) => (
              <mesh key={side} position={[side * (HALF - 0.9), cy + 1.8, cz + RUN / 2]} castShadow>
                <cylinderGeometry args={[0.32, 0.36, 3.4, 10]} />
                <meshStandardMaterial color={STONE} roughness={0.85} />
              </mesh>
            ))}
            {/* a short flight of steps down to the next level */}
            {i < LEVELS - 1 &&
              [0, 1, 2, 3].map((s) => (
                <mesh key={s} position={[0, cy - 0.3 - s * (DROP / 4), cz - RUN / 2 - s * (RUN / 8)]}>
                  <boxGeometry args={[HALF * 1.6, 0.3, RUN / 4]} />
                  <meshStandardMaterial color="#977542" roughness={1} />
                </mesh>
              ))}
          </group>
        );
      })}
    </group>
  );
}

/** Camera glides to frame the current descent level. */
function DescentRig() {
  const level = useSceneStore((s) => s.descentLevel);
  const target = useRef(new Vector3());
  const look = useRef(new Vector3());

  useFrame((state, delta) => {
    const [, cy, cz] = center(level);
    target.current.set(0, cy + 3.4, cz + 8.5);
    look.current.set(0, cy + 0.5, cz - 4);
    const k = 1 - Math.pow(0.0015, delta);
    state.camera.position.lerp(target.current, k);
    state.camera.lookAt(look.current);
  });
  return null;
}

export default function RaniKiVavScene() {
  const level = useSceneStore((s) => s.descentLevel);
  const deep = level / RANI_MAX_LEVEL;

  return (
    <SceneCanvas
      palette={palette}
      cameraPosition={[0, 6, 10]}
      fov={55}
      fog={[18, 90]}
      controls={false}
      bloomIntensity={0.6}
    >
      {/* daylight pouring in from the open top */}
      <directionalLight position={[0, 40, 12]} intensity={1.7} color="#ffeccb" castShadow shadow-mapSize={[1024, 1024]} />
      <DescentRig />

      <Terraces />
      <Walls />

      {/* God-rays from the opening, strongest as you near the bottom */}
      {[-2.4, 0, 2.4].map((x, i) => (
        <mesh key={i} position={[x, -8, -RUN * 4.5]} rotation={[0.25, 0, 0.04 * (i - 1)]}>
          <cylinderGeometry args={[0.7, 2.2, 30, 12, 1, true]} />
          <meshBasicMaterial color="#ffe6b0" transparent opacity={0.05 + deep * 0.14} depthWrite={false} />
        </mesh>
      ))}

      {/* The deep well shaft + still water at the bottom */}
      <group position={center(LEVELS - 1)}>
        <mesh position={[0, -2.4, -RUN]} castShadow receiveShadow>
          <cylinderGeometry args={[HALF - 0.5, HALF - 0.5, 5, 32, 1, true]} />
          <meshStandardMaterial color="#7c5f37" roughness={1} side={2} />
        </mesh>
        <WaterPlane
          size={(HALF - 0.8) * 2}
          segments={24}
          color="#16323b"
          highlight="#e8c074"
          amplitude={0.03}
          position={[0, -4.6, -RUN]}
        />
      </group>
    </SceneCanvas>
  );
}
