import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, BufferAttribute, Color, Group, Points, ShaderMaterial } from 'three';

interface SunAtmosphereProps {
  /** Sun position in world space */
  position: [number, number, number];
  /** Sun color as CSS string */
  color: string;
  /** 0 = sunrise/sunset (low), 1 = noon (high) */
  sunHeight: number;
  /** Sanctum lit intensity 0–1 */
  lit?: number;
}

// ─── Sun corona shader ──────────────────────────────────────────────
function SunCorona({ position, color, sunHeight }: {
  position: [number, number, number];
  color: string;
  sunHeight: number;
}) {
  const matRef = useRef<ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new Color(color) },
    uSunH: { value: sunHeight },
  }), [color, sunHeight]);

  useFrame((_, delta) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh position={position}>
      <sphereGeometry args={[6, 32, 32]} />
      <shaderMaterial
        ref={matRef}
        depthWrite={false}
        transparent
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          varying vec2 vUv;
          varying vec3 vNormal;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uSunH;
          varying vec2 vUv;
          varying vec3 vNormal;

          void main() {
            // Fresnel-based rim glow
            float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.5);

            // Animated corona pulses
            float pulse = 0.85 + 0.15 * sin(uTime * 1.5 + vUv.x * 6.28);

            // Core brightness
            float core = pow(max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 3.0);

            float alpha = (fresnel * 0.6 + core * 0.4) * pulse;
            alpha *= 0.3 + uSunH * 0.4;

            vec3 col = uColor * (1.0 + fresnel * 0.3);

            gl_FragColor = vec4(col, alpha * 0.7);
          }
        `}
      />
    </mesh>
  );
}

// ─── Light rays (god rays) ──────────────────────────────────────────
function LightRays({ position, color, sunHeight }: {
  position: [number, number, number];
  color: string;
  sunHeight: number;
}) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.03;
    }
  });

  if (sunHeight < 0.1) return null;

  const rayCount = 12;
  const rays = useMemo(() => {
    return Array.from({ length: rayCount }).map((_, i) => ({
      angle: (i / rayCount) * Math.PI * 2,
      length: 12 + Math.random() * 10,
      width: 0.3 + Math.random() * 0.5,
      opacity: 0.06 + Math.random() * 0.08,
    }));
  }, []);

  return (
    <group ref={groupRef} position={position}>
      {rays.map((ray, i) => (
        <mesh
          key={i}
          rotation={[0, 0, ray.angle]}
          position={[
            Math.cos(ray.angle) * ray.length * 0.5,
            Math.sin(ray.angle) * ray.length * 0.5,
            0,
          ]}
        >
          <planeGeometry args={[ray.width, ray.length]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={ray.opacity * sunHeight}
            depthWrite={false}
            blending={AdditiveBlending}
            side={2}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── Star field ─────────────────────────────────────────────────────
function StarField({ sunHeight }: { sunHeight: number }) {
  const ref = useRef<Points>(null);
  const count = 300;

  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Scatter on a dome
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.8 + 0.2); // upper hemisphere
      const r = 250;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      sizes[i] = 0.3 + Math.random() * 0.8;
    }
    return { positions, sizes };
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const attr = ref.current.geometry.getAttribute('position') as BufferAttribute;
    const arr = attr.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      // Subtle twinkling via Y oscillation
      arr[i * 3 + 1] += Math.sin(t * 0.8 + i * 1.7) * 0.01;
    }
    attr.needsUpdate = true;
  });

  // Stars visible when sun is low
  const visibility = Math.max(0, 1 - sunHeight * 2.5);

  if (visibility < 0.01) return null;

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
        color="#fff8e8"
        size={0.6}
        sizeAttenuation
        transparent
        opacity={visibility * 0.85}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

// ─── Main export ─────────────────────────────────────────────────────
export default function SunAtmosphere({ position, color, sunHeight, lit = 0 }: SunAtmosphereProps) {
  return (
    <group>
      {/* Core sun disc */}
      <mesh position={position}>
        <sphereGeometry args={[4.5, 32, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Corona glow */}
      <SunCorona position={position} color={color} sunHeight={sunHeight} />

      {/* Soft halo */}
      <mesh position={position}>
        <sphereGeometry args={[9, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.08 + sunHeight * 0.1}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      {/* Outer atmospheric scatter */}
      <mesh position={position}>
        <sphereGeometry args={[16, 20, 20]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.03 + sunHeight * 0.04}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      {/* Light rays */}
      <LightRays position={position} color={color} sunHeight={sunHeight} />

      {/* Star field */}
      <StarField sunHeight={sunHeight} />
    </group>
  );
}
