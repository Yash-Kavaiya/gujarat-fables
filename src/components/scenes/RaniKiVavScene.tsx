import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance, OrbitControls } from '@react-three/drei';
import { Vector3, Color, DoubleSide, Group } from 'three';
import SceneCanvas from '../three/SceneCanvas';
import WaterPlane from '../three/primitives/WaterPlane';
import Particles from '../three/primitives/Particles';
import Hotspot from '../ui/Hotspot';
import { getPlace } from '../../data/places';
import { useSceneStore } from '../../store/useSceneStore';
import {
  RANI_PLACE_ID,
  STONE,
  WATER_COLORS,
  STOREY_COUNT,
  MAX_LEVEL,
  LEVEL_DROP,
  LEVEL_RUN,
  TRENCH_HALF_WIDTH,
  UPPER_HALF_WIDTH,
  WELL_SHAFT,
  LIGHTING_PRESETS,
  DESCENT_STATIONS,
  RANI_HOTSPOTS,
  levelCenter,
  makeMandapaPillars,
  makeMandapaLintels,
  makeNicheFigures,
  makeSolankiStepCascades,
  makeElephantFriezes,
  makeDiyaLamps,
  makeParkTrees,
  makeParkVisitors,
  type NicheFigureSpec,
  type PillarSpec,
} from './raniKiVavLayout';

const place = getPlace(RANI_PLACE_ID)!;

// ==========================================
// Materials
// ==========================================

function SandstoneMat({
  color = STONE.base,
  roughness = 0.88,
  metalness = 0.05,
}: {
  color?: string;
  roughness?: number;
  metalness?: number;
}) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={metalness}
    />
  );
}

function CarvedSandstoneMat({
  color = STONE.carving,
  roughness = 0.78,
  emissive = '#382612',
  emissiveIntensity = 0.35,
}: {
  color?: string;
  roughness?: number;
  emissive?: string;
  emissiveIntensity?: number;
}) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
    />
  );
}

// ==========================================
// 1. Archaeological Park Ground & Entry Torana
// ==========================================

function ArchaeologicalGround() {
  const trees = useMemo(() => makeParkTrees(), []);
  const visitors = useMemo(() => makeParkVisitors(), []);

  return (
    <group>
      {/* Left side archaeological lawn */}
      <mesh position={[-(UPPER_HALF_WIDTH + 35), 0, -10]} receiveShadow>
        <boxGeometry args={[70, 0.2, 120]} />
        <meshStandardMaterial color={STONE.ground} roughness={0.95} />
      </mesh>

      {/* Right side archaeological lawn */}
      <mesh position={[UPPER_HALF_WIDTH + 35, 0, -10]} receiveShadow>
        <boxGeometry args={[70, 0.2, 120]} />
        <meshStandardMaterial color={STONE.ground} roughness={0.95} />
      </mesh>

      {/* East approach lawn */}
      <mesh position={[0, 0, 36]} receiveShadow>
        <boxGeometry args={[140, 0.2, 36]} />
        <meshStandardMaterial color={STONE.ground} roughness={0.95} />
      </mesh>

      {/* West lawn behind the circular well */}
      <mesh position={[0, 0, -58]} receiveShadow>
        <boxGeometry args={[140, 0.2, 40]} />
        <meshStandardMaterial color={STONE.ground} roughness={0.95} />
      </mesh>

      {/* Paved entrance forecourt and walkways */}
      <mesh position={[0, 0.05, 22]} receiveShadow>
        <boxGeometry args={[16, 0.12, 12]} />
        <SandstoneMat color={STONE.path} roughness={0.92} />
      </mesh>

      {/* Excavation trench perimeter stone balustrades (Vedika) */}
      <group position={[0, 0.35, 0]}>
        {/* Left and right long perimeter walls */}
        {[-1, 1].map((side) => (
          <group key={side}>
            <mesh position={[side * (UPPER_HALF_WIDTH + 0.35), 0, -10]} castShadow receiveShadow>
              <boxGeometry args={[0.7, 0.65, 54]} />
              <SandstoneMat color={STONE.border} roughness={0.9} />
            </mesh>
            {/* Coping stone cap */}
            <mesh position={[side * (UPPER_HALF_WIDTH + 0.35), 0.38, -10]}>
              <boxGeometry args={[0.9, 0.12, 54.2]} />
              <SandstoneMat color={STONE.carving} roughness={0.8} />
            </mesh>
          </group>
        ))}

        {/* East entrance boundary gate posts */}
        {[-1, 1].map((side) => (
          <mesh key={`post-${side}`} position={[side * 3.6, 0.6, 17.5]} castShadow>
            <boxGeometry args={[0.9, 1.2, 0.9]} />
            <SandstoneMat color={STONE.pillar} roughness={0.85} />
          </mesh>
        ))}
      </group>

      {/* Trees around the archaeological perimeter */}
      {trees.map((t, idx) => (
        <group key={idx} position={t.position} scale={t.scale}>
          {/* Trunk */}
          <mesh position={[0, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.32, 2.8, 6]} />
            <meshStandardMaterial color="#4a3b2c" roughness={0.98} />
          </mesh>
          {/* Foliage crown */}
          <mesh position={[0, 3.4, 0]} castShadow>
            <sphereGeometry args={[1.5, 8, 7]} />
            <meshStandardMaterial color="#3e522d" roughness={0.95} />
          </mesh>
          <mesh position={[0.4, 4.2, 0.3]} castShadow>
            <sphereGeometry args={[1.1, 7, 6]} />
            <meshStandardMaterial color="#4d6638" roughness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Visitor scale references */}
      <Instances range={visitors.length}>
        <capsuleGeometry args={[0.12, 0.42, 4, 6]} />
        <meshStandardMaterial color="#2d2218" roughness={0.9} />
        {visitors.map((p, i) => (
          <Instance key={i} position={p} />
        ))}
      </Instances>
    </group>
  );
}

function EntranceTorana() {
  const [, eY, eZ] = levelCenter(0);

  return (
    <group position={[0, eY, eZ + 8.5]}>
      {/* Twin ornate torana gateway pillars */}
      {[-2.4, 2.4].map((x, idx) => (
        <group key={idx} position={[x, 0, 0]}>
          {/* Molded base */}
          <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.1, 0.8, 1.1]} />
            <SandstoneMat color={STONE.base} />
          </mesh>
          {/* Main fluted column */}
          <mesh position={[0, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.36, 0.42, 3.4, 12]} />
            <CarvedSandstoneMat />
          </mesh>
          {/* Pot-and-foliage capital */}
          <mesh position={[0, 4.4, 0]} castShadow>
            <sphereGeometry args={[0.5, 10, 8]} />
            <CarvedSandstoneMat color={STONE.carving} />
          </mesh>
          {/* Four-way bracket head */}
          <mesh position={[0, 4.9, 0]} castShadow>
            <boxGeometry args={[1.0, 0.35, 1.0]} />
            <SandstoneMat color={STONE.lintel} />
          </mesh>
        </group>
      ))}

      {/* Main horizontal architrave beam */}
      <mesh position={[0, 5.2, 0]} castShadow>
        <boxGeometry args={[6.4, 0.48, 0.85]} />
        <SandstoneMat color={STONE.lintel} />
      </mesh>

      {/* Triangular ornamental crest / pediment */}
      <mesh position={[0, 6.2, 0]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[2.8, 1.5, 4]} />
        <SandstoneMat color={STONE.carving} />
      </mesh>

      {/* Golden Kalasha finials */}
      <mesh position={[0, 7.1, 0]}>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshStandardMaterial color={STONE.gold} metalness={0.7} roughness={0.3} />
      </mesh>
      {[-2.4, 2.4].map((x, i) => (
        <mesh key={i} position={[x, 5.7, 0]}>
          <coneGeometry args={[0.18, 0.5, 6]} />
          <meshStandardMaterial color={STONE.gold} metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// ==========================================
// 2. The 7 Stepped Terraces & Retaining Walls
// ==========================================

function SteppedTerraces() {
  const steps = useMemo(() => makeSolankiStepCascades(), []);

  return (
    <group>
      {/* 7 Storey floor platforms */}
      {Array.from({ length: STOREY_COUNT }).map((_, i) => {
        const [, cy, cz] = levelCenter(i);
        const depthTone = i >= 4 ? STONE.patina : STONE.floor;

        return (
          <group key={`terrace-${i}`}>
            {/* Main floor slab */}
            <mesh position={[0, cy, cz]} receiveShadow>
              <boxGeometry args={[TRENCH_HALF_WIDTH * 2 + 0.1, 0.55, LEVEL_RUN + 0.2]} />
              <SandstoneMat color={depthTone} roughness={0.92} />
            </mesh>

            {/* Stepped side plinth ledges along the walls */}
            {[-1, 1].map((side) => (
              <mesh
                key={`plinth-${side}`}
                position={[side * (TRENCH_HALF_WIDTH - 0.5), cy + 0.45, cz]}
                receiveShadow
                castShadow
              >
                <boxGeometry args={[0.9, 0.35, LEVEL_RUN]} />
                <SandstoneMat color={STONE.carving} roughness={0.88} />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* Interlocking Solanki Pyramidal & Central Step Flights */}
      {steps.map((st) => (
        <mesh
          key={st.id}
          position={st.position}
          rotation={[0, st.rotationY ?? 0, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={st.size} />
          <SandstoneMat color={STONE.step} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function RetainingWalls() {
  const friezes = useMemo(() => makeElephantFriezes(), []);

  return (
    <group>
      {/* Tiered Sandstone Side Walls for each of the 7 levels */}
      {Array.from({ length: STOREY_COUNT }).map((_, lvl) => {
        const [, cy, cz] = levelCenter(lvl);
        const wallHeight = LEVEL_DROP + 3.8;
        const depthColor = lvl >= 5 ? '#806846' : STONE.base;

        return (
          <group key={`wall-group-${lvl}`}>
            {[-1, 1].map((side) => (
              <group key={`wall-${side}`} position={[side * (TRENCH_HALF_WIDTH + 0.5), cy + wallHeight * 0.42, cz]}>
                {/* Main heavy sandstone wall slab */}
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[1.1, wallHeight, LEVEL_RUN + 0.4]} />
                  <SandstoneMat color={depthColor} roughness={0.92} />
                </mesh>

                {/* Projecting Kapotali cornice mouldings */}
                <mesh position={[-side * 0.48, wallHeight * 0.45, 0]} castShadow>
                  <boxGeometry args={[0.42, 0.28, LEVEL_RUN + 0.4]} />
                  <SandstoneMat color={STONE.lintel} roughness={0.85} />
                </mesh>
                <mesh position={[-side * 0.48, -wallHeight * 0.35, 0]} castShadow>
                  <boxGeometry args={[0.35, 0.22, LEVEL_RUN + 0.4]} />
                  <SandstoneMat color={STONE.lintel} roughness={0.85} />
                </mesh>
              </group>
            ))}
          </group>
        );
      })}

      {/* Continuous Gajathara (Elephant Frieze) along the wall bases */}
      <Instances range={friezes.length}>
        <boxGeometry args={[0.32, 0.48, 0.65]} />
        <meshStandardMaterial color={STONE.carving} roughness={0.82} />
        {friezes.map((f, i) => (
          <Instance key={i} position={f.position} rotation={[0, f.rotationY, 0]} />
        ))}
      </Instances>
    </group>
  );
}

// ==========================================
// 3. Ornate Solanki Mandapa Pavilions
// ==========================================

function MandapaPavilions() {
  const pillars = useMemo(() => makeMandapaPillars(), []);
  const lintels = useMemo(() => makeMandapaLintels(), []);

  return (
    <group>
      {/* Carved Columns (Stambhas) */}
      {pillars.map((p: PillarSpec) => (
        <group key={p.id} position={p.position}>
          {/* Octagonal / Molded Base (Kumbha) */}
          <mesh position={[0, -p.height * 0.45, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[p.radius * 1.35, p.radius * 1.5, 0.35, 8]} />
            <SandstoneMat color={STONE.base} />
          </mesh>

          {/* Fluted Main Shaft with Mid-ring */}
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[p.radius * 0.95, p.radius * 1.05, p.height * 0.75, 12]} />
            <CarvedSandstoneMat color={STONE.pillar} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <torusGeometry args={[p.radius * 1.1, 0.05, 6, 12]} />
            <SandstoneMat color={STONE.lintel} />
          </mesh>

          {/* Pot-and-Foliage Capital (Bharani / Kalasha) */}
          <mesh position={[0, p.height * 0.4, 0]} castShadow>
            <sphereGeometry args={[p.radius * 1.25, 8, 8]} />
            <CarvedSandstoneMat color={STONE.carving} />
          </mesh>

          {/* 4-Way Bracket Head (Madal / Taranga) */}
          <mesh position={[0, p.height * 0.48, 0]} castShadow>
            <boxGeometry args={[p.radius * 2.8, 0.18, p.radius * 2.8]} />
            <SandstoneMat color={STONE.lintel} />
          </mesh>
        </group>
      ))}

      {/* Horizontal Cross Beams and Cornices */}
      {lintels.map((l, i) => (
        <mesh key={i} position={l.position} castShadow receiveShadow>
          <boxGeometry args={l.size} />
          <SandstoneMat color={STONE.lintel} roughness={0.86} />
        </mesh>
      ))}
    </group>
  );
}

// ==========================================
// 4. Carved Sculptural Niches & Figures
// ==========================================

function SculptedFigure({ figure }: { figure: NicheFigureSpec }) {
  const isSheshashayi = figure.sculptureType === 'deity' && figure.level === 6;
  const isApsara = figure.sculptureType === 'apsara';
  const isNagakanya = figure.sculptureType === 'nagakanya';
  const isAvatar = figure.sculptureType === 'avatar';

  return (
    <group position={figure.position} rotation={[0, figure.rotationY, 0]}>
      {/* Niche frame (Rathika) */}
      <mesh position={[0, 0, -0.15]} receiveShadow>
        <boxGeometry args={[0.95, 2.1, 0.28]} />
        <SandstoneMat color={STONE.dark} roughness={0.95} />
      </mesh>

      {/* Flanking miniature pilasters */}
      {[-0.48, 0.48].map((px, i) => (
        <mesh key={i} position={[px, 0, 0.02]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 1.9, 8]} />
          <SandstoneMat color={STONE.carving} />
        </mesh>
      ))}

      {/* Niche pediment (Udgama) */}
      <mesh position={[0, 1.15, 0.04]} castShadow>
        <coneGeometry args={[0.55, 0.45, 4]} />
        <SandstoneMat color={STONE.carving} />
      </mesh>

      {/* --- SCULPTED HIGH-RELIEF DEITY / APSARA --- */}
      <group position={[0, -0.05, 0.08]}>
        {/* Pedestal base (Pitha) */}
        <mesh position={[0, -0.78, 0]} castShadow>
          <boxGeometry args={[0.55, 0.16, 0.25]} />
          <CarvedSandstoneMat />
        </mesh>

        {/* Lower body (Dhoti / Sari) */}
        {isNagakanya ? (
          // Coiling serpent tail for Nagakanya
          <mesh position={[0, -0.38, 0]} rotation={[0.2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.22, 0.75, 8]} />
            <CarvedSandstoneMat color={STONE.carving} />
          </mesh>
        ) : (
          <mesh position={[0, -0.38, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.2, 0.75, 8]} />
            <CarvedSandstoneMat color={STONE.carving} />
          </mesh>
        )}

        {/* Torso with jewelry / sacred thread */}
        <mesh
          position={[0, 0.12, 0]}
          rotation={[0, 0, isApsara ? 0.12 : 0]}
          castShadow
        >
          <capsuleGeometry args={[0.14, 0.42, 4, 8]} />
          <CarvedSandstoneMat color={STONE.carving} />
        </mesh>

        {/* Crowned head (Mukuta) */}
        <mesh position={[0, 0.48, 0]} castShadow>
          <sphereGeometry args={[0.13, 8, 8]} />
          <CarvedSandstoneMat color={STONE.carving} />
        </mesh>
        <mesh position={[0, 0.64, 0]} castShadow>
          <coneGeometry args={[0.11, 0.24, 6]} />
          <CarvedSandstoneMat color={STONE.gold} />
        </mesh>

        {/* Halo / Serpent hood / Mirror attribute */}
        {isNagakanya ? (
          // 5-headed serpent hood fan
          <mesh position={[0, 0.62, -0.05]} castShadow>
            <cylinderGeometry args={[0.3, 0.15, 0.35, 8, 1, false, 0, Math.PI]} />
            <CarvedSandstoneMat color={STONE.carving} />
          </mesh>
        ) : isApsara ? (
          // Raised hand holding mirror (Darpana)
          <mesh position={[0.22, 0.32, 0.08]} rotation={[0.4, 0, -0.3]}>
            <circleGeometry args={[0.08, 8]} />
            <meshStandardMaterial color={STONE.gold} metalness={0.8} roughness={0.2} />
          </mesh>
        ) : isAvatar && figure.deity.includes('Varaha') ? (
          // Varaha Boar snout + Earth sphere
          <group>
            <mesh position={[0, 0.46, 0.14]}>
              <coneGeometry args={[0.08, 0.18, 6]} />
              <CarvedSandstoneMat />
            </mesh>
            <mesh position={[0.16, 0.56, 0.1]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshStandardMaterial color="#6a8a58" roughness={0.8} />
            </mesh>
          </group>
        ) : isSheshashayi ? (
          // Multi-headed serpent crown
          <mesh position={[0, 0.65, -0.06]}>
            <torusGeometry args={[0.25, 0.06, 6, 12, Math.PI]} />
            <CarvedSandstoneMat color={STONE.gold} />
          </mesh>
        ) : (
          // Decorative halo (Prabhavali)
          <mesh position={[0, 0.48, -0.04]}>
            <circleGeometry args={[0.22, 12]} />
            <CarvedSandstoneMat color={STONE.lintel} />
          </mesh>
        )}
      </group>
    </group>
  );
}

function SculptedNiches() {
  const figures = useMemo(() => makeNicheFigures(), []);

  return (
    <group>
      {figures.map((fig) => (
        <SculptedFigure key={fig.id} figure={fig} />
      ))}
    </group>
  );
}

// ==========================================
// 5. The Sacred Sheshashayi Vishnu Sanctum
// ==========================================

function SheshashayiVishnuSanctum() {
  const [, vy, vz] = levelCenter(6);
  const sanctumZ = vz - 3.2;

  return (
    <group position={[0, vy, sanctumZ]}>
      {/* Grand Arch Frame */}
      <mesh position={[0, 2.6, 0]} receiveShadow castShadow>
        <boxGeometry args={[6.8, 5.2, 0.8]} />
        <SandstoneMat color={STONE.dark} roughness={0.95} />
      </mesh>

      {/* Recessed Niche Chamber */}
      <mesh position={[0, 2.2, 0.35]} receiveShadow>
        <boxGeometry args={[5.6, 4.2, 0.4]} />
        <SandstoneMat color="#543c22" roughness={0.98} />
      </mesh>

      {/* --- LORD VISHNU RECLINING ON ANANTA SHESHANAGA --- */}
      <group position={[0, 1.2, 0.65]}>
        {/* Coiled Serpent Bed (Sheshanaga) */}
        {[-0.3, 0, 0.3].map((yo, i) => (
          <mesh key={i} position={[0, yo, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[1.85 - i * 0.15, 0.24, 8, 24, Math.PI * 0.85]} />
            <CarvedSandstoneMat color="#b38a54" />
          </mesh>
        ))}

        {/* Reclining Vishnu Figure */}
        {/* Torso & Head */}
        <mesh position={[-0.45, 0.55, 0.1]} rotation={[0, 0, -0.32]} castShadow>
          <capsuleGeometry args={[0.26, 1.1, 6, 10]} />
          <CarvedSandstoneMat color={STONE.carving} />
        </mesh>
        {/* Crowned Head (Kirita Mukuta) */}
        <mesh position={[-1.15, 0.95, 0.15]} castShadow>
          <sphereGeometry args={[0.22, 10, 10]} />
          <CarvedSandstoneMat color={STONE.carving} />
        </mesh>
        <mesh position={[-1.38, 1.12, 0.18]} rotation={[0, 0, -0.4]} castShadow>
          <coneGeometry args={[0.18, 0.48, 8]} />
          <meshStandardMaterial color={STONE.gold} metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Legs resting horizontally */}
        <mesh position={[0.75, 0.32, 0.12]} rotation={[0, 0, 0.1]} castShadow>
          <capsuleGeometry args={[0.22, 1.4, 6, 10]} />
          <CarvedSandstoneMat color={STONE.carving} />
        </mesh>

        {/* Four Divine Arms holding Conch, Discus, Mace, Lotus */}
        <mesh position={[-0.8, 0.35, 0.25]} rotation={[0.4, 0, -0.5]}>
          <cylinderGeometry args={[0.07, 0.09, 0.65, 6]} />
          <CarvedSandstoneMat />
        </mesh>
        <mesh position={[-0.5, 0.85, 0.25]} rotation={[-0.3, 0, -0.4]}>
          <cylinderGeometry args={[0.07, 0.09, 0.65, 6]} />
          <CarvedSandstoneMat />
        </mesh>
        {/* Discus (Chakra) */}
        <mesh position={[-0.35, 1.25, 0.28]}>
          <torusGeometry args={[0.14, 0.03, 6, 12]} />
          <meshStandardMaterial color={STONE.gold} metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Conch (Shankha) */}
        <mesh position={[-0.95, 0.12, 0.32]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#f0ede4" roughness={0.5} />
        </mesh>

        {/* Seven-Headed Serpent Fan Canopy above Vishnu's Crown */}
        {[-3, -2, -1, 0, 1, 2, 3].map((angleIdx) => {
          const a = (angleIdx / 3) * 0.45;
          return (
            <mesh
              key={angleIdx}
              position={[-1.35 + Math.sin(a) * 0.55, 1.35 + Math.cos(a) * 0.45, 0.05]}
              rotation={[0, 0, -a]}
              castShadow
            >
              <coneGeometry args={[0.1, 0.45, 6]} />
              <CarvedSandstoneMat color={STONE.gold} />
            </mesh>
          );
        })}

        {/* Goddess Lakshmi seated at Vishnu's feet */}
        <group position={[1.7, 0.25, 0.2]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.14, 0.45, 4, 8]} />
            <CarvedSandstoneMat color={STONE.carving} />
          </mesh>
          <mesh position={[0, 0.38, 0]}>
            <sphereGeometry args={[0.11, 8, 8]} />
            <CarvedSandstoneMat />
          </mesh>
        </group>

        {/* Lotus stem from navel with Lord Brahma seated */}
        <group position={[-0.25, 0.7, 0.18]}>
          <mesh position={[0, 0.55, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 1.1, 6]} />
            <meshStandardMaterial color="#507844" roughness={0.8} />
          </mesh>
          {/* Lotus Flower */}
          <mesh position={[0, 1.15, 0]}>
            <cylinderGeometry args={[0.3, 0.1, 0.16, 8]} />
            <meshStandardMaterial color="#e07a8b" roughness={0.6} />
          </mesh>
          {/* Seated Lord Brahma */}
          <mesh position={[0, 1.42, 0]} castShadow>
            <capsuleGeometry args={[0.12, 0.35, 4, 8]} />
            <CarvedSandstoneMat color={STONE.gold} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ==========================================
// 6. The Deep Western Circular Well Shaft (Kupa)
// ==========================================

function CircularWellShaft({ timeOfDay }: { timeOfDay: 'day' | 'dawn' | 'night' }) {
  const waterProps = WATER_COLORS[timeOfDay];

  return (
    <group position={[0, 0, WELL_SHAFT.centerZ]}>
      {/* Outer Ground Rim & Protective Parapet */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[WELL_SHAFT.radius + 0.6, WELL_SHAFT.radius + 0.9, 0.9, 32, 1, true]} />
        <SandstoneMat color={STONE.border} roughness={0.9} />
      </mesh>

      {/* Deep Cylinder Masonry Wall */}
      <mesh position={[0, -WELL_SHAFT.depth * 0.42, 0]} castShadow receiveShadow>
        <cylinderGeometry
          args={[WELL_SHAFT.radius, WELL_SHAFT.radius, WELL_SHAFT.depth, 36, 6, true]}
        />
        <meshStandardMaterial color="#695133" roughness={0.96} side={DoubleSide} />
      </mesh>

      {/* Concentric Cantilever Corbel Balconies inside the Well */}
      {Array.from({ length: WELL_SHAFT.tierCount }).map((_, i) => {
        const ringY = -i * 4.8 - 2.5;
        return (
          <group key={`well-ring-${i}`} position={[0, ringY, 0]}>
            {/* Ledge ring */}
            <mesh castShadow receiveShadow>
              <torusGeometry args={[WELL_SHAFT.radius - 0.28, 0.28, 8, 32]} />
              <SandstoneMat color={STONE.lintel} roughness={0.88} />
            </mesh>

            {/* Radial cantilever stone brackets */}
            {Array.from({ length: 8 }).map((_, bi) => {
              const a = (bi / 8) * Math.PI * 2;
              return (
                <mesh
                  key={bi}
                  position={[
                    Math.cos(a) * (WELL_SHAFT.radius - 0.55),
                    -0.25,
                    Math.sin(a) * (WELL_SHAFT.radius - 0.55),
                  ]}
                  rotation={[0, -a, 0]}
                  castShadow
                >
                  <boxGeometry args={[0.5, 0.45, 0.24]} />
                  <SandstoneMat color={STONE.carving} />
                </mesh>
              );
            })}
          </group>
        );
      })}

      {/* Structural Cross Beams spanning the Well Mouth */}
      {[-1.5, 1.5].map((x, i) => (
        <mesh key={i} position={[x, -0.15, 0]} castShadow>
          <boxGeometry args={[0.45, 0.45, WELL_SHAFT.radius * 2 - 0.2]} />
          <SandstoneMat color={STONE.lintel} />
        </mesh>
      ))}

      {/* Deep Emerald Still Water Surface */}
      <WaterPlane
        size={WELL_SHAFT.radius * 2 - 0.2}
        segments={32}
        color={waterProps.color}
        highlight={waterProps.highlight}
        amplitude={waterProps.amplitude}
        opacity={waterProps.opacity}
        position={[0, WELL_SHAFT.waterY, 0]}
      />
    </group>
  );
}

// ==========================================
// 7. Diya Oil Lamps & Night Aarti Lighting
// ==========================================

function DiyaOilLamps({ active }: { active: boolean }) {
  const lamps = useMemo(() => makeDiyaLamps(), []);

  return (
    <group>
      {/* Small Clay / Brass Diya bowls */}
      <Instances range={lamps.length}>
        <cylinderGeometry args={[0.12, 0.06, 0.08, 8]} />
        <meshStandardMaterial color="#8a5a32" roughness={0.9} />
        {lamps.map((l) => (
          <Instance key={l.id} position={l.position} />
        ))}
      </Instances>

      {/* Glowing Flames */}
      <Instances range={lamps.length}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#ffbd4a" />
        {lamps.map((l) => (
          <Instance
            key={`flame-${l.id}`}
            position={[l.position[0], l.position[1] + 0.07, l.position[2]]}
          />
        ))}
      </Instances>

      {/* Dynamic Point Lights at Key Stations */}
      {active && (
        <>
          <pointLight position={[0, -3.0, 10]} intensity={1.8} color="#ff9c38" distance={16} />
          <pointLight position={[0, -9.0, -2]} intensity={2.4} color="#ffa542" distance={18} />
          <pointLight position={[0, -16.0, -18]} intensity={3.2} color="#ffb050" distance={22} />
          <pointLight
            position={[0, -18.5, -23.5]}
            intensity={4.2}
            color="#ffd27a"
            distance={18}
          />
          <pointLight
            position={[0, WELL_SHAFT.waterY + 3.5, WELL_SHAFT.centerZ]}
            intensity={2.8}
            color="#ff9030"
            distance={20}
          />
        </>
      )}
    </group>
  );
}

// ==========================================
// 8. Volumetric God-Rays & Atmospheric Dust
// ==========================================

function VolumetricAtmosphere({
  opacity,
  timeOfDay,
}: {
  opacity: number;
  timeOfDay: 'day' | 'dawn' | 'night';
}) {
  const particleColor = timeOfDay === 'night' ? '#ff9e3b' : timeOfDay === 'dawn' ? '#fcd0a1' : '#ffe8b5';

  return (
    <group>
      {/* Volumetric Sunbeam Shafts streaming through the stepped opening */}
      {opacity > 0.05 &&
        [-2.4, 0, 2.4].map((x, i) => (
          <mesh
            key={i}
            position={[x, -11, -16]}
            rotation={[0.34, 0, 0.03 * (i - 1)]}
          >
            <cylinderGeometry args={[0.9, 3.8, 30, 16, 1, true]} />
            <meshBasicMaterial
              color={timeOfDay === 'dawn' ? '#ffdfb8' : '#fff0cb'}
              transparent
              opacity={opacity * 0.45}
              depthWrite={false}
              side={DoubleSide}
            />
          </mesh>
        ))}

      {/* Floating dust / mist motes catching the light */}
      <Particles
        count={280}
        area={[14, 26, 48]}
        center={[0, -10, -12]}
        color={particleColor}
        size={timeOfDay === 'night' ? 0.35 : 0.28}
        speed={timeOfDay === 'night' ? 0.4 : -0.15}
        additive
      />
    </group>
  );
}

// ==========================================
// 9. Interactive Camera Rig
// ==========================================

function DynamicCameraRig({
  mode,
  descentLevel,
}: {
  mode: 'descent' | 'orbit' | 'promenade';
  descentLevel: number;
}) {
  const target = useRef(new Vector3());
  const look = useRef(new Vector3());
  const controlsRef = useRef<any>(null);

  useFrame((state, delta) => {
    if (mode === 'descent') {
      const station = DESCENT_STATIONS[descentLevel] ?? DESCENT_STATIONS[0];
      target.current.set(...station.cameraPos);
      look.current.set(...station.lookAtPos);

      const k = 1 - Math.pow(0.0012, delta);
      state.camera.position.lerp(target.current, k);
      state.camera.lookAt(look.current);
    } else if (mode === 'promenade') {
      // Gentle cinematic walking glide along central steps
      const t = state.clock.elapsedTime * 0.15;
      const progress = (Math.sin(t) * 0.5 + 0.5) * MAX_LEVEL;
      const [, cy, cz] = levelCenter(progress);

      target.current.set(0, cy + 1.8, cz + 4.5);
      look.current.set(0, cy + 0.8, cz - 6.0);

      const k = 1 - Math.pow(0.003, delta);
      state.camera.position.lerp(target.current, k);
      state.camera.lookAt(look.current);
    }
  });

  if (mode === 'orbit') {
    const [, cy, cz] = levelCenter(descentLevel);
    return (
      <OrbitControls
        ref={controlsRef}
        makeDefault
        target={[0, cy + 1.2, cz]}
        minDistance={5}
        maxDistance={75}
        maxPolarAngle={Math.PI / 2.05}
        dampingFactor={0.08}
        enableDamping
      />
    );
  }

  return null;
}

// ==========================================
// Main Scene Component
// ==========================================

export default function RaniKiVavScene() {
  const descentLevel = useSceneStore((s) => s.descentLevel);
  const timeOfDay = useSceneStore((s) => s.raniTimeOfDay);
  const cameraMode = useSceneStore((s) => s.raniCameraMode);

  const preset = LIGHTING_PRESETS[timeOfDay] ?? LIGHTING_PRESETS.day;

  return (
    <SceneCanvas
      palette={{
        sky: preset.skyTop,
        ground: STONE.base,
        accent: STONE.gold,
        fog: preset.fogColor,
      }}
      cameraPosition={[0, 6.5, 20]}
      fov={52}
      fog={[preset.fogNear, preset.fogFar]}
      controls={false} // Handled dynamically by DynamicCameraRig
      bloomIntensity={preset.bloomIntensity}
    >
      {/* Directional Sun / Moon Light */}
      <directionalLight
        position={preset.sunPosition}
        intensity={preset.sunIntensity}
        color={preset.sunColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={140}
        shadow-camera-left={-28}
        shadow-camera-right={28}
        shadow-camera-top={35}
        shadow-camera-bottom={-35}
      />

      {/* Subterranean Fill Lighting */}
      <directionalLight
        position={[-preset.sunPosition[0], 15, -preset.sunPosition[2]]}
        intensity={preset.ambientIntensity * 0.7}
        color="#8fa3bd"
      />
      <ambientLight intensity={preset.ambientIntensity} color={preset.ambientColor} />

      {/* Dynamic Camera Rig (Descent / Orbit / Promenade) */}
      <DynamicCameraRig mode={cameraMode} descentLevel={descentLevel} />

      {/* Subsystems */}
      <ArchaeologicalGround />
      <EntranceTorana />
      <SteppedTerraces />
      <RetainingWalls />
      <MandapaPavilions />
      <SculptedNiches />
      <SheshashayiVishnuSanctum />
      <CircularWellShaft timeOfDay={timeOfDay} />
      <DiyaOilLamps active={timeOfDay === 'night' || timeOfDay === 'dawn'} />
      <VolumetricAtmosphere opacity={preset.godRayOpacity} timeOfDay={timeOfDay} />

      {/* Informative 3D Hotspots */}
      {RANI_HOTSPOTS.map((h) => (
        <Hotspot key={h.id} position={h.position} label={`${h.title} — ${h.description}`} />
      ))}
    </SceneCanvas>
  );
}
