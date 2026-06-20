"use client";

import { forwardRef } from "react";
import * as THREE from "three";

interface ArmSegments {
  upperArm: React.RefObject<THREE.Group | null>;
  lowerArm: React.RefObject<THREE.Group | null>;
  hand: React.RefObject<THREE.Group | null>;
}

interface ArmProps {
  skinColor?: string;
  side: "left" | "right";
  onRefsReady?: (refs: ArmSegments) => void;
}

export const Arm = forwardRef<THREE.Group, ArmProps & { 
  upperArmRef: React.RefObject<THREE.Group | null>;
  lowerArmRef: React.RefObject<THREE.Group | null>;
  handRef: React.RefObject<THREE.Group | null>;
}>(
  ({ skinColor = "#f5d7b2", side, upperArmRef, lowerArmRef, handRef, onRefsReady }: ArmProps & {
    upperArmRef: React.RefObject<THREE.Group | null>;
    lowerArmRef: React.RefObject<THREE.Group | null>;
    handRef: React.RefObject<THREE.Group | null>;
  }, ref) => {
    const xOffset = side === "left" ? -0.6 : 0.6;
    const directionMult = side === "left" ? 1 : -1;

    // Call callback when refs are ready
    if (onRefsReady) {
      onRefsReady({ upperArm: upperArmRef, lowerArm: lowerArmRef, hand: handRef });
    }

    return (
      <group ref={ref} position={[xOffset, 2, 0]}>
        {/* Upper Arm - rotates at shoulder */}
        <group ref={upperArmRef} position={[0, 0, 0]}>
          <mesh position={[0, -0.4, 0]}>
            <boxGeometry args={[0.25, 0.8, 0.25]} />
            <meshStandardMaterial color={skinColor} />
          </mesh>
          
          {/* Elbow joint - Lower Arm rotates here */}
          <group ref={lowerArmRef} position={[0, -0.8, 0]}>
            <mesh position={[0, -0.35, 0]}>
              <boxGeometry args={[0.22, 0.7, 0.22]} />
              <meshStandardMaterial color={skinColor} />
            </mesh>
            
            {/* Hand */}
            <group ref={handRef} position={[0, -0.7, 0]}>
              <mesh position={[0, -0.1, 0]}>
                <boxGeometry args={[0.2, 0.2, 0.1]} />
                <meshStandardMaterial color={skinColor} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    );
  }
);

Arm.displayName = "Arm";

interface ArmsProps {
  skinColor?: string;
  leftUpperArmRef: React.RefObject<THREE.Group | null>;
  leftLowerArmRef: React.RefObject<THREE.Group | null>;
  leftHandRef: React.RefObject<THREE.Group | null>;
  rightUpperArmRef: React.RefObject<THREE.Group | null>;
  rightLowerArmRef: React.RefObject<THREE.Group | null>;
  rightHandRef: React.RefObject<THREE.Group | null>;
}

export function Arms({ 
  skinColor = "#f5d7b2", 
  leftUpperArmRef, 
  leftLowerArmRef, 
  leftHandRef,
  rightUpperArmRef, 
  rightLowerArmRef, 
  rightHandRef 
}: ArmsProps) {
  return (
    <>
      <Arm 
        ref={leftUpperArmRef} 
        side="left" 
        skinColor={skinColor}
        upperArmRef={leftUpperArmRef}
        lowerArmRef={leftLowerArmRef}
        handRef={leftHandRef}
      />
      <Arm 
        ref={rightUpperArmRef} 
        side="right" 
        skinColor={skinColor}
        upperArmRef={rightUpperArmRef}
        lowerArmRef={rightLowerArmRef}
        handRef={rightHandRef}
      />
    </>
  );
}