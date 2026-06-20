"use client";

import { useRef, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { Head } from "./Head";
import { Body } from "./Body";
import { Arms } from "./Arms";
import { Legs } from "./Legs";
import { Bass } from "./Bass";

// Define the refs interface for animation - now with segmented arms
export interface CharacterRefs {
  bodyRef: React.RefObject<THREE.Mesh | null>;
  // Left arm segments
  leftUpperArmRef: React.RefObject<THREE.Group | null>;
  leftLowerArmRef: React.RefObject<THREE.Group | null>;
  leftHandRef: React.RefObject<THREE.Group | null>;
  // Right arm segments
  rightUpperArmRef: React.RefObject<THREE.Group | null>;
  rightLowerArmRef: React.RefObject<THREE.Group | null>;
  rightHandRef: React.RefObject<THREE.Group | null>;
  // Legs
  leftLegRef: React.RefObject<THREE.Group | null>;
  rightLegRef: React.RefObject<THREE.Group | null>;
}

interface CharacterProps {
  showBass?: boolean;
  logoTexturePath?: string;
  onRefsReady?: (refs: CharacterRefs) => void;
}

export const Character = forwardRef<CharacterRefs, CharacterProps>(
  ({ showBass = false, logoTexturePath = "/top.jpg", onRefsReady }, ref) => {
    // Refs for animation
    const bodyRef = useRef<THREE.Mesh>(null);
    
    // Left arm segments
    const leftUpperArmRef = useRef<THREE.Group>(null);
    const leftLowerArmRef = useRef<THREE.Group>(null);
    const leftHandRef = useRef<THREE.Group>(null);
    
    // Right arm segments
    const rightUpperArmRef = useRef<THREE.Group>(null);
    const rightLowerArmRef = useRef<THREE.Group>(null);
    const rightHandRef = useRef<THREE.Group>(null);
    
    // Legs
    const leftLegRef = useRef<THREE.Group>(null);
    const rightLegRef = useRef<THREE.Group>(null);

    // Load logo texture if provided
    const logoTexture = useTexture(logoTexturePath);

    // Expose refs to parent component
    useImperativeHandle(
      ref,
      () => ({
        bodyRef,
        leftUpperArmRef,
        leftLowerArmRef,
        leftHandRef,
        rightUpperArmRef,
        rightLowerArmRef,
        rightHandRef,
        leftLegRef,
        rightLegRef,
      }),
      []
    );

    // Call callback when refs are ready
    if (onRefsReady) {
      onRefsReady({
        bodyRef,
        leftUpperArmRef,
        leftLowerArmRef,
        leftHandRef,
        rightUpperArmRef,
        rightLowerArmRef,
        rightHandRef,
        leftLegRef,
        rightLegRef,
      });
    }

    return (
      <group>
        {/* Head */}
        <Head />

        {/* Body with optional logo */}
        <Body ref={bodyRef} logoTexture={logoTexture} />

        {/* Arms with segmented structure */}
        <Arms
          leftUpperArmRef={leftUpperArmRef}
          leftLowerArmRef={leftLowerArmRef}
          leftHandRef={leftHandRef}
          rightUpperArmRef={rightUpperArmRef}
          rightLowerArmRef={rightLowerArmRef}
          rightHandRef={rightHandRef}
        />

        {/* Legs */}
        <Legs
          leftLegRef={leftLegRef}
          rightLegRef={rightLegRef}
        />

        {/* Bass (optional) */}
        {showBass && <Bass />}
      </group>
    );
  }
);

Character.displayName = "Character";