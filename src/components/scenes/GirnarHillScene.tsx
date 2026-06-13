import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance } from '@react-three/drei';
import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Vector3,
} from 'three';
import SceneCanvas from '../three/SceneCanvas';
import ShikharaTower from '../three/primitives/ShikharaTower';
import Particles from '../three/primitives/Particles';
import Hotspot from '../ui/Hotspot';
import { getPlace } from '../../data/places';
import { useSceneStore } from '../../store/useSceneStore';

const place = getPlace('girnar-hill')!;
const palette = place.palette;

const TURNS = 3;
const MAXR = 22;
const MH = 30;

// ---- value-noise helpers (wrap-safe via cos/sin inputs) ----
function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function vnoise(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const tl = hash(xi, yi);
  const tr = hash(xi + 1, yi);
  const bl = hash(xi, yi + 1);
  const br = hash(xi + 1, yi + 1);
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  return tl * (1 - u) * (1 - v) + tr * u * (1 - v) + bl * (1 - u) * v + br * u * v;
}
function fbm(x: number, y: number) {
  let a = 0;
  let amp = 0.5;
  let f = 1;
  for (let o = 0; o < 4; o++) {
    a += amp * vnoise(x * f, y * f);
    f *= 2;
    amp *= 0.5;
  }
  return a;
}
function crag(t: number, a: number) {
  return fbm(Math.cos(a) * 2.6 + 5.3, Math.sin(a) * 2.6 + t * 3.1);
}

/** Rugged mountain radius and height at climb-fraction t and angle a. */
function mtnRadius(t: number, a: number) {
  const base = MAXR * Math.pow(1 - t, 1.12);
  const lump = Math.sin(a * 2.0 + 1.0) * 1.6 * (1 - t);
  return base * (0.82 + crag(t, a) * 0.5) + lump;
}
function mtnHeight(t: number, a: number) {
  const c = crag(t, a) - 0.5;
  const lean = Math.sin(a * 1.0 + 0.6) * 2.6 * t; // tilts the summit to one shoulder
  return t * MH + c * 4 * (0.3 + t) + lean;
}
function surfacePoint(t: number, a: number, lift = 0.2): [number, number, number] {
  const r = mtnRadius(t, a) + lift;
  return [Math.cos(a) * r, mtnHeight(t, a) + lift, Math.sin(a) * r];
}

const FOREST = new Color('#3a4a26');
const FOREST2 = new Color('#46562f');
const ROCK = new Color('#6f6454');
const ROCK_HI = new Color('#8c8472');

function vertexColor(t: number, c: number, out: Color) {
  if (t < 0.4) {
    out.copy(FOREST).lerp(FOREST2, c);
  } else if (t < 0.56) {
    const k = (t - 0.4) / 0.16;
    out.copy(FOREST2).lerp(ROCK, k);
  } else {
    const hi = Math.min(1, (t - 0.56) / 0.44) * 0.6 + c * 0.4;
    out.copy(ROCK).lerp(ROCK_HI, hi);
  }
  // darken crevices / lighten ridges a touch
  out.multiplyScalar(0.82 + c * 0.3);
}

/** Builds the craggy, vertex-coloured mountain mesh once. */
function useMountainGeometry() {
  return useMemo(() => {
    const Rs = 72;
    const Hs = 46;
    const positions: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];
    const col = new Color();

    for (let i = 0; i <= Hs; i++) {
      const t = i / Hs;
      for (let j = 0; j <= Rs; j++) {
        const a = (j / Rs) * Math.PI * 2;
        const r = mtnRadius(t, a);
        positions.push(Math.cos(a) * r, mtnHeight(t, a), Math.sin(a) * r);
        vertexColor(t, crag(t, a), col);
        colors.push(col.r, col.g, col.b);
      }
    }
    for (let i = 0; i < Hs; i++) {
      for (let j = 0; j < Rs; j++) {
        const aI = i * (Rs + 1) + j;
        const bI = aI + 1;
        const cI = (i + 1) * (Rs + 1) + j;
        const dI = cI + 1;
        indices.push(aI, cI, bI, bI, cI, dI);
      }
    }

    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new Float32BufferAttribute(colors, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);
}

function Mountain() {
  const geo = useMountainGeometry();
  return (
    <mesh geometry={geo} castShadow receiveShadow>
      <meshStandardMaterial vertexColors flatShading roughness={1} />
    </mesh>
  );
}

/** Dense forest skirt across the lower slopes. */
function Forest() {
  const trees = useMemo(() => {
    const out: { pos: [number, number, number]; s: number }[] = [];
    let seed = 11;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < 260; i++) {
      const t = rnd() * 0.4;
      const a = rnd() * Math.PI * 2;
      const p = surfacePoint(t, a, 0.1);
      out.push({ pos: [p[0], p[1] + 0.6, p[2]], s: 0.7 + rnd() * 0.9 });
    }
    return out;
  }, []);
  return (
    <Instances range={trees.length} castShadow>
      <coneGeometry args={[0.7, 2.2, 6]} />
      <meshStandardMaterial color="#33421f" roughness={1} flatShading />
      {trees.map((tr, i) => (
        <Instance key={i} position={tr.pos} scale={[tr.s, tr.s, tr.s]} />
      ))}
    </Instances>
  );
}

/** Winding pilgrim stair following the mountain surface. */
function Steps() {
  const steps = useMemo(() => {
    const out: { pos: [number, number, number]; rotY: number }[] = [];
    const N = 170;
    for (let i = 0; i < N; i++) {
      const t = i / N;
      const a = t * TURNS * Math.PI * 2;
      out.push({ pos: surfacePoint(t, a, 0.35), rotY: -a });
    }
    return out;
  }, []);
  return (
    <Instances range={steps.length} castShadow receiveShadow>
      <boxGeometry args={[2.2, 0.22, 0.7]} />
      <meshStandardMaterial color="#c9bfa2" roughness={1} />
      {steps.map((s, i) => (
        <Instance key={i} position={s.pos} rotation={[0, s.rotY, 0]} />
      ))}
    </Instances>
  );
}

/** Scattered white hilltop temple buildings, like the real upper slopes. */
function ScatteredShrines() {
  const blocks = useMemo(() => {
    const out: { pos: [number, number, number]; s: number }[] = [];
    let seed = 29;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < 26; i++) {
      const t = 0.5 + rnd() * 0.42;
      const a = rnd() * Math.PI * 2;
      const p = surfacePoint(t, a, 0.2);
      out.push({ pos: [p[0], p[1] + 0.5, p[2]], s: 0.6 + rnd() * 0.7 });
    }
    return out;
  }, []);
  return (
    <Instances range={blocks.length} castShadow>
      <boxGeometry args={[1, 1.2, 1] } />
      <meshStandardMaterial color="#efe9dc" roughness={0.85} />
      {blocks.map((b, i) => (
        <Instance key={i} position={b.pos} scale={[b.s, b.s, b.s]} />
      ))}
    </Instances>
  );
}

/** A marble temple cluster on a small platform at a path point. */
function PeakTemple({ t, scale = 1, label }: { t: number; scale?: number; label: string }) {
  const a = t * TURNS * Math.PI * 2;
  const [x, y, z] = surfacePoint(t, a, 0.4);
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.3, 0]} receiveShadow>
        <cylinderGeometry args={[2.6 * scale, 3 * scale, 0.6, 16]} />
        <meshStandardMaterial color="#e8e1d2" roughness={0.9} />
      </mesh>
      <ShikharaTower position={[0, 0.6, 0]} height={5 * scale} baseRadius={1.1 * scale} color="#f1ece0" accent="#ffcf6b" />
      <ShikharaTower position={[1.7 * scale, 0.6, 0.6]} height={3.2 * scale} baseRadius={0.65 * scale} color="#e6ddcb" />
      <Hotspot position={[0, 6 * scale, 0]} label={label} />
    </group>
  );
}

function ClimbRig() {
  const climb = useSceneStore((s) => s.climb);
  const pos = useRef(new Vector3(0, 18, 62));
  const look = useRef(new Vector3());

  useFrame((state, delta) => {
    const a = climb * TURNS * Math.PI * 2;
    const here = surfacePoint(climb, a, 1.2);
    const aheadT = Math.min(climb + 0.05, 1);
    const ahead = surfacePoint(aheadT, aheadT * TURNS * Math.PI * 2, 1.2);
    // stand just outside and above the current step, look up the slope
    pos.current.set(here[0] * 1.5, here[1] + 3.4, here[2] * 1.5 + 5);
    look.current.set(ahead[0] * 0.4, ahead[1] + 2 + (1 - climb) * 8, ahead[2] * 0.4);
    const k = 1 - Math.pow(0.0022, delta);
    state.camera.position.lerp(pos.current, k);
    state.camera.lookAt(look.current);
  });
  return null;
}

export default function GirnarHillScene() {
  return (
    <SceneCanvas
      palette={palette}
      cameraPosition={[0, 18, 62]}
      fov={52}
      fog={[40, 220]}
      controls={false}
      bloomIntensity={0.6}
    >
      <directionalLight
        position={[28, 44, 20]}
        intensity={1.5}
        color="#fff1d8"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={160}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={70}
        shadow-camera-bottom={-10}
      />
      <ClimbRig />

      {/* forested plain at the foot */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[120, 56]} />
        <meshStandardMaterial color="#33421f" roughness={1} />
      </mesh>

      <Mountain />
      <Forest />
      <Steps />
      <ScatteredShrines />

      <PeakTemple t={0.5} scale={1.1} label="The Jain temples — Neminath, the 22nd Tirthankara" />
      <PeakTemple t={0.72} scale={0.9} label="Amba Mata — the shrine of newly-weds" />
      <PeakTemple t={0.97} scale={1} label="Dattatreya — the highest peak in Gujarat" />

      {/* mountain haze */}
      <Particles count={80} area={[80, 24, 80]} center={[0, 16, 0]} color="#cdd9d2" size={1.6} speed={0.12} additive={false} />
    </SceneCanvas>
  );
}
