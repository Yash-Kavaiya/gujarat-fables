import { describe, expect, it } from 'vitest';
import { getPlace, places } from '../../data/places';
import { getScene, sceneRegistry } from '../../data/sceneRegistry';
import RaniKiVavScene from './RaniKiVavScene';
import {
  RANI_PLACE_ID,
  STOREY_COUNT,
  MAX_LEVEL,
  LEVEL_DROP,
  LEVEL_RUN,
  TRENCH_HALF_WIDTH,
  UPPER_HALF_WIDTH,
  WELL_SHAFT,
  LIGHTING_PRESETS,
  DESCENT_STATIONS,
  RANI_HOTSPOTS,
  levelCenter,
  makeMandapaPillars,
  makeMandapaLintels,
  makeNicheFigures,
  makeSolankiStepCascades,
  makeElephantFriezes,
  makeDiyaLamps,
  makeParkTrees,
  makeParkVisitors,
} from './raniKiVavLayout';

describe('Rani Ki Vav registry & binding', () => {
  it('is properly registered in places and maps to RaniKiVavScene', () => {
    const place = getPlace(RANI_PLACE_ID);
    expect(place).toBeDefined();
    expect(place!.id).toBe('rani-ki-vav');
    expect(place!.name).toMatch(/Rani ki Vav/i);
    expect(places.some((p) => p.id === RANI_PLACE_ID)).toBe(true);

    const scene = getScene(RANI_PLACE_ID);
    expect(scene).toBeDefined();
    expect(sceneRegistry[RANI_PLACE_ID]).toBe(scene);
    expect(typeof RaniKiVavScene).toBe('function');
    expect(RaniKiVavScene.name).toBe('RaniKiVavScene');
  });
});

describe('Rani Ki Vav 7-storey inverted temple architecture', () => {
  it('defines 7 subterranean storeys with progressive depth and run', () => {
    expect(STOREY_COUNT).toBe(7);
    expect(MAX_LEVEL).toBe(6);
    expect(LEVEL_DROP).toBeGreaterThan(2.5);
    expect(LEVEL_RUN).toBeGreaterThan(4.0);
    expect(TRENCH_HALF_WIDTH).toBeGreaterThan(4.0);
    expect(UPPER_HALF_WIDTH).toBeGreaterThan(TRENCH_HALF_WIDTH);

    const level0 = levelCenter(0);
    const level6 = levelCenter(6);

    expect(level0[1]).toBe(0);
    expect(level6[1]).toBeLessThan(-15);
    expect(level6[2]).toBeLessThan(level0[2]);
  });

  it('defines the 30-metre deep western circular well shaft (Kupa)', () => {
    expect(WELL_SHAFT.radius).toBeGreaterThan(3.5);
    expect(WELL_SHAFT.depth).toBeGreaterThan(20);
    expect(WELL_SHAFT.waterY).toBeLessThan(-20);
    expect(WELL_SHAFT.centerZ).toBeLessThan(levelCenter(6)[2]);
    expect(WELL_SHAFT.tierCount).toBeGreaterThanOrEqual(4);
  });
});

describe('Solanki Mandapa pavilions and carved pillars', () => {
  it('generates multi-tiered pillar bays and structural lintels', () => {
    const pillars = makeMandapaPillars();
    expect(pillars.length).toBeGreaterThanOrEqual(30);

    // Entrance torana pillars should be present
    expect(pillars.some((p) => p.id.includes('torana'))).toBe(true);

    // Each pillar has positive height and radius
    expect(pillars.every((p) => p.height > 2 && p.radius > 0.15)).toBe(true);

    const lintels = makeMandapaLintels();
    expect(lintels.length).toBeGreaterThanOrEqual(15);
    expect(lintels.every((l) => l.size[0] > 4 && l.size[1] > 0.15)).toBe(true);
  });
});

describe('Carved Niche Sculptures & Mythological Iconography', () => {
  it('generates sculpted niche figures across all 7 storeys for both walls', () => {
    const figures = makeNicheFigures();
    expect(figures.length).toBeGreaterThanOrEqual(36);

    // Check presence on both left (-1) and right (1) sides
    expect(figures.some((f) => f.side === -1)).toBe(true);
    expect(figures.some((f) => f.side === 1)).toBe(true);

    // Check representation of all key iconographical groups
    const types = new Set(figures.map((f) => f.sculptureType));
    expect(types.has('avatar')).toBe(true);
    expect(types.has('apsara')).toBe(true);
    expect(types.has('nagakanya')).toBe(true);
    expect(types.has('dikpala')).toBe(true);
    expect(types.has('deity')).toBe(true);

    // Check Dashavatara avatars
    const deities = figures.map((f) => f.deity).join(' ');
    expect(deities).toMatch(/Varaha/i);
    expect(deities).toMatch(/Narasimha/i);
    expect(deities).toMatch(/Vamana/i);
    expect(deities).toMatch(/Rama/i);
    expect(deities).toMatch(/Krishna/i);
    expect(deities).toMatch(/Buddha/i);
    expect(deities).toMatch(/Kalki/i);

    // Check Apsaras / Celestial beauties
    expect(deities).toMatch(/Darpana Sundari|Mirror/i);
    expect(deities).toMatch(/Anjana|Kohl/i);

    // Check Nagakanyas
    expect(deities).toMatch(/Nagakanya/i);
  });

  it('generates continuous Gajathara elephant friezes along the wall bases', () => {
    const friezes = makeElephantFriezes();
    expect(friezes.length).toBeGreaterThanOrEqual(50);
  });
});

describe('Solanki Pyramidal & Chevron Step Cascades', () => {
  it('generates central step flights and flanking interlocking chevron steps', () => {
    const steps = makeSolankiStepCascades();
    expect(steps.length).toBeGreaterThanOrEqual(50);

    const mainSteps = steps.filter((s) => s.id.includes('step-main'));
    const flankSteps = steps.filter((s) => s.id.includes('step-flank'));

    expect(mainSteps.length).toBeGreaterThanOrEqual(30);
    expect(flankSteps.length).toBeGreaterThanOrEqual(20);
  });
});

describe('Lighting Presets & Atmospheric Diya Lamps', () => {
  it('provides Golden Sun, Dawn Mist, and Night Aarti lighting presets', () => {
    expect(LIGHTING_PRESETS.day).toBeDefined();
    expect(LIGHTING_PRESETS.dawn).toBeDefined();
    expect(LIGHTING_PRESETS.night).toBeDefined();

    expect(LIGHTING_PRESETS.day.sunIntensity).toBeGreaterThan(LIGHTING_PRESETS.night.sunIntensity);
    expect(LIGHTING_PRESETS.night.torchIntensity).toBeGreaterThan(LIGHTING_PRESETS.day.torchIntensity);
  });

  it('generates diya oil lamps across landings, pillar heads, and sanctum', () => {
    const lamps = makeDiyaLamps();
    expect(lamps.length).toBeGreaterThanOrEqual(25);
    expect(lamps.some((l) => l.id.includes('sanctum'))).toBe(true);
    expect(lamps.some((l) => l.id.includes('landing'))).toBe(true);
    expect(lamps.some((l) => l.id.includes('well'))).toBe(true);
  });
});

describe('Interactive Hotspots & Camera Descent Stations', () => {
  it('defines 7 descent stations matching the 7 storeys', () => {
    expect(DESCENT_STATIONS.length).toBe(7);
    DESCENT_STATIONS.forEach((st, idx) => {
      expect(st.level).toBe(idx);
      expect(st.name).toBeDefined();
      expect(st.cameraPos).toHaveLength(3);
      expect(st.lookAtPos).toHaveLength(3);
    });
  });

  it('defines rich 3D hotspots covering architectural & mythological highlights', () => {
    expect(RANI_HOTSPOTS.length).toBeGreaterThanOrEqual(7);

    const ids = RANI_HOTSPOTS.map((h) => h.id);
    expect(ids).toContain('torana-entry');
    expect(ids).toContain('mandapa-pavilion');
    expect(ids).toContain('varaha-niche');
    expect(ids).toContain('apsara-mirror');
    expect(ids).toContain('narasimha-niche');
    expect(ids).toContain('chevron-steps');
    expect(ids).toContain('sheshashayi-vishnu');
    expect(ids).toContain('circular-well-kupa');
  });

  it('generates park trees and visitor figures for scale', () => {
    expect(makeParkTrees().length).toBeGreaterThanOrEqual(12);
    expect(makeParkVisitors().length).toBeGreaterThanOrEqual(10);
  });
});
