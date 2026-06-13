import { create } from 'zustand';

/**
 * Shared interaction state for the active place scene. DOM control panels
 * (rendered outside the Canvas) write to it; the 3D scene reads from it.
 * Reset whenever the active place changes.
 */
interface SceneState {
  /** Modhera: 0 = sunrise (east) … 0.5 = noon … 1 = sunset (west). Equinox ≈ 0.04 */
  sunAngle: number;
  /** Rann of Kutch: false = silent white desert, true = Rann Utsav festival */
  festival: boolean;
  /** Somnath / Dwarka: false = day, true = evening aarti */
  evening: boolean;
  /** Rani ki Vav: current descent level (0 = top … maxLevel = water) */
  descentLevel: number;
  /** Dholavira: true = reservoirs full, false = excavated ruins */
  reservoirFull: boolean;
  /** Girnar: climb progress 0 … 1 */
  climb: number;

  setSunAngle: (v: number) => void;
  toggleFestival: () => void;
  toggleEvening: () => void;
  setDescentLevel: (v: number) => void;
  toggleReservoir: () => void;
  setClimb: (v: number) => void;
  reset: () => void;
}

const DEFAULTS = {
  sunAngle: 0.3,
  festival: false,
  evening: false,
  descentLevel: 0,
  reservoirFull: true,
  climb: 0,
};

export const useSceneStore = create<SceneState>((set) => ({
  ...DEFAULTS,
  setSunAngle: (sunAngle) => set({ sunAngle }),
  toggleFestival: () => set((s) => ({ festival: !s.festival })),
  toggleEvening: () => set((s) => ({ evening: !s.evening })),
  setDescentLevel: (descentLevel) => set({ descentLevel }),
  toggleReservoir: () => set((s) => ({ reservoirFull: !s.reservoirFull })),
  setClimb: (climb) => set({ climb }),
  reset: () => set({ ...DEFAULTS }),
}));
