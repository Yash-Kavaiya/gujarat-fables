/**
 * Layout constants, geometric specifications, procedural generators,
 * lighting presets, and camera stations for the Mani Mandir 3D experience.
 */

export const MANI_PLACE_ID = 'mani-mandir';

// ============================================================================
// Material & Stone Color Definitions
// ============================================================================

export const MANI_STONE = {
  sandstone: '#c8a876', // Dhrangadhra yellow sandstone
  sandstoneLight: '#dec69d', // Highlight carved moldings
  sandstoneDark: '#937449', // Shadowed piers and plinths
  sandstoneCarved: '#b89462', // Decorative friezes & brackets
  marbleWhite: '#f5f6f8', // Makrana white marble inlays
  marbleRose: '#e8c4c8', // Pink marble accents
  recessDark: '#1a140e', // Deep interior shadows
  domeGold: '#d4af37', // Kalash finials and brass trims
  riverWater: '#2b4d59', // Machhu river water tone
  riverWaterHighlight: '#ffecd2',
  lawnGreen: '#4d6338', // Palace garden lawn
  pavementTile: '#bda27e', // Courtyard stone tiles
};

// ============================================================================
// Lighting Presets & Atmospheric Modes
// ============================================================================

export type ManiTimeOfDay = 'day' | 'twilight' | 'aarti' | 'moonlight';
export type ManiCameraMode = 'facade' | 'river' | 'garden' | 'orbit';

export interface ManiLightingPreset {
  id: ManiTimeOfDay;
  name: string;
  subtitle: string;
  skyTop: string;
  skyHorizon: string;
  groundColor: string;
  accentColor: string;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  sunPosition: [number, number, number];
  sunColor: string;
  sunIntensity: number;
  ambientColor: string;
  ambientIntensity: number;
  bloomIntensity: number;
  diyaActive: boolean;
  petalColor: string;
  description: string;
}

export const MANI_LIGHTING_PRESETS: Record<ManiTimeOfDay, ManiLightingPreset> = {
  day: {
    id: 'day',
    name: '☀️ Royal Day',
    subtitle: 'Golden sun glowing on Dhrangadhra yellow sandstone',
    skyTop: '#6ba8e5',
    skyHorizon: '#f3e6d8',
    groundColor: '#7a6147',
    accentColor: '#f1c40f',
    fogColor: '#dfcfbe',
    fogNear: 55,
    fogFar: 280,
    sunPosition: [35, 42, 32],
    sunColor: '#fff5e4',
    sunIntensity: 1.7,
    ambientColor: '#d6c5b0',
    ambientIntensity: 0.65,
    bloomIntensity: 0.6,
    diyaActive: false,
    petalColor: '#f7a8b8',
    description: 'Crisp royal sunlight illuminating the carved stone jharokhas and courtyards.',
  },
  twilight: {
    id: 'twilight',
    name: '🌅 Rose Twilight',
    subtitle: 'Romantic dusk bathing the palace in warm amber and coral',
    skyTop: '#7c3aed',
    skyHorizon: '#f43f5e',
    groundColor: '#6d4838',
    accentColor: '#fb7185',
    fogColor: '#a85868',
    fogNear: 45,
    fogFar: 250,
    sunPosition: [42, 10, 24],
    sunColor: '#ff7b72',
    sunIntensity: 2.1,
    ambientColor: '#e8798a',
    ambientIntensity: 0.75,
    bloomIntensity: 1.15,
    diyaActive: true,
    petalColor: '#ff9ebb',
    description: 'Sunset over the Machhu river casting long golden shadows across the arches.',
  },
  aarti: {
    id: 'aarti',
    name: '🪔 Evening Aarti',
    subtitle: 'Hundreds of glowing diyas & lanterns along arcades and river ghats',
    skyTop: '#13192f',
    skyHorizon: '#2b1b36',
    groundColor: '#3a271c',
    accentColor: '#ff9f43',
    fogColor: '#1d172e',
    fogNear: 35,
    fogFar: 220,
    sunPosition: [-25, 20, 20],
    sunColor: '#ffad5a',
    sunIntensity: 0.7,
    ambientColor: '#3d2542',
    ambientIntensity: 0.55,
    bloomIntensity: 1.5,
    diyaActive: true,
    petalColor: '#ff758f',
    description: 'Temple sanctums lit by brass aarti lamps with river reflections.',
  },
  moonlight: {
    id: 'moonlight',
    name: '🌙 Moonlit Love',
    subtitle: 'Serene silver moonlight washing over marble jalis and river waters',
    skyTop: '#090d1f',
    skyHorizon: '#141d3d',
    groundColor: '#2b2633',
    accentColor: '#70a1ff',
    fogColor: '#0e142c',
    fogNear: 40,
    fogFar: 240,
    sunPosition: [-35, 45, -25],
    sunColor: '#d6e2ff',
    sunIntensity: 0.8,
    ambientColor: '#182040',
    ambientIntensity: 0.45,
    bloomIntensity: 1.25,
    diyaActive: true,
    petalColor: '#ffffff',
    description: 'The Taj Mahal of Gujarat under an ethereal moonlit sky.',
  },
};

// ============================================================================
// Camera Stations & Viewpoints
// ============================================================================

export interface ManiCameraStation {
  id: ManiCameraMode;
  name: string;
  cameraPos: [number, number, number];
  lookAtPos: [number, number, number];
  fov: number;
}

export const MANI_CAMERA_STATIONS: Record<ManiCameraMode, ManiCameraStation> = {
  facade: {
    id: 'facade',
    name: '🏰 Palace Facade',
    cameraPos: [0, 14, 52],
    lookAtPos: [0, 12, 0],
    fov: 48,
  },
  river: {
    id: 'river',
    name: '🌊 Machhu River',
    cameraPos: [-28, 4.5, 36],
    lookAtPos: [6, 12, -4],
    fov: 54,
  },
  garden: {
    id: 'garden',
    name: '🌺 Royal Garden',
    cameraPos: [18, 5.5, 32],
    lookAtPos: [-4, 8, 4],
    fov: 50,
  },
  orbit: {
    id: 'orbit',
    name: '🔄 360° Orbit',
    cameraPos: [32, 22, 48],
    lookAtPos: [0, 11, 0],
    fov: 46,
  },
};

// ============================================================================
// 3D Hotspots & Cultural Annotations
// ============================================================================

export interface ManiHotspotSpec {
  id: string;
  title: string;
  category: 'History' | 'Architecture' | 'Sculpture' | 'Setting';
  position: [number, number, number];
  description: string;
}

export const MANI_HOTSPOTS: ManiHotspotSpec[] = [
  {
    id: 'central-shikhara',
    title: 'The Eternal Shrines & Shikhara',
    category: 'History',
    position: [0, 29, 9],
    description:
      'Built in the 1930s by Maharaja Waghji Thakor in tribute to Maharani Mani Ba. The sanctums house divine couples (Radha-Krishna, Lakshmi-Narayan, Shiva-Parvati) celebrating eternal love.',
  },
  {
    id: 'jharokha-balcony',
    title: 'Royal Jharokha & Carved Jali',
    category: 'Architecture',
    position: [0, 20, 11.5],
    description:
      'Projecting Rajput balcony with cusped arches and intricate floral stone jali screens, designed to catch the cooling river breezes from the Machhu.',
  },
  {
    id: 'bangla-roof',
    title: 'Curved Bangla Vault & Chhatris',
    category: 'Architecture',
    position: [0, 25, 9.5],
    description:
      'A harmonious synthesis of Bengal-style vaulted cornices, Rajput corner chhatris, and Chaulukya-Solanki spire pinnacles with golden Kalash finials.',
  },
  {
    id: 'arcaded-wings',
    title: 'Three-Tier Arcaded Corridors',
    category: 'Architecture',
    position: [-16, 9, 8.5],
    description:
      'Triple-storey verandah arcades built with local Dhrangadhra yellow sandstone, featuring 60+ cusped arches and carved bracket capitals.',
  },
  {
    id: 'machhu-ghat',
    title: 'Machhu River Ghats',
    category: 'Setting',
    position: [-32, 1.2, 18],
    description:
      'Stepped stone retaining walls and river embankment along the Machhu river, where evening diyas are set afloat during temple aarti.',
  },
  {
    id: 'marble-fountain',
    title: 'Royal Courtyard & Marble Fountain',
    category: 'Setting',
    position: [0, 1.2, 28],
    description:
      'Octagonal carved white marble water fountain surrounded by paved geometric stone walkways, manicured cypress trees, and flowering gardens.',
  },
];

// ============================================================================
// Procedural Geometry & Layout Generators
// ============================================================================

/**
 * Specs for arcade columns and cusped arch locations on palace wings.
 */
export interface ArcadeSpec {
  cx: number;
  width: number;
  bays: number;
  openBottom: number;
  openTop: number;
  zFront: number;
}

export function makeWingArcades(): ArcadeSpec[] {
  const widths = [16, 16];
  const centers = [-16, 16];
  const arcades: ArcadeSpec[] = [];

  centers.forEach((cx, idx) => {
    const w = widths[idx];
    arcades.push(
      { cx, width: w, bays: 5, openBottom: 1.2, openTop: 5.2, zFront: 8.2 },
      { cx, width: w, bays: 5, openBottom: 6.4, openTop: 10.4, zFront: 8.2 },
      { cx, width: w, bays: 5, openBottom: 11.6, openTop: 15.0, zFront: 8.2 },
    );
  });

  return arcades;
}

/**
 * Corner & Roofline Chhatris.
 */
export interface ChhatriSpec {
  position: [number, number, number];
  size: number;
  hasDome: boolean;
}

export function makeChhatris(): ChhatriSpec[] {
  return [
    { position: [-24, 16.2, 6], size: 2.6, hasDome: true },
    { position: [24, 16.2, 6], size: 2.6, hasDome: true },
    { position: [-24, 16.2, -6], size: 2.4, hasDome: true },
    { position: [24, 16.2, -6], size: 2.4, hasDome: true },
    { position: [-7.2, 23.2, 7.2], size: 2.2, hasDome: true },
    { position: [7.2, 23.2, 7.2], size: 2.2, hasDome: true },
  ];
}

/**
 * Balustrade sections with coordinates and counts.
 */
export interface BalustradeSpec {
  cx: number;
  width: number;
  y: number;
  z: number;
}

export function makeBalustrades(): BalustradeSpec[] {
  return [
    { cx: -16, width: 16, y: 16, z: 8.2 },
    { cx: 16, width: 16, y: 16, z: 8.2 },
    { cx: 0, width: 9.2, y: 18.4, z: 11.6 },
    { cx: -24, width: 6.0, y: 16, z: 0 },
    { cx: 24, width: 6.0, y: 16, z: 0 },
  ];
}

/**
 * Diya lamp positions along corridors, entrance steps, and river ghats.
 */
export interface DiyaLampSpec {
  id: string;
  position: [number, number, number];
  intensity: number;
}

export function makeDiyaLamps(): DiyaLampSpec[] {
  const lamps: DiyaLampSpec[] = [];

  // Entrance staircase flanking lamps
  lamps.push(
    { id: 'lamp-stair-l1', position: [-7.5, 1.2, 18], intensity: 2.2 },
    { id: 'lamp-stair-r1', position: [7.5, 1.2, 18], intensity: 2.2 },
    { id: 'lamp-stair-l2', position: [-5.5, 2.2, 14], intensity: 2.0 },
    { id: 'lamp-stair-r2', position: [5.5, 2.2, 14], intensity: 2.0 },
  );

  // Verandah arcade corridor lamps (lower & mid tiers)
  for (let i = 0; i < 5; i++) {
    const xL = -22 + i * 3.2;
    const xR = 10 + i * 3.2;
    lamps.push(
      { id: `lamp-l-tier1-${i}`, position: [xL, 4.8, 8.4], intensity: 1.4 },
      { id: `lamp-r-tier1-${i}`, position: [xR, 4.8, 8.4], intensity: 1.4 },
      { id: `lamp-l-tier2-${i}`, position: [xL, 10.2, 8.4], intensity: 1.2 },
      { id: `lamp-r-tier2-${i}`, position: [xR, 10.2, 8.4], intensity: 1.2 },
    );
  }

  // River ghat floating diyas
  for (let i = 0; i < 8; i++) {
    const z = 8 + i * 4;
    lamps.push({
      id: `diya-river-${i}`,
      position: [-38 + ((i * 7) % 5), 0.12, z],
      intensity: 1.8,
    });
  }

  return lamps;
}

/**
 * Palace garden trees & cypress spires.
 */
export interface GardenTreeSpec {
  position: [number, number, number];
  scale: number;
  kind: 'cypress' | 'palm' | 'flowering';
}

export function makeGardenTrees(): GardenTreeSpec[] {
  return [
    { position: [-14, 0, 32], scale: 1.2, kind: 'cypress' },
    { position: [14, 0, 32], scale: 1.2, kind: 'cypress' },
    { position: [-18, 0, 38], scale: 1.3, kind: 'cypress' },
    { position: [18, 0, 38], scale: 1.3, kind: 'cypress' },
    { position: [-22, 0, 26], scale: 1.1, kind: 'flowering' },
    { position: [22, 0, 26], scale: 1.1, kind: 'flowering' },
    { position: [-26, 0, 42], scale: 1.4, kind: 'palm' },
    { position: [26, 0, 42], scale: 1.4, kind: 'palm' },
    { position: [8, 0, 44], scale: 1.1, kind: 'flowering' },
    { position: [-8, 0, 44], scale: 1.1, kind: 'flowering' },
  ];
}
