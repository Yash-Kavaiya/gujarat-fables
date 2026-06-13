import { lazy, type LazyExoticComponent, type ComponentType } from 'react';

/**
 * Each scene is the 3D content for a place, rendered INSIDE the shared
 * <SceneCanvas>. Scenes are code-split so a place's geometry only loads
 * when its page is opened.
 */
export type SceneComponent = LazyExoticComponent<ComponentType>;

export const sceneRegistry: Record<string, SceneComponent> = {
  'statue-of-unity': lazy(() => import('../components/scenes/StatueOfUnityScene')),
  'rann-of-kutch': lazy(() => import('../components/scenes/RannOfKutchScene')),
  'rani-ki-vav': lazy(() => import('../components/scenes/RaniKiVavScene')),
  'modhera-sun-temple': lazy(() => import('../components/scenes/ModheraSunTempleScene')),
  'somnath-temple': lazy(() => import('../components/scenes/SomnathTempleScene')),
  'dwarkadhish-temple': lazy(() => import('../components/scenes/DwarkadhishScene')),
  'dholavira': lazy(() => import('../components/scenes/DholaviraScene')),
  'mani-mandir': lazy(() => import('../components/scenes/ManiMandirScene')),
  'girnar-hill': lazy(() => import('../components/scenes/GirnarHillScene')),
};

export const getScene = (id: string): SceneComponent | undefined =>
  sceneRegistry[id];
