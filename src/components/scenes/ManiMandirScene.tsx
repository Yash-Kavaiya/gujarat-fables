import { useMemo } from 'react';
import { Instances, Instance } from '@react-three/drei';
import SceneCanvas from '../three/SceneCanvas';
import ShikharaTower from '../three/primitives/ShikharaTower';
import Particles from '../three/primitives/Particles';
import Hotspot from '../ui/Hotspot';
import { getPlace } from '../../data/places';

const place = getPlace('mani-mandir')!;
const palette = place.palette;

const SAND = '#c6a576';
const SAND_L = '#d9bf94';
const SAND_D = '#8f7349';
const DARK = '#1f160d';
const DOME = '#cbab79';

function sand(color = SAND, rough = 0.82) {
  return <meshStandardMaterial color={color} roughness={rough} />;
}

/** A row of arched bays (verandah arcade) for one storey of the facade. */
function Arcade({
  cx = 0,
  width,
  bays,
  openBottom,
  openTop,
  zFront,
}: {
  cx?: number;
  width: number;
  bays: number;
  openBottom: number;
  openTop: number;
  zFront: number;
}) {
  const spacing = width / bays;
  const archR = spacing * 0.42;
  const midY = (openBottom + openTop) / 2;
  const pierH = openTop - openBottom + 0.4;

  const piers = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i <= bays; i++) out.push(cx - width / 2 + i * spacing);
    return out;
  }, [cx, width, bays, spacing]);

  const arches = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < bays; i++) out.push(cx - width / 2 + (i + 0.5) * spacing);
    return out;
  }, [cx, width, bays, spacing]);

  return (
    <group>
      {/* shadowed recess behind the openings */}
      <mesh position={[cx, midY, zFront - 0.7]}>
        <boxGeometry args={[width, openTop - openBottom, 0.4]} />
        <meshStandardMaterial color={DARK} roughness={1} />
      </mesh>

      {/* piers */}
      <Instances range={piers.length} castShadow>
        <boxGeometry args={[0.55, pierH, 1.1]} />
        {sand(SAND)}
        {piers.map((x, i) => (
          <Instance key={i} position={[x, midY, zFront]} />
        ))}
      </Instances>

      {/* rounded arch tops */}
      <Instances range={arches.length} castShadow>
        <torusGeometry args={[archR, 0.16, 8, 14, Math.PI]} />
        {sand(SAND_L)}
        {arches.map((x, i) => (
          <Instance key={i} position={[x, openTop - archR, zFront + 0.05]} />
        ))}
      </Instances>

      {/* sill + cornice string-courses */}
      <mesh position={[cx, openBottom - 0.1, zFront + 0.1]}>
        <boxGeometry args={[width + 0.6, 0.4, 1.5]} />
        {sand(SAND_L)}
      </mesh>
      <mesh position={[cx, openTop + 0.35, zFront + 0.2]} castShadow>
        <boxGeometry args={[width + 1.2, 0.5, 1.9]} />
        {sand(SAND_L)}
      </mesh>
    </group>
  );
}

/** Hemispherical dome with a finial — crowns pavilions and corners. */
function Dome({
  position,
  radius = 1,
  color = DOME,
}: {
  position: [number, number, number];
  radius?: number;
  color?: string;
}) {
  return (
    <group position={position}>
      {/* drum */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[radius * 0.85, radius * 0.9, 0.4, 16]} />
        {sand(SAND_L)}
      </mesh>
      <mesh castShadow>
        <sphereGeometry args={[radius, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        {sand(color, 0.7)}
      </mesh>
      {/* finial */}
      <mesh position={[0, radius + 0.3, 0]}>
        <coneGeometry args={[radius * 0.16, 0.7, 10]} />
        <meshStandardMaterial color="#e8c074" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, radius + 0.75, 0]}>
        <sphereGeometry args={[radius * 0.12, 10, 10]} />
        <meshStandardMaterial color="#ffd98a" emissive="#ffb24d" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

/** A small domed corner pavilion (chhatri). */
function Chhatri({ position, size = 2.2 }: { position: [number, number, number]; size?: number }) {
  const h = size * 1.5;
  const c = size / 2 - 0.2;
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[size, 0.4, size]} />
        {sand(SAND_L)}
      </mesh>
      {[
        [-c, -c],
        [c, -c],
        [-c, c],
        [c, c],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, h / 2, z]} castShadow>
          <cylinderGeometry args={[0.16, 0.18, h, 8]} />
          {sand(SAND)}
        </mesh>
      ))}
      <mesh position={[0, h + 0.2, 0]} castShadow>
        <boxGeometry args={[size + 0.3, 0.4, size + 0.3]} />
        {sand(SAND_L)}
      </mesh>
      <Dome position={[0, h + 0.4, 0]} radius={size * 0.5} />
    </group>
  );
}

/** A balustraded parapet rail with instanced balusters. */
function Balustrade({
  width,
  y,
  z,
  cx = 0,
}: {
  width: number;
  y: number;
  z: number;
  cx?: number;
}) {
  const count = Math.floor(width / 0.7);
  const balusters = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i <= count; i++) out.push(cx - width / 2 + (i / count) * width);
    return out;
  }, [width, count, cx]);
  return (
    <group>
      <mesh position={[cx, y + 0.9, z]}>
        <boxGeometry args={[width, 0.18, 0.4]} />
        {sand(SAND_L)}
      </mesh>
      <Instances range={balusters.length}>
        <cylinderGeometry args={[0.1, 0.13, 0.8, 8]} />
        {sand(SAND)}
        {balusters.map((x, i) => (
          <Instance key={i} position={[x, y + 0.45, z]} />
        ))}
      </Instances>
    </group>
  );
}

/** The tall central tower: tiered arcades, a jharokha balcony, a curved roof. */
function CentralTower() {
  const z = 9.2;
  return (
    <group>
      {/* tower body, projecting forward */}
      <mesh position={[0, 11, 1.2]} castShadow receiveShadow>
        <boxGeometry args={[16, 22, 14]} />
        {sand(SAND)}
      </mesh>

      {/* grand recessed entrance arch */}
      <mesh position={[0, 3.5, z - 0.4]}>
        <boxGeometry args={[5, 7, 1]} />
        <meshStandardMaterial color={DARK} roughness={1} />
      </mesh>
      <mesh position={[0, 7, z + 0.1]} castShadow>
        <torusGeometry args={[2.5, 0.4, 10, 18, Math.PI]} />
        {sand(SAND_L)}
      </mesh>
      {/* entrance jambs */}
      {[-2.9, 2.9].map((x) => (
        <mesh key={x} position={[x, 3.5, z]} castShadow>
          <boxGeometry args={[0.8, 7.4, 1.2]} />
          {sand(SAND_D)}
        </mesh>
      ))}

      {/* two upper storeys of arcades, narrower than the wings */}
      <Arcade cx={0} width={13} bays={4} openBottom={8.2} openTop={12.4} zFront={z + 0.3} />
      <Arcade cx={0} width={11} bays={3} openBottom={13.6} openTop={17.6} zFront={z + 0.3} />

      {/* projecting jharokha balcony */}
      <mesh position={[0, 18.4, z + 1.4]} castShadow>
        <boxGeometry args={[9, 0.6, 2.4]} />
        {sand(SAND_L)}
      </mesh>
      <Balustrade width={8.6} y={18.4} z={z + 2.5} />
      {/* big central jharokha arch */}
      <mesh position={[0, 19.5, z + 0.2]}>
        <boxGeometry args={[6, 4.2, 0.6]} />
        <meshStandardMaterial color={DARK} roughness={1} />
      </mesh>
      <mesh position={[0, 21.4, z + 0.5]} castShadow>
        <torusGeometry args={[3, 0.4, 10, 20, Math.PI]} />
        {sand(SAND_L)}
      </mesh>
      {[-3.2, 3.2].map((x) => (
        <mesh key={x} position={[x, 19.6, z + 0.4]} castShadow>
          <cylinderGeometry args={[0.3, 0.34, 5, 10]} />
          {sand(SAND)}
        </mesh>
      ))}

      {/* cornice above the jharokha */}
      <mesh position={[0, 22.6, z + 0.6]} castShadow>
        <boxGeometry args={[12, 0.8, 3]} />
        {sand(SAND_L)}
      </mesh>

      {/* curved "bangla" roof of the crowning pavilion */}
      <mesh position={[0, 24.4, z + 0.3]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[2.4, 2.4, 11, 16, 1, true, 0, Math.PI]} />
        {sand(DOME, 0.7)}
      </mesh>
      {/* ridge finials */}
      {[-4.4, 0, 4.4].map((x, i) => (
        <mesh key={i} position={[x, 26.9, z + 0.3]}>
          <coneGeometry args={[0.35, 1.6, 10]} />
          <meshStandardMaterial color="#e8c074" metalness={0.4} roughness={0.4} />
        </mesh>
      ))}
      {/* central crowning shikhara */}
      <ShikharaTower position={[0, 26.6, z + 0.3]} height={5} baseRadius={1.2} color={SAND_L} accent="#ffd98a" />

      {/* domes on the tower corners */}
      <Dome position={[-7.2, 23.2, z - 2]} radius={1.3} />
      <Dome position={[7.2, 23.2, z - 2]} radius={1.3} />

      <Hotspot position={[0, 31, z]} label="The Temple Born of Love — Mani Mandir, Morbi" />
    </group>
  );
}

/** One side wing: three tiers of arcades, parapet, and corner chhatris. */
function Wing({ cx }: { cx: number }) {
  const width = 16;
  const zFront = 8;
  return (
    <group>
      {/* wing body */}
      <mesh position={[cx, 8, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.6, 16, 14]} />
        {sand(SAND)}
      </mesh>

      <Arcade cx={cx} width={width} bays={5} openBottom={1.2} openTop={5.2} zFront={zFront} />
      <Arcade cx={cx} width={width} bays={5} openBottom={6.4} openTop={10.4} zFront={zFront} />
      <Arcade cx={cx} width={width} bays={5} openBottom={11.6} openTop={15.0} zFront={zFront} />

      {/* parapet + balustrade */}
      <Balustrade width={width} y={16} z={zFront} cx={cx} />

      {/* small roofline domes */}
      <Dome position={[cx - 4, 16.6, zFront - 2]} radius={1} />
      <Dome position={[cx + 4, 16.6, zFront - 2]} radius={1} />
    </group>
  );
}

export default function ManiMandirScene() {
  return (
    <SceneCanvas
      palette={palette}
      cameraPosition={[0, 13, 54]}
      fov={48}
      fog={[55, 260]}
      controls={{
        autoRotate: true,
        autoRotateSpeed: 0.28,
        target: [0, 11, 0],
        minDistance: 26,
        maxDistance: 90,
        maxPolarAngle: Math.PI / 2.05,
      }}
      bloomIntensity={1.0}
    >
      <directionalLight
        position={[26, 34, 30]}
        intensity={1.4}
        color="#ffe6d2"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={180}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={70}
        shadow-camera-bottom={-10}
      />
      <hemisphereLight args={['#f0c8cc', '#5a4030', 0.5]} />

      {/* forecourt */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[260, 260]} />
        <meshStandardMaterial color="#7a6147" roughness={1} />
      </mesh>

      {/* plinth + grand staircase */}
      <mesh position={[0, 0.4, 4]} receiveShadow castShadow>
        <boxGeometry args={[52, 0.8, 24]} />
        {sand(SAND_D)}
      </mesh>
      {[0, 1, 2, 3].map((s) => (
        <mesh key={s} position={[0, 0.5 - s * 0.25, 17 + s * 1.2]} receiveShadow>
          <boxGeometry args={[14 - s, 0.3, 1.4]} />
          {sand(SAND_L)}
        </mesh>
      ))}

      <Wing cx={-16} />
      <Wing cx={16} />
      <CentralTower />

      {/* corner chhatris of the whole facade */}
      <Chhatri position={[-24, 16.2, 6]} size={2.4} />
      <Chhatri position={[24, 16.2, 6]} size={2.4} />

      {/* soft glowing lamps flanking the entrance */}
      <Instances range={4}>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshStandardMaterial color="#ffdca0" emissive="#ffb870" emissiveIntensity={2.4} />
        {[
          [-4, 4, 10],
          [4, 4, 10],
          [-9, 3, 9],
          [9, 3, 9],
        ].map((p, i) => (
          <Instance key={i} position={p as [number, number, number]} />
        ))}
      </Instances>
      <pointLight position={[0, 6, 14]} intensity={1.6} color="#ffb870" distance={50} />

      {/* drifting rose petals */}
      <Particles
        count={130}
        area={[60, 30, 30]}
        center={[0, 16, 6]}
        color="#f7b9c4"
        size={0.4}
        speed={-0.5}
        additive={false}
      />
    </SceneCanvas>
  );
}
