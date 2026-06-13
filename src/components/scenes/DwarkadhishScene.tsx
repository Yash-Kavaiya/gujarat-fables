import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { DoubleSide, ShaderMaterial } from 'three';
import SceneCanvas from '../three/SceneCanvas';
import WaterPlane from '../three/primitives/WaterPlane';
import Pillars from '../three/primitives/Pillars';
import ShikharaTower from '../three/primitives/ShikharaTower';
import Hotspot from '../ui/Hotspot';
import { getPlace } from '../../data/places';
import { useSceneStore } from '../../store/useSceneStore';

const place = getPlace('dwarkadhish-temple')!;
const DAY = place.palette;
const EVENING = { sky: '#5a4a66', ground: '#2c4654', accent: '#ff9d4d', fog: '#48405e' };
const STONE = '#d4ad62';

/** The great Dhwaja — a flag that ripples on its pole. */
function Flag() {
  const matRef = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((_, d) => {
    if (matRef.current) (matRef.current.uniforms.uTime.value as number) += d;
  });
  return (
    <group position={[0, 24, 0]}>
      {/* pole */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 6, 8]} />
        <meshStandardMaterial color="#caa24e" metalness={0.4} roughness={0.4} />
      </mesh>
      {/* cloth */}
      <mesh position={[2.1, 0.6, 0]}>
        <planeGeometry args={[4, 2.4, 24, 12]} />
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
              float anchor = (p.x + 2.0) / 4.0;
              p.z += sin(p.x * 2.2 + uTime * 5.0) * 0.32 * anchor;
              p.y += sin(p.x * 1.5 + uTime * 3.0) * 0.12 * anchor;
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
    </group>
  );
}

export default function DwarkadhishScene() {
  const evening = useSceneStore((s) => s.evening);
  const palette = evening ? EVENING : DAY;

  // five diminishing storeys
  const tiers = [0, 1, 2, 3, 4].map((i) => ({
    y: 3 + i * 3,
    w: 9 - i * 1.3,
    d: 9 - i * 1.3,
  }));

  return (
    <SceneCanvas
      palette={palette}
      cameraPosition={[16, 10, 22]}
      fov={50}
      fog={[40, 240]}
      controls={{ target: [0, 9, 0], minDistance: 12, maxDistance: 70 }}
      bloomIntensity={evening ? 1.1 : 0.7}
    >
      <directionalLight
        position={evening ? [-18, 16, 16] : [20, 30, 16]}
        intensity={evening ? 0.7 : 1.6}
        color={evening ? '#ffb275' : '#fff2d8'}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Gomti creek meeting the sea */}
      <WaterPlane
        size={500}
        color={evening ? '#1a2c3c' : '#2f5e6c'}
        highlight={evening ? '#ff9d4d' : '#d4ebee'}
        amplitude={0.26}
        position={[0, 0, 14]}
      />

      {/* Stone ghat platform */}
      <mesh position={[0, 0.75, -2]} receiveShadow castShadow>
        <boxGeometry args={[30, 1.5, 26]} />
        <meshStandardMaterial color="#c2a061" roughness={0.95} />
      </mesh>

      {/* 72-pillar colonnade base */}
      <group position={[0, 1.5, 0]}>
        <Pillars rows={5} cols={6} spacing={1.7} height={3} radius={0.24} color={STONE} hollow />
      </group>

      {/* The five-storey tower */}
      <group position={[0, 1.5, 0]}>
        {tiers.map((t, i) => (
          <mesh key={i} position={[0, t.y, 0]} castShadow>
            <boxGeometry args={[t.w, 2.8, t.d]} />
            <meshStandardMaterial color={i % 2 ? '#cda85f' : STONE} roughness={0.85} />
          </mesh>
        ))}
        <ShikharaTower position={[0, 17, 0]} height={7} baseRadius={1.9} color={STONE} accent="#ffcf6b" />
        <Hotspot position={[0, 25.5, 0]} label="The Dhwaja is changed five times a day" />
      </group>

      <Flag />

      {evening && (
        <pointLight position={[0, 8, 4]} intensity={2.4} color="#ff9d4d" distance={60} />
      )}
    </SceneCanvas>
  );
}
