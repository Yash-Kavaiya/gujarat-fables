# Gujarat Fable — a 3D Showcase

An immersive, browser-based 3D journey through nine iconic places of Gujarat.
Each landmark is presented as a **stylized 3D scene** you can move through, paired
with a short **fable** and the **facts** behind the legend.

Built with **React Three Fiber** + **Vite**. Every scene is generated
**procedurally** in the browser — from primitives, instanced geometry, and custom
shaders — in a warm, storybook art direction. No external 3D model assets, so it
loads fast and runs on modest devices.

> These are interpretive, respectful impressions of living temples and heritage
> sites — evocation, not photoreal replication.

## The nine places

| Region | Place | Signature interaction |
|---|---|---|
| Central | **Statue of Unity** | Heroic auto fly-around of a sculpted Sardar Patel on his tiered base |
| Kutch | **Great Rann of Kutch** | Toggle the silent white salt desert ⇄ the Rann Utsav festival |
| North | **Rani ki Vav** | Descend the inverted stepwell, level by level, to the water |
| North | **Modhera Sun Temple** | Move the sun with a slider until the dawn beam lights the sanctum |
| Saurashtra | **Somnath Temple** | Seafront temple with a day ⇄ evening aarti toggle |
| Saurashtra | **Dwarkadhish Temple** | Five-storey tower with its great waving flag; day ⇄ evening |
| Kutch | **Dholavira** | Fill the Harappan reservoirs ⇄ reveal the excavated ruins |
| Saurashtra | **Mani Mandir** | Orbit the palace-temple amid drifting petals and lamps |
| Saurashtra | **Girnar Hill** | A virtual climb up a craggy, temple-dotted sacred mountain |

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # type-check + production bundle into dist/
npm run preview    # serve the production build locally
```

Requires Node 18+.

## Project structure

```
src/
  data/
    places.ts           # single source of truth: all 9 places + fables + facts + palettes
    sceneRegistry.tsx   # id -> React.lazy(scene) — scenes are code-split
  store/
    useUIStore.ts       # render-quality presets, audio, reduced-motion
    useSceneStore.ts    # per-scene interaction state (sun, festival, descent, climb…)
  components/
    three/              # SceneCanvas, Effects, GradientSky, Ground
      primitives/       # Pillars, WaterPlane, Particles, ShikharaTower, SteppedTank
    ui/                 # Navbar, PlaceCard, FablePanel, SceneControls, NarrationButton…
    scenes/             # <Place>Scene.tsx ×9 (each is a full, self-contained canvas)
    HeroScene.tsx       # the landing-page 3D moment
  pages/                # HomePage, PlacePage, AboutPage, NotFoundPage
  lib/                  # webgl detection, shared scene constants
```

## How it works

- **Scenes** are self-contained: each returns a `<SceneCanvas>` with its own
  palette, camera, lighting, and procedural geometry. They are lazy-loaded per
  route, so a place's geometry only downloads when you open it.
- **Interactions** flow through `useSceneStore`: DOM controls (rendered outside
  the WebGL canvas in `SceneControls`) write state; the 3D scene reads it.
- **Performance:** instancing for repeated geometry (pillars, steps, tents,
  trees), three quality presets (Low/Medium/High controlling pixel ratio,
  shadows, and postprocessing), and adaptive DPR.
- **Resilience & accessibility:** a WebGL error boundary falls back to a 2D
  palette card so the fable still reads; narration uses the browser Web Speech
  API (captioned by the on-screen text); controls have ARIA labels; the gallery
  is keyboard-navigable; and `prefers-reduced-motion` is respected.

## Tech

React 18 · TypeScript · Vite · @react-three/fiber · @react-three/drei ·
@react-three/postprocessing · react-router-dom · zustand · Tailwind CSS.

## Future extensions (not in v1)

Photoreal/commissioned GLTF models, recorded voice-over, Gujarati localization,
an in-scene AI guide, the honorable-mention places (Laxmi Vilas Palace,
Palitana, Adalaj, Sabarmati Ashram), and deployment.
