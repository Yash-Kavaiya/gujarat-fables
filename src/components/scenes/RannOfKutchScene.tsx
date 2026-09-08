import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance, OrbitControls } from '@react-three/drei';
import {
  Color,
  DoubleSide,
  Mesh,
  ShaderMaterial,
  Vector3,
  Group,
} from 'three';
import SceneCanvas from '../three/SceneCanvas';
import WaterPlane from '../three/primitives/WaterPlane';
import Particles from '../three/primitives/Particles';
import Hotspot from '../ui/Hotspot';
import { getPlace } from '../../data/places';
import { useSceneStore } from '../../store/useSceneStore';
import {
  RANN_PLACE_ID,
  RANN_LIGHTING_PRESETS,
  RANN_CAMERA_STATIONS,
  RANN_HOTSPOTS,
  makeBhungaHamlet,
  makeLippanMirrors,
  makeSaltPans,
  makeSaltMounds,
  makeCaravanCamels,
  makeFestivalTents,
  makeGarbaDancers,
  makeFolkMusicians,
  makeCraftBazaarStalls,
  makeFairyLightStrings,
  type RannTimeOfDay,
  type RannCameraMode,
  type BhungaSpec,
  type CamelSpec,
} from './rannOfKutchLayout';

const place = getPlace(RANN_PLACE_ID)!;

// ============================================================================
// 1. Crystalline Salt Crust & Hexagonal Voronoi Terrain Shader
// ============================================================================

function SaltCrustTerrain({
  timeOfDay,
  saltSparkle,
}: {
  timeOfDay: RannTimeOfDay;
  saltSparkle: number;
}) {
  const preset = RANN_LIGHTING_PRESETS[timeOfDay];

  const material = useMemo(() => {
    return new ShaderMaterial({
      side: DoubleSide,
      uniforms: {
        uSaltColor: { value: new Color(preset.groundTint) },
        uCrackColor: { value: new Color(preset.fogColor) },
        uSkyReflect: { value: new Color(preset.skyHorizon) },
        uAccentColor: { value: new Color(preset.accentColor) },
        uScale: { value: 34.0 },
        uSparkleIntensity: { value: saltSparkle },
        uTime: { value: 0 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        varying vec3 vNormal;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        varying vec3 vNormal;

        uniform vec3 uSaltColor;
        uniform vec3 uCrackColor;
        uniform vec3 uSkyReflect;
        uniform vec3 uAccentColor;
        uniform float uScale;
        uniform float uSparkleIntensity;
        uniform float uTime;

        vec2 hash2(vec2 p) {
          p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
          return fract(sin(p) * 43758.5453);
        }

        // Voronoi border algorithm for polygonal salt crust tiles
        float voronoiBorder(vec2 x) {
          vec2 n = floor(x);
          vec2 f = fract(x);
          vec2 mg, mr;
          float md = 8.0;

          for (int j = -1; j <= 1; j++) {
            for (int i = -1; i <= 1; i++) {
              vec2 g = vec2(float(i), float(j));
              vec2 o = hash2(n + g);
              vec2 r = g + o - f;
              float d = dot(r, r);
              if (d < md) {
                md = d;
                mr = r;
                mg = g;
              }
            }
          }

          md = 8.0;
          for (int j = -2; j <= 2; j++) {
            for (int i = -2; i <= 2; i++) {
              vec2 g = mg + vec2(float(i), float(j));
              vec2 o = hash2(n + g);
              vec2 r = g + o - f;
              vec2 diff = mr - r;
              if (dot(diff, diff) > 0.00001) {
                md = min(md, dot(0.5 * (mr + r), normalize(r - mr)));
              }
            }
          }
          return md;
        }

        void main() {
          vec2 uv = vUv * uScale;
          float b = voronoiBorder(uv);

          // Crystalline ridge lines
          float ridge = 1.0 - smoothstep(0.0, 0.055, b);
          float fineCrack = 1.0 - smoothstep(0.0, 0.015, b);

          // Distance fade to prevent moiré at the horizon
          float dist = length(vWorldPosition.xz);
          float fade = smoothstep(220.0, 30.0, dist);

          // Micro salt crystal glint / sparkles
          vec2 sparkleUv = floor(uv * 18.0);
          float sparkleHash = hash2(sparkleUv).x;
          float sparkle = pow(sparkleHash, 32.0) * uSparkleIntensity * fade;

          // Blend base salt, crystalline ridges, and sky sheen
          vec3 col = uSaltColor;
          col = mix(col, uCrackColor * 0.85, ridge * 0.45 * fade);
          col = mix(col, uAccentColor, fineCrack * 0.25 * fade);
          col += vec3(sparkle);

          // Subtle Fresnel sky reflection on the flat salt bed
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          float fresnel = pow(1.0 - max(dot(viewDir, vec3(0.0, 1.0, 0.0)), 0.0), 3.5);
          col = mix(col, uSkyReflect, fresnel * 0.35);

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
  }, [preset, saltSparkle]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} material={material} receiveShadow>
      <planeGeometry args={[650, 650, 1, 1]} />
    </mesh>
  );
}

// ============================================================================
// 2. Celestial Body: Sun, Glowing Moon, & Starfield
// ============================================================================

function CelestialAtmosphere({ timeOfDay }: { timeOfDay: RannTimeOfDay }) {
  const preset = RANN_LIGHTING_PRESETS[timeOfDay];
  const moonRef = useRef<Group>(null);

  useFrame((state) => {
    if (moonRef.current && (timeOfDay === 'fullmoon' || timeOfDay === 'festival')) {
      const t = state.clock.elapsedTime * 0.05;
      moonRef.current.rotation.y = t * 0.2;
    }
  });

  return (
    <group>
      {/* Sun for Day & Sunset */}
      {preset.showSun && (
        <group position={preset.sunPosition}>
          <mesh>
            <sphereGeometry args={[7.5, 32, 32]} />
            <meshBasicMaterial color={preset.sunColor} />
          </mesh>
          {/* Corona Halo */}
          <mesh>
            <sphereGeometry args={[16.0, 24, 24]} />
            <meshBasicMaterial
              color={preset.accentColor}
              transparent
              opacity={timeOfDay === 'sunset' ? 0.32 : 0.18}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}

      {/* Luminous Full Moon for Full Moon Night & Rann Utsav */}
      {preset.showMoon && (
        <group ref={moonRef} position={preset.sunPosition}>
          {/* Main Moon Sphere */}
          <mesh>
            <sphereGeometry args={[6.8, 32, 32]} />
            <meshStandardMaterial
              color="#f5f7fa"
              emissive="#dbe4ff"
              emissiveIntensity={1.2}
              roughness={0.9}
            />
          </mesh>
          {/* Ethereal Outer Lunar Glow */}
          <mesh>
            <sphereGeometry args={[14.5, 24, 24]} />
            <meshBasicMaterial
              color="#a0b8ff"
              transparent
              opacity={0.25}
              depthWrite={false}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[22.0, 20, 20]} />
            <meshBasicMaterial
              color="#70a1ff"
              transparent
              opacity={0.12}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}

      {/* Desert Starfield */}
      {preset.showStars && (
        <Particles
          count={350}
          area={[280, 75, 280]}
          center={[0, 45, -20]}
          color="#ffffff"
          size={0.4}
          speed={0.02}
          additive
        />
      )}
    </group>
  );
}

// ============================================================================
// 3. Traditional Kutch Bhunga Hamlet & Lippan Kaam
// ============================================================================

function BhungaHut({ spec }: { spec: BhungaSpec }) {
  const mirrors = useMemo(
    () => makeLippanMirrors(spec.radius, spec.wallHeight),
    [spec.radius, spec.wallHeight],
  );

  return (
    <group position={spec.position} rotation={[0, spec.rotationY, 0]}>
      {/* Raised Circular Mud Plinth (Otla) */}
      {spec.hasOtla && (
        <mesh position={[0, 0.18, 0]} receiveShadow>
          <cylinderGeometry args={[spec.radius + 0.8, spec.radius + 1.0, 0.36, 24]} />
          <meshStandardMaterial color="#b28756" roughness={0.96} />
        </mesh>
      )}

      {/* Cylindrical Mud Plaster Wall */}
      <mesh position={[0, spec.wallHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[spec.radius, spec.radius * 1.04, spec.wallHeight, 28]} />
        <meshStandardMaterial color="#c29668" roughness={0.94} />
      </mesh>

      {/* Lippan Kaam White Clay Base Band */}
      <mesh position={[0, spec.wallHeight * 0.65, 0]} castShadow>
        <cylinderGeometry
          args={[spec.radius + 0.015, spec.radius * 1.04 + 0.015, spec.wallHeight * 0.5, 28]}
        />
        <meshStandardMaterial color={spec.mirrorBandColor} roughness={0.82} />
      </mesh>

      {/* Embedded Lippan Mirror-work Flakes */}
      <Instances range={mirrors.length}>
        <boxGeometry args={[0.08, 0.08, 0.01]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.95}
          roughness={0.08}
          emissive="#ffffff"
          emissiveIntensity={0.2}
        />
        {mirrors.map((m, i) => (
          <Instance
            key={i}
            position={m.position}
            rotation={m.rotation}
            scale={[m.size / 0.08, m.size / 0.08, 1]}
          />
        ))}
      </Instances>

      {/* Conical Thatched Grass Roof (Banni Straw / Khip) */}
      <mesh
        position={[0, spec.wallHeight + spec.roofHeight / 2, 0]}
        castShadow
        receiveShadow
      >
        <coneGeometry args={[spec.radius * 1.35, spec.roofHeight, 24]} />
        <meshStandardMaterial color="#7a5832" roughness={1.0} />
      </mesh>

      {/* Earthen Finial Pot (Kalashi) atop the apex */}
      <mesh position={[0, spec.wallHeight + spec.roofHeight + 0.22, 0]} castShadow>
        <sphereGeometry args={[0.22, 10, 10]} />
        <meshStandardMaterial color="#a0522d" roughness={0.85} />
      </mesh>

      {/* Carved Wooden Doorway & Frame */}
      <group position={[0, spec.wallHeight * 0.38, spec.radius * 1.02]}>
        {/* Door Frame */}
        <mesh castShadow>
          <boxGeometry args={[0.65, 1.25, 0.12]} />
          <meshStandardMaterial color="#4a3520" roughness={0.9} />
        </mesh>
        {/* Inner Dark Door */}
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[0.5, 1.1, 0.08]} />
          <meshStandardMaterial color="#2d1f12" roughness={0.95} />
        </mesh>
        {/* Colorful Embroidered Toran over doorway */}
        <mesh position={[0, 0.58, 0.07]}>
          <boxGeometry args={[0.68, 0.14, 0.04]} />
          <meshStandardMaterial color="#e74c3c" roughness={0.7} />
        </mesh>
      </group>

      {/* Outside Charpai (Woven Cot) */}
      {spec.hasCharpai && (
        <group position={[spec.radius + 1.2, 0.25, spec.radius * 0.4]} rotation={[0, 0.4, 0]}>
          {/* Wooden Frame */}
          <mesh position={[0, 0.18, 0]} castShadow>
            <boxGeometry args={[1.4, 0.08, 0.8]} />
            <meshStandardMaterial color="#5a422a" roughness={0.9} />
          </mesh>
          {/* Woven Jute Rope Bedding */}
          <mesh position={[0, 0.21, 0]}>
            <boxGeometry args={[1.25, 0.02, 0.68]} />
            <meshStandardMaterial color="#c2a679" roughness={0.95} />
          </mesh>
          {/* 4 Turned Wooden Legs */}
          {[-0.6, 0.6].map((x) =>
            [-0.32, 0.32].map((z) => (
              <mesh key={`${x}-${z}`} position={[x, 0.09, z]} castShadow>
                <cylinderGeometry args={[0.04, 0.03, 0.22, 8]} />
                <meshStandardMaterial color="#44301d" roughness={0.9} />
              </mesh>
            )),
          )}
        </group>
      )}

      {/* Traditional Brass Matkas & Water Pots */}
      <group position={[-spec.radius * 0.85, 0.2, spec.radius * 0.85]}>
        <mesh position={[0, 0.18, 0]} castShadow>
          <sphereGeometry args={[0.18, 12, 10]} />
          <meshStandardMaterial color="#d4af37" metalness={0.75} roughness={0.28} />
        </mesh>
        <mesh position={[0.26, 0.14, -0.1]} castShadow>
          <sphereGeometry args={[0.14, 10, 8]} />
          <meshStandardMaterial color="#c0392b" roughness={0.88} />
        </mesh>
      </group>
    </group>
  );
}

function BhungaHamlet() {
  const bhungas = useMemo(() => makeBhungaHamlet(), []);
  return (
    <group>
      {bhungas.map((b) => (
        <BhungaHut key={b.id} spec={b} />
      ))}
    </group>
  );
}

// ============================================================================
// 4. Agariya Salt Farming Ecosystem: Brine Pans & Crystal Mounds
// ============================================================================

function AgariyaSaltPans() {
  const pans = useMemo(() => makeSaltPans(), []);
  const mounds = useMemo(() => makeSaltMounds(), []);

  return (
    <group>
      {/* 12 Shallow Brine Pans with Mud Bunds */}
      {pans.map((pan) => (
        <group key={pan.id} position={pan.position}>
          {/* Mud Bund Wall Borders */}
          <mesh position={[0, 0.1, 0]} receiveShadow>
            <boxGeometry args={[pan.width, 0.22, pan.length]} />
            <meshStandardMaterial color="#9d7e52" roughness={0.98} />
          </mesh>

          {/* Inner Reflective Brine Pool */}
          <WaterPlane
            size={pan.width - 0.5}
            segments={10}
            color={pan.brineColor}
            highlight="#ffffff"
            amplitude={0.008}
            position={[0, pan.waterLevel, 0]}
          />
        </group>
      ))}

      {/* Harvested Salt Pyramids / Mounds (Khandi) */}
      {mounds.map((m, idx) => (
        <mesh
          key={idx}
          position={[m.position[0], m.height / 2, m.position[2]]}
          rotation={[0, m.rotationY, 0]}
          castShadow
          receiveShadow
        >
          <coneGeometry args={[m.radius, m.height, 8]} />
          <meshStandardMaterial
            color="#f7f9fa"
            roughness={0.45}
            metalness={0.1}
            emissive="#ffffff"
            emissiveIntensity={0.08}
          />
        </mesh>
      ))}

      {/* Agariya Wooden Salt Rakes (Dantali) */}
      {[
        [22, 0.5, 7, 0.3],
        [28, 0.5, 1, -0.4],
        [34, 0.5, -5, 0.2],
      ].map(([x, y, z, rot], i) => (
        <group key={i} position={[x, y, z]} rotation={[0.4, rot, 0.2]}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 1.4, 6]} />
            <meshStandardMaterial color="#6b4c2a" roughness={0.95} />
          </mesh>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.6, 0.08, 0.12]} />
            <meshStandardMaterial color="#533a1e" roughness={0.95} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ============================================================================
// 5. Maldhari Camel Caravan & Decorated Camel Cart
// ============================================================================

function KachchhiCamel({ spec }: { spec: CamelSpec }) {
  const camelHide = '#b78a55';
  const camelDark = '#8f683a';

  return (
    <group position={spec.position} rotation={[0, spec.rotationY, 0]} scale={spec.scale}>
      {/* Torso */}
      <mesh position={[0, 1.6, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.56, 1.8, 8, 12]} />
        <meshStandardMaterial color={camelHide} roughness={0.92} />
      </mesh>

      {/* Single Hump */}
      <mesh position={[-0.1, 2.15, 0]} castShadow>
        <sphereGeometry args={[0.52, 14, 12]} />
        <meshStandardMaterial color={camelHide} roughness={0.92} />
      </mesh>

      {/* Neck */}
      <mesh position={[1.1, 2.2, 0]} rotation={[0, 0, -0.72]} castShadow>
        <capsuleGeometry args={[0.24, 1.15, 8, 10]} />
        <meshStandardMaterial color={camelHide} roughness={0.92} />
      </mesh>

      {/* Head & Snout */}
      <group position={[1.65, 2.8, 0]} rotation={[0, 0, 0.28]}>
        <mesh castShadow>
          <boxGeometry args={[0.65, 0.35, 0.32]} />
          <meshStandardMaterial color={camelHide} roughness={0.92} />
        </mesh>
        {/* Ears */}
        {[-0.12, 0.12].map((z, i) => (
          <mesh key={i} position={[-0.18, 0.22, z]} rotation={[0, 0, -0.4]}>
            <coneGeometry args={[0.06, 0.16, 6]} />
            <meshStandardMaterial color={camelDark} roughness={0.95} />
          </mesh>
        ))}
      </group>

      {/* Four Slender Legs with Padded Sand Hooves */}
      {[
        [0.65, 0.36],
        [0.65, -0.36],
        [-0.65, 0.36],
        [-0.65, -0.36],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.13, 0.11, 1.6, 8]} />
            <meshStandardMaterial color={camelDark} roughness={0.95} />
          </mesh>
          {/* Padded Hoof */}
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.14, 0.16, 0.12, 8]} />
            <meshStandardMaterial color="#4a3720" roughness={0.98} />
          </mesh>
        </group>
      ))}

      {/* Tail with Tuft */}
      <mesh position={[-1.0, 1.48, 0]} rotation={[0, 0, 0.42]}>
        <cylinderGeometry args={[0.05, 0.03, 0.85, 6]} />
        <meshStandardMaterial color={camelDark} roughness={1.0} />
      </mesh>

      {/* Decorative Kachchhi Gorband & Saddle */}
      {spec.decorated && (
        <group>
          {/* Embroidered Saddle Blanket */}
          <mesh position={[0, 2.05, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.6, 0.6, 1.1, 14, 1, true]} />
            <meshStandardMaterial color={spec.saddlePattern} roughness={0.7} side={DoubleSide} />
          </mesh>
          {/* Gorband Chest Strap with Wool Tassels */}
          <mesh position={[0.75, 1.8, 0]} rotation={[0, 0, 0.6]}>
            <torusGeometry args={[0.42, 0.05, 6, 16]} />
            <meshStandardMaterial color={spec.tasselColor} roughness={0.65} />
          </mesh>
        </group>
      )}

      {/* Maldhari Camel Rider in Traditional Attire */}
      {spec.hasRider && (
        <group position={[0.05, 2.65, 0]}>
          {/* White Kediyu Tunic */}
          <mesh castShadow>
            <capsuleGeometry args={[0.22, 0.55, 6, 8]} />
            <meshStandardMaterial color="#f7f9fa" roughness={0.85} />
          </mesh>
          {/* Head with Crimson / Saffron Kutchi Paghadi Turban */}
          <mesh position={[0, 0.55, 0]} castShadow>
            <sphereGeometry args={[0.18, 10, 10]} />
            <meshStandardMaterial color="#4a321f" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.68, 0]} castShadow>
            <torusGeometry args={[0.18, 0.08, 6, 12]} />
            <meshStandardMaterial color="#c0392b" roughness={0.7} />
          </mesh>
          {/* Shepherd Staff (Dang) */}
          <mesh position={[0.25, 0.2, 0.22]} rotation={[0.2, 0, -0.3]}>
            <cylinderGeometry args={[0.02, 0.02, 1.2, 6]} />
            <meshStandardMaterial color="#7a5528" roughness={0.9} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function CamelCaravan() {
  const camels = useMemo(() => makeCaravanCamels(), []);

  return (
    <group>
      {camels.map((c) => (
        <KachchhiCamel key={c.id} spec={c} />
      ))}
    </group>
  );
}

// ============================================================================
// 6. Rann Utsav Tent City & Cultural Stage Pavilion
// ============================================================================

function TentCity() {
  const tents = useMemo(() => makeFestivalTents(), []);

  return (
    <group>
      {tents.map((t) => (
        <group key={t.id} position={t.position} rotation={[0, t.rotationY, 0]}>
          {/* Wooden Veranda Deck */}
          <mesh position={[0, 0.1, 0.4]} receiveShadow>
            <boxGeometry args={[3.6, 0.2, 3.8]} />
            <meshStandardMaterial color="#6a4c28" roughness={0.92} />
          </mesh>

          {/* Main Tent Body */}
          <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.2, 2.0, 2.8]} />
            <meshStandardMaterial color="#f5eedb" roughness={0.88} />
          </mesh>

          {/* Scalloped Pitch Roof */}
          <mesh position={[0, 2.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[2.5, 1.5, 4]} />
            <meshStandardMaterial color={t.roofColor} roughness={0.8} />
          </mesh>

          {/* Roof Trim Valance */}
          <mesh position={[0, 2.1, 0]}>
            <boxGeometry args={[3.35, 0.16, 2.95]} />
            <meshStandardMaterial color={t.trimColor} roughness={0.7} />
          </mesh>

          {/* Entrance Door & Lantern */}
          <mesh position={[0, 0.8, 1.41]}>
            <boxGeometry args={[0.85, 1.45, 0.05]} />
            <meshStandardMaterial color="#3a2518" roughness={0.95} />
          </mesh>
          <mesh position={[0.6, 1.5, 1.45]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial
              color="#ffe08a"
              emissive="#ffba4d"
              emissiveIntensity={2.5}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function CulturalStageAndBonfire() {
  const dancers = useMemo(() => makeGarbaDancers(), []);
  const musicians = useMemo(() => makeFolkMusicians(), []);
  const flameRef = useRef<Mesh>(null);
  const ringRef = useRef<Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Flickering bonfire flame
    if (flameRef.current) {
      const s = 1 + Math.sin(t * 11) * 0.14 + Math.sin(t * 17.3) * 0.08;
      flameRef.current.scale.set(1, s, 1);
    }
    // Rotating Garba dancers circle
    if (ringRef.current) {
      ringRef.current.rotation.y = t * 0.22;
    }
  });

  return (
    <group position={[0, 0, 8]}>
      {/* Wooden Circular Performance Stage */}
      <mesh position={[0, 0.35, 0]} receiveShadow>
        <cylinderGeometry args={[7.2, 7.5, 0.7, 32]} />
        <meshStandardMaterial color="#6a4c28" roughness={0.92} />
      </mesh>

      {/* Stage Brass Balustrade Trim */}
      <mesh position={[0, 0.75, 0]}>
        <torusGeometry args={[7.3, 0.06, 8, 36]} />
        <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Central Campfire with Real Embers */}
      <group position={[0, 0.7, 0]}>
        {/* Firewood Logs */}
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh
            key={i}
            position={[0, 0.15, 0]}
            rotation={[0.35, (i * Math.PI) / 2.5, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.14, 0.14, 1.8, 6]} />
            <meshStandardMaterial color="#2d1a0e" roughness={1.0} />
          </mesh>
        ))}

        {/* Outer Flame Cone */}
        <mesh ref={flameRef} position={[0, 1.25, 0]}>
          <coneGeometry args={[0.85, 2.6, 12]} />
          <meshBasicMaterial color="#ff7a18" transparent opacity={0.88} depthWrite={false} />
        </mesh>
        {/* Inner Golden Flame Core */}
        <mesh position={[0, 0.95, 0]}>
          <coneGeometry args={[0.45, 1.6, 10]} />
          <meshBasicMaterial color="#ffea60" transparent opacity={0.92} depthWrite={false} />
        </mesh>

        {/* Dynamic Warm Firelight */}
        <pointLight position={[0, 1.8, 0]} intensity={3.8} color="#ff9038" distance={36} />

        {/* Fire Spark Embers */}
        <Particles
          count={50}
          area={[2.5, 7.0, 2.5]}
          center={[0, 3.5, 0]}
          color="#ffb84d"
          size={0.22}
          speed={1.4}
          additive
        />
      </group>

      {/* Garba Folk Dancers Ring */}
      <group ref={ringRef}>
        {dancers.map((d) => (
          <group key={d.id} position={d.position} rotation={[0, d.rotationY, 0]}>
            {/* Flared Mirror-work Chaniya Choli Skirt */}
            <mesh position={[0, -0.15, 0]} castShadow>
              <coneGeometry args={[0.45, 0.7, 12, 1, true]} />
              <meshStandardMaterial color={d.skirtColor} roughness={0.7} side={DoubleSide} />
            </mesh>
            {/* Torso & Blouse */}
            <mesh position={[0, 0.35, 0]} castShadow>
              <capsuleGeometry args={[0.14, 0.38, 4, 8]} />
              <meshStandardMaterial color={d.dupattaColor} roughness={0.75} />
            </mesh>
            {/* Head & Hair Bun */}
            <mesh position={[0, 0.68, 0]} castShadow>
              <sphereGeometry args={[0.13, 8, 8]} />
              <meshStandardMaterial color="#2c1f14" roughness={0.9} />
            </mesh>
            {/* Dandiya Sticks */}
            {d.holdingDandiya && (
              <mesh position={[0.18, 0.45, 0.15]} rotation={[0.4, 0, -0.6]}>
                <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
                <meshStandardMaterial color="#f1c40f" roughness={0.5} />
              </mesh>
            )}
          </group>
        ))}
      </group>

      {/* Kutchi Folk Orchestra Musicians */}
      {musicians.map((m) => (
        <group key={m.id} position={m.position} rotation={[0, m.rotationY, 0]}>
          {/* Seated Musician Body */}
          <mesh position={[0, 0, 0]} castShadow>
            <capsuleGeometry args={[0.18, 0.45, 4, 8]} />
            <meshStandardMaterial color="#f5f7fa" roughness={0.88} />
          </mesh>
          {/* Turban */}
          <mesh position={[0, 0.42, 0]}>
            <sphereGeometry args={[0.16, 8, 8]} />
            <meshStandardMaterial color={m.turbanColor} roughness={0.7} />
          </mesh>
          {/* Instrument Mesh */}
          {m.instrument === 'dholak' ? (
            <mesh position={[0, 0.1, 0.28]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.16, 0.18, 0.65, 10]} />
              <meshStandardMaterial color="#533a1e" roughness={0.85} />
            </mesh>
          ) : (
            <mesh position={[0, 0.2, 0.2]} rotation={[0.5, 0, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.6, 6]} />
              <meshStandardMaterial color="#a0522d" roughness={0.8} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

// ============================================================================
// 7. Artisan Craft Bazaar & Machan Observation Watchtower
// ============================================================================

function ArtisanCraftBazaar() {
  const stalls = useMemo(() => makeCraftBazaarStalls(), []);

  return (
    <group>
      {stalls.map((s) => (
        <group key={s.id} position={s.position} rotation={[0, s.rotationY, 0]}>
          {/* Stall Timber Counter */}
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.2, 1.0, 1.4]} />
            <meshStandardMaterial color="#5a3d24" roughness={0.92} />
          </mesh>

          {/* Striped Canopy */}
          <mesh position={[0, 2.2, 0]} castShadow>
            <boxGeometry args={[3.4, 0.12, 1.8]} />
            <meshStandardMaterial color={s.canopyColor} roughness={0.75} />
          </mesh>

          {/* 4 Corner Canopy Support Poles */}
          {[-1.5, 1.5].map((x) =>
            [-0.7, 0.7].map((z) => (
              <mesh key={`${x}-${z}`} position={[x, 1.1, z]} castShadow>
                <cylinderGeometry args={[0.04, 0.04, 2.2, 6]} />
                <meshStandardMaterial color="#422c19" roughness={0.9} />
              </mesh>
            )),
          )}

          {/* Hanging Craft Exhibits / Easel */}
          <mesh position={[0, 1.25, 0.1]} rotation={[-0.15, 0, 0]}>
            <boxGeometry args={[1.2, 0.8, 0.04]} />
            <meshStandardMaterial color={s.accentColor} roughness={0.65} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function MachanWatchtower() {
  return (
    <group position={[-22, 0, -6]}>
      {/* 4 Sturdy Main Timber Pillars */}
      {[-2.2, 2.2].map((x) =>
        [-2.2, 2.2].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 4.5, z]} castShadow>
            <cylinderGeometry args={[0.18, 0.22, 9.0, 8]} />
            <meshStandardMaterial color="#4a3520" roughness={0.95} />
          </mesh>
        )),
      )}

      {/* Mid Platform & Top Observation Deck */}
      {[4.0, 8.2].map((y, idx) => (
        <group key={idx} position={[0, y, 0]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[4.8, 0.25, 4.8]} />
            <meshStandardMaterial color="#6a4c28" roughness={0.9} />
          </mesh>
          {/* Deck Railings */}
          {[-2.3, 2.3].map((side) => (
            <mesh key={`r1-${side}`} position={[side, 0.5, 0]}>
              <boxGeometry args={[0.1, 0.9, 4.6]} />
              <meshStandardMaterial color="#4a3520" roughness={0.95} />
            </mesh>
          ))}
          {[-2.3, 2.3].map((side) => (
            <mesh key={`r2-${side}`} position={[0, 0.5, side]}>
              <boxGeometry args={[4.6, 0.9, 0.1]} />
              <meshStandardMaterial color="#4a3520" roughness={0.95} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Conical Thatch Canopy over Observation Deck */}
      <mesh position={[0, 10.2, 0]} castShadow>
        <coneGeometry args={[3.2, 1.8, 8]} />
        <meshStandardMaterial color="#7a5832" roughness={1.0} />
      </mesh>

      {/* Fluttering Kutchi Pennant Flag */}
      <mesh position={[0, 11.4, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.35, 1.2, 3]} />
        <meshStandardMaterial color="#e74c3c" roughness={0.6} side={DoubleSide} />
      </mesh>
    </group>
  );
}

// ============================================================================
// 8. Festive Fairy Lights & Decorative Bunting
// ============================================================================

function FestiveFairyLights() {
  const rows = useMemo(() => makeFairyLightStrings(), []);
  const allPoles = useMemo(() => rows.flatMap((r) => r.poles), [rows]);
  const allBulbs = useMemo(() => rows.flatMap((r) => r.bulbs), [rows]);

  return (
    <group>
      {/* Timber String Poles */}
      <Instances range={allPoles.length}>
        <cylinderGeometry args={[0.08, 0.1, 5.2, 6]} />
        <meshStandardMaterial color="#533b24" roughness={0.95} />
        {allPoles.map((p, i) => (
          <Instance key={i} position={p} />
        ))}
      </Instances>

      {/* Glowing Warm Incandescent Bulbs */}
      <Instances range={allBulbs.length}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial
          color="#ffeaa7"
          emissive="#ff9f43"
          emissiveIntensity={2.8}
        />
        {allBulbs.map((p, i) => (
          <Instance key={i} position={p} />
        ))}
      </Instances>
    </group>
  );
}

// ============================================================================
// 9. Dynamic Interactive Camera Rig
// ============================================================================

function DynamicRannCameraRig({ mode }: { mode: RannCameraMode }) {
  const target = useRef(new Vector3());
  const look = useRef(new Vector3());

  useFrame((state, delta) => {
    if (mode === 'orbit') return;

    const station = RANN_CAMERA_STATIONS[mode] ?? RANN_CAMERA_STATIONS.explore;
    target.current.set(...station.cameraPos);
    look.current.set(...station.lookAtPos);

    const k = 1 - Math.pow(0.0015, delta);
    state.camera.position.lerp(target.current, k);
    state.camera.lookAt(look.current);
  });

  if (mode === 'orbit') {
    return (
      <OrbitControls
        makeDefault
        target={[0, 2.0, 0]}
        minDistance={6}
        maxDistance={70}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI / 2.04}
        dampingFactor={0.08}
        enableDamping
      />
    );
  }

  return null;
}

// ============================================================================
// Main Great Rann of Kutch 3D Scene Component
// ============================================================================

export default function RannOfKutchScene() {
  const timeOfDay = useSceneStore((s) => s.rannTimeOfDay);
  const cameraMode = useSceneStore((s) => s.rannCameraMode);
  const mirage = useSceneStore((s) => s.rannMirage);

  const preset = RANN_LIGHTING_PRESETS[timeOfDay] ?? RANN_LIGHTING_PRESETS.day;

  return (
    <SceneCanvas
      palette={{
        sky: preset.skyTop,
        ground: preset.groundTint,
        accent: preset.accentColor,
        fog: preset.fogColor,
      }}
      cameraPosition={RANN_CAMERA_STATIONS.explore.cameraPos}
      fov={RANN_CAMERA_STATIONS.explore.fov}
      fog={[preset.fogNear, preset.fogFar]}
      controls={false} // Managed dynamically by DynamicRannCameraRig
      bloomIntensity={preset.bloomIntensity}
    >
      {/* Key Directional Sun / Lunar Light */}
      <directionalLight
        position={preset.sunPosition}
        intensity={preset.sunIntensity}
        color={preset.sunColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={160}
        shadow-camera-left={-55}
        shadow-camera-right={55}
        shadow-camera-top={55}
        shadow-camera-bottom={-20}
      />

      {/* Atmospheric Ambient / Fill Lighting */}
      <ambientLight intensity={preset.ambientIntensity} color={preset.ambientColor} />

      {/* Dynamic Camera Rig */}
      <DynamicRannCameraRig mode={cameraMode} />

      {/* Crystalline Voronoi Salt Crust */}
      <SaltCrustTerrain timeOfDay={timeOfDay} saltSparkle={preset.saltSparkleIntensity} />

      {/* Sun / Moon / Starfield */}
      <CelestialAtmosphere timeOfDay={timeOfDay} />

      {/* Traditional Kutch Bhunga Hamlet */}
      <BhungaHamlet />

      {/* Agariya Salt Harvesting Beds & Crystal Mounds */}
      <AgariyaSaltPans />

      {/* Maldhari Camel Caravan */}
      <CamelCaravan />

      {/* Machan Observation Watchtower */}
      <MachanWatchtower />

      {/* Rann Utsav Festival Subsystems */}
      {(timeOfDay === 'festival' || timeOfDay === 'fullmoon') && (
        <>
          <TentCity />
          <CulturalStageAndBonfire />
          <ArtisanCraftBazaar />
          <FestiveFairyLights />
        </>
      )}

      {/* Mirage Heat Shimmer Reflection for Daytime & Sunset */}
      {mirage && (timeOfDay === 'day' || timeOfDay === 'sunset') && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[28, 0.02, -18]}>
          <planeGeometry args={[18, 140]} />
          <meshBasicMaterial
            color={preset.accentColor}
            transparent
            opacity={0.16}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Floating Salt Dust & Crystalline Atmosphere Particles */}
      <Particles
        count={timeOfDay === 'day' ? 120 : 180}
        area={[70, 24, 60]}
        center={[0, 8, -4]}
        color={preset.accentColor}
        size={0.4}
        speed={0.25}
        additive
      />

      {/* Informational 3D Hotspots */}
      {RANN_HOTSPOTS.map((h) => (
        <Hotspot key={h.id} position={h.position} label={`${h.title} — ${h.description}`} />
      ))}
    </SceneCanvas>
  );
}
