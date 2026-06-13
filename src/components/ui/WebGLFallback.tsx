import type { Place } from '../../data/places';

/**
 * Graceful degradation when WebGL is unavailable: a warm gradient backdrop in
 * the place's palette so the fable and facts still read beautifully.
 */
export default function WebGLFallback({ place }: { place: Place }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        background: `radial-gradient(ellipse at 50% 30%, ${place.palette.sky}, ${place.palette.ground} 70%, ${place.palette.fog})`,
      }}
      role="img"
      aria-label={`${place.name} — 3D view unavailable on this device`}
    >
      <div className="max-w-md px-8 text-center">
        <p className="font-display text-5xl text-night-900/80">{place.name}</p>
        <p className="mt-3 text-sm text-night-900/60">
          3D is unavailable in this browser, but the story below is all yours.
        </p>
      </div>
    </div>
  );
}
