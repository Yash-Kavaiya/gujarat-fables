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
    const timePresets = [
      { id: 'day' as const, label: '☀️ Day' },
      { id: 'sunset' as const, label: '🌅 Sunset' },
      { id: 'fullmoon' as const, label: '🌙 Full Moon' },
      { id: 'festival' as const, label: '🎪 Rann Utsav' },
    ];
    const cameraModes = [
      { id: 'explore' as const, label: '🚶 Desert' },
      { id: 'watchtower' as const, label: '🦅 Machan' },
      { id: 'festival' as const, label: '🎪 Stage' },
      { id: 'orbit' as const, label: '🔄 Orbit' },
    ];

    body = (
      <div className={`${shell} max-w-sm space-y-3`}>
        <div>
          <p className={title}>Atmosphere & Lighting</p>
          <div className="flex flex-wrap gap-1.5">
            {timePresets.map((m) => (
              <button
                key={m.id}
                className={`${btn} ${s.rannTimeOfDay === m.id ? btnOn : btnOff} px-2.5 py-1 text-xs`}
                onClick={() => s.setRannTimeOfDay(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gold/70">
            Camera Viewpoint
          </p>
          <div className="flex flex-wrap gap-1.5">
            {cameraModes.map((cm) => (
              <button
                key={cm.id}
                className={`${btn} ${s.rannCameraMode === cm.id ? btnOn : btnOff} px-2.5 py-1 text-xs`}
                onClick={() => s.setRannCameraMode(cm.id)}
              >
                {cm.label}
              </button>
            ))}
          </div>
        </div>

        {(s.rannTimeOfDay === 'day' || s.rannTimeOfDay === 'sunset') && (
          <div className="flex items-center justify-between pt-1 border-t border-sand-500/15">
            <span className="text-[11px] text-sand-300">Mirage heat shimmer</span>
            <button
              className={`${btn} ${s.rannMirage ? btnOn : btnOff} px-2.5 py-0.5 text-[11px]`}
              onClick={s.toggleRannMirage}
            >
              {s.rannMirage ? 'Enabled' : 'Off'}
            </button>
          </div>
        )}
      </div>
    );
  } else if (placeId === 'mani-mandir') {
    const timePresets = [
      { id: 'day' as const, label: '☀️ Royal Day' },
      { id: 'twilight' as const, label: '🌅 Twilight' },
      { id: 'aarti' as const, label: '🪔 Aarti' },
      { id: 'moonlight' as const, label: '🌙 Moonlight' },
    ];
    const cameraModes = [
      { id: 'facade' as const, label: '🏰 Facade' },
      { id: 'river' as const, label: '🌊 Machhu' },
      { id: 'garden' as const, label: '🌺 Garden' },
      { id: 'orbit' as const, label: '🔄 Orbit' },
    ];

    body = (
      <div className={`${shell} max-w-sm space-y-3`}>
        <div>
          <p className={title}>Temple Atmosphere</p>
          <div className="flex flex-wrap gap-1.5">
            {timePresets.map((m) => (
              <button
                key={m.id}
                className={`${btn} ${s.maniTimeOfDay === m.id ? btnOn : btnOff} px-2.5 py-1 text-xs`}
                onClick={() => s.setManiTimeOfDay(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gold/70">
            Camera Perspective
          </p>
          <div className="flex flex-wrap gap-1.5">
            {cameraModes.map((cm) => (
              <button
                key={cm.id}
                className={`${btn} ${s.maniCameraMode === cm.id ? btnOn : btnOff} px-2.5 py-1 text-xs`}
                onClick={() => s.setManiCameraMode(cm.id)}
              >
                {cm.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-sand-500/15">
          <span className="text-[11px] text-sand-300">Drifting rose petals</span>
          <button
            className={`${btn} ${s.maniPetals ? btnOn : btnOff} px-2.5 py-0.5 text-[11px]`}
            onClick={s.toggleManiPetals}
          >
            {s.maniPetals ? 'Active' : 'Off'}
          </button>
        </div>
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
    const timeModes = [
      { id: 'day' as const, label: '☀️ Golden Sun' },
      { id: 'dawn' as const, label: '🌅 Dawn Mist' },
      { id: 'night' as const, label: '🪔 Night Aarti' },
    ];
    const cameraModes = [
      { id: 'descent' as const, label: '🚶 Descent' },
      { id: 'orbit' as const, label: '🔄 Orbit' },
      { id: 'promenade' as const, label: '🎬 Walk' },
    ];

    body = (
      <div className={`${shell} max-w-sm space-y-3`}>
        <div>
          <p className={title}>Descend the 7 storeys</p>
          <div className="flex items-center gap-2">
            <button
              className={`${btn} ${btnOff} px-3 py-1.5 text-xs`}
              onClick={() => s.setDescentLevel(Math.max(0, s.descentLevel - 1))}
              disabled={s.descentLevel === 0}
              aria-label="Ascend one level"
            >
              ↑ Up
            </button>
            <span className="min-w-[6.5rem] text-center text-xs font-semibold text-sand-100">
              Level {s.descentLevel + 1} of {RANI_MAX_LEVEL + 1}
            </span>
            <button
              className={`${btn} ${btnOff} px-3 py-1.5 text-xs`}
              onClick={() => s.setDescentLevel(Math.min(RANI_MAX_LEVEL, s.descentLevel + 1))}
              disabled={s.descentLevel === RANI_MAX_LEVEL}
              aria-label="Descend one level"
            >
              ↓ Down
            </button>
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gold/70">
            Atmosphere & Lighting
          </p>
          <div className="flex flex-wrap gap-1.5">
            {timeModes.map((m) => (
              <button
                key={m.id}
                className={`${btn} ${s.raniTimeOfDay === m.id ? btnOn : btnOff} px-2.5 py-1 text-xs`}
                onClick={() => s.setRaniTimeOfDay(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gold/70">
            Camera Mode
          </p>
          <div className="flex flex-wrap gap-1.5">
            {cameraModes.map((cm) => (
              <button
                key={cm.id}
                className={`${btn} ${s.raniCameraMode === cm.id ? btnOn : btnOff} px-2.5 py-1 text-xs`}
                onClick={() => s.setRaniCameraMode(cm.id)}
              >
                {cm.label}
              </button>
            ))}
          </div>
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
