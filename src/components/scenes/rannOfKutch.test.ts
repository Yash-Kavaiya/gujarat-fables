import { describe, it, expect } from 'vitest';
import {
  RANN_LIGHTING_PRESETS,
  RANN_CAMERA_STATIONS,
  RANN_HOTSPOTS,
  makeBhungaHamlet,
  makeLippanMirrors,
  makeSaltPans,
  makeSaltMounds,
  makeCaravanCamels,
  makeFestivalTents,
  makeGarbaDancers,
  makeFolkMusicians,
  makeCraftBazaarStalls,
  makeFairyLightStrings,
  type RannTimeOfDay,
} from './rannOfKutchLayout';

describe('Rann of Kutch 3D Layout & Asset Generators', () => {
  it('defines valid lighting presets for all time-of-day modes', () => {
    const modes: RannTimeOfDay[] = ['day', 'sunset', 'fullmoon', 'festival'];
    modes.forEach((mode) => {
      const p = RANN_LIGHTING_PRESETS[mode];
      expect(p).toBeDefined();
      expect(p.id).toBe(mode);
      expect(p.skyTop).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(p.skyHorizon).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(p.fogFar).toBeGreaterThan(p.fogNear);
      expect(p.sunPosition.length).toBe(3);
    });
  });

  it('defines camera stations with distinct positions and viewpoints', () => {
    const stations = Object.values(RANN_CAMERA_STATIONS);
    expect(stations.length).toBeGreaterThanOrEqual(4);
    stations.forEach((st) => {
      expect(st.cameraPos.length).toBe(3);
      expect(st.lookAtPos.length).toBe(3);
      expect(st.fov).toBeGreaterThan(30);
      expect(st.fov).toBeLessThan(90);
    });
  });

  it('provides comprehensive cultural and architectural 3D hotspots', () => {
    expect(RANN_HOTSPOTS.length).toBeGreaterThanOrEqual(6);
    RANN_HOTSPOTS.forEach((h) => {
      expect(h.id).toBeTruthy();
      expect(h.title).toBeTruthy();
      expect(h.position.length).toBe(3);
      expect(h.description.length).toBeGreaterThan(20);
    });
  });

  it('generates an authentic cluster of 7 traditional Bhungas', () => {
    const bhungas = makeBhungaHamlet();
    expect(bhungas.length).toBe(7);
    bhungas.forEach((b) => {
      expect(b.radius).toBeGreaterThan(1.0);
      expect(b.wallHeight).toBeGreaterThan(1.5);
      expect(b.roofHeight).toBeGreaterThan(1.5);
      expect(b.position[0]).toBeLessThan(0); // positioned on western flank
    });
  });

  it('generates Lippan Kaam mirrors excluding door openings', () => {
    const mirrors = makeLippanMirrors(1.5, 2.0);
    expect(mirrors.length).toBeGreaterThan(20);
    mirrors.forEach((m) => {
      expect(m.position.length).toBe(3);
      expect(m.size).toBeGreaterThan(0.02);
    });
  });

  it('generates a grid of Agariya brine salt pans with varied mineral tints', () => {
    const pans = makeSaltPans();
    expect(pans.length).toBe(12); // 3x4 grid
    pans.forEach((p) => {
      expect(p.width).toBeGreaterThan(4);
      expect(p.length).toBeGreaterThan(4);
      expect(p.position[0]).toBeGreaterThan(10); // on eastern salt-work flank
    });
  });

  it('generates harvested salt crystal mounds', () => {
    const mounds = makeSaltMounds();
    expect(mounds.length).toBeGreaterThan(20);
    mounds.forEach((m) => {
      expect(m.radius).toBeGreaterThan(0.5);
      expect(m.height).toBeGreaterThan(0.8);
    });
  });

  it('generates decorated Kachchhi camels for caravan and joyrides', () => {
    const camels = makeCaravanCamels();
    expect(camels.length).toBe(5);
    camels.forEach((c) => {
      expect(c.scale).toBeGreaterThan(0.8);
      expect(c.decorated).toBe(true);
    });
  });

  it('generates luxury Swiss cottage tents for Rann Utsav tent city', () => {
    const tents = makeFestivalTents();
    expect(tents.length).toBe(18);
    tents.forEach((t) => {
      expect(t.position[2]).toBeLessThan(-10); // positioned in the background
      expect(t.roofColor).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  it('generates circular Garba folk dancer formation', () => {
    const dancers = makeGarbaDancers(14, 5.2);
    expect(dancers.length).toBe(14);
    dancers.forEach((d) => {
      expect(d.skirtColor).toBeTruthy();
      expect(d.position[1]).toBeCloseTo(0.75, 1);
    });
  });

  it('generates folk musicians with authentic instruments', () => {
    const musicians = makeFolkMusicians();
    expect(musicians.length).toBe(5);
    const instruments = musicians.map((m) => m.instrument);
    expect(instruments).toContain('dholak');
    expect(instruments).toContain('kani');
    expect(instruments).toContain('surando');
  });

  it('generates artisan craft bazaar stalls and fairy light catenaries', () => {
    const stalls = makeCraftBazaarStalls();
    expect(stalls.length).toBe(4);

    const lightRows = makeFairyLightStrings();
    expect(lightRows.length).toBe(4);
    lightRows.forEach((r) => {
      expect(r.poles.length).toBeGreaterThanOrEqual(5);
      expect(r.bulbs.length).toBeGreaterThan(20);
    });
  });
});
