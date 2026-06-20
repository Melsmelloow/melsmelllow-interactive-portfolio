"use client";

import * as THREE from "three";
import { Eyes } from "./Eyes";
import { Hair } from "./Hair";

interface HeadProps {
  skinColor?: string;
  hairColor?: string;
  mouthColor?: string;
}

export function Head({
  skinColor = "#f5d7b2",
  hairColor = "#1a1a1a",
  mouthColor = "#b22222",
}: HeadProps) {
  return (
    <group position={[0, 2.5, 0]}>
      {/* Head base (sphere) */}
      <mesh>
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* Eyes and eyebrows */}
      <Eyes />

      {/* Mouth */}
      <mesh position={[0, -0.18, 0.46]}>
        <boxGeometry args={[0.12, 0.02, 0.02]} />
        <meshStandardMaterial color={mouthColor} />
      </mesh>

      {/* Hair */}
      <Hair color={hairColor} />
    </group>
  );
}