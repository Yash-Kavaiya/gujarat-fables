import { useState } from 'react';
import { Html } from '@react-three/drei';

interface HotspotProps {
  position: [number, number, number];
  label: string;
}

/** An elegant 3D-anchored marker that reveals a rich architectural label on hover/focus. */
export default function Hotspot({ position, label }: HotspotProps) {
  const [open, setOpen] = useState(false);

  return (
    <Html position={position} center distanceFactor={30} zIndexRange={[10, 0]}>
      <div className="relative">
        <button
          type="button"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onClick={() => setOpen((v) => !v)}
          className="relative flex h-4 w-4 items-center justify-center rounded-full border border-gold/90 bg-night-900/90 text-[8px] font-bold text-gold shadow-md backdrop-blur-sm transition-transform duration-200 hover:scale-125 focus:scale-125 focus:outline-none"
          aria-label={label}
        >
          <span className="relative z-10">i</span>
          <span className="absolute inset-0 rounded-full bg-gold/25 animate-ping opacity-50 pointer-events-none" />
        </button>

        {open && (
          <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 z-50 w-56 rounded-lg border border-gold/40 bg-night-950/95 p-2.5 text-xs text-sand-100 shadow-2xl backdrop-blur-md">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gold">
              Architectural Detail
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-sand-200">{label}</p>
          </div>
        )}
      </div>
    </Html>
  );
}
