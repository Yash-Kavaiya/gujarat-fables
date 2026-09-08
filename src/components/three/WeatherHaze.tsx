import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, BufferAttribute, Points, DoubleSide, ShaderMaterial } from 'three';

interface WeatherHazeProps {
  /** 0 = sunrise, 0.5 = noon, 1 = sunset */
  sunAngle: number;
  /** Size of the haze plane */
  size?: number;
}

/**
 * Ground-hugging haze layer that thickens at dawn/dusk and thins at noon.
 * Uses a semi-transparent plane with a noise shader for organic variation.
 */
function HazePlane({ sunAngle, size = 200 }: WeatherHazeProps) {
  const matRef = useRef<ShaderMaterial>(null);

  const uniforms = useMemo(() => {
    const theta = sunAngle * Math.PI;
    const sunH = Math.sin(theta);
    const horizonWarm = Math.pow(1 - sunH, 1.8);

    // Haze colour: warm golden at dawn/dusk, cool white at noon
    const r = 0.75 + horizonWarm * 0.2;
    const g = 0.72 + sunH * 0.1 - horizonWarm * 0.15;
    const b = 0.65 + sunH * 0.15 - horizonWarm * 0.25;

    return {
      uTime: { value: 0 },
      uColor: { value: [r, g, b] },
      uOpacity: { value: 0.08 + horizonWarm * 0.15 },
      uSunH: { value: sunH },
    };
  }, [sunAngle]);

  useFrame((_, delta) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.8, 0]}>
      <planeGeometry args={[size, size, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        depthWrite={false}
        transparent
        side={DoubleSide}
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uOpacity;
          uniform float uSunH;
          varying vec2 vUv;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
          }

          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
              mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
              f.y
            );
          }

          void main() {
            vec2 uv = vUv * 4.0 + uTime * 0.02;

            // Layered noise for organic haze
            float n = noise(uv * 2.0) * 0.5
                    + noise(uv * 4.0 + 10.0) * 0.3
                    + noise(uv * 8.0 + 20.0) * 0.2;

            // Fade at edges
            float edge = smoothstep(0.0, 0.15, vUv.x)
                       * smoothstep(0.0, 0.15, 1.0 - vUv.x)
                       * smoothstep(0.0, 0.15, vUv.y)
                       * smoothstep(0.0, 0.15, 1.0 - vUv.y);

            float alpha = n * edge * uOpacity;

            gl_FragColor = vec4(uColor, alpha);
          }
        `}
      />
    </mesh>
  );
}

// ─── Atmospheric dust particles ─────────────────────────────────────
function AtmosphericDust({ sunAngle }: { sunAngle: number }) {
  const ref = useRef<Points>(null);
  const count = 150;

  const theta = sunAngle * Math.PI;
  const sunH = Math.sin(theta);
  const horizonWarm = Math.pow(1 - sunH, 1.8);

  const { positions, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = 0.5 + Math.random() * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 120;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, phases };
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const attr = ref.current.geometry.getAttribute('position') as BufferAttribute;
    const arr = attr.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      // Gentle upward drift and horizontal sway
      arr[i * 3 + 1] += 0.008;
      arr[i * 3] += Math.sin(t * 0.2 + phases[i]) * 0.015;
      arr[i * 3 + 2] += Math.cos(t * 0.15 + phases[i] * 1.3) * 0.01;
      // Reset if too high
      if (arr[i * 3 + 1] > 16) arr[i * 3 + 1] = 0.5;
    }
    attr.needsUpdate = true;
  });

  // Dust more visible at dawn/dusk
  const opacity = 0.15 + horizonWarm * 0.45;
  const dustColor = horizonWarm > 0.3 ? '#ffe0a0' : '#f0ead8';

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={dustColor}
        size={0.2}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

// ─── Main export ─────────────────────────────────────────────────────
export default function WeatherHaze({ sunAngle, size }: WeatherHazeProps) {
  return (
    <group>
      <HazePlane sunAngle={sunAngle} size={size} />
      <AtmosphericDust sunAngle={sunAngle} />
    </group>
  );
}
