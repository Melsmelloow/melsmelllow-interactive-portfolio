"use client";

import { forwardRef } from "react";
import * as THREE from "three";

interface BodyProps {
  bodyColor?: string;
  logoTexture?: THREE.Texture;
}

export const Body = forwardRef<THREE.Mesh, BodyProps>(
  ({ bodyColor = "black", logoTexture }: BodyProps, ref) => {
    return (
      <group>
        {/* Torso */}
        <mesh ref={ref} position={[0, 1.4, 0]}>
          <boxGeometry args={[1, 1.5, 0.5]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>

        {/* Shirt logo (if texture provided) */}
        {logoTexture && (
          <mesh position={[0, 1.4, 0.251]}>
            <planeGeometry args={[0.5, 0.5]} />
            <meshBasicMaterial
              map={logoTexture}
              transparent
              depthWrite={false}
            />
          </mesh>
        )}
      </group>
    );
  }
);

Body.displayName = "Body";