interface GroundProps {
  color?: string;
  size?: number;
  position?: [number, number, number];
  roughness?: number;
}

/** A simple large receiving ground plane. */
export default function Ground({
  color = '#8a6b3e',
  size = 400,
  position = [0, 0, 0],
  roughness = 1,
}: GroundProps) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={position}
      receiveShadow
    >
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={0} />
    </mesh>
  );
}
