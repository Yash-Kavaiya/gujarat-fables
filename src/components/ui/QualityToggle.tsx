import { useUIStore, type Quality } from '../../store/useUIStore';

const ORDER: Quality[] = ['low', 'medium', 'high'];
const LABEL: Record<Quality, string> = { low: 'Low', medium: 'Medium', high: 'High' };

/** Cycles render quality presets (dpr / shadows / postprocessing). */
export default function QualityToggle() {
  const quality = useUIStore((s) => s.quality);
  const setQuality = useUIStore((s) => s.setQuality);

  return (
    <button
      type="button"
      onClick={() => setQuality(ORDER[(ORDER.indexOf(quality) + 1) % ORDER.length])}
      className="rounded-full border border-sand-500/30 bg-night-800/70 px-3 py-1.5 text-xs font-medium text-sand-100 backdrop-blur transition hover:border-gold/60 hover:text-gold"
      title="Render quality — lower it for smoother performance"
      aria-label={`Render quality: ${LABEL[quality]}. Click to change.`}
    >
      Quality: <span className="text-gold">{LABEL[quality]}</span>
    </button>
  );
}
