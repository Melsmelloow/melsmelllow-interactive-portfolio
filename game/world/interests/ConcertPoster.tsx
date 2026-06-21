"use client";

import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface ConcertPosterProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  imagePath: string;
  width?: number;
  height?: number;
  frameColor?: string;
  frameThickness?: number;
}

export default function ConcertPoster({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  imagePath,
  width = 0.8,
  height = 1.1,
  frameColor = "#2a2a2a",
  frameThickness = 0.05,
}: ConcertPosterProps) {
  const texture = useTexture(imagePath);

  // Ensure the image isn't stretched oddly if its aspect ratio differs
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <group position={position} rotation={rotation} scale={[.8, .8, .8]}>
      {/* Frame backing, slightly larger than the poster image */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry
          args={[width + frameThickness, height + frameThickness, 0.02]}
        />
        <meshStandardMaterial color={frameColor} />
      </mesh>

      {/* Poster image */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}
