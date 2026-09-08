import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BackSide, ShaderMaterial } from 'three';

interface CloudLayerProps {
  /** 0 = sunrise, 0.5 = noon, 1 = sunset */
  sunAngle: number;
  /** Cloud density 0–1 */
  density?: number;
  /** Radius of the cloud dome */
  radius?: number;
  /** Height offset of the cloud band */
  height?: number;
  /** Speed of cloud drift */
  speed?: number;
}

/**
 * A hemispherical cloud layer rendered as a noise-driven shader on a
 * dome. Clouds drift slowly across the sky and their colour shifts
 * with the time of day (warm at dawn/dusk, white at noon).
 */
export default function CloudLayer({
  sunAngle,
  density = 0.45,
  radius = 350,
  height = 80,
  speed = 0.012,
}: CloudLayerProps) {
  const matRef = useRef<ShaderMaterial>(null);

  const uniforms = useMemo(() => {
    const theta = sunAngle * Math.PI;
    const sunH = Math.sin(theta);
    const horizonWarm = Math.pow(1 - sunH, 1.8);

    // Cloud tint: warm golden at dawn/dusk, white at noon
    const tintR = 0.92 + horizonWarm * 0.08;
    const tintG = 0.88 + sunH * 0.08 - horizonWarm * 0.12;
    const tintB = 0.82 + sunH * 0.12 - horizonWarm * 0.25;

    return {
      uTime: { value: 0 },
      uDensity: { value: density },
      uTint: { value: [tintR, tintG, tintB] },
      uSunH: { value: sunH },
      uHorizonWarm: { value: horizonWarm },
    };
  }, [sunAngle, density]);

  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += delta * speed;
    }
  });

  return (
    <mesh position={[0, height, 0]} frustumCulled={false}>
      <sphereGeometry args={[radius, 48, 24]} />
      <shaderMaterial
        ref={matRef}
        side={BackSide}
        depthWrite={false}
        transparent
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          varying vec3 vWorldPos;
          varying vec2 vUv;
          void main() {
            vec4 wp = modelMatrix * vec4(position, 1.0);
            vWorldPos = wp.xyz;
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          uniform float uTime;
          uniform float uDensity;
          uniform vec3 uTint;
          uniform float uSunH;
          uniform float uHorizonWarm;

          varying vec3 vWorldPos;
          varying vec2 vUv;

          // ── Simplex-ish noise (hash-based) ──
          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
          }

          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
          }

          float fbm(vec2 p) {
            float v = 0.0;
            float a = 0.5;
            for (int i = 0; i < 5; i++) {
              v += a * noise(p);
              p *= 2.0;
              a *= 0.5;
            }
            return v;
          }

          void main() {
            // UV based on world position for seamless tiling
            vec2 uv = vWorldPos.xz * 0.0008;

            // Animate clouds drifting
            uv.x += uTime * 0.4;
            uv.y += uTime * 0.08;

            // FBM noise for cloud shapes
            float n = fbm(uv * 6.0);
            float n2 = fbm(uv * 3.0 + 42.0);

            // Combine for more organic shapes
            float cloud = smoothstep(0.35, 0.65, n * 0.6 + n2 * 0.4);

            // Density control
            cloud *= uDensity;

            // Thin out clouds at the edges (horizon)
            float edgeFade = smoothstep(0.0, 0.15, vWorldPos.y / length(vWorldPos.xz));

            // Vertical band: clouds only in a horizontal band
            float band = smoothstep(0.0, 0.3, edgeFade);

            float alpha = cloud * band * 0.7;

            // Cloud colour with slight variation
            vec3 col = uTint;
            // Darker undersides
            col *= 0.85 + cloud * 0.15;
            // Warm edges at dawn/dusk
            col += vec3(0.08, 0.03, -0.02) * uHorizonWarm * (1.0 - cloud);

            gl_FragColor = vec4(col, alpha);
          }
        `}
      />
    </mesh>
  );
}
