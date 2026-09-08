/**
 * Single source of truth for the Dwarkadhish Temple scene: the 72-pillar
 * Jagat Mandir hall, the 5-storey Nija Mandir shikhara, the 56-step
 * Swargadwar descending to the Gomti–sea sangam, and the day/evening
 * lighting presets. The scene consumes this module; tests drive the same
 * data.
 */

export const DWARKA_PLACE_ID = 'dwarkadhish-temple';

// ─── Material palette ────────────────────────────────────────────────
export const STONE = {
  base: '#d4ad62',
  dark: '#a9803f',
  light: '#e9c583',
  carved: '#c79a55',
  mortar: '#8a6a3a',
};
export const GOLD = '#ffcf6b';

// ─── Camera & controls ───────────────────────────────────────────────
export const camera = {
  position: [24, 14, 32] as [number, number, number],
  fov: 46,
  fog: [45, 280] as [number, number],
};

export const orbitControls = {
  target: [0, 9, 0] as [number, number, number],
  minDistance: 14,
  maxDistance: 90,
  maxPolarAngle: Math.PI / 2.08,
};

// ─── Jagat Mandir hall — the 72-pillar colonnade ─────────────────────
// The platform is a world-space box; everything above it (colonnade, roof,
// tower) is rendered inside a `<group position={[0, HALL.platformY, 0]}>`,
// so all `y` values below this point are relative to that group unless
// noted "world-space".
export const HALL = {
  rows: 14,
  cols: 24,
  spacing: 1.05,
  shaftHeight: 3.0,
  radius: 0.22,
  /** World-space elevation of the platform's top surface. */
  platformY: 1.5,
  /** [width, height, depth] of the plinth box (height == platformY). */
  platformSize: [30, 1.5, 24] as [number, number, number],
};

/** Group-local y of the flat hall roof the colonnade capitals carry. */
export const ROOF_Y = HALL.shaftHeight + 0.6;

export const PILLAR_COUNT = 72;

/** Perimeter-only pillar grid (interior left open as the hall floor). */
export function makeColonnadePositions(): [number, number, number][] {
  const { rows, cols, spacing } = HALL;
  const out: [number, number, number][] = [];
  const ox = ((cols - 1) * spacing) / 2;
  const oz = ((rows - 1) * spacing) / 2;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r > 0 && r < rows - 1 && c > 0 && c < cols - 1) continue;
      out.push([c * spacing - ox, 0, r * spacing - oz]);
    }
  }
  return out;
}

// ─── The five-storey Nija Mandir tower ────────────────────────────────
export interface Storey {
  id: string;
  y: number;
  w: number;
  d: number;
  h: number;
  color: string;
  hasJharokha: boolean;
  hasNiches: boolean;
}

export const STOREY_COUNT = 5;

// Each storey's bottom face sits flush on the top of the one below it
// (the first sits flush on ROOF_Y, the colonnade's flat roof) — a clean
// stack with no gaps and no overlap.
function stackStoreys(specs: Omit<Storey, 'y'>[]): Storey[] {
  let bottom = ROOF_Y;
  return specs.map((spec) => {
    const y = bottom + spec.h / 2;
    bottom += spec.h;
    return { ...spec, y };
  });
}

export const STOREYS: Storey[] = stackStoreys([
  { id: 'storey-1', w: 9.6, d: 9.6, h: 3.0, color: STONE.base, hasJharokha: true, hasNiches: true },
  { id: 'storey-2', w: 8.2, d: 8.2, h: 2.7, color: STONE.light, hasJharokha: false, hasNiches: true },
  { id: 'storey-3', w: 6.9, d: 6.9, h: 2.5, color: STONE.base, hasJharokha: true, hasNiches: false },
  { id: 'storey-4', w: 5.7, d: 5.7, h: 2.3, color: STONE.light, hasJharokha: false, hasNiches: true },
  { id: 'storey-5', w: 4.6, d: 4.6, h: 2.1, color: STONE.base, hasJharokha: true, hasNiches: false },
]);

export function storeyTopY(): number {
  const last = STOREYS[STOREYS.length - 1];
  return last.y + last.h / 2;
}

/** Thin cornice/molding strips ringing the top edge of every storey. */
export function makeStoreyCornices(): { position: [number, number, number]; size: [number, number, number] }[] {
  const out: { position: [number, number, number]; size: [number, number, number] }[] = [];
  for (const s of STOREYS) {
    const topY = s.y + s.h / 2;
    out.push({ position: [0, topY, s.d / 2 + 0.03], size: [s.w + 0.24, 0.16, 0.16] });
    out.push({ position: [0, topY, -s.d / 2 - 0.03], size: [s.w + 0.24, 0.16, 0.16] });
    out.push({ position: [s.w / 2 + 0.03, topY, 0], size: [0.16, 0.16, s.d + 0.24] });
    out.push({ position: [-s.w / 2 - 0.03, topY, 0], size: [0.16, 0.16, s.d + 0.24] });
  }
  return out;
}

/** Recessed wall niches on storeys marked `hasNiches`, one per face. */
export function makeStoreyNiches(): { position: [number, number, number]; rotationY: number }[] {
  const out: { position: [number, number, number]; rotationY: number }[] = [];
  for (const s of STOREYS) {
    if (!s.hasNiches) continue;
    const half = s.d / 2 + 0.02;
    const halfX = s.w / 2 + 0.02;
    out.push({ position: [0, s.y, half], rotationY: 0 });
    out.push({ position: [0, s.y, -half], rotationY: Math.PI });
    out.push({ position: [halfX, s.y, 0], rotationY: Math.PI / 2 });
    out.push({ position: [-halfX, s.y, 0], rotationY: -Math.PI / 2 });
  }
  return out;
}

/** Projecting balcony (jharokha) with a chhajja eave on the front face. */
export function makeJharokhas(): { basePosition: [number, number, number]; storeyW: number }[] {
  return STOREYS.filter((s) => s.hasJharokha).map((s) => ({
    basePosition: [0, s.y, s.d / 2] as [number, number, number],
    storeyW: s.w,
  }));
}

// ─── Shikhara (spire) & Dhwaja (flag) ─────────────────────────────────
export const SHIKHARA = {
  position: [0, storeyTopY(), 0] as [number, number, number],
  height: 8.5,
  baseRadius: 2.2,
};

export function flagPoleTopY(): number {
  return SHIKHARA.position[1] + SHIKHARA.height + 1.4;
}

// ─── Swargadwar — 56 steps to the Gomti–sea sangam ────────────────────
export const SWARGADWAR_STEPS = 56;
/** World-space z of the platform's front (water-facing) edge. */
export const SWARGADWAR_START_Z = HALL.platformSize[2] / 2;
export const SWARGADWAR_STEP_HEIGHT = 0.045;
export const SWARGADWAR_STEP_DEPTH = 0.22;
export const SWARGADWAR_WIDTH = 7.2;

export interface StepSpec {
  position: [number, number, number];
  size: [number, number, number];
}

/** 56 shallow steps descending from the hall platform to the waterline. */
export function makeSwargadwarSteps(): StepSpec[] {
  const out: StepSpec[] = [];
  const startY = HALL.platformY;
  for (let i = 0; i < SWARGADWAR_STEPS; i++) {
    const y = startY - SWARGADWAR_STEP_HEIGHT / 2 - i * SWARGADWAR_STEP_HEIGHT;
    const z = SWARGADWAR_START_Z + i * SWARGADWAR_STEP_DEPTH;
    const w = Math.max(SWARGADWAR_WIDTH - i * 0.02, 3.2);
    out.push({ position: [0, y, z], size: [w, SWARGADWAR_STEP_HEIGHT, SWARGADWAR_STEP_DEPTH] });
  }
  return out;
}

export function swargadwarWaterlineZ(): number {
  const steps = makeSwargadwarSteps();
  return steps[steps.length - 1].position[2];
}

/** A handful of pilgrims descending the ghat, for human scale. */
export function makePilgrims(): [number, number, number][] {
  const steps = makeSwargadwarSteps();
  const picks = [3, 10, 17, 24, 31, 38, 45, 52];
  return picks.map((i, idx) => {
    const s = steps[Math.min(i, steps.length - 1)];
    const side = idx % 2 === 0 ? -1 : 1;
    return [side * (0.6 + (idx % 3) * 0.4), s.position[1] + 0.32, s.position[2]] as [number, number, number];
  });
}

// ─── Gomti–sea sangam: boats & Bet Dwarka island ──────────────────────
export const BET_DWARKA = {
  position: [6, 0, 145] as [number, number, number],
  radius: 26,
  height: 5.5,
};

export interface BoatSpec {
  position: [number, number, number];
  rotationY: number;
  scale: number;
}

export function makeBoats(): BoatSpec[] {
  return [
    { position: [-16, 0.12, 42], rotationY: 0.35, scale: 1.0 },
    { position: [11, 0.12, 58], rotationY: -0.42, scale: 0.85 },
    { position: [-5, 0.12, 76], rotationY: 0.12, scale: 1.1 },
    { position: [18, 0.12, 95], rotationY: -0.2, scale: 0.9 },
  ];
}

// ─── Coastal vegetation ────────────────────────────────────────────────
export interface TreeSpec {
  position: [number, number, number];
  scale: number;
}

export function makeCoastalTrees(): TreeSpec[] {
  const out: TreeSpec[] = [];
  const n = 14;
  for (let i = 0; i < n; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const x = side * (19 + (i % 4) * 2.4);
    const z = -12 + Math.floor(i / 2) * 3.6;
    out.push({ position: [x, 0, z], scale: 0.85 + (i % 3) * 0.18 });
  }
  return out;
}

// ─── Interactive hotspots ──────────────────────────────────────────────
export interface HotspotSpec {
  id: string;
  position: [number, number, number];
  label: string;
}

export const DWARKA_HOTSPOTS: HotspotSpec[] = [
  {
    id: 'dhwaja',
    position: [0, flagPoleTopY() + 1, 0],
    label: 'The Dhwaja — changed five times a day, bearing only the sun and the moon, never a weapon',
  },
  {
    id: 'shikhara',
    position: [0, storeyTopY() + 3, 3],
    label: 'The five-storey Nija Mandir shikhara, rising above the sanctum toward a ~78 m spire',
  },
  {
    id: 'colonnade',
    position: [13, 3, 0],
    label: '72 carved pillars raise the Jagat Mandir hall — the number the fable counts to this day',
  },
  {
    id: 'swargadwar',
    position: [0, HALL.platformY + 0.3, SWARGADWAR_START_Z + 3],
    label: 'Swargadwar — the 56-step Gate to Heaven, descending toward the water',
  },
  {
    id: 'sangam',
    position: [0, 0.3, swargadwarWaterlineZ() + 4],
    label: 'The Gomti–sea sangam, where river and ocean waters mingle at the ghat',
  },
  {
    id: 'bet-dwarka',
    position: [BET_DWARKA.position[0], BET_DWARKA.height + 2, BET_DWARKA.position[2]],
    label: 'Bet Dwarka — the island across the water where Krishna is said to have made his home',
  },
];

// ─── Day / evening lighting presets ────────────────────────────────────
export interface LightingPreset {
  sunPos: [number, number, number];
  sunColor: string;
  sunIntensity: number;
  ambient: number;
  hemi: number;
  sky: string;
  ground: string;
  fog: string;
  fogRange: [number, number];
  cloudDensity: number;
  /** 0 = sunrise/sunset, 0.5 = noon — feeds DynamicSky / CloudLayer / WeatherHaze */
  skyAngle: number;
  bloom: number;
  aartiLit: number;
}

export const LIGHTING_PRESETS: { day: LightingPreset; evening: LightingPreset } = {
  day: {
    sunPos: [26, 32, 18],
    sunColor: '#fff2d8',
    sunIntensity: 1.6,
    ambient: 0.5,
    hemi: 0.6,
    sky: '#d9ab63',
    ground: '#33586a',
    fog: '#b78f4e',
    fogRange: [45, 280],
    cloudDensity: 0.32,
    skyAngle: 0.58,
    bloom: 0.7,
    aartiLit: 0,
  },
  evening: {
    sunPos: [-24, 11, 20],
    sunColor: '#ff9d6a',
    sunIntensity: 0.55,
    ambient: 0.26,
    hemi: 0.32,
    sky: '#5a4a66',
    ground: '#2c4654',
    fog: '#48405e',
    fogRange: [30, 220],
    cloudDensity: 0.55,
    skyAngle: 0.08,
    bloom: 1.15,
    aartiLit: 1,
  },
};

export function sunHeightFromAngle(angle: number): number {
  return Math.sin(angle * Math.PI);
}
