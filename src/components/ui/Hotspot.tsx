import { useState } from 'react';
import { Html } from '@react-three/drei';

interface HotspotProps {
  position: [number, number, number];
  label: string;
}

/** A small 3D-anchored marker that reveals a label on hover/focus. */
export default function Hotspot({ position, label }: HotspotProps) {
  const [open, setOpen] = useState(false);
  return (
    <Html position={position} center distanceFactor={18} zIndexRange={[10, 0]}>
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        className="relative grid h-5 w-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold bg-night-900/70 text-[10px] text-gold backdrop-blur transition hover:scale-110"
        aria-label={label}
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/40" />
        <span className="relative">i</span>
        {open && (
          <span className="pointer-events-none absolute bottom-6 left-1/2 w-max max-w-[12rem] -translate-x-1/2 rounded-md bg-night-900/95 px-2.5 py-1.5 text-xs text-sand-100 shadow-lg">
            {label}
          </span>
        )}
      </button>
    </Html>
  );
}
