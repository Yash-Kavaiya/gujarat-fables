import { useMemo } from 'react';
import { Instances, Instance } from '@react-three/drei';
import { Vector2 } from 'three';
import SceneCanvas from '../three/SceneCanvas';
import WaterPlane from '../three/primitives/WaterPlane';
import Hotspot from '../ui/Hotspot';
import { getPlace } from '../../data/places';

const palette = getPlace('statue-of-unity')!.palette;

// Weathered-bronze cladding of the real statue
const BRONZE = '#8a7660';
const BRONZE_DARK = '#6f5d49';
const HAIR = '#4a3d30';
const SKIN_SHADOW = '#2a2018';
const RED = '#974730';
const RED_DARK = '#7d3a26';
const RED_LIGHT = '#a85940';

function bronze(metal = 0.35, rough = 0.55, color = BRONZE) {
  return <meshStandardMaterial color={color} metalness={metal} roughness={rough} />;
}

/** Sardar Patel's draped lower garment (dhoti) as a flowing, pleated form. */
function Dhoti() {
  // lathe profile: covers the legs, hem flares slightly near the ankles
  const profile = useMemo(() => {
    const pts: Vector2[] = [];
    // from waist (top) down to hem (bottom)
    pts.push(new Vector2(1.55, 8.0)); // waist
    pts.push(new Vector2(1.75, 7.2));
    pts.push(new Vector2(2.0, 6.0));
    pts.push(new Vector2(2.15, 4.6));
    pts.push(new Vector2(2.25, 3.2));
    pts.push(new Vector2(2.35, 2.2)); // flared hem
    pts.push(new Vector2(2.15, 2.0));
    pts.push(new Vector2(1.9, 1.9)); // tuck under
    return pts;
  }, []);

  // vertical pleats suggested by thin ridges around the lower garment
  const pleats = useMemo(() => {
    const out: { a: number; r: number }[] = [];
    const N = 22;
    for (let i = 0; i < N; i++) out.push({ a: (i / N) * Math.PI * 2, r: 2.18 });
    return out;
  }, []);

  return (
    <group>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <latheGeometry args={[profile, 24]} />
        {bronze(0.3, 0.6)}
      </mesh>
      <Instances range={pleats.length} castShadow>
        <boxGeometry args={[0.12, 5.6, 0.16]} />
        {bronze(0.3, 0.62, BRONZE_DARK)}
        {pleats.map((p, i) => (
          <Instance
            key={i}
            position={[Math.cos(p.a) * p.r, 4.7, Math.sin(p.a) * p.r]}
            rotation={[0, -p.a, 0]}
          />
        ))}
      </Instances>
    </group>
  );
}

/** Legs/shins and sandalled feet visible below the dhoti hem. */
function LegsAndFeet() {
  return (
    <group>
      {[-0.7, 0.7].map((x) => (
        <group key={x}>
          {/* shin */}
          <mesh position={[x, 1.1, 0.1]} castShadow>
            <cylinderGeometry args={[0.42, 0.5, 2.2, 12]} />
            {bronze(0.3, 0.6, BRONZE_DARK)}
          </mesh>
          {/* foot / sandal */}
          <mesh position={[x, 0.18, 0.5]} castShadow>
            <boxGeometry args={[0.7, 0.36, 1.5]} />
            {bronze(0.25, 0.7, BRONZE_DARK)}
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** The upper body: coat/torso, shoulders, and the buttoned front. */
function Torso() {
  const coat = useMemo(() => {
    const pts: Vector2[] = [];
    pts.push(new Vector2(1.5, 0)); // waist
    pts.push(new Vector2(1.62, 1.2));
    pts.push(new Vector2(1.68, 2.4));
    pts.push(new Vector2(1.55, 3.4)); // chest
    pts.push(new Vector2(1.2, 4.1)); // toward shoulders
    return pts;
  }, []);

  return (
    <group position={[0, 8, 0]}>
      {/* waist sash */}
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.55, 0.22, 10, 24]} />
        {bronze(0.3, 0.55, BRONZE_DARK)}
      </mesh>

      {/* coat / torso */}
      <mesh position={[0, 0, 0]} castShadow>
        <latheGeometry args={[coat, 22]} />
        {bronze(0.32, 0.55)}
      </mesh>

      {/* buttoned front placket */}
      <mesh position={[0, 2.0, 1.45]} castShadow>
        <boxGeometry args={[0.3, 3.6, 0.18]} />
        {bronze(0.35, 0.5, BRONZE_DARK)}
      </mesh>
      {[2.9, 2.3, 1.7, 1.1].map((y, i) => (
        <mesh key={i} position={[0, y, 1.58]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          {bronze(0.5, 0.4, '#a8956f')}
        </mesh>
      ))}

      {/* shoulders */}
      <mesh position={[0, 4.0, 0]} scale={[1, 0.62, 0.85]} castShadow>
        <sphereGeometry args={[1.85, 20, 14]} />
        {bronze(0.32, 0.55)}
      </mesh>
    </group>
  );
}

/** The angvastram (shawl) draped over one shoulder and across the chest. */
function Shawl() {
  return (
    <group>
      {/* shoulder roll */}
      <mesh position={[1.35, 11.7, 0.2]} rotation={[0, 0, -0.3]} castShadow>
        <capsuleGeometry args={[0.42, 1.1, 6, 10]} />
        {bronze(0.3, 0.6, '#94806a')}
      </mesh>
      {/* band crossing the chest */}
      <mesh position={[0.1, 9.9, 1.35]} rotation={[0.1, 0, -0.62]} castShadow>
        <boxGeometry args={[0.85, 5.0, 0.32]} />
        {bronze(0.3, 0.58, '#907c66')}
      </mesh>
      {/* long panel hanging down the side */}
      <mesh position={[1.65, 8.2, 0.4]} rotation={[0.05, 0, 0.05]} castShadow>
        <boxGeometry args={[1.0, 6.4, 0.3]} />
        {bronze(0.3, 0.6, '#907c66')}
      </mesh>
    </group>
  );
}

/** Arms held at the sides, slightly bent, with hands. */
function Arms() {
  return (
    <group position={[0, 11.4, 0]}>
      {[-1, 1].map((s) => (
        <group key={s}>
          {/* upper arm */}
          <mesh position={[s * 1.85, -1.1, 0.1]} rotation={[0.1, 0, s * 0.16]} castShadow>
            <capsuleGeometry args={[0.42, 2.0, 6, 10]} />
            {bronze(0.32, 0.55)}
          </mesh>
          {/* forearm */}
          <mesh position={[s * 2.15, -3.4, 0.35]} rotation={[0.25, 0, s * 0.05]} castShadow>
            <capsuleGeometry args={[0.36, 2.0, 6, 10]} />
            {bronze(0.32, 0.55)}
          </mesh>
          {/* hand */}
          <mesh position={[s * 2.25, -4.7, 0.6]} castShadow>
            <sphereGeometry args={[0.4, 12, 10]} />
            {bronze(0.28, 0.55, '#7e6a54')}
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** The bald, stern head of Sardar Patel with a suggested face. */
function Head() {
  return (
    <group position={[0, 12.9, 0]}>
      {/* neck */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.62, 1.0, 12]} />
        {bronze(0.3, 0.55, '#7e6a54')}
      </mesh>
      {/* cranium (bald, broad forehead) */}
      <mesh position={[0, 1.35, 0]} scale={[1, 1.12, 1.05]} castShadow>
        <sphereGeometry args={[0.95, 24, 20]} />
        {bronze(0.3, 0.5, '#8a7660')}
      </mesh>
      {/* jaw / lower face */}
      <mesh position={[0, 0.75, 0.18]} scale={[1, 0.85, 0.95]} castShadow>
        <sphereGeometry args={[0.72, 20, 16]} />
        {bronze(0.3, 0.52, '#86715b')}
      </mesh>
      {/* brow ridge */}
      <mesh position={[0, 1.28, 0.72]}>
        <boxGeometry args={[1.15, 0.2, 0.3]} />
        {bronze(0.28, 0.55, BRONZE_DARK)}
      </mesh>
      {/* eyes */}
      {[-0.34, 0.34].map((x) => (
        <mesh key={x} position={[x, 1.12, 0.82]}>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshStandardMaterial color={SKIN_SHADOW} roughness={0.5} />
        </mesh>
      ))}
      {/* nose */}
      <mesh position={[0, 0.95, 0.92]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.16, 0.5, 8]} />
        {bronze(0.3, 0.55, '#86715b')}
      </mesh>
      {/* mouth (set, stern) */}
      <mesh position={[0, 0.62, 0.84]}>
        <boxGeometry args={[0.42, 0.07, 0.1]} />
        <meshStandardMaterial color={SKIN_SHADOW} roughness={0.5} />
      </mesh>
      {/* ears */}
      {[-0.92, 0.92].map((x) => (
        <mesh key={x} position={[x, 1.0, 0.05]} scale={[0.5, 1, 0.8]}>
          <sphereGeometry args={[0.26, 12, 10]} />
          {bronze(0.3, 0.52, '#86715b')}
        </mesh>
      ))}
      {/* fringe of hair low around the sides/back */}
      <mesh position={[0, 0.95, -0.1]} rotation={[0.2, 0, 0]}>
        <torusGeometry args={[0.86, 0.13, 10, 24, Math.PI * 1.25]} />
        <meshStandardMaterial color={HAIR} roughness={0.8} />
      </mesh>
    </group>
  );
}

function Patel() {
  return (
    <group position={[0, 7.3, 0]}>
      <LegsAndFeet />
      <Dhoti />
      <Torso />
      <Shawl />
      <Arms />
      <Head />
      <Hotspot position={[0, 15.4, 0]} label="Sardar Patel — 182 m of bronze over the Narmada" />
    </group>
  );
}

/** The distinctive angular, tiered terracotta pedestal with a gallery colonnade. */
function Pedestal() {
  const gallery = useMemo(() => {
    const out: [number, number, number][] = [];
    const N = 24;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      out.push([Math.cos(a) * 7.4, 5.7, Math.sin(a) * 7.4]);
    }
    return out;
  }, []);

  return (
    <group>
      {/* broad lower apron (octagonal) */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[16, 18, 1.8, 8]} />
        <meshStandardMaterial color={RED_DARK} roughness={0.95} flatShading />
      </mesh>
      {/* battered mid tier */}
      <mesh position={[0, 3.0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[10.5, 14, 2.6, 8]} />
        <meshStandardMaterial color={RED} roughness={0.95} flatShading />
      </mesh>
      {/* gallery tier */}
      <mesh position={[0, 5.0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[8, 9.6, 1.6, 8]} />
        <meshStandardMaterial color={RED_LIGHT} roughness={0.95} flatShading />
      </mesh>
      {/* viewing-gallery colonnade */}
      <Instances range={gallery.length} castShadow>
        <boxGeometry args={[0.45, 1.6, 0.45]} />
        <meshStandardMaterial color="#c08a6a" roughness={0.9} />
        {gallery.map((p, i) => (
          <Instance key={i} position={p} />
        ))}
      </Instances>
      {/* gallery roof ring */}
      <mesh position={[0, 6.6, 0]}>
        <cylinderGeometry args={[8.2, 8.2, 0.4, 8]} />
        <meshStandardMaterial color={RED} roughness={0.9} flatShading />
      </mesh>
      {/* top plinth the statue stands on */}
      <mesh position={[0, 7.0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[4.4, 5.4, 0.8, 8]} />
        <meshStandardMaterial color={RED_LIGHT} roughness={0.95} flatShading />
      </mesh>
    </group>
  );
}

/** Tiny visitors on the gallery for heroic scale reference. */
function ScaleReference() {
  const people = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let i = 0; i < 30; i++) {
      const a = Math.random() * Math.PI * 2;
      out.push([Math.cos(a) * 8.1, 6.0, Math.sin(a) * 8.1]);
    }
    return out;
  }, []);
  return (
    <Instances range={people.length}>
      <capsuleGeometry args={[0.1, 0.34, 4, 6]} />
      <meshStandardMaterial color="#241b14" roughness={1} />
      {people.map((p, i) => (
        <Instance key={i} position={p} />
      ))}
    </Instances>
  );
}

export default function StatueOfUnityScene() {
  return (
    <SceneCanvas
      palette={palette}
      cameraPosition={[24, 14, 38]}
      fov={46}
      fog={[50, 240]}
      controls={{
        autoRotate: true,
        autoRotateSpeed: 0.4,
        target: [0, 13, 0],
        minDistance: 22,
        maxDistance: 85,
        maxPolarAngle: Math.PI / 2.05,
      }}
    >
      {/* key light — soft morning */}
      <directionalLight
        position={[34, 46, 24]}
        intensity={1.6}
        color="#fff1d6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={160}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={60}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-20, 18, -10]} intensity={0.4} color="#bcd0ff" />

      {/* island the pedestal sits on */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[30, 48]} />
        <meshStandardMaterial color="#5c6b4d" roughness={1} />
      </mesh>

      {/* the Narmada */}
      <WaterPlane size={500} color="#3f5a63" highlight="#cfe2e0" amplitude={0.16} position={[0, -0.4, 0]} />

      {/* distant Sardar Sarovar dam + hills */}
      <mesh position={[0, 5, -110]}>
        <boxGeometry args={[320, 11, 6]} />
        <meshStandardMaterial color="#7c8a73" roughness={1} />
      </mesh>
      {[-90, -55, 60, 100].map((x, i) => (
        <mesh key={i} position={[x, 5, -85 - (i % 2) * 16]}>
          <coneGeometry args={[18 + i * 4, 22 + i * 5, 5]} />
          <meshStandardMaterial color="#566b4f" roughness={1} flatShading />
        </mesh>
      ))}

      <Pedestal />
      <ScaleReference />
      <Patel />
    </SceneCanvas>
  );
}
