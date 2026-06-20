"use client";

interface BassProps {
  bodyColor?: string;
  neckColor?: string;
  stringColor?: string;
}

export function Bass({
  bodyColor = "#8B4513",
  neckColor = "#D2691E",
  stringColor = "#C0C0C0",
}: BassProps) {
  return (
    <group position={[0.8, 1.5, 0.3]} rotation={[0, 0, -0.3]}>
      {/* Bass body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.3, 0.4, 0.1]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Bass neck */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.08, 0.6, 0.05]} />
        <meshStandardMaterial color={neckColor} />
      </mesh>

      {/* Bass headstock */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[0.12, 0.15, 0.05]} />
        <meshStandardMaterial color={neckColor} />
      </mesh>

      {/* Strings */}
      <mesh position={[0, 0.3, 0.03]}>
        <boxGeometry args={[0.02, 0.6, 0.01]} />
        <meshStandardMaterial color={stringColor} />
      </mesh>
    </group>
  );
}