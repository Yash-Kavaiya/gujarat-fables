import { create } from 'zustand';

export type RannTimeOfDay = 'day' | 'sunset' | 'fullmoon' | 'festival';
export type RannCameraMode = 'explore' | 'watchtower' | 'festival' | 'orbit';

export type ManiTimeOfDay = 'day' | 'twilight' | 'aarti' | 'moonlight';
export type ManiCameraMode = 'facade' | 'river' | 'garden' | 'orbit';

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
  /** Rann of Kutch: lighting / atmosphere preset */
  rannTimeOfDay: RannTimeOfDay;
  /** Rann of Kutch: camera viewpoint / mode */
  rannCameraMode: RannCameraMode;
  /** Rann of Kutch: heat shimmer / mirage toggle */
  rannMirage: boolean;

  /** Mani Mandir: lighting / atmosphere preset */
  maniTimeOfDay: ManiTimeOfDay;
  /** Mani Mandir: camera viewpoint / mode */
  maniCameraMode: ManiCameraMode;
  /** Mani Mandir: drifting flower petals toggle */
  maniPetals: boolean;

  /** Somnath / Dwarka: false = day, true = evening aarti */
  evening: boolean;
  /** Rani ki Vav: current descent level (0 = top … maxLevel = water) */
  descentLevel: number;
  /** Rani ki Vav: lighting / time of day preset */
  raniTimeOfDay: 'day' | 'dawn' | 'night';
  /** Rani ki Vav: camera control mode */
  raniCameraMode: 'descent' | 'orbit' | 'promenade';
  /** Dholavira: true = reservoirs full, false = excavated ruins */
  reservoirFull: boolean;
  /** Girnar: climb progress 0 … 1 */
  climb: number;

  setSunAngle: (v: number) => void;
  toggleFestival: () => void;
  setRannTimeOfDay: (v: RannTimeOfDay) => void;
  setRannCameraMode: (v: RannCameraMode) => void;
  toggleRannMirage: () => void;

  setManiTimeOfDay: (v: ManiTimeOfDay) => void;
  setManiCameraMode: (v: ManiCameraMode) => void;
  toggleManiPetals: () => void;

  toggleEvening: () => void;
  setDescentLevel: (v: number) => void;
  setRaniTimeOfDay: (v: 'day' | 'dawn' | 'night') => void;
  setRaniCameraMode: (v: 'descent' | 'orbit' | 'promenade') => void;
  toggleReservoir: () => void;
  setClimb: (v: number) => void;
  reset: () => void;
}

const DEFAULTS = {
  sunAngle: 0.3,
  festival: false,
  rannTimeOfDay: 'day' as RannTimeOfDay,
  rannCameraMode: 'explore' as RannCameraMode,
  rannMirage: true,
  maniTimeOfDay: 'twilight' as ManiTimeOfDay,
  maniCameraMode: 'facade' as ManiCameraMode,
  maniPetals: true,
  evening: false,
  descentLevel: 0,
  raniTimeOfDay: 'day' as const,
  raniCameraMode: 'descent' as const,
  reservoirFull: true,
  climb: 0,
};

export const useSceneStore = create<SceneState>((set) => ({
  ...DEFAULTS,
  setSunAngle: (sunAngle) => set({ sunAngle }),
  toggleFestival: () =>
    set((s) => {
      const nextFestival = !s.festival;
      return {
        festival: nextFestival,
        rannTimeOfDay: nextFestival ? 'festival' : 'fullmoon',
      };
    }),
  setRannTimeOfDay: (rannTimeOfDay) =>
    set({
      rannTimeOfDay,
      festival: rannTimeOfDay === 'festival',
    }),
  setRannCameraMode: (rannCameraMode) => set({ rannCameraMode }),
  toggleRannMirage: () => set((s) => ({ rannMirage: !s.rannMirage })),

  setManiTimeOfDay: (maniTimeOfDay) => set({ maniTimeOfDay }),
  setManiCameraMode: (maniCameraMode) => set({ maniCameraMode }),
  toggleManiPetals: () => set((s) => ({ maniPetals: !s.maniPetals })),

  toggleEvening: () => set((s) => ({ evening: !s.evening })),
  setDescentLevel: (descentLevel) => set({ descentLevel }),
  setRaniTimeOfDay: (raniTimeOfDay) => set({ raniTimeOfDay }),
  setRaniCameraMode: (raniCameraMode) => set({ raniCameraMode }),
  toggleReservoir: () => set((s) => ({ reservoirFull: !s.reservoirFull })),
  setClimb: (climb) => set({ climb }),
  reset: () => set({ ...DEFAULTS }),
}));
