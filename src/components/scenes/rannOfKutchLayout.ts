/**
 * Layout, geometric specifications, color palettes, and procedural asset
 * generators for the Great Rann of Kutch 3D experience.
 */

export const RANN_PLACE_ID = 'rann-of-kutch';

// ============================================================================
// Color Palettes & Lighting Presets for Atmospheric Modes
// ============================================================================

export type RannTimeOfDay = 'day' | 'sunset' | 'fullmoon' | 'festival';
export type RannCameraMode = 'explore' | 'watchtower' | 'festival' | 'orbit';

export interface RannLightingPreset {
  id: RannTimeOfDay;
  name: string;
  subtitle: string;
  skyTop: string;
  skyHorizon: string;
  groundTint: string;
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
  showStars: boolean;
  showMoon: boolean;
  showSun: boolean;
  saltSparkleIntensity: number;
  description: string;
}

export const RANN_LIGHTING_PRESETS: Record<RannTimeOfDay, RannLightingPreset> = {
  day: {
    id: 'day',
    name: '☀️ Brilliant Day',
    subtitle: 'Blinding white salt flats under crisp desert sun',
    skyTop: '#4a90e2',
    skyHorizon: '#e0f0fc',
    groundTint: '#f5f3ec',
    accentColor: '#e67e22',
    fogColor: '#d6e8f7',
    fogNear: 45,
    fogFar: 260,
    sunPosition: [48, 38, -42],
    sunColor: '#fff9ea',
    sunIntensity: 1.8,
    ambientColor: '#c5e2f7',
    ambientIntensity: 0.65,
    bloomIntensity: 0.5,
    showStars: false,
    showMoon: false,
    showSun: true,
    saltSparkleIntensity: 1.2,
    description: 'The vast white expanse under blazing sunlight with shimmering mirage reflections.',
  },
  sunset: {
    id: 'sunset',
    name: '🌅 Sunset Twilight',
    subtitle: 'Fiery crimson & gold sunset with stretching shadows',
    skyTop: '#5e2474',
    skyHorizon: '#ff7e47',
    groundTint: '#eed2bc',
    accentColor: '#ff4757',
    fogColor: '#e07a52',
    fogNear: 35,
    fogFar: 220,
    sunPosition: [55, 6.5, -60],
    sunColor: '#ff5e36',
    sunIntensity: 2.2,
    ambientColor: '#f39c12',
    ambientIntensity: 0.8,
    bloomIntensity: 0.95,
    showStars: true,
    showMoon: false,
    showSun: true,
    saltSparkleIntensity: 1.5,
    description: 'Golden hour illuminating salt ridges in rose and amber tones as dusk falls.',
  },
  fullmoon: {
    id: 'fullmoon',
    name: '🌙 Full Moon Night',
    subtitle: 'Luminescent salt desert glowing under silver moonlight',
    skyTop: '#080e29',
    skyHorizon: '#16224f',
    groundTint: '#d8e1f5',
    accentColor: '#70a1ff',
    fogColor: '#0f1838',
    fogNear: 30,
    fogFar: 240,
    sunPosition: [-42, 36, -65], // Position of the moon
    sunColor: '#dce6ff',
    sunIntensity: 0.85,
    ambientColor: '#1c2854',
    ambientIntensity: 0.45,
    bloomIntensity: 1.35,
    showStars: true,
    showMoon: true,
    showSun: false,
    saltSparkleIntensity: 1.8,
    description: 'The magical phenomenon where the white salt catches lunar light and glows from beneath.',
  },
  festival: {
    id: 'festival',
    name: '🎪 Rann Utsav',
    subtitle: 'Carnival of folk music, Garba dance, & warm lanterns',
    skyTop: '#0f1533',
    skyHorizon: '#242a54',
    groundTint: '#e5dcce',
    accentColor: '#ffa502',
    fogColor: '#181e3d',
    fogNear: 25,
    fogFar: 210,
    sunPosition: [-35, 40, -55], // Moon position
    sunColor: '#dbe4ff',
    sunIntensity: 0.65,
    ambientColor: '#302b4d',
    ambientIntensity: 0.6,
    bloomIntensity: 1.45,
    showStars: true,
    showMoon: true,
    showSun: false,
    saltSparkleIntensity: 1.4,
    description: 'Vibrant winter cultural festival with glowing Swiss tents, Garba circle, and artisan stalls.',
  },
};

// ============================================================================
// Camera Stations & Interactive Viewpoints
// ============================================================================

export interface RannCameraStation {
  id: RannCameraMode;
  name: string;
  cameraPos: [number, number, number];
  lookAtPos: [number, number, number];
  fov: number;
}

export const RANN_CAMERA_STATIONS: Record<RannCameraMode, RannCameraStation> = {
  explore: {
    id: 'explore',
    name: '🚶 Desert View',
    cameraPos: [0, 3.4, 22],
    lookAtPos: [0, 2.0, -4],
    fov: 56,
  },
  watchtower: {
    id: 'watchtower',
    name: '🦅 Machan Horizon',
    cameraPos: [-18, 12.5, -4],
    lookAtPos: [10, 1.5, -25],
    fov: 62,
  },
  festival: {
    id: 'festival',
    name: '🎪 Cultural Stage',
    cameraPos: [0, 3.2, 18],
    lookAtPos: [0, 1.8, 8],
    fov: 54,
  },
  orbit: {
    id: 'orbit',
    name: '🔄 360° Orbit',
    cameraPos: [18, 14, 28],
    lookAtPos: [0, 1.5, 0],
    fov: 52,
  },
};

// ============================================================================
// Hotspots & Cultural Annotations
// ============================================================================

export interface RannHotspotSpec {
  id: string;
  title: string;
  category: 'Geology' | 'Architecture' | 'Culture' | 'Craft' | 'Wildlife';
  position: [number, number, number];
  description: string;
}

export const RANN_HOTSPOTS: RannHotspotSpec[] = [
  {
    id: 'salt-crust',
    title: 'The Great White Salt Crust',
    category: 'Geology',
    position: [12, 0.5, 6],
    description:
      'Spanning over 7,500 km², this ancient Arabian Sea inlet floods during monsoons and crystallizes under the desert sun into gleaming hexagonal salt polygons.',
  },
  {
    id: 'bhunga-lippan',
    title: 'Bhungas & Lippan Kaam',
    category: 'Architecture',
    position: [-16, 2.5, -8],
    description:
      'Traditional cylindrical mud huts designed to withstand seismic shocks and desert heat. The walls are embellished with Lippan Kaam — intricate clay and mirror relief murals.',
  },
  {
    id: 'agariya-pans',
    title: 'Agariya Salt Harvesting',
    category: 'Craft',
    position: [24, 1.2, 4],
    description:
      'Generations of Agariya salt-workers pump underground brine into shallow pans, raking the crystals as they dry into shimmering white salt mounds.',
  },
  {
    id: 'camel-caravan',
    title: 'Kachchhi Camel Caravan',
    category: 'Culture',
    position: [-5, 2.8, 12],
    description:
      'The hardy single-humped camel of Kutch, decorated with hand-knotted Gorband chest harnesses, brass bells, and mirror-work saddles.',
  },
  {
    id: 'garba-stage',
    title: 'Garba & Kutchi Folk Music',
    category: 'Culture',
    position: [0, 2.2, 10],
    description:
      'Dancers swirl around the campfire in mirror-embroidered Chaniya Cholis, accompanied by the hypnotic rhythms of Dholak, Kani bamboo flutes, and the Surando fiddle.',
  },
  {
    id: 'machan-tower',
    title: 'Machan Observation Deck',
    category: 'Architecture',
    position: [-22, 9.0, -6],
    description:
      'A multi-tier timber watchtower offering uninterrupted 360-degree vistas across the boundless white desert where earth seamlessly touches sky.',
  },
  {
    id: 'artisan-haat',
    title: 'Kutch Artisan Bazaar',
    category: 'Craft',
    position: [14, 2.0, -14],
    description:
      'Celebrated UNESCO crafts including 400-year-old Rogan castor-oil painting, Ajrakh block printing, bell making, and Rabari needlework.',
  },
];

// ============================================================================
// Procedural Geometry & Layout Generators
// ============================================================================

/**
 * Procedural specs for the 7 Bhunga huts in the hamlet cluster.
 */
export interface BhungaSpec {
  id: string;
  position: [number, number, number];
  radius: number;
  wallHeight: number;
  roofHeight: number;
  rotationY: number;
  hasOtla: boolean;
  mirrorBandColor: string;
  hasCharpai: boolean;
}

export function makeBhungaHamlet(): BhungaSpec[] {
  return [
    {
      id: 'bhunga-main',
      position: [-16, 0, -8],
      radius: 1.6,
      wallHeight: 2.1,
      roofHeight: 2.2,
      rotationY: 0.35,
      hasOtla: true,
      mirrorBandColor: '#f7f1e3',
      hasCharpai: true,
    },
    {
      id: 'bhunga-north',
      position: [-22, 0, -14],
      radius: 1.35,
      wallHeight: 1.9,
      roofHeight: 2.0,
      rotationY: 0.7,
      hasOtla: true,
      mirrorBandColor: '#fffae6',
      hasCharpai: false,
    },
    {
      id: 'bhunga-west',
      position: [-25, 0, -6],
      radius: 1.45,
      wallHeight: 2.0,
      roofHeight: 2.1,
      rotationY: -0.2,
      hasOtla: false,
      mirrorBandColor: '#f1f2f6',
      hasCharpai: true,
    },
    {
      id: 'bhunga-south',
      position: [-19, 0, 0],
      radius: 1.3,
      wallHeight: 1.85,
      roofHeight: 1.9,
      rotationY: 1.1,
      hasOtla: true,
      mirrorBandColor: '#f7f1e3',
      hasCharpai: false,
    },
    {
      id: 'bhunga-east',
      position: [-11, 0, -14],
      radius: 1.4,
      wallHeight: 1.95,
      roofHeight: 2.05,
      rotationY: -0.6,
      hasOtla: false,
      mirrorBandColor: '#fffae6',
      hasCharpai: false,
    },
    {
      id: 'bhunga-workshop',
      position: [-13, 0, -2],
      radius: 1.25,
      wallHeight: 1.8,
      roofHeight: 1.8,
      rotationY: 0.1,
      hasOtla: true,
      mirrorBandColor: '#f7f1e3',
      hasCharpai: true,
    },
    {
      id: 'bhunga-store',
      position: [-28, 0, -12],
      radius: 1.2,
      wallHeight: 1.75,
      roofHeight: 1.8,
      rotationY: 0.85,
      hasOtla: false,
      mirrorBandColor: '#e4dcd3',
      hasCharpai: false,
    },
  ];
}

/**
 * Geometric mirror positions for Lippan Kaam around a cylindrical bhunga wall.
 */
export interface LippanMirrorSpec {
  position: [number, number, number];
  rotation: [number, number, number];
  size: number;
}

export function makeLippanMirrors(radius: number, height: number): LippanMirrorSpec[] {
  const mirrors: LippanMirrorSpec[] = [];
  const count = 16;
  const yBands = [height * 0.45, height * 0.65, height * 0.82];

  yBands.forEach((y, bandIdx) => {
    for (let i = 0; i < count; i++) {
      // Exclude doorway (around angle 0)
      const a = (i / count) * Math.PI * 2;
      if (Math.abs(a - Math.PI / 2) < 0.35) continue; // Door opening angle
      const r = radius + 0.02;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      mirrors.push({
        position: [x, y, z],
        rotation: [0, -a + Math.PI / 2, bandIdx % 2 === 0 ? Math.PI / 4 : 0],
        size: bandIdx === 1 ? 0.08 : 0.06,
      });
    }
  });

  return mirrors;
}

/**
 * Procedural specs for the Agariya Salt Pan beds and harvest mounds.
 */
export interface SaltPanSpec {
  id: string;
  position: [number, number, number];
  width: number;
  length: number;
  brineColor: string;
  waterLevel: number;
}

export function makeSaltPans(): SaltPanSpec[] {
  const pans: SaltPanSpec[] = [];
  const BRINE_COLORS = [
    '#95afc0', // Clear pale brine
    '#70a1ff', // Aquamarine sky reflection
    '#57606f', // Deep mineral brine
    '#e17055', // Halophilic algae pink/copper
    '#6ab04c', // Mineral green brine
    '#7ed6df', // Turquoise shallow brine
  ];

  let idx = 0;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      pans.push({
        id: `pan-${r}-${c}`,
        position: [18 + c * 6.5, 0, 6 - r * 6.5],
        width: 5.8,
        length: 5.8,
        brineColor: BRINE_COLORS[idx % BRINE_COLORS.length],
        waterLevel: 0.16,
      });
      idx++;
    }
  }
  return pans;
}

/**
 * Harvested salt crystal mounds (Khandi pyramids).
 */
export interface SaltMoundSpec {
  position: [number, number, number];
  radius: number;
  height: number;
  rotationY: number;
}

export function makeSaltMounds(): SaltMoundSpec[] {
  const mounds: SaltMoundSpec[] = [];
  const count = 28;

  for (let i = 0; i < count; i++) {
    const a = (i * 137.5 * Math.PI) / 180;
    const r = 5 + ((i * 17) % 18);
    const x = 28 + Math.cos(a) * r;
    const z = -2 + Math.sin(a) * (r * 0.7);
    mounds.push({
      position: [x, 0, z],
      radius: 0.7 + ((i * 13) % 7) * 0.1,
      height: 1.1 + ((i * 11) % 5) * 0.22,
      rotationY: ((i * 45) * Math.PI) / 180,
    });
  }
  return mounds;
}

/**
 * Procedural specs for the Maldhari Camel Caravan.
 */
export interface CamelSpec {
  id: string;
  position: [number, number, number];
  rotationY: number;
  scale: number;
  hasRider: boolean;
  decorated: boolean;
  tasselColor: string;
  saddlePattern: string;
}

export function makeCaravanCamels(): CamelSpec[] {
  const TASSELS = ['#e74c3c', '#f1c40f', '#3498db', '#9b59b6', '#e67e22'];

  return [
    {
      id: 'camel-lead',
      position: [8, 0, 14],
      rotationY: -0.4,
      scale: 1.05,
      hasRider: true,
      decorated: true,
      tasselColor: TASSELS[0],
      saddlePattern: '#c0392b',
    },
    {
      id: 'camel-2',
      position: [4, 0, 16],
      rotationY: -0.38,
      scale: 0.98,
      hasRider: false,
      decorated: true,
      tasselColor: TASSELS[1],
      saddlePattern: '#2980b9',
    },
    {
      id: 'camel-3',
      position: [0, 0, 17.5],
      rotationY: -0.36,
      scale: 1.0,
      hasRider: true,
      decorated: true,
      tasselColor: TASSELS[2],
      saddlePattern: '#27ae60',
    },
    {
      id: 'camel-4',
      position: [-4, 0, 19],
      rotationY: -0.35,
      scale: 0.95,
      hasRider: false,
      decorated: true,
      tasselColor: TASSELS[3],
      saddlePattern: '#d35400',
    },
    {
      id: 'camel-cart-draft',
      position: [-10, 0, 16],
      rotationY: 0.25,
      scale: 1.02,
      hasRider: true,
      decorated: true,
      tasselColor: TASSELS[4],
      saddlePattern: '#8e44ad',
    },
  ];
}

/**
 * Tent City layout for the Rann Utsav luxury Swiss cottage tents.
 */
export interface TentSpec {
  id: string;
  position: [number, number, number];
  rotationY: number;
  kind: 'swiss' | 'pavilion' | 'royal';
  roofColor: string;
  trimColor: string;
}

export function makeFestivalTents(): TentSpec[] {
  const tents: TentSpec[] = [];
  const ROOFS = ['#b33927', '#227093', '#2c2c54', '#cd6133', '#40407a'];
  const TRIMS = ['#ffb142', '#ffd32a', '#fffa65', '#f7f1e3'];

  // Two grand crescent rows
  for (let i = 0; i < 18; i++) {
    const row = Math.floor(i / 9);
    const col = i % 9;
    const angle = ((col - 4) * 11 * Math.PI) / 180;
    const radius = 26 + row * 8;
    const x = Math.sin(angle) * radius;
    const z = -14 - Math.cos(angle) * radius;

    tents.push({
      id: `tent-${row}-${col}`,
      position: [x, 0, z],
      rotationY: -angle,
      kind: col === 4 && row === 0 ? 'royal' : i % 3 === 0 ? 'pavilion' : 'swiss',
      roofColor: ROOFS[i % ROOFS.length],
      trimColor: TRIMS[i % TRIMS.length],
    });
  }

  return tents;
}

/**
 * Garba folk dancers in a circular dance formation.
 */
export interface GarbaDancerSpec {
  id: string;
  position: [number, number, number];
  rotationY: number;
  skirtColor: string;
  dupattaColor: string;
  holdingDandiya: boolean;
}

export function makeGarbaDancers(count = 14, radius = 5.2): GarbaDancerSpec[] {
  const SKIRTS = ['#e84118', '#fbc531', '#4cd137', '#00a8ff', '#9c88ff', '#e056fd', '#ff6b81'];
  const DUPATTAS = ['#ffd32a', '#ff3838', '#2ed573', '#1e90ff', '#ff9ff3'];

  const dancers: GarbaDancerSpec[] = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const x = Math.cos(a) * radius;
    const z = 8 + Math.sin(a) * radius;
    dancers.push({
      id: `dancer-${i}`,
      position: [x, 0.75, z],
      rotationY: -a + Math.PI / 2 + 0.3, // facing tangential / towards center
      skirtColor: SKIRTS[i % SKIRTS.length],
      dupattaColor: DUPATTAS[i % DUPATTAS.length],
      holdingDandiya: i % 2 === 0,
    });
  }
  return dancers;
}

/**
 * Traditional Kutchi folk musicians seated on stage.
 */
export interface MusicianSpec {
  id: string;
  instrument: 'dholak' | 'kani' | 'surando' | 'morchang' | 'manjira';
  position: [number, number, number];
  rotationY: number;
  turbanColor: string;
}

export function makeFolkMusicians(): MusicianSpec[] {
  return [
    { id: 'mus-dholak', instrument: 'dholak', position: [-2.2, 0.65, 8.2], rotationY: 0.6, turbanColor: '#e74c3c' },
    { id: 'mus-flute', instrument: 'kani', position: [-1.2, 0.65, 9.4], rotationY: 0.3, turbanColor: '#f39c12' },
    { id: 'mus-surando', instrument: 'surando', position: [1.2, 0.65, 9.4], rotationY: -0.3, turbanColor: '#e67e22' },
    { id: 'mus-morchang', instrument: 'morchang', position: [2.2, 0.65, 8.2], rotationY: -0.6, turbanColor: '#c0392b' },
    { id: 'mus-manjira', instrument: 'manjira', position: [0, 0.65, 10.2], rotationY: 0, turbanColor: '#d35400' },
  ];
}

/**
 * Artisan Bazaar Craft Stalls specs.
 */
export interface CraftStallSpec {
  id: string;
  craft: 'Rogan Art' | 'Embroidery' | 'Kutchi Bells' | 'Leather Mojri';
  position: [number, number, number];
  rotationY: number;
  canopyColor: string;
  accentColor: string;
}

export function makeCraftBazaarStalls(): CraftStallSpec[] {
  return [
    {
      id: 'stall-rogan',
      craft: 'Rogan Art',
      position: [12, 0, -12],
      rotationY: -0.5,
      canopyColor: '#c0392b',
      accentColor: '#f1c40f',
    },
    {
      id: 'stall-embroidery',
      craft: 'Embroidery',
      position: [18, 0, -10],
      rotationY: -0.4,
      canopyColor: '#2980b9',
      accentColor: '#e74c3c',
    },
    {
      id: 'stall-bells',
      craft: 'Kutchi Bells',
      position: [14, 0, -18],
      rotationY: -0.6,
      canopyColor: '#d35400',
      accentColor: '#f39c12',
    },
    {
      id: 'stall-mojri',
      craft: 'Leather Mojri',
      position: [20, 0, -16],
      rotationY: -0.45,
      canopyColor: '#27ae60',
      accentColor: '#f1c40f',
    },
  ];
}

/**
 * Procedural fairy light string catenary points.
 */
export interface FairyLightRowSpec {
  poles: [number, number, number][];
  bulbs: [number, number, number][];
}

export function makeFairyLightStrings(): FairyLightRowSpec[] {
  const rows: FairyLightRowSpec[] = [];
  const spans = [
    { z: 2, xStart: -24, xEnd: 24, poleCount: 7, height: 4.8, sag: 1.4 },
    { z: -4, xStart: -28, xEnd: 28, poleCount: 8, height: 5.0, sag: 1.5 },
    { z: -10, xStart: -32, xEnd: 32, poleCount: 9, height: 5.2, sag: 1.6 },
    { z: 14, xStart: -16, xEnd: 16, poleCount: 5, height: 4.4, sag: 1.2 },
  ];

  spans.forEach((span) => {
    const poles: [number, number, number][] = [];
    const bulbs: [number, number, number][] = [];
    const step = (span.xEnd - span.xStart) / (span.poleCount - 1);

    for (let p = 0; p < span.poleCount; p++) {
      const px = span.xStart + p * step;
      poles.push([px, span.height / 2, span.z]);
    }

    for (let p = 0; p < span.poleCount - 1; p++) {
      const [x0] = poles[p];
      const [x1] = poles[p + 1];
      const segments = 10;
      for (let k = 1; k < segments; k++) {
        const t = k / segments;
        const x = x0 + (x1 - x0) * t;
        // Catenary parabolic sag formula
        const y = span.height - span.sag * (1 - Math.pow(2 * t - 1, 2));
        bulbs.push([x, y, span.z]);
      }
    }

    rows.push({ poles, bulbs });
  });

  return rows;
}
