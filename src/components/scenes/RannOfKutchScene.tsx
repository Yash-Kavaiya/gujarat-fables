import { useMemo } from 'react';
import { Instances, Instance } from '@react-three/drei';
import { Color, DoubleSide, ShaderMaterial } from 'three';
import SceneCanvas from '../three/SceneCanvas';
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
          // fade cracks toward the far distance so the horizon stays clean
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

/** Bhunga huts — round mud houses with conical thatch roofs. */
function Bhungas() {
  const spots = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + 0.4;
      const r = 10 + (i % 3) * 3;
      out.push([Math.cos(a) * r, 0, -8 - Math.sin(a) * r * 0.5]);
    }
    return out;
  }, []);
  return (
    <group>
      <Instances range={spots.length} castShadow>
        <cylinderGeometry args={[1.1, 1.2, 1.8, 14]} />
        <meshStandardMaterial color="#b98f63" roughness={0.95} />
        {spots.map((p, i) => (
          <Instance key={i} position={[p[0], 0.9, p[2]]} />
        ))}
      </Instances>
      <Instances range={spots.length} castShadow>
        <coneGeometry args={[1.5, 1.6, 14]} />
        <meshStandardMaterial color="#8a6a3f" roughness={1} />
        {spots.map((p, i) => (
          <Instance key={i} position={[p[0], 2.6, p[2]]} />
        ))}
      </Instances>
    </group>
  );
}

/** Festival tents with glowing tops. */
function FestivalTents() {
  const tents = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let i = 0; i < 14; i++) {
      out.push([(i - 7) * 3.2 + (i % 2), 0, -5 - (i % 3) * 3]);
    }
    return out;
  }, []);
  return (
    <group>
      <Instances range={tents.length} castShadow>
        <coneGeometry args={[1.3, 2.2, 4]} />
        <meshStandardMaterial color="#c9462f" roughness={0.8} emissive="#5a1d12" emissiveIntensity={0.4} />
        {tents.map((p, i) => (
          <Instance key={i} position={[p[0], 1.1, p[2]]} rotation={[0, Math.PI / 4, 0]} />
        ))}
      </Instances>
      {/* glowing finials */}
      <Instances range={tents.length}>
        <sphereGeometry args={[0.16, 8, 8]} />
        <meshStandardMaterial color="#ffd27a" emissive="#ffb14d" emissiveIntensity={2.2} />
        {tents.map((p, i) => (
          <Instance key={i} position={[p[0], 2.3, p[2]]} />
        ))}
      </Instances>
    </group>
  );
}

function CelestialBody({ festival }: { festival: boolean }) {
  return (
    <mesh position={festival ? [-30, 26, -90] : [26, 9, -90]}>
      <sphereGeometry args={[festival ? 5 : 7, 24, 24]} />
      <meshBasicMaterial color={festival ? '#eef0ff' : '#ffd98a'} />
    </mesh>
  );
}

export default function RannOfKutchScene() {
  const festival = useSceneStore((s) => s.festival);
  const palette = festival ? NIGHT : DAY;

  return (
    <SceneCanvas
      palette={palette}
      cameraPosition={[0, 2.6, 16]}
      fov={58}
      fog={[30, 200]}
      controls={{
        target: [0, 2, -8],
        minDistance: 6,
        maxDistance: 40,
        minPolarAngle: 0.8,
        maxPolarAngle: Math.PI / 2.08,
      }}
      bloomIntensity={festival ? 1.3 : 0.7}
    >
      <directionalLight
        position={festival ? [-20, 30, -10] : [20, 10, -10]}
        intensity={festival ? 0.5 : 1.6}
        color={festival ? '#9fb0ff' : '#ffe9c4'}
      />

      <SaltFlat tint={palette.fog} />
      <CelestialBody festival={festival} />

      {festival ? (
        <>
          <FestivalTents />
          <Particles
            count={120}
            area={[60, 16, 30]}
            center={[0, 8, -8]}
            color="#ffce86"
            size={0.5}
            speed={0.4}
          />
          {/* warm festival glow */}
          <pointLight position={[0, 5, -6]} intensity={2.4} color="#ff9d4d" distance={60} />
        </>
      ) : (
        <Bhungas />
      )}
    </SceneCanvas>
  );
}
