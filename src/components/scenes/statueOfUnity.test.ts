import { describe, expect, it } from 'vitest';
import { getPlace, places } from '../../data/places';
import { getScene, sceneRegistry } from '../../data/sceneRegistry';
import StatueOfUnityScene from './StatueOfUnityScene';
import {
  STATUE_PLACE_ID,
  bridge,
  buildIslandGeometry,
  buildMoundGeometry,
  camera,
  dam,
  figureFacing,
  figurePart,
  figureParts,
  hills,
  island,
  makeBridgePiers,
  makeCladdingSeams,
  makeDhotiPleats,
  makeDhotiProfile,
  makeFeet,
  makeHands,
  makeHeadFeatures,
  makeIslandHeight,
  makeShawlFolds,
  makeTrees,
  makeTunicDetails,
  makeVisitors,
  orbitControls,
  pedestalTiers,
  pedestalTopY,
  pose,
  water,
} from './statueOfUnityLayout';

describe('statue-of-unity registry', () => {
  it('is a registered place bound to the default-exported scene', () => {
    const place = getPlace(STATUE_PLACE_ID);
    expect(place).toBeDefined();
    expect(place!.id).toBe('statue-of-unity');
    expect(place!.name).toMatch(/Statue of Unity/i);
    expect(places.some((p) => p.id === STATUE_PLACE_ID)).toBe(true);

    const mapped = getScene(STATUE_PLACE_ID);
    expect(mapped).toBeDefined();
    expect(sceneRegistry[STATUE_PLACE_ID]).toBe(mapped);
    expect(typeof StatueOfUnityScene).toBe('function');
    expect(StatueOfUnityScene.name).toBe('StatueOfUnityScene');
  });
});

describe('Patel figure layout', () => {
  it('has dhoti, shawl, tunic, bald head with a face, sandalled mid-stride feet, and cladding seams', () => {
    const ids = figureParts.map((p) => p.id);
    expect(ids).toEqual(
      expect.arrayContaining(['dhoti', 'shawl', 'tunic', 'head', 'feet', 'cladding-seams', 'arms', 'hands', 'legs']),
    );

    const dhoti = figurePart('dhoti');
    expect(dhoti.folds).toBe(true);
    expect(dhoti.kind).toBe('garment');
    expect(makeDhotiPleats()).toHaveLength(dhoti.meshCount);
    expect(makeDhotiProfile().length).toBeGreaterThan(6);
    expect(dhoti.meshCount).toBeGreaterThan(8);

    const shawl = figurePart('shawl');
    expect(shawl.draped).toBe(true);
    expect(shawl.folds).toBe(true);
    expect(makeShawlFolds()).toHaveLength(shawl.meshCount);
    expect(makeShawlFolds().some((s) => s.id.includes('shoulder'))).toBe(true);

    const tunic = figurePart('tunic');
    expect(tunic.panelSeams).toBe(true);
    expect(makeTunicDetails().length).toBe(tunic.meshCount);

    const head = figurePart('head');
    expect(head.bald).toBe(true);
    expect(head.facialFeatures).toBe(true);
    const headIds = makeHeadFeatures().map((s) => s.id);
    expect(headIds.length).toBeGreaterThanOrEqual(head.meshCount);
    expect(headIds.some((id) => id.includes('eye'))).toBe(true);
    expect(headIds.some((id) => id.includes('nose'))).toBe(true);
    expect(headIds.some((id) => id.includes('mouth'))).toBe(true);
    expect(headIds.some((id) => id.includes('ear'))).toBe(true);
    expect(headIds.some((id) => id.includes('socket'))).toBe(true);
    expect(headIds).toContain('cranium');
    expect(figureFacing).toBeGreaterThan(0);
    expect(Math.abs(figureFacing - Math.atan2(camera.position[0], camera.position[2]))).toBeLessThan(1e-9);

    const feet = figurePart('feet');
    expect(feet.sandalled).toBe(true);
    expect(feet.midStride).toBe(true);
    expect(makeFeet().length).toBe(feet.meshCount);
    expect(makeFeet().some((s) => s.id.includes('strap'))).toBe(true);
    expect(makeFeet().some((s) => s.id.includes('sole'))).toBe(true);

    expect(pose.stance).toBe('mid-stride');
    expect(Math.abs(pose.leftFoot.z - pose.rightFoot.z)).toBeGreaterThan(0.5);

    const seams = makeCladdingSeams();
    expect(seams.length).toBeGreaterThanOrEqual(figurePart('cladding-seams').meshCount);
    expect(makeHands().length).toBe(figurePart('hands').meshCount);
  });
});

describe('Sadhu Bet site layout', () => {
  it('is a river island with water, hills, dam, bridge, vegetation — not a single mesh plus a flat disk', () => {
    expect(pedestalTiers.length).toBeGreaterThanOrEqual(5);
    const ys = pedestalTiers.map((t) => t.y);
    expect(new Set(ys).size).toBe(pedestalTiers.length);
    expect(pedestalTiers.every((t) => t.sides >= 8 && t.height > 0)).toBe(true);
    expect(pedestalTopY()).toBeGreaterThan(island.plazaY + 5);

    expect(island.kind).toBe('heightfield');
    expect(island.notFlatDisk).toBe(true);
    const crest = makeIslandHeight(0, 0);
    const bank = makeIslandHeight(island.radiusX * 0.72, 0);
    const offIsland = makeIslandHeight(island.radiusX * 1.4, 0);
    expect(crest).toBeGreaterThan(bank);
    expect(offIsland).toBeLessThan(0.2);

    const geo = buildIslandGeometry();
    expect(geo.positions.length).toBeGreaterThan(16 * 3);
    const yValues: number[] = [];
    for (let i = 1; i < geo.positions.length; i += 3) yValues.push(geo.positions[i]);
    expect(Math.max(...yValues) - Math.min(...yValues)).toBeGreaterThan(1);
    expect(geo.colors.length).toBe(geo.positions.length);

    expect(water.size).toBeGreaterThan(200);
    expect(water.y).toBeLessThan(island.plazaY);

    expect(dam.position[2]).toBeLessThan(-80);
    expect(dam.size[0]).toBeGreaterThan(100);
    expect(dam.spillwayCount).toBeGreaterThan(6);

    expect(hills.length).toBeGreaterThanOrEqual(6);
    expect(hills.every((h) => h.height > 8 && h.radius > 5)).toBe(true);
    const mound = buildMoundGeometry(hills[0]);
    expect(mound.positions.length).toBeGreaterThan(100 * 3);
    const moundY: number[] = [];
    for (let i = 1; i < mound.positions.length; i += 3) moundY.push(mound.positions[i]);
    expect(Math.max(...moundY) - Math.min(...moundY)).toBeGreaterThan(hills[0].height * 0.5);

    expect(bridge.pierCount).toBeGreaterThanOrEqual(4);
    expect(bridge.railing).toBe(true);
    expect(makeBridgePiers()).toHaveLength(bridge.pierCount);
    expect(
      Math.hypot(bridge.end[0] - bridge.start[0], bridge.end[2] - bridge.start[2]),
    ).toBeGreaterThan(20);

    expect(makeTrees().length).toBeGreaterThan(20);
    expect(makeVisitors().length).toBeGreaterThan(15);
  });

  it('keeps the slow auto-rotating orbit around the statue', () => {
    expect(orbitControls.autoRotate).toBe(true);
    expect(orbitControls.autoRotateSpeed).toBeGreaterThan(0);
    expect(orbitControls.autoRotateSpeed).toBeLessThan(1);
    expect(camera.position[2]).toBeGreaterThan(20);
    expect(orbitControls.target[1]).toBeGreaterThan(8);
  });
});
