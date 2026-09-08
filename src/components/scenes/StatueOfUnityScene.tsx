import { useMemo } from 'react';
import { Instances, Instance } from '@react-three/drei';
import { BufferGeometry, Float32BufferAttribute, Vector2 } from 'three';
import SceneCanvas from '../three/SceneCanvas';
import WaterPlane from '../three/primitives/WaterPlane';
import Hotspot from '../ui/Hotspot';
import { getPlace } from '../../data/places';
import {
  BRONZE,
  STONE,
  bridgeDeck,
  buildIslandGeometry,
  buildMoundGeometry,
  camera,
  dam,
  figureFacing,
  figurePart,
  galleryColumns,
  hills,
  island,
  mainland,
  makeGalleryArches,
  makePedestalStairs,
  makeArms,
  makeBridgePiers,
  makeBridgeRailPosts,
  makeCladdingSeams,
  makeDamSpillways,
  makeDamTowers,
  makeDhotiPleats,
  makeDhotiProfile,
  makeFeet,
  makeGalleryColumnPositions,
  makeHands,
  makeHeadFeatures,
  makeLegs,
  makeShawlFolds,
  makeShoreRocks,
  makeTrees,
  makeTunicDetails,
  makeTunicProfile,
  makeVisitors,
  orbitControls,
  pedestalTiers,
  pedestalTopY,
  water,
  type MeshSpec,
  type PrimitiveKind,
} from './statueOfUnityLayout';

export {
  STATUE_PLACE_ID,
  figureParts,
  pedestalTiers,
  island,
  water,
  dam,
  hills,
  bridge,
  orbitControls,
  pose,
} from './statueOfUnityLayout';

const palette = getPlace('statue-of-unity')!.palette;

function BronzeMat({
  color = BRONZE.base,
  metalness = 0.6,
  roughness = 0.46,
}: {
  color?: string;
  metalness?: number;
  roughness?: number;
}) {
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={metalness}
      roughness={roughness}
      clearcoat={0.14}
      clearcoatRoughness={0.42}
    />
  );
}

function SculptGeom({ spec }: { spec: MeshSpec }) {
  const a = spec.args;
  const kind: PrimitiveKind = spec.primitive;
  switch (kind) {
    case 'sphere':
      return <sphereGeometry args={[a[0], a[1] ?? 16, a[2] ?? 12]} />;
    case 'box':
      return <boxGeometry args={[a[0], a[1], a[2]]} />;
    case 'cylinder':
      return <cylinderGeometry args={[a[0], a[1], a[2], a[3] ?? 12]} />;
    case 'cone':
      return <coneGeometry args={[a[0], a[1], a[2] ?? 8]} />;
    case 'capsule':
      return <capsuleGeometry args={[a[0], a[1], a[2] ?? 4, a[3] ?? 8]} />;
    case 'torus':
      return <torusGeometry args={[a[0], a[1], a[2] ?? 8, a[3] ?? 16, a[4]]} />;
    default:
      return <boxGeometry args={[0.2, 0.2, 0.2]} />;
  }
}

function Sculpt({ spec }: { spec: MeshSpec }) {
  return (
    <mesh
      position={spec.position}
      rotation={spec.rotation ?? [0, 0, 0]}
      scale={spec.scale ?? [1, 1, 1]}
      castShadow={spec.castShadow !== false}
      receiveShadow
    >
      <SculptGeom spec={spec} />
      <BronzeMat
        color={spec.color ?? BRONZE.base}
        metalness={spec.metalness ?? 0.6}
        roughness={spec.roughness ?? 0.46}
      />
    </mesh>
  );
}

function Dhoti() {
  const profile = useMemo(() => makeDhotiProfile().map(([x, y]) => new Vector2(x, y)), []);
  const pleats = useMemo(() => makeDhotiPleats(), []);
  const part = figurePart('dhoti');
  return (
    <group>
      <mesh castShadow receiveShadow>
        <latheGeometry args={[profile, 32]} />
        <BronzeMat metalness={0.52} roughness={0.52} />
      </mesh>
      <mesh position={[0, 1.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.12, 0.1, 8, 28]} />
        <BronzeMat color={BRONZE.dark} roughness={0.58} />
      </mesh>
      <mesh position={[0.12, 4.3, 2.05]} rotation={[0.06, 0.08, -0.05]} castShadow>
        <boxGeometry args={[0.95, 5.2, 0.16]} />
        <BronzeMat color={BRONZE.dark} roughness={0.56} />
      </mesh>
      <Instances range={part.meshCount} castShadow>
        <boxGeometry args={[0.038, 3.6, 0.028]} />
        <BronzeMat color={BRONZE.dark} metalness={0.5} roughness={0.58} />
        {pleats.map((p, i) => (
          <Instance
            key={i}
            position={[Math.cos(p.a) * p.r, p.y, Math.sin(p.a) * p.r]}
            rotation={[0, -p.a, 0]}
          />
        ))}
      </Instances>
    </group>
  );
}

function Tunic() {
  const profile = useMemo(() => makeTunicProfile().map(([x, y]) => new Vector2(x, y)), []);
  const details = useMemo(() => makeTunicDetails(), []);
  return (
    <group>
      <mesh position={[0, 8, 0]} castShadow receiveShadow>
        <latheGeometry args={[profile, 28]} />
        <BronzeMat metalness={0.58} roughness={0.44} />
      </mesh>
      <mesh position={[0, 12.05, 0]} scale={[1, 0.58, 0.82]} castShadow>
        <sphereGeometry args={[1.82, 22, 14]} />
        <BronzeMat metalness={0.58} roughness={0.44} />
      </mesh>
      {details.map((spec) => (
        <Sculpt key={spec.id} spec={spec} />
      ))}
    </group>
  );
}

function CladdingSeams() {
  const seams = useMemo(() => makeCladdingSeams(), []);
  const part = figurePart('cladding-seams');
  return (
    <Instances range={Math.max(seams.length, part.meshCount)} castShadow={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshPhysicalMaterial color={BRONZE.dark} metalness={0.45} roughness={0.62} />
      {seams.map((s, i) => (
        <Instance key={i} position={s.position} rotation={s.rotation} scale={s.size} />
      ))}
    </Instances>
  );
}

function Patel() {
  const shawl = useMemo(() => makeShawlFolds(), []);
  const head = useMemo(() => makeHeadFeatures(), []);
  const arms = useMemo(() => makeArms(), []);
  const hands = useMemo(() => makeHands(), []);
  const legs = useMemo(() => makeLegs(), []);
  const feet = useMemo(() => makeFeet(), []);
  return (
    <group position={[0, pedestalTopY(), 0]} rotation={[0, figureFacing, 0]}>
      {legs.map((spec) => (
        <Sculpt key={spec.id} spec={spec} />
      ))}
      {feet.map((spec) => (
        <Sculpt key={spec.id} spec={spec} />
      ))}
      <Dhoti />
      <Tunic />
      {shawl.map((spec) => (
        <Sculpt key={spec.id} spec={spec} />
      ))}
      {arms.map((spec) => (
        <Sculpt key={spec.id} spec={spec} />
      ))}
      {hands.map((spec) => (
        <Sculpt key={spec.id} spec={spec} />
      ))}
      {head.map((spec) => (
        <Sculpt key={spec.id} spec={spec} />
      ))}
      <CladdingSeams />
      <Hotspot position={[0, 15.6, 0]} label="Sardar Patel — 182 m of bronze over the Narmada" />
    </group>
  );
}

function Pedestal() {
  const columns = useMemo(() => makeGalleryColumnPositions(), []);
  const arches = useMemo(() => makeGalleryArches(), []);
  const stairs = useMemo(() => makePedestalStairs(), []);
  return (
    <group position={[0, island.plazaY, 0]}>
      {pedestalTiers.map((tier) => (
        <mesh key={tier.id} position={[0, tier.y, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[tier.radiusTop, tier.radiusBottom, tier.height, tier.sides]} />
          <meshStandardMaterial color={tier.color} roughness={0.94} metalness={0.04} flatShading />
        </mesh>
      ))}
      {pedestalTiers.map((tier) => (
        <mesh key={`${tier.id}-mortar`} position={[0, tier.y + tier.height * 0.48, 0]}>
          <cylinderGeometry args={[tier.radiusTop + 0.08, tier.radiusTop + 0.08, 0.06, tier.sides]} />
          <meshStandardMaterial color={STONE.mortar} roughness={1} />
        </mesh>
      ))}
      <Instances range={columns.length} castShadow>
        <boxGeometry args={galleryColumns.size} />
        <meshStandardMaterial color={STONE.column} roughness={0.88} />
        {columns.map((p, i) => (
          <Instance key={i} position={[p[0], p[1] - island.plazaY, p[2]]} />
        ))}
      </Instances>
      {arches.map((a, i) => (
        <mesh key={`arch-${i}`} position={[a.position[0], a.position[1] - island.plazaY, a.position[2]]} rotation={a.rotation}>
          <boxGeometry args={a.size} />
          <meshStandardMaterial color="#2a1810" roughness={1} />
        </mesh>
      ))}
      {stairs.map((s, i) => (
        <mesh key={`st-${i}`} position={[s.position[0], s.position[1] - island.plazaY, s.position[2]]} receiveShadow castShadow>
          <boxGeometry args={s.size} />
          <meshStandardMaterial color={STONE.light} roughness={0.92} />
        </mesh>
      ))}
    </group>
  );
}

function Island() {
  const geom = useMemo(() => {
    const { positions, colors, indices } = buildIslandGeometry();
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(positions, 3));
    g.setAttribute('color', new Float32BufferAttribute(colors, 3));
    g.setIndex(indices);
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <mesh geometry={geom} receiveShadow castShadow>
      <meshStandardMaterial vertexColors roughness={0.96} metalness={0} />
    </mesh>
  );
}

function HillMound({ hill }: { hill: (typeof hills)[number] }) {
  const geom = useMemo(() => {
    const { positions, colors, indices } = buildMoundGeometry(hill);
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(positions, 3));
    g.setAttribute('color', new Float32BufferAttribute(colors, 3));
    g.setIndex(indices);
    g.computeVertexNormals();
    return g;
  }, [hill]);
  return (
    <mesh geometry={geom} position={hill.base} receiveShadow castShadow>
      <meshStandardMaterial vertexColors roughness={1} metalness={0} />
    </mesh>
  );
}

function Hills() {
  return (
    <group>
      {hills.map((h) => (
        <HillMound key={h.id} hill={h} />
      ))}
    </group>
  );
}

function Dam() {
  const spillways = useMemo(() => makeDamSpillways(), []);
  const towers = useMemo(() => makeDamTowers(), []);
  return (
    <group>
      <mesh position={dam.position} castShadow receiveShadow>
        <boxGeometry args={dam.size} />
        <meshStandardMaterial color={dam.color} roughness={0.92} />
      </mesh>
      <mesh
        position={[dam.position[0], dam.position[1] - 1.2, dam.position[2] + dam.size[2] * 0.9]}
        rotation={[-dam.slope, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[dam.size[0] - 4, dam.size[1] + 4, 5]} />
        <meshStandardMaterial color="#7d827b" roughness={0.94} />
      </mesh>
      <mesh position={[dam.position[0], dam.position[1] + dam.size[1] * 0.52, dam.position[2]]}>
        <boxGeometry args={[dam.size[0] + 2, 0.6, dam.size[2] + 1.4]} />
        <meshStandardMaterial color="#9aa194" roughness={0.88} />
      </mesh>
      {spillways.map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[dam.size[0] / dam.spillwayCount - 1.2, 7.5, 1.4]} />
          <meshStandardMaterial color="#4d5a48" roughness={0.85} />
        </mesh>
      ))}
      {towers.map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <cylinderGeometry args={[1.6, 1.9, 9, 8]} />
          <meshStandardMaterial color="#6e7c68" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function ApproachBridge() {
  const deck = useMemo(() => bridgeDeck(), []);
  const piers = useMemo(() => makeBridgePiers(), []);
  const rails = useMemo(() => makeBridgeRailPosts(), []);
  return (
    <group>
      <mesh position={deck.mid} rotation={deck.rotation} castShadow receiveShadow>
        <boxGeometry args={[deck.width, deck.thickness, deck.length]} />
        <meshStandardMaterial color="#8b8a82" roughness={0.86} />
      </mesh>
      {piers.map((p, i) => (
        <mesh key={i} position={p.position} castShadow>
          <boxGeometry args={[1.1, p.height, 0.7]} />
          <meshStandardMaterial color="#6f6e66" roughness={0.9} />
        </mesh>
      ))}
      {rails.map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.08, 0.7, 0.08]} />
          <meshStandardMaterial color="#c5c2b6" roughness={0.7} metalness={0.2} />
        </mesh>
      ))}
      <mesh position={deck.mid} rotation={deck.rotation}>
        <boxGeometry args={[deck.width + 0.12, 0.08, deck.length]} />
        <meshStandardMaterial color="#b7b4a8" roughness={0.7} />
      </mesh>
    </group>
  );
}

function Vegetation() {
  const trees = useMemo(() => makeTrees(), []);
  const rocks = useMemo(() => makeShoreRocks(), []);
  return (
    <group>
      <Instances range={trees.length} castShadow>
        <cylinderGeometry args={[0.16, 0.22, 1.1, 6]} />
        <meshStandardMaterial color="#4a3728" roughness={1} />
        {trees.map((t, i) => (
          <Instance
            key={`tr-${i}`}
            position={[t.position[0], t.position[1] + 0.55 * t.scale, t.position[2]]}
            scale={t.scale}
          />
        ))}
      </Instances>
      <Instances range={trees.length} castShadow>
        <sphereGeometry args={[1.15, 8, 6]} />
        <meshStandardMaterial color="#3d5a32" roughness={1} />
        {trees.map((t, i) => (
          <Instance
            key={`can-${i}`}
            position={[t.position[0], t.position[1] + 1.85 * t.scale, t.position[2]]}
            scale={[t.scale, t.scale * 0.85, t.scale]}
            color={t.canopy}
          />
        ))}
      </Instances>
      <Instances range={rocks.length} castShadow>
        <dodecahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial color="#6a6558" roughness={1} flatShading />
        {rocks.map((r, i) => (
          <Instance key={i} position={r.position} scale={r.scale} />
        ))}
      </Instances>
    </group>
  );
}

function ScaleReference() {
  const people = useMemo(() => makeVisitors(), []);
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
      cameraPosition={camera.position}
      fov={camera.fov}
      fog={camera.fog}
      controls={orbitControls}
    >
      <directionalLight
        position={[36, 48, 22]}
        intensity={1.75}
        color="#fff1d6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={180}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={70}
        shadow-camera-bottom={-14}
      />
      <directionalLight position={[-22, 16, -12]} intensity={0.42} color="#bcd0ff" />
      <directionalLight position={[8, 10, 30]} intensity={0.28} color="#e7c9a0" />

      <Island />
      <WaterPlane
        size={water.size}
        color={water.color}
        highlight={water.highlight}
        amplitude={water.amplitude}
        position={[0, water.y, 0]}
      />
      <mesh position={mainland.position} receiveShadow castShadow>
        <boxGeometry args={mainland.size} />
        <meshStandardMaterial color={mainland.color} roughness={1} />
      </mesh>
      <Hills />
      <Dam />
      <ApproachBridge />
      <Vegetation />
      <Pedestal />
      <ScaleReference />
      <Patel />
    </SceneCanvas>
  );
}
