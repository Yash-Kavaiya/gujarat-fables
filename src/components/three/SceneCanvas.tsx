import { Suspense, useMemo, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, AdaptiveDpr } from '@react-three/drei';
import { Color } from 'three';
import type { Palette } from '../../data/places';
import { useQualitySettings } from '../../store/useUIStore';
import GradientSky from './GradientSky';
import Effects from './Effects';

export interface ControlsConfig {
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  minDistance?: number;
  maxDistance?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
  target?: [number, number, number];
  enablePan?: boolean;
  enableZoom?: boolean;
}

interface SceneCanvasProps {
  palette: Palette;
  cameraPosition?: [number, number, number];
  fov?: number;
  fog?: [number, number];
  controls?: ControlsConfig | false;
  /** Extra bloom for night/festival scenes */
  bloomIntensity?: number;
  children: ReactNode;
}

function horizonColor(sky: string): string {
  return '#' + new Color(sky).lerp(new Color('#fdf6e8'), 0.4).getHexString();
}

export default function SceneCanvas({
  palette,
  cameraPosition = [0, 4, 14],
  fov = 50,
  fog = [12, 120],
  controls = {},
  bloomIntensity,
  children,
}: SceneCanvasProps) {
  const { dpr, shadows } = useQualitySettings();
  const horizon = useMemo(() => horizonColor(palette.sky), [palette.sky]);

  return (
    <Canvas
      shadows={shadows}
      dpr={dpr}
      camera={{ position: cameraPosition, fov, near: 0.1, far: 600 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <color attach="background" args={[palette.fog]} />
      <fog attach="fog" args={[palette.fog, fog[0], fog[1]]} />

      {/* Fill lighting — scenes add their own key/sun light */}
      <ambientLight intensity={0.55} color={horizon} />
      <hemisphereLight args={[palette.sky, palette.ground, 0.6]} />

      <GradientSky top={palette.sky} bottom={horizon} />

      <Suspense fallback={null}>{children}</Suspense>

      {controls !== false && (
        <OrbitControls
          makeDefault
          enablePan={controls.enablePan ?? false}
          enableZoom={controls.enableZoom ?? true}
          autoRotate={controls.autoRotate ?? false}
          autoRotateSpeed={controls.autoRotateSpeed ?? 0.4}
          minDistance={controls.minDistance ?? 4}
          maxDistance={controls.maxDistance ?? 60}
          minPolarAngle={controls.minPolarAngle ?? 0.15}
          maxPolarAngle={controls.maxPolarAngle ?? Math.PI / 2.05}
          target={controls.target ?? [0, 2, 0]}
          dampingFactor={0.08}
          enableDamping
        />
      )}

      <Effects bloomIntensity={bloomIntensity} />
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
