import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance } from '@react-three/drei';
import { DoubleSide, ShaderMaterial } from 'three';
import SceneCanvas from '../three/SceneCanvas';
import DynamicSky from '../three/DynamicSky';
import CloudLayer from '../three/CloudLayer';
import SunAtmosphere from '../three/SunAtmosphere';
import WeatherHaze from '../three/WeatherHaze';
import WaterPlane from '../three/primitives/WaterPlane';
import ShikharaTower from '../three/primitives/ShikharaTower';
import Particles from '../three/primitives/Particles';
import Hotspot from '../ui/Hotspot';
import { useSceneStore } from '../../store/useSceneStore';
import {
  HALL,
  ROOF_Y,
  STOREYS,
  SHIKHARA,
  BET_DWARKA,
  LIGHTING_PRESETS,
  camera,
  orbitControls,
  makeColonnadePositions,
  makeStoreyCornices,
  makeStoreyNiches,
  makeJharokhas,
  makeSwargadwarSteps,
  makePilgrims,
  makeBoats,
  makeCoastalTrees,
  flagPoleTopY,
  storeyTopY,
  DWARKA_HOTSPOTS,
} from './dwarkadhishLayout';

// ─── Great Dhwaja — ripples on its pole, bearing sun & moon ──────────
function Dhwaja({ y }: { y: number }) {
  const matRef = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((_, d) => {
    if (matRef.current) (matRef.current.uniforms.uTime.value as number) += d;
  });
  return (
    <group position={[0, y, 0]}>
      <mesh position={[0, -1, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 2.4, 8]} />
        <meshStandardMaterial color="#caa24e" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[1.9, 0.4, 0]}>
        <planeGeometry args={[3.6, 2.1, 24, 12]} />
        <shaderMaterial
          ref={matRef}
          side={DoubleSide}
          uniforms={uniforms}
          vertexShader={/* glsl */ `
            uniform float uTime;
            varying vec2 vUv;
            void main(){
              vUv = uv;
              vec3 p = position;
              float anchor = (p.x + 1.8) / 3.6;
              p.z += sin(p.x * 2.4 + uTime * 5.0) * 0.3 * anchor;
              p.y += sin(p.x * 1.6 + uTime * 3.2) * 0.11 * anchor;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
            }
          `}
          fragmentShader={/* glsl */ `
            varying vec2 vUv;
            void main(){
              vec3 saffron = vec3(0.93, 0.55, 0.16);
              vec2 c = vUv - vec2(0.5);
              float disc = smoothstep(0.16, 0.13, length(c));
              vec3 col = mix(saffron, vec3(1.0, 0.92, 0.7), disc);
              gl_FragColor = vec4(col, 1.0);
            }
          `}
        />
      </mesh>
      {/* Sun & crescent moon emblem, near the fly */}
      <mesh position={[2.9, 0.9, 0.02]}>
        <circleGeometry args={[0.14, 16]} />
        <meshStandardMaterial color="#ffe6a0" emissive="#ffcf6b" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[3.2, 0.55, 0.02]} rotation={[0, 0, 0.5]}>
        <ringGeometry args={[0.07, 0.11, 16, 1, 0, Math.PI * 1.4]} />
        <meshStandardMaterial color="#fff4d8" emissive="#ffe6a0" emissiveIntensity={0.4} side={DoubleSide} />
      </mesh>
    </group>
  );
}

// ─── Jagat Mandir hall: carved colonnade of 72 pillars + flat roof ───
function Colonnade() {
  const positions = useMemo(() => makeColonnadePositions(), []);
  return (
    <group>
      <Instances range={positions.length} castShadow receiveShadow>
        <cylinderGeometry args={[HALL.radius, HALL.radius * 1.15, HALL.shaftHeight, 12]} />
        <meshStandardMaterial color="#d4ad62" roughness={0.85} metalness={0.05} />
        {positions.map((p, i) => (
          <Instance key={`shaft-${i}`} position={[p[0], p[1] + HALL.shaftHeight / 2, p[2]]} />
        ))}
      </Instances>
      <Instances range={positions.length}>
        <boxGeometry args={[HALL.radius * 2.6, 0.32, HALL.radius * 2.6]} />
        <meshStandardMaterial color="#a9803f" roughness={0.9} />
        {positions.map((p, i) => (
          <Instance key={`base-${i}`} position={[p[0], p[1] + 0.16, p[2]]} />
        ))}
      </Instances>
      <Instances range={positions.length}>
        <torusGeometry args={[HALL.radius * 1.3, HALL.radius * 0.28, 6, 12]} />
        <meshStandardMaterial color="#c79a55" roughness={0.75} />
        {positions.map((p, i) => (
          <Instance
            key={`band-${i}`}
            position={[p[0], p[1] + HALL.shaftHeight * 0.6, p[2]]}
            rotation={[Math.PI / 2, 0, 0]}
          />
        ))}
      </Instances>
      <Instances range={positions.length}>
        <boxGeometry args={[HALL.radius * 3.1, 0.42, HALL.radius * 3.1]} />
        <meshStandardMaterial color="#e9c583" roughness={0.8} />
        {positions.map((p, i) => (
          <Instance key={`cap-${i}`} position={[p[0], p[1] + HALL.shaftHeight + 0.2, p[2]]} />
        ))}
      </Instances>
      {/* Flat hall roof carried by the colonnade */}
      <mesh position={[0, ROOF_Y - 0.2, 0]} receiveShadow castShadow>
        <boxGeometry
          args={[(HALL.cols - 1) * HALL.spacing + 1.2, 0.4, (HALL.rows - 1) * HALL.spacing + 1.2]}
        />
        <meshStandardMaterial color="#a9803f" roughness={0.9} />
      </mesh>
      <Hotspot
        position={[13, 3, 0]}
        label={DWARKA_HOTSPOTS.find((h) => h.id === 'colonnade')!.label}
      />
    </group>
  );
}

// ─── Storey cornices, niches & jharokha balconies ─────────────────────
function StoreyDetailing() {
  const cornices = useMemo(() => makeStoreyCornices(), []);
  const niches = useMemo(() => makeStoreyNiches(), []);
  const jharokhas = useMemo(() => makeJharokhas(), []);
  return (
    <group>
      {cornices.map((c, i) => (
        <mesh key={`cornice-${i}`} position={c.position} castShadow>
          <boxGeometry args={c.size} />
          <meshStandardMaterial color="#c79a55" roughness={0.7} />
        </mesh>
      ))}
      {niches.map((n, i) => (
        <group key={`niche-${i}`} position={n.position} rotation={[0, n.rotationY, 0]}>
          <mesh position={[0, 0, 0.03]} castShadow>
            <boxGeometry args={[0.55, 1.0, 0.12]} />
            <meshStandardMaterial color="#a9803f" roughness={0.92} />
          </mesh>
          <mesh position={[0, 0.62, 0.06]}>
            <coneGeometry args={[0.32, 0.35, 4]} />
            <meshStandardMaterial color="#c79a55" roughness={0.75} flatShading />
          </mesh>
        </group>
      ))}
      {jharokhas.map((j, i) => (
        <group key={`jharokha-${i}`} position={j.basePosition}>
          <mesh position={[0, 0, 0.35]} castShadow receiveShadow>
            <boxGeometry args={[j.storeyW * 0.5, 0.18, 0.7]} />
            <meshStandardMaterial color="#e9c583" roughness={0.85} />
          </mesh>
          <mesh position={[-j.storeyW * 0.18, -0.35, 0.62]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.7, 8]} />
            <meshStandardMaterial color="#c79a55" roughness={0.8} />
          </mesh>
          <mesh position={[j.storeyW * 0.18, -0.35, 0.62]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.7, 8]} />
            <meshStandardMaterial color="#c79a55" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.55, 0.4]} castShadow>
            <boxGeometry args={[j.storeyW * 0.56, 0.1, 0.9]} />
            <meshStandardMaterial color="#a9803f" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── Nija Mandir — the five-storey tower + shikhara + dhwaja ─────────
function NijaMandir() {
  return (
    <group>
      {STOREYS.map((s) => (
        <mesh key={s.id} position={[0, s.y, 0]} castShadow receiveShadow>
          <boxGeometry args={[s.w, s.h, s.d]} />
          <meshStandardMaterial color={s.color} roughness={0.85} />
        </mesh>
      ))}
      <StoreyDetailing />
      <ShikharaTower
        position={SHIKHARA.position}
        height={SHIKHARA.height}
        baseRadius={SHIKHARA.baseRadius}
        color="#d4ad62"
        accent="#ffcf6b"
      />
      <Dhwaja y={flagPoleTopY()} />
      <Hotspot position={[0, storeyTopY() + 3, 3]} label={DWARKA_HOTSPOTS.find((h) => h.id === 'shikhara')!.label} />
      <Hotspot position={[0, flagPoleTopY() + 1, 0]} label={DWARKA_HOTSPOTS.find((h) => h.id === 'dhwaja')!.label} />
    </group>
  );
}

// ─── Swargadwar — 56 steps down to the sangam, with pilgrims ─────────
function Swargadwar() {
  const steps = useMemo(() => makeSwargadwarSteps(), []);
  const pilgrims = useMemo(() => makePilgrims(), []);
  return (
    <group>
      <Instances range={steps.length} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#c2a061" roughness={0.94} />
        {steps.map((s, i) => (
          <Instance key={i} position={s.position} scale={s.size} />
        ))}
      </Instances>
      <Instances range={pilgrims.length} castShadow>
        <capsuleGeometry args={[0.11, 0.36, 4, 6]} />
        <meshStandardMaterial color="#2a2018" roughness={1} />
        {pilgrims.map((p, i) => (
          <Instance key={i} position={p} />
        ))}
      </Instances>
      <Hotspot
        position={[0, HALL.platformY + 0.3, 15]}
        label={DWARKA_HOTSPOTS.find((h) => h.id === 'swargadwar')!.label}
      />
    </group>
  );
}

// ─── Boats & Bet Dwarka island across the sangam ──────────────────────
function Boat({ position, rotationY, scale }: { position: [number, number, number]; rotationY: number; scale: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.28, 1.9]} />
        <meshStandardMaterial color="#5a3d24" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 1.1, 6]} />
        <meshStandardMaterial color="#3d2a18" roughness={0.85} />
      </mesh>
      <mesh position={[0.15, 0.55, 0.1]} rotation={[0, 0.1, 0]}>
        <planeGeometry args={[0.55, 0.7]} />
        <meshStandardMaterial color="#e2d3ae" side={DoubleSide} roughness={0.95} />
      </mesh>
    </group>
  );
}

function SangamWaterfront() {
  const boats = useMemo(() => makeBoats(), []);
  return (
    <group>
      {boats.map((b, i) => (
        <Boat key={i} position={b.position} rotationY={b.rotationY} scale={b.scale} />
      ))}
      <Hotspot
        position={[0, 0.3, 28]}
        label={DWARKA_HOTSPOTS.find((h) => h.id === 'sangam')!.label}
      />
      {/* Bet Dwarka — a low island silhouette across the water */}
      <group position={BET_DWARKA.position}>
        <mesh position={[0, BET_DWARKA.height * 0.32, 0]} castShadow receiveShadow>
          <coneGeometry args={[BET_DWARKA.radius, BET_DWARKA.height, 10]} />
          <meshStandardMaterial color="#4e6346" roughness={1} flatShading />
        </mesh>
        <ShikharaTower
          position={[3, BET_DWARKA.height * 0.62, 0]}
          height={2.4}
          baseRadius={0.6}
          color="#c79a55"
          accent="#ffcf6b"
          emissiveFinial={false}
        />
        <Hotspot
          position={[0, BET_DWARKA.height + 2, 0]}
          label={DWARKA_HOTSPOTS.find((h) => h.id === 'bet-dwarka')!.label}
        />
      </group>
    </group>
  );
}

// ─── Coastal vegetation for a lived-in shoreline ──────────────────────
function CoastalTrees() {
  const trees = useMemo(() => makeCoastalTrees(), []);
  return (
    <group>
      <Instances range={trees.length} castShadow>
        <cylinderGeometry args={[0.13, 0.18, 1.4, 6]} />
        <meshStandardMaterial color="#4a3728" roughness={1} />
        {trees.map((t, i) => (
          <Instance key={`tr-${i}`} position={[t.position[0], 0.7 * t.scale, t.position[2]]} scale={t.scale} />
        ))}
      </Instances>
      <Instances range={trees.length} castShadow>
        <sphereGeometry args={[1.05, 8, 6]} />
        <meshStandardMaterial color="#3d5a32" roughness={1} flatShading />
        {trees.map((t, i) => (
          <Instance key={`can-${i}`} position={[t.position[0], 1.9 * t.scale, t.position[2]]} scale={t.scale} />
        ))}
      </Instances>
    </group>
  );
}

// ─── Main scene ────────────────────────────────────────────────────────
export default function DwarkadhishScene() {
  const evening = useSceneStore((s) => s.evening);
  const preset = evening ? LIGHTING_PRESETS.evening : LIGHTING_PRESETS.day;

  const dynamicPalette = useMemo(
    () => ({ sky: preset.sky, ground: preset.ground, accent: '#f0c25a', fog: preset.fog }),
    [preset],
  );

  return (
    <SceneCanvas
      palette={dynamicPalette}
      cameraPosition={camera.position}
      fov={camera.fov}
      fog={preset.fogRange}
      controls={{
        target: orbitControls.target,
        minDistance: orbitControls.minDistance,
        maxDistance: orbitControls.maxDistance,
        maxPolarAngle: orbitControls.maxPolarAngle,
      }}
      bloomIntensity={preset.bloom}
      sky={<DynamicSky sunAngle={preset.skyAngle} />}
    >
      {/* ── Lighting rig ── */}
      <directionalLight
        position={preset.sunPos}
        intensity={preset.sunIntensity}
        color={preset.sunColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={200}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-24}
      />
      <directionalLight position={[-preset.sunPos[0] * 0.3, 14, -10]} intensity={0.25} color="#bcd0ff" />
      <ambientLight intensity={preset.ambient} color={preset.fog} />
      <hemisphereLight args={[preset.sky, preset.ground, preset.hemi]} />

      <SunAtmosphere position={preset.sunPos} color={preset.sunColor} sunHeight={Math.max(Math.sin(preset.skyAngle * Math.PI), 0)} />
      <CloudLayer sunAngle={preset.skyAngle} density={preset.cloudDensity} />
      <WeatherHaze sunAngle={preset.skyAngle} />

      {/* ── The Gomti creek meeting the sea ── */}
      <WaterPlane
        size={500}
        color={evening ? '#1a2c3c' : '#2f5e6c'}
        highlight={evening ? '#ff9d4d' : '#d4ebee'}
        amplitude={0.24}
        position={[0, 0, 14]}
      />

      {/* ── Jagat Mandir plinth ── */}
      <mesh position={[0, HALL.platformY / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={HALL.platformSize} />
        <meshStandardMaterial color="#c2a061" roughness={0.95} />
      </mesh>

      <group position={[0, HALL.platformY, 0]}>
        <Colonnade />
        <NijaMandir />
      </group>

      <Swargadwar />
      <SangamWaterfront />
      <CoastalTrees />

      {evening && (
        <>
          <pointLight position={[0, 8, 4]} intensity={2.2} color="#ff9d4d" distance={60} />
          <pointLight position={[0, HALL.platformY + 1, 16]} intensity={1.6} color="#ffb56a" distance={26} />
          <Particles
            count={70}
            area={[16, 6, 20]}
            center={[0, HALL.platformY + 2, 16]}
            color="#ffcf6b"
            size={0.22}
            speed={0.4}
            additive
          />
        </>
      )}
    </SceneCanvas>
  );
}
