import { useState } from 'react';
import type { Place } from '../../data/places';
import NarrationButton from './NarrationButton';

/**
 * Slide-in narration panel: the place's fable, key facts, and the narrate
 * control. Collapsible so the 3D scene can be admired full-bleed.
 */
export default function FablePanel({ place }: { place: Place }) {
  const [open, setOpen] = useState(true);

  return (
    <>
      {/* Reopen tab when collapsed */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed right-0 top-1/2 z-30 -translate-y-1/2 rounded-l-xl border border-r-0 border-gold/40 bg-night-800/90 px-3 py-4 text-sm font-medium text-gold backdrop-blur transition hover:bg-night-700"
          aria-label="Open the fable panel"
        >
          <span className="[writing-mode:vertical-rl]">Read the fable</span>
        </button>
      )}

      <aside
        className={`fixed z-30 flex flex-col border-sand-500/15 bg-night-900/85 backdrop-blur-md transition-transform duration-500 ease-out
          bottom-0 left-0 right-0 max-h-[62vh] rounded-t-2xl border-t
          sm:bottom-auto sm:left-auto sm:right-0 sm:top-0 sm:h-full sm:max-h-none sm:w-[min(30rem,90vw)] sm:rounded-none sm:rounded-l-2xl sm:border-l sm:border-t-0
          ${open ? 'translate-y-0 sm:translate-x-0' : 'translate-y-full sm:translate-x-full sm:translate-y-0'}`}
        aria-label={`The fable of ${place.name}`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-sand-500/15 px-6 pb-4 pt-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold/80">
              {place.region} · {place.district}
            </p>
            <h1 className="mt-1 font-display text-3xl leading-tight text-sand-50">
              {place.name}
            </h1>
            <p className="mt-1 font-display text-lg italic text-gold/90">
              {place.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="shrink-0 rounded-full border border-sand-500/25 px-2.5 py-1 text-xs text-sand-200 transition hover:border-gold/60 hover:text-gold"
            aria-label="Collapse the fable panel"
          >
            Hide ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-terracotta-600/30 px-3 py-1 text-xs text-sand-100">
              ✨ {place.feature}
            </span>
            <span className="rounded-full border border-sand-500/20 px-3 py-1 text-xs text-sand-300/70">
              Modelling: {place.difficulty}
            </span>
          </div>

          <NarrationButton text={place.fable} title={place.name} />

          <div className="fable-prose mt-5 text-[15px] text-sand-100/90">
            {place.fable.map((para, i) => (
              <p key={i} className={i === 0 ? 'drop-cap' : undefined}>
                {para}
              </p>
            ))}
          </div>

          <div className="mt-6">
            <h2 className="mb-3 font-display text-xl text-gold">Key facts</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-1">
              {place.facts.map((f) => (
                <div
                  key={f.label}
                  className="rounded-lg border border-sand-500/10 bg-night-800/50 px-3 py-2"
                >
                  <dt className="text-[11px] uppercase tracking-wider text-gold/70">
                    {f.label}
                  </dt>
                  <dd className="mt-0.5 text-sm text-sand-100">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </aside>
    </>
  );
}
