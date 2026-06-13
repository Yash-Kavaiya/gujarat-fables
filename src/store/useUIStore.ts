import { create } from 'zustand';

export type Quality = 'low' | 'medium' | 'high';

export interface QualitySettings {
  /** Device pixel ratio cap for the canvas */
  dpr: [number, number];
  /** Enable shadow maps */
  shadows: boolean;
  /** Enable postprocessing (bloom, vignette) */
  postprocessing: boolean;
}

export const QUALITY_PRESETS: Record<Quality, QualitySettings> = {
  low: { dpr: [0.6, 1], shadows: false, postprocessing: false },
  medium: { dpr: [1, 1.5], shadows: false, postprocessing: true },
  high: { dpr: [1, 2], shadows: true, postprocessing: true },
};

interface UIState {
  quality: Quality;
  audioEnabled: boolean;
  /** Whether the user prefers reduced motion (mirrors the media query) */
  reducedMotion: boolean;
  setQuality: (q: Quality) => void;
  toggleAudio: () => void;
  setReducedMotion: (v: boolean) => void;
}

/** Pick a sensible default quality from rough device signals. */
function detectDefaultQuality(): Quality {
  if (typeof navigator === 'undefined') return 'high';
  const cores = navigator.hardwareConcurrency ?? 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const coarse =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(pointer: coarse)').matches;
  if (cores <= 4 || mem <= 4 || coarse) return 'medium';
  return 'high';
}

export const useUIStore = create<UIState>((set) => ({
  quality: detectDefaultQuality(),
  audioEnabled: false,
  reducedMotion:
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  setQuality: (quality) => set({ quality }),
  toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
}));

export const useQualitySettings = (): QualitySettings =>
  QUALITY_PRESETS[useUIStore((s) => s.quality)];
