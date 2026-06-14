import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance } from '@react-three/drei';
import { Color, DoubleSide, Mesh, ShaderMaterial } from 'three';
import SceneCanvas from '../three/SceneCanvas';
import WaterPlane from '../three/primitives/WaterPlane';
import Particles from '../three/primitives/Particles';
import { getPlace } from '../../data/places';
import { useSceneStore } from '../../store/useSceneStore';

const place = getPlace('rann-of-kutch')!;

const DAY = place.palette;
const NIGHT = { sky: '#1c2542', ground: '#d7d0bf', accent: '#ffb152', fog: '#28304f' };

/** Cracked salt-flat ground via a voronoi-border shader. */
function SaltFlat({ tint }: { tint: string }) {
  const material = useMemo(() => {
    return new ShaderMaterial({
      side: DoubleSide,
      uniforms: {
        uSalt: { value: new Color('#f3efe2') },
        uCrack: { value: new Color(tint) },
        uScale: { value: 26.0 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying vec2 vUv;
        uniform vec3 uSalt;
        uniform vec3 uCrack;
        uniform float uScale;

        vec2 hash2(vec2 p){
          p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
          return fract(sin(p) * 43758.5453);
        }
        float voronoiBorder(vec2 x){
          vec2 n = floor(x); vec2 f = fract(x);
          vec2 mg, mr; float md = 8.0;
          for (int j=-1;j<=1;j++) for (int i=-1;i<=1;i++){
            vec2 g = vec2(float(i), float(j));
            vec2 o = hash2(n + g);
            vec2 r = g + o - f;
            float d = dot(r, r);
            if (d < md){ md = d; mr = r; mg = g; }
          }
          md = 8.0;
          for (int j=-2;j<=2;j++) for (int i=-2;i<=2;i++){
            vec2 g = mg + vec2(float(i), float(j));
            vec2 o = hash2(n + g);
            vec2 r = g + o - f;
            vec2 diff = mr - r;
            if (dot(diff, diff) > 0.00001){
              md = min(md, dot(0.5*(mr + r), normalize(r - mr)));
            }
          }
          return md;
        }
        void main(){
          vec2 uv = vUv * uScale;
          float b = voronoiBorder(uv);
          float crack = 1.0 - smoothstep(0.0, 0.045, b);
          float fade = smoothstep(0.5, 0.18, abs(vUv.y - 0.5));
          vec3 col = mix(uSalt, uCrack, crack * 0.6 * fade);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
  }, [tint]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} material={material} receiveShadow>
      <planeGeometry args={[500, 500]} />
    </mesh>
  );
}

/** A stylized single-humped Kachchhi camel. */
function Camel({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  rider = false,
  decorated = false,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  rider?: boolean;
  decorated?: boolean;
}) {
  const hide = '#b78a55';
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* body (long axis along X) */}
      <mesh position={[0, 1.55, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.55, 1.7, 6, 10]} />
        <meshStandardMaterial color={hide} roughness={0.9} />
      </mesh>
      {/* hump */}
      <mesh position={[-0.1, 2.05, 0]} castShadow>
        <sphereGeometry args={[0.5, 12, 10]} />
        <meshStandardMaterial color={hide} roughness={0.9} />
      </mesh>
      {/* neck */}
      <mesh position={[1.05, 2.15, 0]} rotation={[0, 0, -0.7]} castShadow>
        <capsuleGeometry args={[0.22, 1.1, 6, 8]} />
        <meshStandardMaterial color={hide} roughness={0.9} />
      </mesh>
      {/* head */}
      <mesh position={[1.55, 2.75, 0]} rotation={[0, 0, 0.3]} castShadow>
        <boxGeometry args={[0.6, 0.34, 0.32]} />
        <meshStandardMaterial color={hide} roughness={0.9} />
      </mesh>
      {/* legs */}
      {[
        [0.6, 0.35],
        [0.6, -0.35],
        [-0.6, 0.35],
        [-0.6, -0.35],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.75, z]} castShadow>
          <cylinderGeometry args={[0.13, 0.11, 1.6, 8]} />
          <meshStandardMaterial color="#a87f4c" roughness={0.95} />
        </mesh>
      ))}
      {/* tail */}
      <mesh position={[-0.95, 1.45, 0]} rotation={[0, 0, 0.4]}>
        <cylinderGeometry args={[0.05, 0.03, 0.8, 6]} />
        <meshStandardMaterial color="#8a6a40" roughness={1} />
      </mesh>

      {decorated && (
        <mesh position={[0, 2.0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.58, 0.58, 1.0, 12, 1, true]} />
          <meshStandardMaterial color="#c0392b" roughness={0.7} side={DoubleSide} />
        </mesh>
      )}
      {rider && (
        <group position={[0.1, 2.55, 0]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.22, 0.5, 6, 8]} />
            <meshStandardMaterial color="#33271a" roughness={1} />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.2, 10, 10]} />
            <meshStandardMaterial color="#2a2018" roughness={1} />
          </mesh>
        </group>
      )}
    </group>
  );
}

/** A line of camels crossing the white emptiness. */
function Caravan() {
  return (
    <group position={[-6, 0, 10]} rotation={[0, 0.35, 0]}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Camel
          key={i}
          position={[i * 3.2, 0, i * 0.4]}
          scale={0.9}
          rider={i % 2 === 0}
        />
      ))}
    </group>
  );
}

/** Improved bhunga huts — round mud houses with mirror-work bands. */
function Bhungas() {
  const spots = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2 + 0.4;
      const r = 11 + (i % 3) * 3;
      out.push([Math.cos(a) * r - 14, 0, -8 - Math.sin(a) * r * 0.4]);
    }
    return out;
  }, []);
  return (
    <group>
      {spots.map((p, i) => (
        <group key={i} position={p}>
          {/* wall */}
          <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.1, 1.2, 1.8, 16]} />
            <meshStandardMaterial color="#bd9466" roughness={0.95} />
          </mesh>
          {/* mirror-work / paint band */}
          <mesh position={[0, 1.55, 0]}>
            <cylinderGeometry args={[1.13, 1.13, 0.3, 16]} />
            <meshStandardMaterial color="#e8e3d4" roughness={0.6} metalness={0.2} />
          </mesh>
          {/* thatch roof */}
          <mesh position={[0, 2.55, 0]} castShadow>
            <coneGeometry args={[1.5, 1.7, 16]} />
            <meshStandardMaterial color="#8a6a3f" roughness={1} />
          </mesh>
          {/* door */}
          <mesh position={[0, 0.7, 1.12]}>
            <boxGeometry args={[0.5, 1.0, 0.1]} />
            <meshStandardMaterial color="#3a2c1c" roughness={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Agariya salt-pan field: reflective brine squares with low mud bunds. */
function SaltPans() {
  const pans = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 4; c++) out.push([16 + c * 6, 0, 8 - r * 6]);
    return out;
  }, []);
  return (
    <group>
      {pans.map((p, i) => (
        <group key={i} position={p}>
          {/* mud bund */}
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[5.6, 0.2, 5.6]} />
            <meshStandardMaterial color="#b6986a" roughness={1} />
          </mesh>
          {/* brine */}
          <WaterPlane
            size={5}
            segments={8}
            color="#9fb6c2"
            highlight="#fff3df"
            amplitude={0.01}
            position={[0, 0.18, 0]}
          />
        </group>
      ))}
      {/* harvested salt mounds */}
      <Instances range={22} castShadow>
        <coneGeometry args={[0.8, 1.1, 10]} />
        <meshStandardMaterial color="#f4f0e6" roughness={0.7} />
        {Array.from({ length: 22 }).map((_, i) => {
          const a = (i * 977) % 360;
          const r = 4 + ((i * 53) % 10);
          return (
            <Instance
              key={i}
              position={[
                16 + Math.cos((a * Math.PI) / 180) * r + 8,
                0.55,
                4 + Math.sin((a * Math.PI) / 180) * r,
              ]}
            />
          );
        })}
      </Instances>
    </group>
  );
}

/** Lone salt-worker figures dotting the flats. */
function Figures({ count, color }: { count: number; color: string }) {
  const spots = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const a = (i * 137.5 * Math.PI) / 180;
      const r = 6 + ((i * 7) % 22);
      out.push([Math.cos(a) * r, 0.7, -4 + Math.sin(a) * r * 0.6]);
    }
    return out;
  }, [count]);
  return (
    <Instances range={spots.length} castShadow>
      <capsuleGeometry args={[0.18, 0.7, 4, 8]} />
      <meshStandardMaterial color={color} roughness={1} />
      {spots.map((p, i) => (
        <Instance key={i} position={p} />
      ))}
    </Instances>
  );
}

/** Sun (day) or full moon (festival) with a soft halo. */
function CelestialBody({ festival }: { festival: boolean }) {
  const pos: [number, number, number] = festival ? [-28, 30, -95] : [28, 9, -95];
  const r = festival ? 6 : 7;
  const col = festival ? '#eef0ff' : '#ffd98a';
  return (
    <group position={pos}>
      <mesh>
        <sphereGeometry args={[r, 28, 28]} />
        <meshBasicMaterial color={col} />
      </mesh>
      <mesh>
        <sphereGeometry args={[r * 2.1, 24, 24]} />
        <meshBasicMaterial color={col} transparent opacity={0.12} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** Strings of festive fairy lights sagging between poles. */
function StringLights() {
  const strings = useMemo(() => {
    const rows: { poles: [number, number][]; bulbs: [number, number, number][] }[] = [];
    for (let s = 0; s < 3; s++) {
      const z = -2 - s * 4;
      const poles: [number, number][] = [];
      const bulbs: [number, number, number][] = [];
      const span = 7;
      for (let p = -3; p <= 3; p++) poles.push([p * span, z]);
      for (let p = 0; p < poles.length - 1; p++) {
        const [x0] = poles[p];
        const [x1] = poles[p + 1];
        const N = 9;
        for (let k = 0; k <= N; k++) {
          const t = k / N;
          const x = x0 + (x1 - x0) * t;
          const y = 4.4 - 1.4 * (1 - Math.pow(2 * t - 1, 2));
          bulbs.push([x, y, z]);
        }
      }
      rows.push({ poles, bulbs });
    }
    return rows;
  }, []);

  const allBulbs = strings.flatMap((r) => r.bulbs);
  const allPoles = strings.flatMap((r) => r.poles);

  return (
    <group>
      <Instances range={allPoles.length}>
        <cylinderGeometry args={[0.08, 0.1, 5, 6]} />
        <meshStandardMaterial color="#5a4a35" roughness={1} />
        {allPoles.map(([x, z], i) => (
          <Instance key={i} position={[x, 2.5, z]} />
        ))}
      </Instances>
      <Instances range={allBulbs.length}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#ffe08a" emissive="#ffba4d" emissiveIntensity={2.6} />
        {allBulbs.map((p, i) => (
          <Instance key={i} position={p} />
        ))}
      </Instances>
    </group>
  );
}

/** Rows of festival tents — luxury "Swiss" tents + decorated pavilions. */
function Tents() {
  const tents = useMemo(() => {
    const out: { pos: [number, number, number]; kind: number }[] = [];
    for (let i = 0; i < 16; i++) {
      const row = Math.floor(i / 8);
      const col = i % 8;
      out.push({ pos: [(col - 3.5) * 4.4, 0, -16 - row * 5], kind: i % 2 });
    }
    return out;
  }, []);
  return (
    <group>
      {tents.map((t, i) =>
        t.kind === 0 ? (
          // Swiss cottage tent: box body + pitched roof
          <group key={i} position={t.pos}>
            <mesh position={[0, 1, 0]} castShadow>
              <boxGeometry args={[3, 2, 2.6]} />
              <meshStandardMaterial color="#efe6d2" roughness={0.85} />
            </mesh>
            <mesh position={[0, 2.4, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
              <coneGeometry args={[2.3, 1.4, 4]} />
              <meshStandardMaterial color="#b9462f" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.7, 1.31]}>
              <boxGeometry args={[0.8, 1.4, 0.05]} />
              <meshStandardMaterial color="#5a3a28" roughness={1} />
            </mesh>
          </group>
        ) : (
          // decorated conical tent
          <group key={i} position={t.pos}>
            <mesh position={[0, 1.3, 0]} rotation={[0, Math.PI / 8, 0]} castShadow>
              <coneGeometry args={[1.7, 2.8, 8]} />
              <meshStandardMaterial color="#c43d6e" roughness={0.8} emissive="#3a0f20" emissiveIntensity={0.4} />
            </mesh>
            <mesh position={[0, 2.85, 0]}>
              <sphereGeometry args={[0.16, 8, 8]} />
              <meshStandardMaterial color="#ffd27a" emissive="#ffb14d" emissiveIntensity={2.4} />
            </mesh>
          </group>
        ),
      )}
    </group>
  );
}

/** The central cultural stage with a canopy. */
function StagePavilion() {
  return (
    <group position={[0, 0, -8]}>
      <mesh position={[0, 0.3, 0]} receiveShadow>
        <cylinderGeometry args={[5, 5, 0.6, 24]} />
        <meshStandardMaterial color="#7a5a3a" roughness={1} />
      </mesh>
      {/* canopy poles */}
      {[
        [-4, -4],
        [4, -4],
        [-4, 4],
        [4, 4],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 2, z]} castShadow>
          <cylinderGeometry args={[0.14, 0.14, 4, 8]} />
          <meshStandardMaterial color="#caa46a" roughness={0.9} />
        </mesh>
      ))}
      {/* canopy */}
      <mesh position={[0, 4.4, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[6.5, 2.2, 4]} />
        <meshStandardMaterial color="#e0b24a" roughness={0.7} emissive="#5a3a10" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

/** Bonfire with a flickering flame and a ring of dancers. */
function Bonfire() {
  const flame = useRef<Mesh>(null);
  useFrame((state) => {
    if (flame.current) {
      const t = state.clock.elapsedTime;
      const s = 1 + Math.sin(t * 9) * 0.12 + Math.sin(t * 13.7) * 0.06;
      flame.current.scale.set(1, s, 1);
    }
  });

  const dancers = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      out.push([Math.cos(a) * 5.5, 0.8, 12 + Math.sin(a) * 5.5]);
    }
    return out;
  }, []);

  return (
    <group>
      <group position={[0, 0, 12]}>
        {/* logs */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[0, 0.3, 0]} rotation={[0.4, (i * Math.PI) / 4, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 1.6, 6]} />
            <meshStandardMaterial color="#3a2a1a" roughness={1} />
          </mesh>
        ))}
        {/* flame */}
        <mesh ref={flame} position={[0, 1.1, 0]}>
          <coneGeometry args={[0.7, 2.2, 10]} />
          <meshBasicMaterial color="#ff8a2d" transparent opacity={0.85} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <coneGeometry args={[0.4, 1.3, 10]} />
          <meshBasicMaterial color="#ffe06a" transparent opacity={0.9} depthWrite={false} />
        </mesh>
        <pointLight position={[0, 1.5, 0]} intensity={3} color="#ff8a3d" distance={30} />
        <Particles count={40} area={[2, 6, 2]} center={[0, 3, 0]} color="#ffb24d" size={0.18} speed={1.2} />
      </group>

      {/* dancers ringing the fire */}
      <Instances range={dancers.length} castShadow>
        <capsuleGeometry args={[0.2, 0.7, 4, 8]} />
        <meshStandardMaterial color="#2a2018" roughness={1} />
        {dancers.map((p, i) => (
          <Instance key={i} position={p} />
        ))}
      </Instances>
      <Instances range={dancers.length}>
        <sphereGeometry args={[0.17, 8, 8]} />
        <meshStandardMaterial color="#2a2018" roughness={1} />
        {dancers.map((p, i) => (
          <Instance key={i} position={[p[0], p[1] + 0.6, p[2]]} />
        ))}
      </Instances>
    </group>
  );
}

/** Triangular bunting strung above the festival. */
function Bunting() {
  const COLORS = ['#e54b4b', '#f4b400', '#2e9e5b', '#3d6fe5', '#d63ea0'];
  const flags = useMemo(() => {
    const out: { x: number; c: string }[] = [];
    for (let i = 0; i < 28; i++) out.push({ x: (i - 14) * 1.5, c: COLORS[i % COLORS.length] });
    return out;
  }, []);
  return (
    <group position={[0, 5.4, 1]}>
      {flags.map((f, i) => (
        <mesh key={i} position={[f.x, -1.2 * (1 - Math.pow((i - 14) / 14, 2)), 0]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.32, 0.7, 3]} />
          <meshStandardMaterial color={f.c} roughness={0.7} side={DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

export default function RannOfKutchScene() {
  const festival = useSceneStore((s) => s.festival);
  const palette = festival ? NIGHT : DAY;

  return (
    <SceneCanvas
      palette={palette}
      cameraPosition={[0, 3.2, 20]}
      fov={60}
      fog={[34, 220]}
      controls={{
        target: [0, 2, -6],
        minDistance: 7,
        maxDistance: 48,
        minPolarAngle: 0.7,
        maxPolarAngle: Math.PI / 2.08,
      }}
      bloomIntensity={festival ? 1.35 : 0.7}
    >
      <directionalLight
        position={festival ? [-22, 30, -10] : [24, 12, -12]}
        intensity={festival ? 0.45 : 1.6}
        color={festival ? '#9fb0ff' : '#ffe9c4'}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={120}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-10}
      />

      <SaltFlat tint={palette.fog} />
      <CelestialBody festival={festival} />

      {festival ? (
        <>
          <Tents />
          <StagePavilion />
          <StringLights />
          <Bunting />
          <Bonfire />
          <Camel position={[-12, 0, 4]} rotation={[0, 0.6, 0]} scale={0.95} decorated rider />
          <Camel position={[12, 0, 6]} rotation={[0, -0.7, 0]} scale={0.95} decorated />
          <Figures count={10} color="#1d1830" />
          <Particles count={120} area={[60, 18, 36]} center={[0, 9, -6]} color="#ffce86" size={0.5} speed={0.4} />
        </>
      ) : (
        <>
          <Bhungas />
          <SaltPans />
          <Caravan />
          <Figures count={9} color="#2a2018" />
          {/* long sun-sheen reflection on the salt */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[24, 0.02, -10]}>
            <planeGeometry args={[10, 120]} />
            <meshBasicMaterial color="#ffe9b8" transparent opacity={0.18} depthWrite={false} />
          </mesh>
        </>
      )}
    </SceneCanvas>
  );
}
