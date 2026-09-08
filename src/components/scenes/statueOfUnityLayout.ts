/**
 * Single source of truth for the Statue of Unity scene: pose, figure parts,
 * pedestal tiers, and Sadhu Bet / Narmada landscape placements. The scene
 * consumes this module; tests drive the same data.
 */

export const STATUE_PLACE_ID = 'statue-of-unity';

export const BRONZE = {
  base: '#8c7660',
  dark: '#6a5744',
  mid: '#9a836c',
  light: '#b59a78',
  shadow: '#3a2c22',
  hair: '#4a3d30',
};

export const STONE = {
  dark: '#7a3a26',
  mid: '#954830',
  light: '#b05d42',
  column: '#c48a6c',
  mortar: '#6e3a28',
};

export const orbitControls = {
  autoRotate: true,
  autoRotateSpeed: 0.38,
  target: [0, 12, 0] as [number, number, number],
  minDistance: 18,
  maxDistance: 95,
  maxPolarAngle: Math.PI / 2.02,
};

export const camera = {
  position: [14, 14, 36] as [number, number, number],
  fov: 42,
  fog: [50, 270] as [number, number],
};

/** Yaw so local +Z (the face) aims at the default camera. */
export const figureFacing = Math.atan2(camera.position[0], camera.position[2]);

export type FigurePartId =
  | 'dhoti'
  | 'shawl'
  | 'tunic'
  | 'head'
  | 'arms'
  | 'hands'
  | 'legs'
  | 'feet'
  | 'cladding-seams';

export interface FigurePart {
  id: FigurePartId;
  kind: 'garment' | 'anatomy' | 'surface';
  meshCount: number;
  folds?: boolean;
  draped?: boolean;
  bald?: boolean;
  facialFeatures?: boolean;
  sandalled?: boolean;
  midStride?: boolean;
  panelSeams?: boolean;
}

export const DHOTI_PLEAT_COUNT = 28;
export const SHAWL_FOLD_COUNT = 9;
export const CLADDING_MIN_SEAMS = 80;

export const figureParts: FigurePart[] = [
  { id: 'dhoti', kind: 'garment', meshCount: DHOTI_PLEAT_COUNT, folds: true },
  { id: 'shawl', kind: 'garment', meshCount: SHAWL_FOLD_COUNT, draped: true, folds: true },
  { id: 'tunic', kind: 'garment', meshCount: 12, panelSeams: true },
  { id: 'head', kind: 'anatomy', meshCount: 16, bald: true, facialFeatures: true },
  { id: 'arms', kind: 'anatomy', meshCount: 8 },
  { id: 'hands', kind: 'anatomy', meshCount: 12 },
  { id: 'legs', kind: 'anatomy', meshCount: 6, midStride: true },
  { id: 'feet', kind: 'anatomy', meshCount: 8, sandalled: true, midStride: true },
  { id: 'cladding-seams', kind: 'surface', meshCount: CLADDING_MIN_SEAMS, panelSeams: true },
];

export const pose = {
  stance: 'mid-stride' as const,
  leftFoot: { x: -0.62, y: 0.2, z: 0.92 },
  rightFoot: { x: 0.64, y: 0.2, z: -0.48 },
};

export const bronzeMaterial = {
  colors: BRONZE,
  metalness: { min: 0.42, max: 0.78 },
  roughness: { min: 0.32, max: 0.68 },
  weathered: true,
};

export interface PedestalTier {
  id: string;
  /** Cylinder centre, relative to the island plaza. */
  y: number;
  radiusTop: number;
  radiusBottom: number;
  height: number;
  sides: number;
  color: string;
}

export const island = {
  kind: 'heightfield' as const,
  radiusX: 38,
  radiusZ: 26,
  plazaY: 1.48,
  plazaRadius: 21,
  segments: 80,
  notFlatDisk: true,
};

export const pedestalTiers: PedestalTier[] = [
  { id: 'apron', y: 0.55, radiusTop: 17.2, radiusBottom: 19.0, height: 1.1, sides: 8, color: STONE.dark },
  { id: 'base', y: 1.65, radiusTop: 14.6, radiusBottom: 16.8, height: 1.15, sides: 8, color: STONE.mid },
  { id: 'batter', y: 3.15, radiusTop: 10.8, radiusBottom: 14.2, height: 1.9, sides: 8, color: STONE.mid },
  { id: 'gallery-floor', y: 4.45, radiusTop: 9.2, radiusBottom: 10.6, height: 0.7, sides: 8, color: STONE.light },
  { id: 'gallery-wall', y: 5.35, radiusTop: 8.0, radiusBottom: 8.8, height: 1.15, sides: 8, color: STONE.mid },
  { id: 'gallery-roof', y: 6.15, radiusTop: 8.5, radiusBottom: 8.7, height: 0.42, sides: 8, color: STONE.mid },
  { id: 'plinth', y: 6.65, radiusTop: 4.0, radiusBottom: 5.1, height: 0.62, sides: 8, color: STONE.light },
];

export const galleryColumns = {
  count: 28,
  radius: 8.55,
  y: 5.35,
  height: 1.2,
  size: [0.42, 1.2, 0.42] as [number, number, number],
};

export function pedestalTopY(): number {
  return island.plazaY + Math.max(...pedestalTiers.map((t) => t.y + t.height / 2));
}

export const water = {
  size: 520,
  y: -0.55,
  color: '#35545c',
  highlight: '#cfe2e0',
  amplitude: 0.14,
};

export const dam = {
  position: [6, 8, -124] as [number, number, number],
  size: [240, 16, 8] as [number, number, number],
  color: '#8a8e86',
  spillwayCount: 14,
  towerCount: 4,
  slope: 0.42,
};

export interface HillSpec {
  id: string;
  base: [number, number, number];
  radius: number;
  height: number;
  color: string;
}

export const hills: HillSpec[] = [
  { id: 'west-far', base: [-108, 0, -98], radius: 24, height: 32, color: '#44573e' },
  { id: 'west-mid', base: [-72, 0, -82], radius: 18, height: 22, color: '#4e6346' },
  { id: 'west-near', base: [-48, 0, -70], radius: 12, height: 14, color: '#566b4f' },
  { id: 'east-far', base: [118, 0, -104], radius: 26, height: 34, color: '#3f5339' },
  { id: 'east-mid', base: [78, 0, -86], radius: 17, height: 20, color: '#4e6346' },
  { id: 'east-near', base: [52, 0, -68], radius: 11, height: 13, color: '#5a6e52' },
  { id: 'behind-dam-l', base: [-40, 0, -148], radius: 20, height: 24, color: '#44573e' },
  { id: 'behind-dam-r', base: [46, 0, -152], radius: 22, height: 28, color: '#3f5339' },
];

export const bridge = {
  start: [-18, island.plazaY + 0.12, 4] as [number, number, number],
  end: [-64, 1.95, 10] as [number, number, number],
  deckWidth: 3.8,
  deckThickness: 0.35,
  pierCount: 8,
  railing: true,
};

export const mainland = {
  position: [-84, 0.95, 12] as [number, number, number],
  size: [42, 2.5, 64] as [number, number, number],
  color: '#5a6a4c',
};

export type PrimitiveKind = 'sphere' | 'box' | 'cylinder' | 'cone' | 'capsule' | 'torus';

export interface MeshSpec {
  id: string;
  primitive: PrimitiveKind;
  args: number[];
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  metalness?: number;
  roughness?: number;
  castShadow?: boolean;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function hash2(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

function noise2(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const tl = hash2(xi, yi);
  const tr = hash2(xi + 1, yi);
  const bl = hash2(xi, yi + 1);
  const br = hash2(xi + 1, yi + 1);
  return tl * (1 - u) * (1 - v) + tr * u * (1 - v) + bl * (1 - u) * v + br * u * v;
}

function fbm2(x: number, y: number) {
  return noise2(x, y) * 0.5 + noise2(x * 2.1, y * 2.1) * 0.25 + noise2(x * 4.2, y * 4.2) * 0.125;
}

/** Dhoti lathe profile: [radius, height] from waist down to a flared hem. */
export function makeDhotiProfile(): [number, number][] {
  return [
    [1.48, 8.05],
    [1.58, 7.55],
    [1.72, 6.7],
    [1.92, 5.6],
    [2.08, 4.4],
    [2.18, 3.2],
    [2.32, 2.15],
    [2.38, 1.55],
    [2.22, 1.35],
    [1.85, 1.22],
  ];
}

/** Achkan / tunic lathe profile, local y = 0 at the waist. */
export function makeTunicProfile(): [number, number][] {
  return [
    [1.5, 0.0],
    [1.6, 1.15],
    [1.7, 2.35],
    [1.62, 3.35],
    [1.28, 4.15],
    [0.72, 4.55],
  ];
}

export function makeDhotiPleats(): { a: number; r: number; y: number }[] {
  const out: { a: number; r: number; y: number }[] = [];
  // Real dhoti pleats gather at the front, not as a full radial cage.
  for (let i = 0; i < DHOTI_PLEAT_COUNT; i++) {
    const a = -0.55 + (i / (DHOTI_PLEAT_COUNT - 1)) * 1.1;
    const r = 2.06 + (i % 2) * 0.015;
    out.push({ a, r, y: 4.0 });
  }
  return out;
}

export function makeShawlFolds(): MeshSpec[] {
  return [
    {
      id: 'shawl-shoulder-roll',
      primitive: 'capsule',
      args: [0.46, 1.25, 6, 10],
      position: [1.38, 11.75, 0.18],
      rotation: [0.08, 0.2, -0.32],
      color: BRONZE.mid,
      roughness: 0.52,
    },
    {
      id: 'shawl-nape',
      primitive: 'capsule',
      args: [0.34, 0.9, 5, 8],
      position: [0.55, 12.05, -0.55],
      rotation: [0.15, 0.4, 0.5],
      color: BRONZE.mid,
    },
    {
      id: 'shawl-chest-1',
      primitive: 'box',
      args: [0.92, 5.1, 0.28],
      position: [0.12, 9.85, 1.38],
      rotation: [0.12, 0.05, -0.62],
      color: '#907c66',
    },
    {
      id: 'shawl-chest-2',
      primitive: 'box',
      args: [0.7, 4.6, 0.18],
      position: [0.28, 9.7, 1.52],
      rotation: [0.14, 0.04, -0.58],
      color: BRONZE.dark,
      roughness: 0.58,
    },
    {
      id: 'shawl-chest-3',
      primitive: 'box',
      args: [0.5, 4.2, 0.14],
      position: [-0.05, 9.55, 1.46],
      rotation: [0.1, 0.08, -0.66],
      color: BRONZE.mid,
    },
    {
      id: 'shawl-hang-panel',
      primitive: 'box',
      args: [1.05, 6.6, 0.28],
      position: [1.68, 8.15, 0.38],
      rotation: [0.06, 0.08, 0.06],
      color: '#907c66',
    },
    {
      id: 'shawl-hang-fold-a',
      primitive: 'box',
      args: [0.22, 6.2, 0.12],
      position: [1.38, 8.1, 0.52],
      rotation: [0.05, 0.08, 0.04],
      color: BRONZE.dark,
    },
    {
      id: 'shawl-hang-fold-b',
      primitive: 'box',
      args: [0.2, 5.8, 0.12],
      position: [1.95, 8.0, 0.5],
      rotation: [0.07, 0.1, 0.08],
      color: BRONZE.dark,
    },
    {
      id: 'shawl-hem',
      primitive: 'box',
      args: [1.12, 0.28, 0.36],
      position: [1.7, 4.9, 0.42],
      rotation: [0.04, 0.08, 0.05],
      color: BRONZE.dark,
      roughness: 0.6,
    },
  ];
}

export function makeTunicDetails(): MeshSpec[] {
  return [
    {
      id: 'sash',
      primitive: 'torus',
      args: [1.55, 0.22, 10, 24],
      position: [0, 8.12, 0],
      rotation: [Math.PI / 2, 0, 0],
      color: BRONZE.dark,
    },
    {
      id: 'collar',
      primitive: 'torus',
      args: [0.78, 0.16, 8, 18, Math.PI * 1.35],
      position: [0, 12.35, 0.12],
      rotation: [0.35, 0, 0],
      color: BRONZE.dark,
    },
    {
      id: 'placket',
      primitive: 'box',
      args: [0.32, 3.7, 0.16],
      position: [0, 10.05, 1.48],
      color: BRONZE.dark,
      metalness: 0.55,
    },
    { id: 'btn-1', primitive: 'sphere', args: [0.1, 8, 8], position: [0, 11.15, 1.6], color: BRONZE.light, metalness: 0.7, roughness: 0.35 },
    { id: 'btn-2', primitive: 'sphere', args: [0.1, 8, 8], position: [0, 10.55, 1.6], color: BRONZE.light, metalness: 0.7, roughness: 0.35 },
    { id: 'btn-3', primitive: 'sphere', args: [0.1, 8, 8], position: [0, 9.95, 1.6], color: BRONZE.light, metalness: 0.7, roughness: 0.35 },
    { id: 'btn-4', primitive: 'sphere', args: [0.1, 8, 8], position: [0, 9.35, 1.6], color: BRONZE.light, metalness: 0.7, roughness: 0.35 },
    { id: 'btn-5', primitive: 'sphere', args: [0.1, 8, 8], position: [0, 8.75, 1.58], color: BRONZE.light, metalness: 0.7, roughness: 0.35 },
    {
      id: 'pocket-l',
      primitive: 'box',
      args: [0.7, 0.55, 0.12],
      position: [-0.85, 9.15, 1.42],
      color: BRONZE.dark,
    },
    {
      id: 'pocket-r',
      primitive: 'box',
      args: [0.7, 0.55, 0.12],
      position: [0.85, 9.15, 1.42],
      color: BRONZE.dark,
    },
    {
      id: 'shoulder-l',
      primitive: 'sphere',
      args: [0.72, 14, 10],
      position: [-1.45, 11.85, 0.05],
      scale: [1.05, 0.62, 0.9],
      color: BRONZE.base,
    },
    {
      id: 'shoulder-r',
      primitive: 'sphere',
      args: [0.72, 14, 10],
      position: [1.45, 11.85, 0.05],
      scale: [1.05, 0.62, 0.9],
      color: BRONZE.base,
    },
  ];
}

export function makeHeadFeatures(): MeshSpec[] {
  return [
    {
      id: 'neck',
      primitive: 'cylinder',
      args: [0.48, 0.62, 1.05, 14],
      position: [0, 12.95, 0.04],
      color: BRONZE.mid,
    },
    {
      id: 'neck-fold',
      primitive: 'torus',
      args: [0.52, 0.07, 8, 16],
      position: [0, 12.7, 0.04],
      rotation: [Math.PI / 2, 0, 0],
      color: BRONZE.dark,
    },
    {
      id: 'cranium',
      primitive: 'sphere',
      args: [1.12, 28, 22],
      position: [0, 14.42, 0.04],
      scale: [1.06, 1.16, 1.1],
      color: BRONZE.base,
      roughness: 0.42,
      metalness: 0.62,
    },
    {
      id: 'forehead',
      primitive: 'sphere',
      args: [0.78, 16, 12],
      position: [0, 14.28, 0.5],
      scale: [1.08, 0.58, 0.62],
      color: BRONZE.mid,
    },
    {
      id: 'jaw',
      primitive: 'sphere',
      args: [0.82, 20, 16],
      position: [0, 13.58, 0.28],
      scale: [1.06, 0.9, 1.0],
      color: BRONZE.mid,
    },
    {
      id: 'chin',
      primitive: 'sphere',
      args: [0.34, 12, 10],
      position: [0, 13.12, 0.82],
      scale: [1.2, 0.72, 0.85],
      color: BRONZE.mid,
    },
    {
      id: 'cheek-l',
      primitive: 'sphere',
      args: [0.34, 10, 8],
      position: [-0.52, 13.58, 0.62],
      scale: [0.95, 0.85, 0.75],
      color: BRONZE.mid,
    },
    {
      id: 'cheek-r',
      primitive: 'sphere',
      args: [0.34, 10, 8],
      position: [0.52, 13.58, 0.62],
      scale: [0.95, 0.85, 0.75],
      color: BRONZE.mid,
    },
    {
      id: 'brow',
      primitive: 'box',
      args: [1.42, 0.24, 0.4],
      position: [0, 14.28, 0.98],
      color: BRONZE.dark,
    },
    {
      id: 'socket-l',
      primitive: 'sphere',
      args: [0.24, 10, 8],
      position: [-0.4, 14.02, 0.92],
      scale: [1.05, 0.7, 0.45],
      color: BRONZE.shadow,
      roughness: 0.7,
      metalness: 0.15,
    },
    {
      id: 'socket-r',
      primitive: 'sphere',
      args: [0.24, 10, 8],
      position: [0.4, 14.02, 0.92],
      scale: [1.05, 0.7, 0.45],
      color: BRONZE.shadow,
      roughness: 0.7,
      metalness: 0.15,
    },
    {
      id: 'eye-l',
      primitive: 'sphere',
      args: [0.16, 10, 10],
      position: [-0.4, 14.0, 1.08],
      color: BRONZE.shadow,
      roughness: 0.55,
      metalness: 0.2,
    },
    {
      id: 'eye-r',
      primitive: 'sphere',
      args: [0.16, 10, 10],
      position: [0.4, 14.0, 1.08],
      color: BRONZE.shadow,
      roughness: 0.55,
      metalness: 0.2,
    },
    {
      id: 'lid-l',
      primitive: 'sphere',
      args: [0.16, 8, 8],
      position: [-0.4, 14.12, 1.02],
      scale: [1, 0.4, 0.65],
      color: BRONZE.dark,
    },
    {
      id: 'lid-r',
      primitive: 'sphere',
      args: [0.16, 8, 8],
      position: [0.4, 14.12, 1.02],
      scale: [1, 0.4, 0.65],
      color: BRONZE.dark,
    },
    {
      id: 'nose-bridge',
      primitive: 'box',
      args: [0.24, 0.42, 0.34],
      position: [0, 13.98, 1.12],
      color: BRONZE.mid,
    },
    {
      id: 'nose',
      primitive: 'cone',
      args: [0.24, 0.72, 8],
      position: [0, 13.68, 1.22],
      rotation: [Math.PI / 2, 0, 0],
      color: BRONZE.mid,
    },
    {
      id: 'mouth',
      primitive: 'box',
      args: [0.52, 0.1, 0.14],
      position: [0, 13.32, 1.12],
      color: BRONZE.shadow,
      roughness: 0.55,
      metalness: 0.2,
    },
    {
      id: 'ear-l',
      primitive: 'sphere',
      args: [0.32, 12, 10],
      position: [-1.08, 13.88, 0.1],
      scale: [0.5, 1.1, 0.82],
      color: BRONZE.mid,
    },
    {
      id: 'ear-r',
      primitive: 'sphere',
      args: [0.32, 12, 10],
      position: [1.08, 13.88, 0.1],
      scale: [0.5, 1.1, 0.82],
      color: BRONZE.mid,
    },
    {
      id: 'hair-fringe',
      primitive: 'torus',
      args: [0.88, 0.13, 10, 24, Math.PI * 1.2],
      position: [0, 13.85, -0.12],
      rotation: [0.28, 0, 0],
      color: BRONZE.hair,
      roughness: 0.8,
      metalness: 0.25,
    },
  ];
}

export function makeLegs(): MeshSpec[] {
  const { leftFoot: L, rightFoot: R } = pose;
  return [
    {
      id: 'shin-l',
      primitive: 'cylinder',
      args: [0.4, 0.5, 2.15, 12],
      position: [L.x, 1.18, L.z * 0.55],
      rotation: [0.28, 0, -0.04],
      color: BRONZE.dark,
    },
    {
      id: 'knee-l',
      primitive: 'sphere',
      args: [0.42, 10, 8],
      position: [L.x, 2.2, L.z * 0.28],
      color: BRONZE.dark,
    },
    {
      id: 'calf-l',
      primitive: 'sphere',
      args: [0.38, 10, 8],
      position: [L.x, 1.45, L.z * 0.42],
      scale: [0.95, 1.15, 0.9],
      color: BRONZE.dark,
    },
    {
      id: 'shin-r',
      primitive: 'cylinder',
      args: [0.4, 0.5, 2.15, 12],
      position: [R.x, 1.18, R.z * 0.55],
      rotation: [-0.18, 0, 0.05],
      color: BRONZE.dark,
    },
    {
      id: 'knee-r',
      primitive: 'sphere',
      args: [0.42, 10, 8],
      position: [R.x, 2.2, R.z * 0.22],
      color: BRONZE.dark,
    },
    {
      id: 'calf-r',
      primitive: 'sphere',
      args: [0.38, 10, 8],
      position: [R.x, 1.45, R.z * 0.35],
      scale: [0.95, 1.15, 0.9],
      color: BRONZE.dark,
    },
  ];
}

export function makeFeet(): MeshSpec[] {
  const { leftFoot: L, rightFoot: R } = pose;
  const sandal = (id: string, x: number, y: number, z: number, rotX: number): MeshSpec[] => [
    {
      id: `${id}-sole`,
      primitive: 'box',
      args: [0.72, 0.22, 1.55],
      position: [x, y, z],
      rotation: [rotX, 0, 0],
      color: BRONZE.dark,
      roughness: 0.7,
      metalness: 0.28,
    },
    {
      id: `${id}-toe`,
      primitive: 'sphere',
      args: [0.28, 10, 8],
      position: [x, y + 0.08, z + 0.62],
      scale: [1.15, 0.55, 0.9],
      color: BRONZE.dark,
    },
    {
      id: `${id}-strap-a`,
      primitive: 'torus',
      args: [0.32, 0.05, 6, 12, Math.PI],
      position: [x, y + 0.22, z + 0.15],
      rotation: [0.2, 0, 0],
      color: BRONZE.shadow,
      roughness: 0.75,
    },
    {
      id: `${id}-strap-b`,
      primitive: 'torus',
      args: [0.28, 0.045, 6, 12, Math.PI],
      position: [x, y + 0.2, z - 0.15],
      rotation: [0.15, 0, 0],
      color: BRONZE.shadow,
      roughness: 0.75,
    },
  ];
  return [...sandal('foot-l', L.x, L.y, L.z, 0.08), ...sandal('foot-r', R.x, R.y, R.z, -0.05)];
}

export function makeArms(): MeshSpec[] {
  return [-1, 1].flatMap((s) => [
    {
      id: `upper-arm-${s}`,
      primitive: 'capsule',
      args: [0.42, 2.05, 6, 10],
      position: [s * 1.88, 10.25, 0.12],
      rotation: [0.12, 0, s * 0.18],
      color: BRONZE.base,
    },
    {
      id: `elbow-${s}`,
      primitive: 'sphere',
      args: [0.32, 10, 8],
      position: [s * 2.05, 9.05, 0.28],
      color: BRONZE.dark,
    },
    {
      id: `forearm-${s}`,
      primitive: 'capsule',
      args: [0.34, 2.0, 6, 10],
      position: [s * 2.18, 8.0, 0.48],
      rotation: [0.28, 0, s * 0.06],
      color: BRONZE.base,
    },
    {
      id: `wrist-${s}`,
      primitive: 'sphere',
      args: [0.26, 10, 8],
      position: [s * 2.28, 6.85, 0.7],
      color: BRONZE.mid,
    },
  ]);
}

export function makeHands(): MeshSpec[] {
  return [-1, 1].flatMap((s) => {
    const x = s * 2.32;
    const y = 6.55;
    const z = 0.82;
    const fingers: MeshSpec[] = [0, 1, 2, 3].map((i) => ({
      id: `finger-${s}-${i}`,
      primitive: 'capsule',
      args: [0.075, 0.4, 4, 6],
      position: [x + s * 0.04, y - 0.48, z + 0.1 + (i - 1.5) * 0.13],
      rotation: [0.55, 0, s * 0.1],
      color: BRONZE.mid,
    }));
    return [
      {
        id: `palm-${s}`,
        primitive: 'sphere',
        args: [0.36, 12, 10],
        position: [x, y, z],
        scale: [0.85, 1.05, 0.7],
        color: BRONZE.mid,
      },
      ...fingers,
      {
        id: `thumb-${s}`,
        primitive: 'capsule',
        args: [0.08, 0.32, 4, 6],
        position: [x - s * 0.28, y - 0.12, z + 0.18],
        rotation: [0.4, s * 0.6, s * 0.5],
        color: BRONZE.mid,
      },
    ];
  });
}

export interface TransformSpec {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number, number];
}

export function makeCladdingSeams(): TransformSpec[] {
  const out: TransformSpec[] = [];
  const meridians = 8;
  const tunicRings = [8.55, 9.35, 10.15, 10.95, 11.7];
  const tunicR = 1.56;
  for (const y of tunicRings) {
    for (let m = 0; m < meridians; m++) {
      const a = (m / meridians) * Math.PI * 2;
      const span = ((2 * Math.PI * tunicR) / meridians) * 0.7;
      out.push({
        position: [Math.cos(a) * tunicR, y, Math.sin(a) * tunicR],
        rotation: [0, -a, 0],
        size: [span, 0.026, 0.032],
      });
    }
  }
  for (let m = 0; m < meridians; m++) {
    const a = (m / meridians) * Math.PI * 2;
    out.push({
      position: [Math.cos(a) * tunicR, 10.1, Math.sin(a) * tunicR],
      rotation: [0, -a, 0],
      size: [0.026, 3.35, 0.032],
    });
  }
  const dhotiRings = [2.45, 3.85, 5.25, 6.65];
  const dhotiR = 2.12;
  for (const y of dhotiRings) {
    for (let m = 0; m < meridians; m++) {
      const a = (m / meridians) * Math.PI * 2 + 0.18;
      const span = ((2 * Math.PI * dhotiR) / meridians) * 0.68;
      out.push({
        position: [Math.cos(a) * dhotiR, y, Math.sin(a) * dhotiR],
        rotation: [0, -a, 0],
        size: [span, 0.022, 0.03],
      });
    }
  }
  return out;
}

export function makeGalleryColumnPositions(): [number, number, number][] {
  const out: [number, number, number][] = [];
  for (let i = 0; i < galleryColumns.count; i++) {
    const a = (i / galleryColumns.count) * Math.PI * 2;
    out.push([
      Math.cos(a) * galleryColumns.radius,
      island.plazaY + galleryColumns.y,
      Math.sin(a) * galleryColumns.radius,
    ]);
  }
  return out;
}

export function makeVisitors(): [number, number, number][] {
  const out: [number, number, number][] = [];
  const n = 22;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + 0.11;
    const r = galleryColumns.radius + 0.62;
    out.push([
      Math.cos(a) * r,
      island.plazaY + 4.8,
      Math.sin(a) * r,
    ]);
  }
  for (let i = 0; i < 8; i++) {
    const t = (i + 0.5) / 8;
    out.push([
      ((i % 2) - 0.5) * 1.1,
      lerp(bridge.start[1], bridge.end[1], t) + 0.35,
      lerp(bridge.start[2], bridge.end[2], t),
    ]);
  }
  return out;
}

export function makeIslandHeight(x: number, z: number): number {
  const nx = x / island.radiusX;
  const nz = z / island.radiusZ;
  const r = Math.hypot(nx, nz);
  const n = fbm2(x * 0.055, z * 0.055);
  const shore = 0.9 + n * 0.16;
  if (r >= shore) {
    const t = Math.min(1, (r - shore) / 0.28);
    return lerp(0.12, -0.85, t);
  }
  const worldR = Math.hypot(x, z);
  if (worldR < island.plazaRadius) {
    return island.plazaY + (n - 0.45) * 0.05;
  }
  const inner = 1 - r / shore;
  const bank = island.plazaY * Math.pow(inner, 0.35);
  const lumps = (n - 0.4) * 0.5;
  return Math.max(0.05, bank + lumps);
}

export function buildIslandGeometry(): {
  positions: Float32Array;
  colors: Float32Array;
  indices: number[];
} {
  const cols = island.segments;
  const rows = island.segments;
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const grass = [0.36, 0.44, 0.28];
  const earth = [0.42, 0.36, 0.24];
  const wet = [0.28, 0.32, 0.28];

  for (let iz = 0; iz <= rows; iz++) {
    for (let ix = 0; ix <= cols; ix++) {
      const x = (ix / cols - 0.5) * island.radiusX * 2.25;
      const z = (iz / rows - 0.5) * island.radiusZ * 2.25;
      const y = makeIslandHeight(x, z);
      positions.push(x, y, z);
      const c = y > 1.15 ? grass : y > 0.28 ? earth : wet;
      const shade = 0.88 + fbm2(x * 0.2, z * 0.2) * 0.22;
      colors.push(c[0] * shade, c[1] * shade, c[2] * shade);
    }
  }
  for (let iz = 0; iz < rows; iz++) {
    for (let ix = 0; ix < cols; ix++) {
      const a = iz * (cols + 1) + ix;
      const b = a + 1;
      const c = a + (cols + 1);
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }
  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
    indices,
  };
}

function hexRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/** Irregular hill mound — not a cone. Local space, base at y = 0. */
export function buildMoundGeometry(
  hill: HillSpec,
  radial = 28,
  rings = 18,
): { positions: Float32Array; colors: Float32Array; indices: number[] } {
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const [cr, cg, cb] = hexRgb(hill.color);
  for (let i = 0; i <= rings; i++) {
    const t = i / rings;
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      const n = fbm2(Math.cos(a) * 2.2 + hill.radius * 0.07, Math.sin(a) * 2.2 + t * 3.4 + hill.height * 0.05);
      const r = hill.radius * t * (0.88 + n * 0.28);
      const y = hill.height * Math.sqrt(Math.max(0, 1 - t * t)) * (0.78 + n * 0.4);
      positions.push(Math.cos(a) * r, Math.max(0, y), Math.sin(a) * r);
      const shade = 0.72 + n * 0.38;
      colors.push(cr * shade, cg * shade, cb * shade);
    }
  }
  for (let i = 0; i < rings; i++) {
    for (let j = 0; j < radial; j++) {
      const aI = i * (radial + 1) + j;
      const bI = aI + 1;
      const cI = (i + 1) * (radial + 1) + j;
      const dI = cI + 1;
      indices.push(aI, cI, bI, bI, cI, dI);
    }
  }
  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
    indices,
  };
}

export function makeGalleryArches(): TransformSpec[] {
  const n = galleryColumns.count;
  const out: TransformSpec[] = [];
  for (let i = 0; i < n; i++) {
    const a = ((i + 0.5) / n) * Math.PI * 2;
    const r = galleryColumns.radius - 0.12;
    out.push({
      position: [Math.cos(a) * r, island.plazaY + galleryColumns.y, Math.sin(a) * r],
      rotation: [0, -a, 0],
      size: [0.72, 0.88, 0.2],
    });
  }
  return out;
}

export function makePedestalStairs(): { position: [number, number, number]; size: [number, number, number] }[] {
  const steps = 7;
  const out: { position: [number, number, number]; size: [number, number, number] }[] = [];
  for (let i = 0; i < steps; i++) {
    out.push({
      position: [0, island.plazaY + 0.16 + i * 0.2, 16.8 - i * 0.5],
      size: [6.4 - i * 0.12, 0.2, 1.05],
    });
  }
  return out;
}

export interface TreeSpec {
  position: [number, number, number];
  scale: number;
  canopy: string;
}

export function makeTrees(): TreeSpec[] {
  const out: TreeSpec[] = [];
  const canopies = ['#3d5a32', '#4a6a3a', '#2f4a28'];
  const n = 40;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + 0.35;
    const r = 22 + (i % 5) * 1.9;
    const x = Math.cos(a) * r * (island.radiusX / 32);
    const z = Math.sin(a) * r * (island.radiusZ / 32);
    if (x < -14 && Math.abs(z) < 12) continue;
    const y = makeIslandHeight(x, z);
    if (y < 0.35) continue;
    out.push({
      position: [x, y, z],
      scale: 0.72 + (i % 4) * 0.2,
      canopy: canopies[i % canopies.length],
    });
  }
  for (const h of hills) {
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + 0.4;
      const rr = h.radius * 0.42;
      const x = h.base[0] + Math.cos(a) * rr;
      const z = h.base[2] + Math.sin(a) * rr;
      const y = h.base[1] + h.height * 0.18;
      out.push({
        position: [x, y, z],
        scale: 1.35 + (i % 3) * 0.28,
        canopy: canopies[i % canopies.length],
      });
    }
  }
  return out;
}

export function makeShoreRocks(): { position: [number, number, number]; scale: number }[] {
  const out: { position: [number, number, number]; scale: number }[] = [];
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2 + 0.2;
    const r = 27 + (i % 3) * 1.4;
    const x = Math.cos(a) * r * (island.radiusX / 34);
    const z = Math.sin(a) * r * (island.radiusZ / 34);
    const y = makeIslandHeight(x, z);
    out.push({ position: [x, Math.max(y, 0.05), z], scale: 0.7 + (i % 4) * 0.35 });
  }
  return out;
}

export function makeBridgePiers(): { position: [number, number, number]; height: number }[] {
  const n = bridge.pierCount;
  return Array.from({ length: n }, (_, i) => {
    const t = (i + 0.5) / n;
    const x = lerp(bridge.start[0], bridge.end[0], t);
    const z = lerp(bridge.start[2], bridge.end[2], t);
    const deckY = lerp(bridge.start[1], bridge.end[1], t);
    return { position: [x, deckY / 2, z], height: deckY };
  });
}

export function bridgeDeck() {
  const dx = bridge.end[0] - bridge.start[0];
  const dy = bridge.end[1] - bridge.start[1];
  const dz = bridge.end[2] - bridge.start[2];
  const length = Math.hypot(dx, dy, dz);
  const mid: [number, number, number] = [
    (bridge.start[0] + bridge.end[0]) / 2,
    (bridge.start[1] + bridge.end[1]) / 2,
    (bridge.start[2] + bridge.end[2]) / 2,
  ];
  const rotY = Math.atan2(dx, dz);
  const rotX = -Math.atan2(dy, Math.hypot(dx, dz));
  return {
    length,
    mid,
    rotation: [rotX, rotY, 0] as [number, number, number],
    width: bridge.deckWidth,
    thickness: bridge.deckThickness,
  };
}

export function makeBridgeRailPosts(): [number, number, number][] {
  const out: [number, number, number][] = [];
  const n = 18;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const x = lerp(bridge.start[0], bridge.end[0], t);
    const y = lerp(bridge.start[1], bridge.end[1], t) + 0.55;
    const z = lerp(bridge.start[2], bridge.end[2], t);
    out.push([x - bridge.deckWidth * 0.42, y, z], [x + bridge.deckWidth * 0.42, y, z]);
  }
  return out;
}

export function makeDamSpillways(): [number, number, number][] {
  const w = dam.size[0];
  const n = dam.spillwayCount;
  return Array.from({ length: n }, (_, i) => {
    const x = dam.position[0] - w / 2 + ((i + 0.5) * w) / n;
    return [x, dam.position[1] - 1.5, dam.position[2] + dam.size[2] * 0.38];
  });
}

export function makeDamTowers(): [number, number, number][] {
  const w = dam.size[0];
  const n = dam.towerCount;
  return Array.from({ length: n }, (_, i) => {
    const x = dam.position[0] - w * 0.38 + (i * w * 0.76) / (n - 1);
    return [x, dam.position[1] + dam.size[1] * 0.45, dam.position[2]];
  });
}

export function figurePart(id: FigurePartId): FigurePart {
  const part = figureParts.find((p) => p.id === id);
  if (!part) throw new Error(`Missing figure part ${id}`);
  return part;
}
