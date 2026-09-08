/**
 * Single source of truth for the Rani Ki Vav (The Queen's Stepwell) 3D scene.
 * Defines the 7-storey inverted temple architecture, Solanki/Maru-Gurjara pillar grids,
 * stepped pavilion mandapas, carved niche sculptures (Dashavatara, Apsaras, Sheshashayi Vishnu),
 * interlocking pyramidal chevron steps, deep circular well shaft (Kupa), archaeological park,
 * dynamic lighting presets, and interactive hotspots.
 */

export const RANI_PLACE_ID = 'rani-ki-vav';

export const STONE = {
  base: '#ad8753',       // Golden-ochre Patan sandstone
  carving: '#c99f66',    // Highlighted sculpted relief
  dark: '#75542e',       // Deep recessed niche shadow stone
  patina: '#5c634c',     // Subterranean moss/mineral patina near water table
  lintel: '#96713e',     // Heavy structural beams and cornices
  step: '#9e7947',       // Stepped tread sandstone
  pillar: '#b8905b',     // Ornate column sandstone
  floor: '#8e6c3d',      // Terrace paving slabs
  mortar: '#634928',     // Deep stone joints
  ground: '#617043',     // Surrounding lush archaeological lawn
  path: '#c2a578',       // Archaeological park gravel walkways
  border: '#8f7048',     // Perimeter stone wall
  gold: '#dfb158',       // Temple finials & bronze kalashas
};

export const WATER_COLORS = {
  day: {
    color: '#0e2d36',
    highlight: '#4ebbb0',
    amplitude: 0.04,
    opacity: 0.92,
  },
  dawn: {
    color: '#122530',
    highlight: '#d49b65',
    amplitude: 0.03,
    opacity: 0.94,
  },
  night: {
    color: '#07151a',
    highlight: '#ff9838',
    amplitude: 0.02,
    opacity: 0.96,
  },
};

export type RaniTimeOfDay = 'day' | 'dawn' | 'night';
export type RaniCameraMode = 'descent' | 'orbit' | 'promenade';

export interface LightingPreset {
  id: RaniTimeOfDay;
  label: string;
  sunPosition: [number, number, number];
  sunColor: string;
  sunIntensity: number;
  ambientColor: string;
  ambientIntensity: number;
  skyTop: string;
  skyBottom: string;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  bloomIntensity: number;
  godRayOpacity: number;
  torchIntensity: number;
}

export const LIGHTING_PRESETS: Record<RaniTimeOfDay, LightingPreset> = {
  day: {
    id: 'day',
    label: 'Golden Sun',
    sunPosition: [12, 42, 28],
    sunColor: '#fff1d6',
    sunIntensity: 1.85,
    ambientColor: '#d6b885',
    ambientIntensity: 0.65,
    skyTop: '#c9a868',
    skyBottom: '#f0dfbe',
    fogColor: '#473623',
    fogNear: 22,
    fogFar: 110,
    bloomIntensity: 0.6,
    godRayOpacity: 0.18,
    torchIntensity: 0.0,
  },
  dawn: {
    id: 'dawn',
    label: 'Dawn Mist',
    sunPosition: [4, 18, 48],
    sunColor: '#fcd3a2',
    sunIntensity: 1.45,
    ambientColor: '#9ba0a8',
    ambientIntensity: 0.5,
    skyTop: '#d49b80',
    skyBottom: '#fad6b6',
    fogColor: '#3a2e2c',
    fogNear: 16,
    fogFar: 95,
    bloomIntensity: 0.85,
    godRayOpacity: 0.28,
    torchIntensity: 0.35,
  },
  night: {
    id: 'night',
    label: 'Night Aarti',
    sunPosition: [-8, 25, -15],
    sunColor: '#406085',
    sunIntensity: 0.25,
    ambientColor: '#1a2233',
    ambientIntensity: 0.22,
    skyTop: '#101726',
    skyBottom: '#222d42',
    fogColor: '#0c1017',
    fogNear: 14,
    fogFar: 85,
    bloomIntensity: 1.15,
    godRayOpacity: 0.04,
    torchIntensity: 1.6,
  },
};

/** Dimensions and scaling for the 7 storeys */
export const STOREY_COUNT = 7;
export const MAX_LEVEL = STOREY_COUNT - 1; // 0..6
export const LEVEL_DROP = 3.1;             // Vertical depth per level
export const LEVEL_RUN = 5.6;              // Horizontal distance per level
export const TRENCH_HALF_WIDTH = 5.2;      // Half-width of main stepped corridor
export const UPPER_HALF_WIDTH = 6.8;       // Half-width of upper ground retaining wall

export const WELL_SHAFT = {
  radius: 4.8,
  depth: 26.0,
  centerZ: -STOREY_COUNT * LEVEL_RUN + 2.5, // Z = -36.7
  topY: 1.5,
  waterY: -STOREY_COUNT * LEVEL_DROP - 1.2, // Y = -22.9
  tierCount: 5,
  bracketCount: 16,
};

/** Calculates central coordinates [x, y, z] for a given level (0..6) */
export function levelCenter(levelIndex: number): [number, number, number] {
  const y = levelIndex === 0 ? 0 : -levelIndex * LEVEL_DROP;
  return [0, y, -levelIndex * LEVEL_RUN + 8];
}

/** Camera viewpoints for each descent level */
export interface CameraFocus {
  level: number;
  name: string;
  subtitle: string;
  description: string;
  cameraPos: [number, number, number];
  lookAtPos: [number, number, number];
  keyFeature: string;
}

export const DESCENT_STATIONS: CameraFocus[] = [
  {
    level: 0,
    name: 'Level 1: Ground Plaza & Torana Entry',
    subtitle: 'Gateway to the Inverted Temple',
    description: 'The monumental entrance portal framed by carved Solanki torana pillars and the vast park lawns of ancient Patan.',
    cameraPos: [0, 6.8, 25.5],
    lookAtPos: [0, 0.8, 9.0],
    keyFeature: 'Ornate entrance torana and initial grand stepped descent',
  },
  {
    level: 1,
    name: 'Level 2: The Upper Gallery & Dikpalas',
    subtitle: 'Guardians of the Eight Directions',
    description: 'First subterranean pillared gallery. The side walls feature Dikpala deities guarding the sacred descent.',
    cameraPos: [-2.0, 3.2, 17.5],
    lookAtPos: [0, -2.4, 4.0],
    keyFeature: 'Single-tiered Mandapa pavilion and Dikpala niche panels',
  },
  {
    level: 2,
    name: 'Level 3: Dashavatara — Varaha & Kurma',
    subtitle: 'The Cosmic Boar & Tortoise Avatars',
    description: 'Carvings of Lord Vishnu incarnating as Varaha to lift the earth goddess Bhudevi from the primordial deluge.',
    cameraPos: [2.8, 0.2, 11.0],
    lookAtPos: [-2.2, -5.5, 0.0],
    keyFeature: 'Two-tier Mandapa tower and Varaha lifting Bhudevi',
  },
  {
    level: 3,
    name: 'Level 4: Apsaras & Solah Shringar',
    subtitle: 'The Celestial Maidens of Solanki Art',
    description: 'Surasundaris engaged in 16 classical acts of embellishment: applying kohl, holding mirrors, and adjusting ringing anklets.',
    cameraPos: [-2.8, -3.0, 5.2],
    lookAtPos: [2.2, -8.5, -5.5],
    keyFeature: 'Three-tier Mandapa and Darpana Sundari mirror carving',
  },
  {
    level: 4,
    name: 'Level 5: Narasimha & Vamana Avatars',
    subtitle: 'The Divine Deliverers',
    description: 'Intricate high-relief panels depicting Narasimha breaking the pillars of ego and Vamana measuring the cosmos in three strides.',
    cameraPos: [2.4, -6.0, -0.5],
    lookAtPos: [-2.2, -11.5, -11.5],
    keyFeature: 'Four-tier Mandapa structure and interlocking chevron step arrays',
  },
  {
    level: 5,
    name: 'Level 6: Nagakanyas & Sacred Jaalis',
    subtitle: 'Serpent Maidens of the Deep Waters',
    description: 'Nagakanyas with coiling serpent tails guarding the cool subterranean galleries alongside geometric sandstone jaali screens.',
    cameraPos: [-2.4, -9.0, -6.5],
    lookAtPos: [2.2, -14.5, -17.5],
    keyFeature: 'Multi-tiered colonnades and Nagakanya serpent canopies',
  },
  {
    level: 6,
    name: 'Level 7: Sheshashayi Vishnu & Well Shaft',
    subtitle: 'The Lord Reclining on the Cosmic Serpent',
    description: 'The sacred heart of the inverted temple. Vishnu reclines on the thousand-headed serpent Ananta above the still emerald water.',
    cameraPos: [0, -13.0, -14.0],
    lookAtPos: [0, -17.5, -25.5],
    keyFeature: 'Colossal Sheshashayi Vishnu panel and the 30-metre circular well shaft',
  },
];

/** Hotspot marker specifications */
export interface HotspotSpec {
  id: string;
  title: string;
  category: 'architecture' | 'mythology' | 'craftsmanship';
  level: number;
  position: [number, number, number];
  description: string;
}

export const RANI_HOTSPOTS: HotspotSpec[] = [
  {
    id: 'torana-entry',
    title: 'Solanki Torana Gateway',
    category: 'architecture',
    level: 0,
    position: [-2.9, 4.8, 17.5],
    description: 'The monumental entrance torana featuring pot-and-foliage pillars and a cusped archway welcoming pilgrims into the descent.',
  },
  {
    id: 'mandapa-pavilion',
    title: 'Multi-Tiered Mandapa Pavilion',
    category: 'architecture',
    level: 2,
    position: [0, -3.2, 2.5],
    description: 'Open pillared pavilions (kirti-stambhas) that provide cross-bracing against the immense subterranean earth pressure.',
  },
  {
    id: 'varaha-niche',
    title: 'Varaha Avatar of Vishnu',
    category: 'mythology',
    level: 2,
    position: [-4.6, -4.8, 1.2],
    description: 'The third incarnation of Vishnu as a cosmic boar, gently carrying Goddess Bhudevi (Earth) safely upon his tusk.',
  },
  {
    id: 'apsara-mirror',
    title: 'Apsara with Mirror (Darpana Sundari)',
    category: 'craftsmanship',
    level: 3,
    position: [4.6, -7.8, -4.5],
    description: 'One of Rani Ki Vav’s famous celestial dancers (Surasundari) admiring her reflection in a hand mirror with delicate jewellery.',
  },
  {
    id: 'narasimha-niche',
    title: 'Narasimha Slaying Hiranyakashipu',
    category: 'mythology',
    level: 4,
    position: [-4.6, -11.0, -10.2],
    description: 'The fourth avatar of Vishnu as the fierce half-man half-lion incarnating at twilight to vanquish tyranny.',
  },
  {
    id: 'chevron-steps',
    title: 'Solanki Pyramidal Chevron Steps',
    category: 'architecture',
    level: 4,
    position: [3.8, -12.5, -11.5],
    description: 'Distinctive interlocking triangular stair cascades allowing pilgrims to navigate between terrace levels at varying water heights.',
  },
  {
    id: 'sheshashayi-vishnu',
    title: 'Sheshashayi Vishnu on Ananta',
    category: 'mythology',
    level: 6,
    position: [0, -16.8, -22.5],
    description: 'The climax of the stepwell: Lord Vishnu reclining on the multi-headed serpent Sheshanaga amid cosmic waters, with Lakshmi at his feet.',
  },
  {
    id: 'circular-well-kupa',
    title: 'The Great Circular Well Shaft (Kupa)',
    category: 'architecture',
    level: 6,
    position: [0, -10.5, WELL_SHAFT.centerZ],
    description: 'The monumental 30-metre circular shaft ringed with bracketed cantilever balconies, dropping into the clear water table.',
  },
];

/** Pillar generator for Mandapa pavilions */
export interface PillarSpec {
  id: string;
  position: [number, number, number];
  height: number;
  radius: number;
  tier: number;
}

export function makeMandapaPillars(): PillarSpec[] {
  const pillars: PillarSpec[] = [];
  
  // Create multi-tier pillar bays at each terrace boundary
  for (let lvl = 1; lvl < STOREY_COUNT; lvl++) {
    const [, cy, cz] = levelCenter(lvl);
    const tierCount = Math.min(lvl, 4); // upper pavilions have more tiers
    const pz = cz + LEVEL_RUN * 0.45;
    
    // 4 to 6 pillars across the span
    const xOffsets = [-3.8, -1.9, 1.9, 3.8];
    for (let t = 0; t < tierCount; t++) {
      const py = cy + t * 3.2 + 1.6;
      for (let xi = 0; xi < xOffsets.length; xi++) {
        pillars.push({
          id: `p-${lvl}-${t}-${xi}`,
          position: [xOffsets[xi], py, pz],
          height: 3.1,
          radius: 0.28,
          tier: t,
        });
      }
    }
  }

  // Entrance Torana Pillars (Level 0)
  const [, eY, eZ] = levelCenter(0);
  pillars.push(
    { id: 'torana-p-l', position: [-2.4, eY + 2.5, eZ + 8.5], height: 5.0, radius: 0.38, tier: 0 },
    { id: 'torana-p-r', position: [2.4, eY + 2.5, eZ + 8.5], height: 5.0, radius: 0.38, tier: 0 },
  );

  return pillars;
}

/** Horizontal beam / lintel structures for pavilions */
export interface LintelSpec {
  position: [number, number, number];
  size: [number, number, number];
}

export function makeMandapaLintels(): LintelSpec[] {
  const lintels: LintelSpec[] = [];
  
  for (let lvl = 1; lvl < STOREY_COUNT; lvl++) {
    const [, cy, cz] = levelCenter(lvl);
    const tierCount = Math.min(lvl, 4);
    const pz = cz + LEVEL_RUN * 0.45;
    
    for (let t = 0; t < tierCount; t++) {
      const py = cy + t * 3.2 + 3.15;
      // Main cross beam across the trench
      lintels.push({
        position: [0, py, pz],
        size: [TRENCH_HALF_WIDTH * 2 - 0.2, 0.45, 0.7],
      });
      // Cornice eave over the beam
      lintels.push({
        position: [0, py + 0.3, pz],
        size: [TRENCH_HALF_WIDTH * 2 + 0.4, 0.2, 1.1],
      });
    }
  }

  // Entrance Torana Architraves
  const [, eY, eZ] = levelCenter(0);
  lintels.push(
    { position: [0, eY + 5.2, eZ + 8.5], size: [6.2, 0.55, 0.9] },
    { position: [0, eY + 5.7, eZ + 8.5], size: [5.4, 0.4, 0.7] },
  );

  return lintels;
}

/** Carved Niche Figure specifications for the 7 storeys */
export interface NicheFigureSpec {
  id: string;
  deity: string;
  side: -1 | 1;
  level: number;
  position: [number, number, number];
  rotationY: number;
  sculptureType: 'avatar' | 'apsara' | 'deity' | 'nagakanya' | 'dikpala';
}

export function makeNicheFigures(): NicheFigureSpec[] {
  const figures: NicheFigureSpec[] = [];

  const deitiesByLevel: { [lvl: number]: { left: string[]; right: string[]; type: NicheFigureSpec['sculptureType'] } } = {
    0: {
      left: ['Indra (Lord of Heavens)', 'Agni (Fire Deity)', 'Yama (Lord of Justice)'],
      right: ['Varuna (Water Guardian)', 'Vayu (Wind Deity)', 'Kubera (Lord of Wealth)'],
      type: 'dikpala',
    },
    1: {
      left: ['Matsya Avatar (The Fish)', 'Kurma Avatar (The Tortoise)', 'Padmavati Devi'],
      right: ['Surasundari with Mirror', 'Apsara with Kohl', 'Alasa Kanya'],
      type: 'avatar',
    },
    2: {
      left: ['Varaha (Boar Avatar lifting Earth)', 'Brahmani Devi', 'Maheshwari Devi'],
      right: ['Apsara applying Anjana', 'Darpana Sundari', 'Nupura Padika (Anklet)'],
      type: 'avatar',
    },
    3: {
      left: ['Narasimha (Man-Lion Avatar)', 'Vamana (Dwarf Avatar)', 'Parashurama (Axe Bearer)'],
      right: ['Apsara with Parrot', 'Karpura Manjari', 'Mugdha Apsara'],
      type: 'apsara',
    },
    4: {
      left: ['Lord Rama with Bow', 'Balarama with Plough', 'Lord Krishna with Flute'],
      right: ['Buddha Avatar', 'Kalki with Sword & Steed', 'Chamunda Devi'],
      type: 'avatar',
    },
    5: {
      left: ['Mahishasuramardini (Durga)', 'Bhairava with Trishul', 'Surya (Sun God)'],
      right: ['Nagakanya with Serpent Canopy', 'Yogini with Lotus', 'Ganesha Guardian'],
      type: 'nagakanya',
    },
    6: {
      left: ['Ashta-Vasu Guardian', 'Sheshashayi Vishnu Retinue', 'Lakshmi Narayana'],
      right: ['Garuda Vahana', 'Brahma on Lotus', 'Saraswati with Veena'],
      type: 'deity',
    },
  };

  for (let lvl = 0; lvl < STOREY_COUNT; lvl++) {
    const [, cy, cz] = levelCenter(lvl);
    const lvlData = deitiesByLevel[lvl];
    if (!lvlData) continue;

    // Left wall niches
    for (let n = 0; n < lvlData.left.length; n++) {
      const zOffset = (n - 1) * 1.55;
      figures.push({
        id: `niche-${lvl}-L-${n}`,
        deity: lvlData.left[n],
        side: -1,
        level: lvl,
        position: [-TRENCH_HALF_WIDTH + 0.42, cy + 1.45, cz + zOffset],
        rotationY: Math.PI / 2,
        sculptureType: lvlData.type,
      });
    }

    // Right wall niches
    for (let n = 0; n < lvlData.right.length; n++) {
      const zOffset = (n - 1) * 1.55;
      figures.push({
        id: `niche-${lvl}-R-${n}`,
        deity: lvlData.right[n],
        side: 1,
        level: lvl,
        position: [TRENCH_HALF_WIDTH - 0.42, cy + 1.45, cz + zOffset],
        rotationY: -Math.PI / 2,
        sculptureType: lvlData.type,
      });
    }
  }

  return figures;
}

/** Interlocking Pyramidal / Chevron Steps */
export interface StepFlightSpec {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
  rotationY?: number;
}

export function makeSolankiStepCascades(): StepFlightSpec[] {
  const steps: StepFlightSpec[] = [];

  for (let lvl = 0; lvl < STOREY_COUNT - 1; lvl++) {
    const [, cy, cz] = levelCenter(lvl);
    const stepCount = 6;
    const dy = LEVEL_DROP / stepCount;
    const dz = (LEVEL_RUN * 0.45) / stepCount;

    // Central grand flight of stairs
    for (let s = 0; s < stepCount; s++) {
      steps.push({
        id: `step-main-${lvl}-${s}`,
        position: [0, cy - (s + 0.5) * dy, cz - LEVEL_RUN * 0.28 - s * dz],
        size: [TRENCH_HALF_WIDTH * 1.35, dy * 1.05, dz * 1.15],
      });
    }

    // Flanking pyramidal / chevron side step triangles
    for (const side of [-1, 1] as const) {
      for (let s = 0; s < 4; s++) {
        const stepWidth = 1.4 - s * 0.25;
        steps.push({
          id: `step-flank-${lvl}-${side}-${s}`,
          position: [
            side * (TRENCH_HALF_WIDTH - 1.1 + s * 0.18),
            cy - (s + 1) * (dy * 0.85),
            cz - LEVEL_RUN * 0.15 - s * 0.55,
          ],
          size: [stepWidth, dy * 0.85, 0.65],
          rotationY: side * 0.22,
        });
      }
    }
  }

  return steps;
}

/** Elephant frieze (Gajathara) bas-relief along the wall bases */
export function makeElephantFriezes(): { position: [number, number, number]; rotationY: number }[] {
  const friezes: { position: [number, number, number]; rotationY: number }[] = [];

  for (let lvl = 0; lvl < STOREY_COUNT; lvl++) {
    const [, cy, cz] = levelCenter(lvl);
    for (const side of [-1, 1] as const) {
      for (let i = 0; i < 7; i++) {
        friezes.push({
          position: [side * (TRENCH_HALF_WIDTH - 0.25), cy + 0.35, cz + (i - 3) * 0.82],
          rotationY: side > 0 ? -Math.PI / 2 : Math.PI / 2,
        });
      }
    }
  }

  return friezes;
}

/** Torchlight and Diya oil lamp positions */
export interface DiyaLampSpec {
  id: string;
  position: [number, number, number];
  color: string;
  intensity: number;
}

export function makeDiyaLamps(): DiyaLampSpec[] {
  const lamps: DiyaLampSpec[] = [];

  // Lamps along terrace landings
  for (let lvl = 0; lvl < STOREY_COUNT; lvl++) {
    const [, cy, cz] = levelCenter(lvl);
    for (const side of [-1, 1] as const) {
      lamps.push({
        id: `diya-landing-${lvl}-${side}`,
        position: [side * (TRENCH_HALF_WIDTH - 0.8), cy + 0.25, cz],
        color: '#ffaa3b',
        intensity: 1.2,
      });
      // Lamps on pillar capitals
      lamps.push({
        id: `diya-pillar-${lvl}-${side}`,
        position: [side * (TRENCH_HALF_WIDTH - 1.4), cy + 3.3, cz + LEVEL_RUN * 0.45],
        color: '#ff9020',
        intensity: 1.5,
      });
    }
  }

  // Sacred Sanctum lamps around Sheshashayi Vishnu
  const [, vy, vz] = levelCenter(6);
  lamps.push(
    { id: 'diya-sanctum-1', position: [-2.2, vy + 0.4, vz - 2.8], color: '#ffb040', intensity: 2.2 },
    { id: 'diya-sanctum-2', position: [2.2, vy + 0.4, vz - 2.8], color: '#ffb040', intensity: 2.2 },
    { id: 'diya-sanctum-c', position: [0, vy + 3.2, vz - 3.4], color: '#ffd060', intensity: 2.8 },
  );

  // Well shaft gallery lamps
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    lamps.push({
      id: `diya-well-${i}`,
      position: [
        Math.cos(a) * (WELL_SHAFT.radius - 0.4),
        WELL_SHAFT.waterY + 3.0,
        WELL_SHAFT.centerZ + Math.sin(a) * (WELL_SHAFT.radius - 0.4),
      ],
      color: '#ff9830',
      intensity: 1.6,
    });
  }

  return lamps;
}

/** Surrounding Archaeological Park trees and benches */
export interface TreeSpec {
  position: [number, number, number];
  scale: number;
}

export function makeParkTrees(): TreeSpec[] {
  const trees: TreeSpec[] = [
    // North side lawns
    { position: [-14, 0, 16], scale: 1.2 },
    { position: [-16, 0, 6], scale: 1.4 },
    { position: [-15, 0, -6], scale: 1.1 },
    { position: [-17, 0, -18], scale: 1.3 },
    { position: [-14, 0, -28], scale: 1.25 },
    // South side lawns
    { position: [14, 0, 18], scale: 1.3 },
    { position: [16, 0, 8], scale: 1.15 },
    { position: [15, 0, -4], scale: 1.4 },
    { position: [17, 0, -16], scale: 1.2 },
    { position: [15, 0, -26], scale: 1.35 },
    // East entrance trees
    { position: [-8, 0, 26], scale: 1.1 },
    { position: [8, 0, 27], scale: 1.15 },
    { position: [0, 0, 32], scale: 1.05 },
    // West well surroundings
    { position: [-12, 0, WELL_SHAFT.centerZ - 6], scale: 1.3 },
    { position: [12, 0, WELL_SHAFT.centerZ - 6], scale: 1.25 },
    { position: [0, 0, WELL_SHAFT.centerZ - 10], scale: 1.4 },
  ];
  return trees;
}

/** Surrounding Park visitors for human scale */
export function makeParkVisitors(): [number, number, number][] {
  return [
    [0, 0.4, 19.5],
    [1.8, 0.4, 18.2],
    [-2.2, 0.4, 17.8],
    [5.8, 0.4, 12.0],
    [-5.8, 0.4, 10.5],
    [-3.2, -3.1 + 0.4, 8.0],
    [2.8, -6.2 + 0.4, 2.5],
    [-2.4, -9.3 + 0.4, -3.5],
    [1.6, -12.4 + 0.4, -9.5],
    [0, -18.6 + 0.4, -20.5],
    [WELL_SHAFT.radius - 1.2, 0.4, WELL_SHAFT.centerZ],
    [-WELL_SHAFT.radius + 1.2, 0.4, WELL_SHAFT.centerZ],
  ];
}
