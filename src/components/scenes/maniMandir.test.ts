import { describe, it, expect } from 'vitest';
import {
  MANI_LIGHTING_PRESETS,
  MANI_CAMERA_STATIONS,
  MANI_HOTSPOTS,
  makeWingArcades,
  makeChhatris,
  makeBalustrades,
  makeDiyaLamps,
  makeGardenTrees,
  type ManiTimeOfDay,
} from './maniMandirLayout';

describe('Mani Mandir 3D Palace Layout & Procedural Generators', () => {
  it('defines valid lighting presets for royal daylight, twilight, aarti, and moonlight', () => {
    const modes: ManiTimeOfDay[] = ['day', 'twilight', 'aarti', 'moonlight'];
    modes.forEach((mode) => {
      const p = MANI_LIGHTING_PRESETS[mode];
      expect(p).toBeDefined();
      expect(p.id).toBe(mode);
      expect(p.skyTop).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(p.skyHorizon).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(p.fogFar).toBeGreaterThan(p.fogNear);
      expect(p.sunPosition.length).toBe(3);
    });
  });

  it('defines four distinctive camera viewpoints', () => {
    const stations = Object.values(MANI_CAMERA_STATIONS);
    expect(stations.length).toBe(4);
    stations.forEach((st) => {
      expect(st.cameraPos.length).toBe(3);
      expect(st.lookAtPos.length).toBe(3);
      expect(st.fov).toBeGreaterThan(35);
      expect(st.fov).toBeLessThan(75);
    });
  });

  it('provides 3D hotspots highlighting the history and architecture', () => {
    expect(MANI_HOTSPOTS.length).toBeGreaterThanOrEqual(5);
    MANI_HOTSPOTS.forEach((h) => {
      expect(h.id).toBeTruthy();
      expect(h.title).toBeTruthy();
      expect(h.position.length).toBe(3);
      expect(h.description.length).toBeGreaterThan(25);
    });
  });

  it('generates multi-tier wing arcades for left and right wings', () => {
    const arcades = makeWingArcades();
    expect(arcades.length).toBe(6); // 3 tiers x 2 wings
    arcades.forEach((a) => {
      expect(a.bays).toBeGreaterThanOrEqual(4);
      expect(a.openTop).toBeGreaterThan(a.openBottom);
    });
  });

  it('generates Rajput corner chhatris with domes', () => {
    const chhatris = makeChhatris();
    expect(chhatris.length).toBeGreaterThanOrEqual(4);
    chhatris.forEach((c) => {
      expect(c.size).toBeGreaterThan(1.5);
      expect(c.hasDome).toBe(true);
    });
  });

  it('generates ornate balustrades and parapet rails', () => {
    const balustrades = makeBalustrades();
    expect(balustrades.length).toBeGreaterThanOrEqual(3);
    balustrades.forEach((b) => {
      expect(b.width).toBeGreaterThan(4);
    });
  });

  it('generates glowing diya lamps along corridors, staircases, and river ghats', () => {
    const lamps = makeDiyaLamps();
    expect(lamps.length).toBeGreaterThanOrEqual(20);
    lamps.forEach((l) => {
      expect(l.position.length).toBe(3);
      expect(l.intensity).toBeGreaterThan(0.5);
    });
  });

  it('generates palace garden cypress and flowering trees', () => {
    const trees = makeGardenTrees();
    expect(trees.length).toBeGreaterThanOrEqual(8);
    trees.forEach((t) => {
      expect(t.scale).toBeGreaterThan(0.8);
      expect(['cypress', 'palm', 'flowering']).toContain(t.kind);
    });
  });
});
