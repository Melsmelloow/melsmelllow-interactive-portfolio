"use client";

interface BassDisplayProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  bodyColor?: string;
  neckColor?: string;
  stringColor?: string;
}

export default function BassDisplay({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  bodyColor = "#8B4513",
  neckColor = "#D2691E",
  stringColor = "#C0C0C0",
}: BassDisplayProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Stand base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.1, 16]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      {/* Stand pole */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.9, 8]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>

      {/* Bass body, leaning upright on the stand */}
      <group position={[0, 1.1, 0]} rotation={[0.15, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.3, 0.4, 0.1]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.08, 0.6, 0.05]} />
          <meshStandardMaterial color={neckColor} />
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[0.12, 0.15, 0.05]} />
          <meshStandardMaterial color={neckColor} />
        </mesh>
        <mesh position={[0, 0.3, 0.03]}>
          <boxGeometry args={[0.02, 0.6, 0.01]} />
          <meshStandardMaterial color={stringColor} />
        </mesh>
      </group>
    </group>
  );
}