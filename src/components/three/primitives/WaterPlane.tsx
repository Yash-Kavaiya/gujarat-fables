import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, DoubleSide, ShaderMaterial } from 'three';

interface WaterPlaneProps {
  size?: number;
  segments?: number;
  /** Deep water color */
  color?: string;
  /** Highlight / reflected-sky color */
  highlight?: string;
  position?: [number, number, number];
  /** Wave amplitude */
  amplitude?: number;
  opacity?: number;
}

/**
 * A cheap animated water surface: sine-wave vertex displacement plus a moving
 * specular shimmer. Used for the sea (Somnath, Dwarka) and stepwell pools.
 */
export default function WaterPlane({
  size = 200,
  segments = 96,
  color = '#1c3a4a',
  highlight = '#e8b34a',
  position = [0, 0, 0],
  amplitude = 0.22,
  opacity = 1,
}: WaterPlaneProps) {
  const matRef = useRef<ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new Color(color) },
      uHighlight: { value: new Color(highlight) },
      uAmp: { value: amplitude },
      uOpacity: { value: opacity },
    }),
    [color, highlight, amplitude, opacity],
  );

  useFrame((_, delta) => {
    if (matRef.current) {
      (matRef.current.uniforms.uTime.value as number) += delta;
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position} receiveShadow>
      <planeGeometry args={[size, size, segments, segments]} />
      <shaderMaterial
        ref={matRef}
        transparent={opacity < 1}
        side={DoubleSide}
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          uniform float uTime;
          uniform float uAmp;
          varying float vWave;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            vec3 p = position;
            float w =
              sin(p.x * 0.25 + uTime * 0.9) * 0.6 +
              sin(p.y * 0.32 - uTime * 1.1) * 0.4 +
              sin((p.x + p.y) * 0.15 + uTime * 0.6) * 0.5;
            p.z += w * uAmp;
            vWave = w;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          uniform vec3 uColor;
          uniform vec3 uHighlight;
          uniform float uOpacity;
          uniform float uTime;
          varying float vWave;
          varying vec2 vUv;
          void main() {
            float crest = smoothstep(0.35, 1.0, vWave);
            float glint = pow(max(sin(vUv.x * 40.0 + uTime) * 0.5 + 0.5, 0.0), 8.0) * 0.25;
            vec3 col = mix(uColor, uHighlight, crest * 0.5 + glint);
            gl_FragColor = vec4(col, uOpacity);
          }
        `}
      />
    </mesh>
  );
}
