import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useQualitySettings } from '../../store/useUIStore';

interface EffectsProps {
  bloomIntensity?: number;
  bloomThreshold?: number;
}

/**
 * Shared postprocessing stack: a warm bloom for the "fable" glow plus a soft
 * vignette. Disabled entirely on the low-quality preset.
 */
export default function Effects({
  bloomIntensity = 0.7,
  bloomThreshold = 0.55,
}: EffectsProps) {
  const { postprocessing } = useQualitySettings();
  if (!postprocessing) return null;

  return (
    <EffectComposer multisampling={2}>
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={bloomThreshold}
        luminanceSmoothing={0.85}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.25} darkness={0.75} />
    </EffectComposer>
  );
}
