"use client";

interface SpiderManFigureProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export default function SpiderManFigure({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: SpiderManFigureProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Display stand base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 16]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.1, 0.4, 0]}>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshStandardMaterial color="#1d3a8f" />
      </mesh>
      <mesh position={[0.1, 0.4, 0]}>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshStandardMaterial color="#1d3a8f" />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[0.35, 0.4, 0.2]} />
        <meshStandardMaterial color="#c41e2a" />
      </mesh>
      {/* Web pattern accent lines on torso */}
      <mesh position={[0, 0.85, 0.101]}>
        <boxGeometry args={[0.3, 0.02, 0.01]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0, 0.95, 0.101]}>
        <boxGeometry args={[0.22, 0.02, 0.01]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Arms - one raised in web-shooting pose */}
      <mesh position={[-0.28, 0.95, 0]} rotation={[0, 0, 0.6]}>
        <boxGeometry args={[0.12, 0.45, 0.12]} />
        <meshStandardMaterial color="#c41e2a" />
      </mesh>
      <mesh position={[0.3, 1.05, 0]} rotation={[0, 0, -1.1]}>
        <boxGeometry args={[0.12, 0.45, 0.12]} />
        <meshStandardMaterial color="#1d3a8f" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.28, 0.28, 0.28]} />
        <meshStandardMaterial color="#c41e2a" />
      </mesh>
      {/* Eye lenses */}
      <mesh position={[-0.07, 1.2, 0.14]}>
        <boxGeometry args={[0.08, 0.1, 0.02]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      <mesh position={[0.07, 1.2, 0.14]}>
        <boxGeometry args={[0.08, 0.1, 0.02]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
    </group>
  );
}