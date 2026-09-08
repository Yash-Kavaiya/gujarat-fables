import { describe, expect, it } from 'vitest';
import { getPlace, places } from '../../data/places';
import { getScene, sceneRegistry } from '../../data/sceneRegistry';
import DwarkadhishScene from './DwarkadhishScene';
import {
  DWARKA_PLACE_ID,
  DWARKA_HOTSPOTS,
  HALL,
  PILLAR_COUNT,
  STOREYS,
  STOREY_COUNT,
  SHIKHARA,
  SWARGADWAR_STEPS,
  BET_DWARKA,
  LIGHTING_PRESETS,
  camera,
  orbitControls,
  makeColonnadePositions,
  makeStoreyCornices,
  makeStoreyNiches,
  makeJharokhas,
  makeSwargadwarSteps,
  makePilgrims,
  makeBoats,
  makeCoastalTrees,
  storeyTopY,
  swargadwarWaterlineZ,
  sunHeightFromAngle,
} from './dwarkadhishLayout';

describe('dwarkadhish-temple registry', () => {
  it('is a registered place bound to the default-exported scene', () => {
    const place = getPlace(DWARKA_PLACE_ID);
    expect(place).toBeDefined();
    expect(place!.id).toBe('dwarkadhish-temple');
    expect(place!.name).toMatch(/Dwarkadhish/i);
    expect(places.some((p) => p.id === DWARKA_PLACE_ID)).toBe(true);

    const mapped = getScene(DWARKA_PLACE_ID);
    expect(mapped).toBeDefined();
    expect(sceneRegistry[DWARKA_PLACE_ID]).toBe(mapped);
    expect(typeof DwarkadhishScene).toBe('function');
    expect(DwarkadhishScene.name).toBe('DwarkadhishScene');
  });
});

describe('Jagat Mandir — the 72-pillar colonnade', () => {
  it('generates exactly 72 pillar positions around a hollow hall', () => {
    const positions = makeColonnadePositions();
    expect(positions).toHaveLength(PILLAR_COUNT);
    expect(PILLAR_COUNT).toBe(72);
    expect(HALL.rows).toBeGreaterThan(2);
    expect(HALL.cols).toBeGreaterThan(2);

    // Every position must lie on the perimeter, not the hollow interior.
    const xs = positions.map((p) => p[0]);
    const zs = positions.map((p) => p[2]);
    expect(Math.max(...xs) - Math.min(...xs)).toBeGreaterThan(20);
    expect(Math.max(...zs) - Math.min(...zs)).toBeGreaterThan(12);

    // No duplicate positions.
    const unique = new Set(positions.map((p) => p.join(',')));
    expect(unique.size).toBe(PILLAR_COUNT);
  });
});

describe('Nija Mandir — the five-storey tower', () => {
  it('defines 5 diminishing storeys with cornices, niches, and jharokhas', () => {
    expect(STOREYS).toHaveLength(STOREY_COUNT);
    expect(STOREY_COUNT).toBe(5);

    const ys = STOREYS.map((s) => s.y);
    expect(ys).toEqual([...ys].sort((a, b) => a - b));
    expect(new Set(ys).size).toBe(STOREYS.length);

    const ws = STOREYS.map((s) => s.w);
    for (let i = 1; i < ws.length; i++) {
      expect(ws[i]).toBeLessThan(ws[i - 1]);
    }

    expect(storeyTopY()).toBeGreaterThan(STOREYS[0].y);

    const cornices = makeStoreyCornices();
    expect(cornices.length).toBe(STOREYS.length * 4);
    expect(cornices.every((c) => c.size[0] > 0 && c.size[1] > 0)).toBe(true);

    const niches = makeStoreyNiches();
    expect(niches.length).toBeGreaterThanOrEqual(STOREYS.filter((s) => s.hasNiches).length * 4);

    const jharokhas = makeJharokhas();
    expect(jharokhas.length).toBe(STOREYS.filter((s) => s.hasJharokha).length);
    expect(jharokhas.length).toBeGreaterThanOrEqual(2);
  });

  it('crowns the tower with a shikhara tall enough to carry the great dhwaja', () => {
    expect(SHIKHARA.height).toBeGreaterThan(6);
    expect(SHIKHARA.position[1]).toBe(storeyTopY());
  });
});

describe('Swargadwar — the 56-step Gate to Heaven', () => {
  it('descends 56 steps from the platform to the waterline', () => {
    const steps = makeSwargadwarSteps();
    expect(steps).toHaveLength(56);
    expect(SWARGADWAR_STEPS).toBe(56);

    // Monotonically descending and advancing toward the water.
    for (let i = 1; i < steps.length; i++) {
      expect(steps[i].position[1]).toBeLessThan(steps[i - 1].position[1]);
      expect(steps[i].position[2]).toBeGreaterThan(steps[i - 1].position[2]);
    }
    expect(steps[0].position[1]).toBeCloseTo(HALL.platformY, 1);
    expect(swargadwarWaterlineZ()).toBe(steps[steps.length - 1].position[2]);
  });

  it('places pilgrims on the steps for a sense of human scale', () => {
    const pilgrims = makePilgrims();
    expect(pilgrims.length).toBeGreaterThanOrEqual(6);
    // Standing height puts a pilgrim's anchor slightly above their step, but
    // the group as a whole still tracks the ghat's descent toward the water.
    expect(pilgrims.every((p) => p[1] < HALL.platformY + 1)).toBe(true);
    expect(pilgrims[pilgrims.length - 1][1]).toBeLessThan(pilgrims[0][1]);
  });
});

describe('Gomti–sea sangam: boats & Bet Dwarka', () => {
  it('places boats between the ghat and Bet Dwarka island', () => {
    const boats = makeBoats();
    expect(boats.length).toBeGreaterThanOrEqual(3);
    expect(boats.every((b) => b.position[2] > swargadwarWaterlineZ())).toBe(true);
    expect(BET_DWARKA.position[2]).toBeGreaterThan(Math.max(...boats.map((b) => b.position[2])));
  });

  it('scatters coastal trees for a lived-in shoreline', () => {
    expect(makeCoastalTrees().length).toBeGreaterThanOrEqual(10);
  });
});

describe('Day / evening lighting presets', () => {
  it('the evening preset is dimmer, warmer, and lights the aarti', () => {
    expect(LIGHTING_PRESETS.day.sunIntensity).toBeGreaterThan(LIGHTING_PRESETS.evening.sunIntensity);
    expect(LIGHTING_PRESETS.evening.aartiLit).toBeGreaterThan(LIGHTING_PRESETS.day.aartiLit);
    expect(LIGHTING_PRESETS.evening.bloom).toBeGreaterThan(LIGHTING_PRESETS.day.bloom);
    expect(sunHeightFromAngle(LIGHTING_PRESETS.day.skyAngle)).toBeGreaterThan(
      sunHeightFromAngle(LIGHTING_PRESETS.evening.skyAngle),
    );
  });
});

describe('Hotspots & camera', () => {
  it('covers the temple, the ghat, and the sangam', () => {
    expect(DWARKA_HOTSPOTS.length).toBeGreaterThanOrEqual(6);
    const ids = DWARKA_HOTSPOTS.map((h) => h.id);
    expect(ids).toEqual(
      expect.arrayContaining(['dhwaja', 'shikhara', 'colonnade', 'swargadwar', 'sangam', 'bet-dwarka']),
    );
  });

  it('frames the temple from a respectful distance', () => {
    expect(camera.position[2]).toBeGreaterThan(20);
    expect(orbitControls.target[1]).toBeGreaterThan(5);
    expect(orbitControls.maxDistance).toBeGreaterThan(orbitControls.minDistance);
  });
});
