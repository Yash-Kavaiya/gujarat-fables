import { useMemo } from 'react';
import SceneCanvas from '../three/SceneCanvas';
import Pillars from '../three/primitives/Pillars';
import SteppedTank from '../three/primitives/SteppedTank';
import ShikharaTower from '../three/primitives/ShikharaTower';
import Ground from '../three/Ground';
import Hotspot from '../ui/Hotspot';
import { getPlace } from '../../data/places';
import { useSceneStore } from '../../store/useSceneStore';
import { MODHERA_EQUINOX, MODHERA_LIT_RANGE } from '../../lib/sceneConstants';

const place = getPlace('modhera-sun-temple')!;
const palette = place.palette;

const STONE = '#c79a55';

/** The closed sanctum that lights up when the dawn beam reaches it. */
function Sanctum({ lit }: { lit: number }) {
  return (
    <group position={[-13, 0, 0]}>
      {/* walls (open toward +X / the hall) */}
      <mesh position={[-2.4, 4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 6, 7]} />
        <meshStandardMaterial color={STONE} roughness={0.85} />
      </mesh>
      <mesh position={[0, 4, 3.4]} castShadow>
        <boxGeometry args={[5, 6, 0.4]} />
        <meshStandardMaterial color={STONE} roughness={0.85} />
      </mesh>
      <mesh position={[0, 4, -3.4]} castShadow>
        <boxGeometry args={[5, 6, 0.4]} />
        <meshStandardMaterial color={STONE} roughness={0.85} />
      </mesh>
      {/* the idol of Surya */}
      <mesh position={[-1.3, 3, 0]}>
        <boxGeometry args={[1, 3, 1.4]} />
        <meshStandardMaterial
          color="#ffcf6b"
          emissive="#ffb24d"
          emissiveIntensity={0.15 + lit * 3.2}
          roughness={0.4}
          metalness={0.4}
        />
      </mesh>
      {lit > 0.05 && (
        <pointLight position={[-1, 3, 0]} intensity={lit * 3} color="#ffd27a" distance={20} />
      )}
      <ShikharaTower position={[0, 6.4, 0]} height={7.5} baseRadius={2.4} color={STONE} />
      <Hotspot position={[0, 14.5, 0]} label="The sanctum — lit by the equinox dawn" />
    </group>
  );
}

export default function ModheraSunTempleScene() {
  const sunAngle = useSceneStore((s) => s.sunAngle);

  const { sunPos, lit, sunColor } = useMemo(() => {
    const theta = sunAngle * Math.PI;
    const R = 65;
    const sunPos: [number, number, number] = [
      Math.cos(theta) * R,
      Math.max(Math.sin(theta) * R, 2),
      0,
    ];
    const lit = Math.max(0, 1 - Math.abs(sunAngle - MODHERA_EQUINOX) / MODHERA_LIT_RANGE);
    const lowness = 1 - Math.min(Math.sin(theta), 1);
    const sunColor = `rgb(255, ${Math.round(220 - lowness * 50)}, ${Math.round(150 + (1 - lowness) * 60)})`;
    return { sunPos, lit, sunColor };
  }, [sunAngle]);

  return (
    <SceneCanvas
      palette={palette}
      cameraPosition={[24, 11, 22]}
      fov={48}
      fog={[40, 220]}
      controls={{ target: [-2, 4, 0], minDistance: 12, maxDistance: 70 }}
      bloomIntensity={0.8 + lit * 0.8}
    >
      {/* The sun — its position drives the whole scene */}
      <directionalLight
        position={sunPos}
        intensity={1.4 + lit * 0.8}
        color={sunColor}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <mesh position={sunPos}>
        <sphereGeometry args={[5, 24, 24]} />
        <meshBasicMaterial color={sunColor} />
      </mesh>

      <Ground color="#b08a4e" size={400} />

      {/* Surya Kund — the great stepped tank (east) */}
      <SteppedTank
        position={[16, 0, 0]}
        levels={7}
        outerSize={18}
        stepWidth={1}
        stepHeight={0.6}
        color={STONE}
        waterColor="#2e5664"
        waterHighlight="#ffdca0"
      />

      {/* Temple platform */}
      <mesh position={[-7, 0.75, 0]} receiveShadow castShadow>
        <boxGeometry args={[24, 1.5, 13]} />
        <meshStandardMaterial color="#b88f50" roughness={0.9} />
      </mesh>

      {/* Sabha Mandapa — open pillared hall */}
      <group position={[-1, 1.5, 0]}>
        <Pillars rows={4} cols={4} spacing={1.9} height={3.4} radius={0.26} color={STONE} hollow />
        {/* pyramidal roof */}
        <mesh position={[0, 5.4, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[5.2, 3.2, 4]} />
          <meshStandardMaterial color={STONE} roughness={0.8} flatShading />
        </mesh>
      </group>

      <Sanctum lit={lit} />

      {/* The equinox beam: a glowing shaft entering the sanctum */}
      {lit > 0.02 && (
        <mesh position={[3, 3, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.5 + lit * 0.3, 0.5 + lit * 0.3, 30, 16, 1, true]} />
          <meshBasicMaterial color="#ffe2a8" transparent opacity={lit * 0.4} depthWrite={false} />
        </mesh>
      )}
    </SceneCanvas>
  );
}
