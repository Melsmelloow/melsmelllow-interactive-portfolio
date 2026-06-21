"use client";

import Turntable from "./TurnTable";


interface TurntableTableProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export default function TurntableTable({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: TurntableTableProps) {
  return (
    <group position={position} rotation={rotation} scale={[1.5, 1.5, 1.5]}>
      {/* Table surface */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.1, 0.08, 0.8]} />
        <meshStandardMaterial color="#8B5A2B" />
      </mesh>
      {/* Table legs */}
      <mesh position={[-0.45, 0.25, -0.3]}>
        <boxGeometry args={[0.08, 0.5, 0.08]} />
        <meshStandardMaterial color="#5C3A1A" />
      </mesh>
      <mesh position={[0.45, 0.25, -0.3]}>
        <boxGeometry args={[0.08, 0.5, 0.08]} />
        <meshStandardMaterial color="#5C3A1A" />
      </mesh>
      <mesh position={[-0.45, 0.25, 0.3]}>
        <boxGeometry args={[0.08, 0.5, 0.08]} />
        <meshStandardMaterial color="#5C3A1A" />
      </mesh>
      <mesh position={[0.45, 0.25, 0.3]}>
        <boxGeometry args={[0.08, 0.5, 0.08]} />
        <meshStandardMaterial color="#5C3A1A" />
      </mesh>

      {/* Turntable sitting on top of the table surface */}
      <Turntable position={[0, 0.54, 0]} />
    </group>
  );
}