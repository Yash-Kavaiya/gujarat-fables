import { useMemo } from 'react';
import { BackSide, Color, ShaderMaterial } from 'three';

interface GradientSkyProps {
  /** Color near the horizon */
  bottom: string;
  /** Color overhead */
  top: string;
  /** Radius of the sky dome */
  radius?: number;
}

/**
 * A large inward-facing sphere with a smooth vertical gradient — the dome of
 * every scene. Cheap (one mesh, no texture) and sets the whole mood.
 */
export default function GradientSky({ bottom, top, radius = 400 }: GradientSkyProps) {
  const material = useMemo(() => {
    return new ShaderMaterial({
      side: BackSide,
      depthWrite: false,
      uniforms: {
        topColor: { value: new Color(top) },
        bottomColor: { value: new Color(bottom) },
        offset: { value: 0.15 },
        exponent: { value: 0.7 },
      },
      vertexShader: /* glsl */ `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + vec3(0.0, offset, 0.0)).y;
          float t = pow(max(h, 0.0), exponent);
          gl_FragColor = vec4(mix(bottomColor, topColor, t), 1.0);
        }
      `,
    });
  }, [top, bottom]);

  return (
    <mesh material={material} frustumCulled={false}>
      <sphereGeometry args={[radius, 32, 16]} />
    </mesh>
  );
}
