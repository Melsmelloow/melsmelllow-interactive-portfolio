"use client";

import { useRef } from "react";
import * as THREE from "three";

interface EyesProps {
  position?: [number, number, number];
}

export function Eyes({ position = [0, -0.05, 0.45] }: EyesProps) {
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);

  return (
    <group position={position}>
      {/* Left Eye */}
      <mesh ref={leftEyeRef} position={[-0.15, 0, 0]}>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Right Eye */}
      <mesh ref={rightEyeRef} position={[0.15, 0, 0]}>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Left Eyebrow */}
      <mesh position={[-0.15, 0.15, 0.02]}>
        <boxGeometry args={[0.15, 0.03, 0.03]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Right Eyebrow */}
      <mesh position={[0.15, 0.15, 0.02]}>
        <boxGeometry args={[0.15, 0.03, 0.03]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
}