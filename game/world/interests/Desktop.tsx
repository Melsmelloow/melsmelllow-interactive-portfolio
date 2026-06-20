"use client";

interface DesktopProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export default function Desktop({ position = [0, 0, 0], rotation = [0, 0, 0] }: DesktopProps) {
  return (
    <group position={position} rotation={rotation} scale={[1.5, 1.5, 1.5]}>
      {/* Desk surface */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.4, 0.08, 0.7]} />
        <meshStandardMaterial color="#8B5A2B" />
      </mesh>
      {/* Desk legs */}
      <mesh position={[-0.6, 0.25, -0.25]}>
        <boxGeometry args={[0.08, 0.5, 0.08]} />
        <meshStandardMaterial color="#5C3A1A" />
      </mesh>
      <mesh position={[0.6, 0.25, -0.25]}>
        <boxGeometry args={[0.08, 0.5, 0.08]} />
        <meshStandardMaterial color="#5C3A1A" />
      </mesh>
      <mesh position={[-0.6, 0.25, 0.25]}>
        <boxGeometry args={[0.08, 0.5, 0.08]} />
        <meshStandardMaterial color="#5C3A1A" />
      </mesh>
      <mesh position={[0.6, 0.25, 0.25]}>
        <boxGeometry args={[0.08, 0.5, 0.08]} />
        <meshStandardMaterial color="#5C3A1A" />
      </mesh>

      {/* Tower (PC case) */}
      <mesh position={[0.5, 0.75, 0.15]}>
        <boxGeometry args={[0.25, 0.5, 0.4]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Tower accent light strip */}
      <mesh position={[0.625, 0.75, 0.15]}>
        <boxGeometry args={[0.01, 0.4, 0.3]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.6} />
      </mesh>

      {/* Monitor stand */}
      <mesh position={[-0.1, 0.62, -0.15]}>
        <boxGeometry args={[0.06, 0.18, 0.06]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      {/* Monitor screen */}
      <mesh position={[-0.1, 0.95, -0.15]}>
        <boxGeometry args={[0.7, 0.42, 0.04]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      {/* Screen glow */}
      <mesh position={[-0.1, 0.95, -0.13]}>
        <boxGeometry args={[0.6, 0.34, 0.01]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.4} />
      </mesh>

      {/* Keyboard */}
      <mesh position={[-0.1, 0.545, 0.15]}>
        <boxGeometry args={[0.5, 0.03, 0.18]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
    </group>
  );
}