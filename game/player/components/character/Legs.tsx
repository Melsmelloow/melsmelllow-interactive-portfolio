"use client";

import { forwardRef } from "react";
import * as THREE from "three";

interface LegProps {
  pantsColor?: string;
  shoeColor?: string;
  side: "left" | "right";
}

export const Leg = forwardRef<THREE.Group, LegProps>(
  ({ pantsColor = "blue", shoeColor = "white", side }: LegProps, ref) => {
    const xOffset = side === "left" ? -0.25 : 0.25;

    return (
      <group ref={ref} position={[xOffset, 0.8, 0]}>
        {/* Leg (pants) */}
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[0.3, 1, 0.3]} />
          <meshStandardMaterial color={pantsColor} />
        </mesh>

        {/* Shoe */}
        <mesh position={[0, -1.05, 0.1]}>
          <boxGeometry args={[0.35, 0.15, 0.5]} />
          <meshStandardMaterial color={shoeColor} />
        </mesh>
      </group>
    );
  }
);

Leg.displayName = "Leg";

interface LegsProps {
  pantsColor?: string;
  shoeColor?: string;
  leftLegRef: React.RefObject<THREE.Group | null>;
  rightLegRef: React.RefObject<THREE.Group | null>;
}

export function Legs({
  pantsColor = "blue",
  shoeColor = "white",
  leftLegRef,
  rightLegRef,
}: LegsProps) {
  return (
    <>
      <Leg ref={leftLegRef} side="left" pantsColor={pantsColor} shoeColor={shoeColor} />
      <Leg ref={rightLegRef} side="right" pantsColor={pantsColor} shoeColor={shoeColor} />
    </>
  );
}