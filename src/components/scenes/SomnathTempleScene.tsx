import SceneCanvas from '../three/SceneCanvas';
import ShikharaTower from '../three/primitives/ShikharaTower';
import WaterPlane from '../three/primitives/WaterPlane';
import Pillars from '../three/primitives/Pillars';
import Particles from '../three/primitives/Particles';
import Hotspot from '../ui/Hotspot';
import { getPlace } from '../../data/places';
import { useSceneStore } from '../../store/useSceneStore';

const place = getPlace('somnath-temple')!;
const DAY = { sky: '#93b8d8', ground: '#35525f', accent: '#e8b34a', fog: '#a3c2da' };
const EVENING = place.palette;
const STONE = '#d6b478';

export default function SomnathTempleScene() {
  const evening = useSceneStore((s) => s.evening);
  const palette = evening ? EVENING : DAY;

  return (
    <SceneCanvas
      palette={palette}
      cameraPosition={[14, 7, 20]}
      fov={50}
      fog={[36, 220]}
      controls={{ target: [0, 5, 0], minDistance: 10, maxDistance: 60 }}
      bloomIntensity={evening ? 1.15 : 0.7}
    >
      <directionalLight
        position={evening ? [-20, 14, 18] : [18, 28, 16]}
        intensity={evening ? 0.7 : 1.6}
        color={evening ? '#ffb774' : '#fff2d8'}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* The Arabian Sea */}
      <WaterPlane
        size={500}
        color={evening ? '#16263a' : '#26586b'}
        highlight={evening ? '#ff9d4d' : '#cfe7ee'}
        amplitude={0.32}
        position={[0, 0, 0]}
      />

      {/* Temple platform / shoreline */}
      <mesh position={[0, 0.6, -6]} receiveShadow castShadow>
        <boxGeometry args={[34, 1.2, 26]} />
        <meshStandardMaterial color="#c2a268" roughness={0.95} />
      </mesh>

      {/* Main shikhara + mandapa hall + flanking towers */}
      <group position={[0, 1.2, -6]}>
        <ShikharaTower position={[0, 0, -2]} height={14} baseRadius={3} color={STONE} accent="#ffcf6b" emissiveFinial />
        <group position={[0, 0, 6]}>
          <Pillars rows={3} cols={4} spacing={2} height={4} radius={0.3} color={STONE} hollow />
          <mesh position={[0, 6.4, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[5, 3.4, 4]} />
            <meshStandardMaterial color={STONE} roughness={0.8} flatShading />
          </mesh>
        </group>
        <ShikharaTower position={[-7, 0, 1]} height={7} baseRadius={1.4} color={STONE} />
        <ShikharaTower position={[7, 0, 1]} height={7} baseRadius={1.4} color={STONE} />
        <Hotspot position={[0, 17.5, -2]} label="The first Jyotirlinga — rebuilt against time and tide" />
      </group>

      {/* Baan Stambh — the arrow pillar pointing out to sea */}
      <mesh position={[0, 6, 9]}>
        <cylinderGeometry args={[0.3, 0.4, 12, 10]} />
        <meshStandardMaterial color={STONE} roughness={0.8} />
      </mesh>

      {/* Evening aarti: lamps + warm glow */}
      {evening && (
        <>
          <pointLight position={[0, 6, 4]} intensity={2.6} color="#ff9d4d" distance={50} />
          <Particles count={90} area={[26, 10, 18]} center={[0, 5, 0]} color="#ffce86" size={0.45} speed={0.45} />
        </>
      )}
    </SceneCanvas>
  );
}
