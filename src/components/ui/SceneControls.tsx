import { useSceneStore } from '../../store/useSceneStore';
import {
  MODHERA_EQUINOX,
  MODHERA_LIT_RANGE,
  RANI_MAX_LEVEL,
  GIRNAR_BEATS,
} from '../../lib/sceneConstants';

const shell =
  'pointer-events-auto rounded-2xl border border-sand-500/20 bg-night-900/80 px-5 py-4 backdrop-blur-md shadow-xl';
const title = 'mb-2 text-xs font-semibold uppercase tracking-wider text-gold/80';
const btn =
  'rounded-full px-4 py-2 text-sm font-medium transition border';
const btnOn = 'bg-gold text-night-900 border-gold';
const btnOff = 'bg-night-800/60 text-sand-100 border-sand-500/25 hover:border-gold/60';

/** The DOM control panel for a place's signature interaction. */
export default function SceneControls({ placeId }: { placeId: string }) {
  const s = useSceneStore();

  let body: React.ReactNode = null;

  if (placeId === 'modhera-sun-temple') {
    const lit = Math.abs(s.sunAngle - MODHERA_EQUINOX) < MODHERA_LIT_RANGE;
    body = (
      <div className={shell}>
        <p className={title}>Move the sun</p>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={s.sunAngle}
          onChange={(e) => s.setSunAngle(parseFloat(e.target.value))}
          className="w-56 accent-[#e8b34a]"
          aria-label="Sun position from sunrise to sunset"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <button
            className={`${btn} ${btnOff} text-xs`}
            onClick={() => s.setSunAngle(MODHERA_EQUINOX)}
          >
            Align to equinox
          </button>
          <span
            className={`text-xs font-medium ${lit ? 'text-gold animate-shimmer' : 'text-sand-300/60'}`}
          >
            {lit ? '✦ Sanctum is lit' : 'Sanctum in shadow'}
          </span>
        </div>
      </div>
    );
  } else if (placeId === 'rann-of-kutch') {
    body = (
      <div className={shell}>
        <p className={title}>The white desert</p>
        <button
          className={`${btn} ${s.festival ? btnOn : btnOff}`}
          onClick={s.toggleFestival}
          aria-pressed={s.festival}
        >
          {s.festival ? '🎪 Rann Utsav' : '🌙 Silent desert'}
        </button>
      </div>
    );
  } else if (placeId === 'somnath-temple' || placeId === 'dwarkadhish-temple') {
    body = (
      <div className={shell}>
        <p className={title}>Time of day</p>
        <button
          className={`${btn} ${s.evening ? btnOn : btnOff}`}
          onClick={s.toggleEvening}
          aria-pressed={s.evening}
        >
          {s.evening ? '🪔 Evening aarti' : '☀ Daylight'}
        </button>
      </div>
    );
  } else if (placeId === 'dholavira') {
    body = (
      <div className={shell}>
        <p className={title}>Five thousand years</p>
        <button
          className={`${btn} ${s.reservoirFull ? btnOn : btnOff}`}
          onClick={s.toggleReservoir}
          aria-pressed={s.reservoirFull}
        >
          {s.reservoirFull ? '💧 City alive' : '🏛 Excavated ruins'}
        </button>
      </div>
    );
  } else if (placeId === 'rani-ki-vav') {
    body = (
      <div className={shell}>
        <p className={title}>Descend the stepwell</p>
        <div className="flex items-center gap-3">
          <button
            className={`${btn} ${btnOff}`}
            onClick={() => s.setDescentLevel(Math.max(0, s.descentLevel - 1))}
            disabled={s.descentLevel === 0}
            aria-label="Ascend one level"
          >
            ↑ Up
          </button>
          <span className="min-w-[5.5rem] text-center text-sm text-sand-100">
            Level {s.descentLevel} / {RANI_MAX_LEVEL}
          </span>
          <button
            className={`${btn} ${btnOff}`}
            onClick={() => s.setDescentLevel(Math.min(RANI_MAX_LEVEL, s.descentLevel + 1))}
            disabled={s.descentLevel === RANI_MAX_LEVEL}
            aria-label="Descend one level"
          >
            ↓ Down
          </button>
        </div>
      </div>
    );
  } else if (placeId === 'girnar-hill') {
    const beat = [...GIRNAR_BEATS].reverse().find((b) => s.climb >= b.at) ?? GIRNAR_BEATS[0];
    body = (
      <div className={shell}>
        <p className={title}>Virtual climb</p>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={s.climb}
          onChange={(e) => s.setClimb(parseFloat(e.target.value))}
          className="w-56 accent-[#e8b34a]"
          aria-label="Climb progress up Girnar"
        />
        <p className="mt-2 text-xs italic text-gold/90">{beat.label}</p>
      </div>
    );
  }

  if (!body) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-20 flex justify-center px-4 sm:bottom-6 sm:left-6 sm:right-auto sm:justify-start">
      {body}
    </div>
  );
}
