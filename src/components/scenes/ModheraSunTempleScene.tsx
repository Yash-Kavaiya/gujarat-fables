import { useMemo } from 'react';
import { Color, DoubleSide } from 'three';
import SceneCanvas from '../three/SceneCanvas';
import DynamicSky from '../three/DynamicSky';
import CloudLayer from '../three/CloudLayer';
import SunAtmosphere from '../three/SunAtmosphere';
import WeatherHaze from '../three/WeatherHaze';
import Pillars from '../three/primitives/Pillars';
import SteppedTank from '../three/primitives/SteppedTank';
import ShikharaTower from '../three/primitives/ShikharaTower';
import WaterPlane from '../three/primitives/WaterPlane';
import Particles from '../three/primitives/Particles';
import Ground from '../three/Ground';
import Hotspot from '../ui/Hotspot';
import { getPlace } from '../../data/places';
import { useSceneStore } from '../../store/useSceneStore';
import { MODHERA_EQUINOX, MODHERA_LIT_RANGE } from '../../lib/sceneConstants';

const place = getPlace('modhera-sun-temple')!;

// ─── Material palette ────────────────────────────────────────────────
const STONE = '#c79a55';
const STONE_DARK = '#a07838';
const STONE_LIGHT = '#dbb872';
const STONE_WEATHERED = '#8a6a30';
const STONE_CARVED = '#bf9045';
const GOLD = '#ffcf6b';
const PLINTH = '#b08840';

// ─── Time-of-day colour computation ─────────────────────────────────
function computeWeather(sunAngle: number) {
  const theta = sunAngle * Math.PI;
  const sunH = Math.sin(theta); // 0 at horizon, 1 at noon
  const horizonWarm = Math.pow(1 - sunH, 1.8);
  const sunEast = Math.cos(theta); // + sunrise, − sunset

  // ── Dynamic sky palette ──
  const skyR = 0.18 + sunH * 0.22 + horizonWarm * 0.15;
  const skyG = 0.28 + sunH * 0.40 + horizonWarm * 0.08;
  const skyB = 0.52 + sunH * 0.30 - horizonWarm * 0.08;
  const sky = new Color(skyR, skyG, skyB).getStyle();

  // ── Horizon / ground tone ──
  const gndR = 0.55 + horizonWarm * 0.25;
  const gndG = 0.50 + sunH * 0.10 - horizonWarm * 0.10;
  const gndB = 0.35 + sunH * 0.15 - horizonWarm * 0.18;
  const ground = new Color(gndR, gndG, gndB).getStyle();

  // ── Fog colour: blends sky and warm haze ──
  const fogR = 0.55 + horizonWarm * 0.35;
  const fogG = 0.52 + sunH * 0.15 - horizonWarm * 0.12;
  const fogB = 0.45 + sunH * 0.20 - horizonWarm * 0.25;
  const fog = new Color(fogR, fogG, fogB).getStyle();

  // ── Sun colour ──
  const sunR = 255;
  const sunG = Math.round(220 - horizonWarm * 55);
  const sunB = Math.round(150 + sunH * 60 - horizonWarm * 30);
  const sunColor = `rgb(${sunR}, ${sunG}, ${sunB})`;

  // ── Ambient & hemisphere intensity ──
  const ambientIntensity = 0.35 + sunH * 0.35;
  const hemiIntensity = 0.4 + sunH * 0.3;

  // ── Fog density ──
  const fogNear = 30 + sunH * 15;
  const fogFar = 200 + sunH * 60 - horizonWarm * 40;

  // ── Cloud density: thicker at dawn/dusk ──
  const cloudDensity = 0.3 + horizonWarm * 0.35;

  return {
    sky,
    ground,
    fog,
    sunColor,
    sunH,
    horizonWarm,
    sunEast,
    ambientIntensity,
    hemiIntensity,
    fogNear,
    fogFar,
    cloudDensity,
    theta,
  };
}

// ─── Animated dust motes in sunbeam ──────────────────────────────────
function SunbeamDust({ lit }: { lit: number }) {
  const count = 120;

  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = -13 + Math.random() * 22;
      positions[i * 3 + 1] = 0.5 + Math.random() * 5.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    return positions;
  }, []);

  if (lit < 0.02) return null;

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffe8c0"
        size={0.12}
        sizeAttenuation
        transparent
        opacity={lit * 0.7}
        depthWrite={false}
      />
    </points>
  );
}

// ─── Decorative frieze / molding strip ───────────────────────────────
function Frieze({
  position,
  size,
  color = STONE_CARVED,
  rotation,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.75} metalness={0.05} />
    </mesh>
  );
}

// ─── Decorative pillar with carved bands ─────────────────────────────
function CarvedPillar({
  position,
  height = 4.2,
  color = STONE,
  radius = 0.3,
}: {
  position: [number, number, number];
  height?: number;
  color?: string;
  radius?: number;
}) {
  const bandCount = 6;
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius * 1.4, radius * 1.6, 0.5, 12]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.9} />
      </mesh>
      <mesh position={[0, height / 2 + 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius * 1.1, height, 14]} />
        <meshStandardMaterial color={color} roughness={0.82} metalness={0.04} />
      </mesh>
      {Array.from({ length: bandCount }).map((_, i) => (
        <mesh
          key={i}
          position={[0, 0.5 + (height / (bandCount + 1)) * (i + 1), 0]}
          castShadow
        >
          <torusGeometry args={[radius * 1.12, 0.03, 6, 16]} />
          <meshStandardMaterial color={STONE_CARVED} roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, height + 0.5, 0]} castShadow>
        <cylinderGeometry args={[radius * 1.6, radius * 0.9, 0.55, 12]} />
        <meshStandardMaterial color={color} roughness={0.75} />
      </mesh>
      <mesh position={[0, height + 0.85, 0]} castShadow>
        <boxGeometry args={[radius * 2.8, 0.35, radius * 2.8]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.85} />
      </mesh>
    </group>
  );
}

// ─── Miniature shrine (for Surya Kund perimeter) ─────────────────────
function MiniatureShrine({
  position,
  color = STONE,
  height = 1.2,
  rotY = 0,
}: {
  position: [number, number, number];
  color?: string;
  height?: number;
  rotY?: number;
}) {
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.4, 0.7]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.4 + height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.55, height, 0.55]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.5 + height / 2, 0.29]} castShadow>
        <boxGeometry args={[0.25, 0.4, 0.06]} />
        <meshStandardMaterial color={STONE_WEATHERED} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.4 + height + 0.25, 0]} castShadow>
        <coneGeometry args={[0.28, 0.5, 4]} />
        <meshStandardMaterial color={color} roughness={0.7} flatShading />
      </mesh>
      <mesh position={[0, 0.4 + height + 0.55, 0]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={0.6}
          roughness={0.4}
          metalness={0.5}
        />
      </mesh>
    </group>
  );
}

// ─── Stone pathway ───────────────────────────────────────────────────
function StonePathway() {
  const slabCount = 24;
  return (
    <group>
      {Array.from({ length: slabCount }).map((_, i) => {
        const x = 20 - i * 1.6;
        const w = 1.1 + Math.random() * 0.3;
        const d = 2.2 + Math.random() * 0.4;
        return (
          <mesh key={i} position={[x, 0.04, (Math.random() - 0.5) * 0.5]} receiveShadow castShadow>
            <boxGeometry args={[w, 0.08, d]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? STONE_LIGHT : i % 3 === 1 ? STONE : STONE_DARK}
              roughness={0.92}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── Simple tree / vegetation ────────────────────────────────────────
function SimpleTree({
  position,
  scale = 1,
  trunkColor = '#6b4226',
  canopyColor = '#4a6b2a',
}: {
  position: [number, number, number];
  scale?: number;
  trunkColor?: string;
  canopyColor?: string;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 3, 6]} />
        <meshStandardMaterial color={trunkColor} roughness={0.95} />
      </mesh>
      <mesh position={[0, 3.5, 0]} castShadow>
        <sphereGeometry args={[1.4, 8, 6]} />
        <meshStandardMaterial color={canopyColor} roughness={0.85} flatShading />
      </mesh>
      <mesh position={[0.4, 3.8, 0.3]} castShadow>
        <sphereGeometry args={[0.9, 7, 5]} />
        <meshStandardMaterial color={canopyColor} roughness={0.85} flatShading />
      </mesh>
    </group>
  );
}

// ─── Dense decorative pillars for Sabha Mandapa ──────────────────────
function SabhaPillars({ height }: { height: number }) {
  const positions = useMemo(() => {
    const out: [number, number, number][] = [];
    const rows = 6;
    const cols = 6;
    const spacing = 2.1;
    const ox = ((cols - 1) * spacing) / 2;
    const oz = ((rows - 1) * spacing) / 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (r > 0 && r < rows - 1 && c > 0 && c < cols - 1) continue;
        out.push([c * spacing - ox, 0, r * spacing - oz]);
      }
    }
    return out;
  }, []);

  return (
    <group>
      {positions.map((pos, i) => (
        <CarvedPillar
          key={i}
          position={[pos[0], pos[1], pos[2]]}
          height={height}
          radius={0.28}
          color={i % 4 === 0 ? STONE_LIGHT : STONE}
        />
      ))}
    </group>
  );
}

// ─── Detailed sanctum (Garbhagriha) ─────────────────────────────────
function Sanctum({ lit }: { lit: number }) {
  return (
    <group position={[-15, 0, 0]}>
      {/* Multi-level plinth */}
      <mesh position={[-0.5, 0.2, 0]} receiveShadow castShadow>
        <boxGeometry args={[6.5, 0.4, 8]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.92} />
      </mesh>
      <mesh position={[-0.5, 0.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[6, 0.3, 7.5]} />
        <meshStandardMaterial color={PLINTH} roughness={0.88} />
      </mesh>

      {/* Rear wall (west) */}
      <mesh position={[-3.2, 3.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 6.5, 7.8]} />
        <meshStandardMaterial color={STONE} roughness={0.85} />
      </mesh>
      {/* North wall */}
      <mesh position={[-0.5, 3.8, 3.9]} castShadow receiveShadow>
        <boxGeometry args={[5.5, 6.5, 0.5]} />
        <meshStandardMaterial color={STONE} roughness={0.85} />
      </mesh>
      {/* South wall */}
      <mesh position={[-0.5, 3.8, -3.9]} castShadow receiveShadow>
        <boxGeometry args={[5.5, 6.5, 0.5]} />
        <meshStandardMaterial color={STONE} roughness={0.85} />
      </mesh>
      {/* East wall with doorway */}
      <mesh position={[2, 4.8, 0]} castShadow>
        <boxGeometry args={[0.4, 3, 7.8]} />
        <meshStandardMaterial color={STONE} roughness={0.85} />
      </mesh>
      <mesh position={[2, 2.8, 2.2]} castShadow>
        <boxGeometry args={[0.5, 3.2, 0.5]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.82} />
      </mesh>
      <mesh position={[2, 2.8, -2.2]} castShadow>
        <boxGeometry args={[0.5, 3.2, 0.5]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.82} />
      </mesh>
      <mesh position={[2, 4.5, 0]} castShadow>
        <boxGeometry args={[0.6, 0.4, 5]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.8} />
      </mesh>

      {/* Wall niches */}
      {[-1.5, 0.5].map((z, i) => (
        <mesh key={`n${i}`} position={[0.2, 3.5, 3.65]} castShadow>
          <boxGeometry args={[0.5, 1.8, 0.12]} />
          <meshStandardMaterial color={STONE_WEATHERED} roughness={0.9} />
        </mesh>
      ))}
      {[-1.5, 0.5].map((z, i) => (
        <mesh key={`s${i}`} position={[0.2, 3.5, -3.65]} castShadow>
          <boxGeometry args={[0.5, 1.8, 0.12]} />
          <meshStandardMaterial color={STONE_WEATHERED} roughness={0.9} />
        </mesh>
      ))}

      {/* Horizontal moldings */}
      <Frieze position={[-0.5, 1.2, 4]} size={[5.5, 0.2, 0.15]} />
      <Frieze position={[-0.5, 1.2, -4]} size={[5.5, 0.2, 0.15]} />
      <Frieze position={[-0.5, 5.5, 4]} size={[5.5, 0.15, 0.15]} />
      <Frieze position={[-0.5, 5.5, -4]} size={[5.5, 0.15, 0.15]} />

      {/* The idol of Surya */}
      <mesh position={[-1.5, 3, 0]}>
        <boxGeometry args={[1.2, 3.2, 1.6]} />
        <meshStandardMaterial
          color="#ffcf6b"
          emissive="#ffb24d"
          emissiveIntensity={0.12 + lit * 3.5}
          roughness={0.35}
          metalness={0.45}
        />
      </mesh>
      <mesh position={[-1.5, 1.2, 0]}>
        <cylinderGeometry args={[0.7, 0.85, 0.4, 8]} />
        <meshStandardMaterial color={STONE_CARVED} roughness={0.8} metalness={0.1} />
      </mesh>

      {lit > 0.05 && (
        <>
          <pointLight position={[-1.5, 3, 0]} intensity={lit * 4} color="#ffd27a" distance={22} />
          <pointLight position={[-0.5, 2, 0]} intensity={lit * 1.5} color="#ffe8a0" distance={10} />
        </>
      )}

      <ShikharaTower position={[0, 6.5, 0]} height={9} baseRadius={2.8} color={STONE} />

      <mesh position={[-0.5, 6.5, 0]} receiveShadow>
        <boxGeometry args={[5.8, 0.3, 7.8]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.88} />
      </mesh>

      <Hotspot position={[0, 17, 0]} label="The sanctum (Garbhagriha) — aligned so the equinox dawn beam strikes the Surya idol directly" />
      <Hotspot position={[-3.2, 4, 4.5]} label="Rear wall — 0.6m thick sandstone, built to channel the first light inward" />
      <Hotspot position={[2.2, 2, 0]} label="East-facing doorway — the entry point of the dawn beam at equinox" />
    </group>
  );
}

// ─── Nritya Mandapa (dance hall) ─────────────────────────────────────
function NrityaMandapa() {
  return (
    <group position={[-7, 0, 0]}>
      <mesh position={[0, 0.6, 0]} receiveShadow castShadow>
        <boxGeometry args={[7, 1.2, 8.5]} />
        <meshStandardMaterial color={PLINTH} roughness={0.88} />
      </mesh>
      <Frieze position={[0, 1.25, 4.3]} size={[7.2, 0.15, 0.15]} />
      <Frieze position={[0, 1.25, -4.3]} size={[7.2, 0.15, 0.15]} />
      <Frieze position={[3.6, 1.25, 0]} size={[0.15, 0.15, 8.5]} />
      <Frieze position={[-3.6, 1.25, 0]} size={[0.15, 0.15, 8.5]} />
      <Pillars rows={3} cols={4} spacing={2.2} height={3} radius={0.24} color={STONE} hollow />
      <mesh position={[0, 4.6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[4.8, 1.4, 4]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.82} flatShading />
      </mesh>
      <mesh position={[0, 5.6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[3.4, 1.2, 4]} />
        <meshStandardMaterial color={STONE} roughness={0.78} flatShading />
      </mesh>
      <mesh position={[0, 6.4, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[2, 0.9, 4]} />
        <meshStandardMaterial color={STONE_LIGHT} roughness={0.75} flatShading />
      </mesh>
      <mesh position={[0, 7.2, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.8} roughness={0.35} metalness={0.5} />
      </mesh>
      <Hotspot position={[0, 8, 0]} label="Nritya Mandapa — the dance hall where the annual Modhera Dance Festival is held" />
    </group>
  );
}

// ─── Sabha Mandapa (great assembly hall) ─────────────────────────────
function SabhaMandapa() {
  const roofHeight = 5.8;
  return (
    <group position={[-1, 0, 0]}>
      <mesh position={[0, 0.65, 0]} receiveShadow castShadow>
        <boxGeometry args={[11, 1.3, 11]} />
        <meshStandardMaterial color={PLINTH} roughness={0.88} />
      </mesh>
      <Frieze position={[0, 1.35, 5.55]} size={[11.2, 0.18, 0.18]} />
      <Frieze position={[0, 1.35, -5.55]} size={[11.2, 0.18, 0.18]} />
      <Frieze position={[5.55, 1.35, 0]} size={[0.18, 0.18, 11]} />
      <Frieze position={[-5.55, 1.35, 0]} size={[0.18, 0.18, 11]} />
      <mesh position={[0, 2, 5.4]} castShadow receiveShadow>
        <boxGeometry args={[10.8, 0.8, 0.25]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.9} />
      </mesh>
      <mesh position={[0, 2, -5.4]} castShadow receiveShadow>
        <boxGeometry args={[10.8, 0.8, 0.25]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.9} />
      </mesh>
      <mesh position={[5.4, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.25, 0.8, 10.8]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.9} />
      </mesh>
      <mesh position={[-5.4, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.25, 0.8, 10.8]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.9} />
      </mesh>
      <group position={[0, 1.3, 0]}>
        <SabhaPillars height={3.8} />
      </group>
      <mesh position={[0, roofHeight, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[6, 1.8, 4]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.82} flatShading />
      </mesh>
      <mesh position={[0, roofHeight + 1.6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[4.2, 1.5, 4]} />
        <meshStandardMaterial color={STONE} roughness={0.78} flatShading />
      </mesh>
      <mesh position={[0, roofHeight + 2.8, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[2.6, 1.2, 4]} />
        <meshStandardMaterial color={STONE_LIGHT} roughness={0.75} flatShading />
      </mesh>
      <mesh position={[0, roofHeight + 3.7, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.4, 0.8, 4]} />
        <meshStandardMaterial color={STONE_CARVED} roughness={0.7} flatShading />
      </mesh>
      <mesh position={[0, roofHeight + 4.5, 0]}>
        <sphereGeometry args={[0.22, 10, 10]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={1} roughness={0.3} metalness={0.55} />
      </mesh>
      <Hotspot position={[0, roofHeight + 5.5, 0]} label="Sabha Mandapa — the 52 pillars count the weeks of the year, a calendar in stone" />
      <Hotspot position={[6, 3, 0]} label="Vedika — the low stone balustrade encircling the assembly hall" />
      <Hotspot position={[-6, 3, 0]} label="Aditya reliefs — twelve sun-god panels mark the months on the walls" />
    </group>
  );
}

// ─── Surrounding environment ─────────────────────────────────────────
function Environment() {
  return (
    <group>
      <StonePathway />
      <SimpleTree position={[30, 0, 18]} scale={1.3} canopyColor="#3d5c22" />
      <SimpleTree position={[35, 0, -12]} scale={1.1} canopyColor="#4a6b2a" />
      <SimpleTree position={[-32, 0, 15]} scale={1.2} canopyColor="#3a5520" />
      <SimpleTree position={[-35, 0, -10]} scale={1.0} canopyColor="#4e7330" />
      <SimpleTree position={[28, 0, -20]} scale={0.9} canopyColor="#445e28" />
      <SimpleTree position={[-28, 0, 22]} scale={1.15} canopyColor="#3c5921" />
      {[[-18, 0, 8], [-18, 0, -8], [10, 0, 10], [10, 0, -10], [-22, 0, 12], [-22, 0, -12]].map(
        (pos, i) => (
          <mesh key={i} position={[pos[0], 0.3, pos[2]]} castShadow>
            <sphereGeometry args={[0.5 + Math.random() * 0.3, 6, 5]} />
            <meshStandardMaterial color="#4a6828" roughness={0.9} flatShading />
          </mesh>
        ),
      )}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={`wall-n${i}`} position={[-25 + i * 10, 0.5, 30]} castShadow receiveShadow>
          <boxGeometry args={[9, 1, 0.3]} />
          <meshStandardMaterial color={STONE_WEATHERED} roughness={0.95} />
        </mesh>
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={`wall-s${i}`} position={[-25 + i * 10, 0.5, -30]} castShadow receiveShadow>
          <boxGeometry args={[9, 1, 0.3]} />
          <meshStandardMaterial color={STONE_WEATHERED} roughness={0.95} />
        </mesh>
      ))}
      <WaterPlane
        size={60}
        depth={12}
        segments={32}
        color="#2a4f5a"
        highlight="#8ab8c4"
        amplitude={0.08}
        position={[50, -0.3, 0]}
      />
      <mesh position={[50, 0.05, 0]} receiveShadow>
        <planeGeometry args={[60, 12]} />
        <meshStandardMaterial color="#5a8a6a" roughness={0.95} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// ─── Dynamic lighting rig ────────────────────────────────────────────
function DynamicLighting({
  sunPos,
  sunColor,
  sunH,
  ambientIntensity,
  hemiIntensity,
  fogColor,
}: {
  sunPos: [number, number, number];
  sunColor: string;
  sunH: number;
  ambientIntensity: number;
  hemiIntensity: number;
  fogColor: string;
}) {
  // Sky colour for hemisphere light top
  const skyColor = useMemo(() => {
    return new Color().setHSL(0.55 + sunH * 0.05, 0.35 + sunH * 0.2, 0.45 + sunH * 0.25);
  }, [sunH]);

  // Ground bounce colour
  const groundColor = useMemo(() => {
    return new Color().setHSL(0.08, 0.4, 0.25 + sunH * 0.1);
  }, [sunH]);

  return (
    <>
      {/* Main sun light */}
      <directionalLight
        position={sunPos}
        intensity={1.5 + sunH * 1.2}
        color={sunColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0003}
        shadow-camera-near={1}
        shadow-camera-far={200}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />
      {/* Warm fill from opposite side */}
      <directionalLight
        position={[-sunPos[0] * 0.4, 15, 10]}
        intensity={0.25 + sunH * 0.15}
        color="#ffeedd"
      />
      {/* Cool sky fill from above */}
      <directionalLight position={[0, 40, 0]} intensity={0.15 + sunH * 0.1} color="#c8d8f0" />
      {/* Ground bounce */}
      <directionalLight position={[0, -5, 0]} intensity={0.08} color="#8a6a30" />

      {/* Ambient light — brighter at noon, dimmer at dawn/dusk */}
      <ambientLight intensity={ambientIntensity} color={fogColor} />

      {/* Hemisphere light — sky above, ground below */}
      <hemisphereLight
        args={[skyColor, groundColor, hemiIntensity]}
      />
    </>
  );
}

// ─── Main scene ──────────────────────────────────────────────────────
export default function ModheraSunTempleScene() {
  const sunAngle = useSceneStore((s) => s.sunAngle);
  const weather = useMemo(() => computeWeather(sunAngle), [sunAngle]);

  const { sunPos, lit, sunColor } = useMemo(() => {
    const theta = sunAngle * Math.PI;
    const R = 65;
    const sunPos: [number, number, number] = [
      Math.cos(theta) * R,
      Math.max(Math.sin(theta) * R, 2),
      0,
    ];
    const lit = Math.max(0, 1 - Math.abs(sunAngle - MODHERA_EQUINOX) / MODHERA_LIT_RANGE);
    const lowness = 1 - Math.min(Math.sin(theta), 1);
    const sunColor = `rgb(255, ${Math.round(220 - lowness * 50)}, ${Math.round(150 + (1 - lowness) * 60)})`;
    return { sunPos, lit, sunColor };
  }, [sunAngle]);

  // Miniature shrines for the Surya Kund
  const shrinePositions = useMemo(() => {
    const positions: { pos: [number, number, number]; rot: number }[] = [];
    const tankCx = 16;
    const tankHalf = 9;
    const spacing = 3.2;
    for (let x = tankCx - tankHalf; x <= tankCx + tankHalf; x += spacing) {
      positions.push({ pos: [x, 0.15, tankHalf + 0.5], rot: 0 });
    }
    for (let x = tankCx - tankHalf; x <= tankCx + tankHalf; x += spacing) {
      positions.push({ pos: [x, 0.15, -tankHalf - 0.5], rot: Math.PI });
    }
    for (let z = -tankHalf + spacing; z < tankHalf; z += spacing) {
      positions.push({ pos: [tankCx + tankHalf + 0.5, 0.15, z], rot: Math.PI / 2 });
    }
    for (let z = -tankHalf + spacing; z < tankHalf; z += spacing) {
      positions.push({ pos: [tankCx - tankHalf - 0.5, 0.15, z], rot: -Math.PI / 2 });
    }
    return positions;
  }, []);

  // Dynamic palette for SceneCanvas (fog, background)
  const dynamicPalette = useMemo(() => ({
    sky: weather.sky,
    ground: weather.ground,
    accent: place.palette.accent,
    fog: weather.fog,
  }), [weather]);

  return (
    <SceneCanvas
      palette={dynamicPalette}
      cameraPosition={[28, 14, 26]}
      fov={45}
      fog={[weather.fogNear, weather.fogFar]}
      controls={{ target: [-6, 4, 0], minDistance: 10, maxDistance: 80 }}
      bloomIntensity={0.7 + lit * 0.9}
      sky={<DynamicSky sunAngle={sunAngle} />}
    >
      {/* ── Dynamic lighting rig ── */}
      <DynamicLighting
        sunPos={sunPos}
        sunColor={sunColor}
        sunH={weather.sunH}
        ambientIntensity={weather.ambientIntensity}
        hemiIntensity={weather.hemiIntensity}
        fogColor={weather.fog}
      />

      {/* ── Sun atmosphere: corona, rays, stars ── */}
      <SunAtmosphere
        position={sunPos}
        color={sunColor}
        sunHeight={weather.sunH}
        lit={lit}
      />

      {/* ── Cloud layer ── */}
      <CloudLayer sunAngle={sunAngle} density={weather.cloudDensity} />

      {/* ── Weather haze & atmospheric dust ── */}
      <WeatherHaze sunAngle={sunAngle} />

      {/* ── Ground ── */}
      <Ground color={weather.ground} size={400} />

      {/* ── Surya Kund — stepped tank with miniature shrines ── */}
      <SteppedTank
        position={[16, 0, 0]}
        levels={8}
        outerSize={20}
        stepWidth={1.05}
        stepHeight={0.55}
        color={STONE}
        waterColor="#2e5664"
        waterHighlight="#ffdca0"
      />
      {shrinePositions.map((s, i) => (
        <MiniatureShrine
          key={i}
          position={s.pos}
          height={0.9 + (i % 3) * 0.2}
          rotY={s.rot}
          color={i % 5 === 0 ? STONE_LIGHT : STONE}
        />
      ))}
      <Hotspot position={[16, 1, 11]} label="Surya Kund — the great stepped tank with over a hundred miniature shrines" />

      {/* ── Main temple platform ── */}
      <mesh position={[-8, 0.9, 0]} receiveShadow castShadow>
        <boxGeometry args={[28, 1.8, 14]} />
        <meshStandardMaterial color={PLINTH} roughness={0.9} />
      </mesh>
      <Frieze position={[-8, 1.85, 7.1]} size={[28.4, 0.2, 0.25]} color={STONE_DARK} />
      <Frieze position={[-8, 1.85, -7.1]} size={[28.4, 0.2, 0.25]} color={STONE_DARK} />
      <Frieze position={[6.1, 1.85, 0]} size={[0.25, 0.2, 14]} color={STONE_DARK} />
      <Frieze position={[-22.1, 1.85, 0]} size={[0.25, 0.2, 14]} color={STONE_DARK} />

      {/* ── Sabha Mandapa — great assembly hall ── */}
      <SabhaMandapa />

      {/* ── Nritya Mandapa — dance hall ── */}
      <NrityaMandapa />

      {/* ── Sanctum (Garbhagriha) with Shikhara ── */}
      <Sanctum lit={lit} />

      {/* ── Environment ── */}
      <Environment />

      {/* ── Equinox beam — volumetric light shaft ── */}
      {lit > 0.02 && (
        <group>
          <mesh position={[0, 3.2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.4 + lit * 0.35, 0.6 + lit * 0.2, 38, 20, 1, true]} />
            <meshBasicMaterial
              color="#ffe2a8"
              transparent
              opacity={lit * 0.35}
              side={DoubleSide}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[0, 3.2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.15 + lit * 0.1, 0.25 + lit * 0.1, 38, 12, 1, true]} />
            <meshBasicMaterial
              color="#fff5d4"
              transparent
              opacity={lit * 0.5}
              side={DoubleSide}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[-15, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[3 + lit * 1.5, 24]} />
            <meshBasicMaterial
              color="#ffe8b0"
              transparent
              opacity={lit * 0.3}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}

      {/* ── Atmospheric dust motes in the sunbeam ── */}
      <SunbeamDust lit={lit} />

      {/* ── Floating atmospheric particles ── */}
      <Particles
        count={80}
        area={[50, 20, 50]}
        center={[0, 10, 0]}
        color="#ffe0a0"
        size={0.25}
        speed={0.15}
        additive
      />

      {/* ── Ambient hotspots ── */}
      <Hotspot position={[16, 1, 0]} label="Surya Kund — 108 miniature shrines surround the sacred tank, each an offering to the sun" />
      <Hotspot position={[-8, 10, 0]} label="Modhera Sun Temple complex — Solanki architecture at its finest, c. 1026 CE" />
      <Hotspot position={[-15, 0.3, 6]} label="Pushpavati river flows nearby — pilgrims bathe here before approaching the temple" />
    </SceneCanvas>
  );
}
