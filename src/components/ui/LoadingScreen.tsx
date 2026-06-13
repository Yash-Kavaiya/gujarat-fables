interface LoadingScreenProps {
  label?: string;
}

/** Full-bleed warm loading veil shown while a scene's geometry streams in. */
export default function LoadingScreen({ label = 'Summoning the scene' }: LoadingScreenProps) {
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-night-900"
      role="status"
      aria-live="polite"
    >
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-2 border-sand-500/30" />
        <div className="absolute inset-0 animate-spin rounded-full border-t-2 border-gold" />
        <div className="absolute inset-3 animate-shimmer rounded-full bg-gold/20" />
      </div>
      <p className="mt-5 font-display text-lg italic text-sand-200">{label}…</p>
    </div>
  );
}
