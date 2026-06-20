import { useRef, useCallback } from "react";
import * as THREE from "three";

const WALK_SPEED = 8;
const WALK_AMPLITUDE = 0.5;
const BREATHING_SPEED = 2;
const BREATHING_AMPLITUDE = 0.02;

interface AnimationRefs {
  leftLegRef?: React.RefObject<THREE.Mesh | THREE.Group | null>;
  rightLegRef?: React.RefObject<THREE.Mesh | THREE.Group | null>;
  leftUpperArmRef?: React.RefObject<THREE.Mesh | THREE.Group | null>;
  rightUpperArmRef?: React.RefObject<THREE.Mesh | THREE.Group | null>;
  leftLowerArmRef?: React.RefObject<THREE.Mesh | THREE.Group | null>;
  rightLowerArmRef?: React.RefObject<THREE.Mesh | THREE.Group | null>;
  bodyRef?: React.RefObject<THREE.Mesh | null>;
}

export function usePlayerAnimation(animationRefs: AnimationRefs) {
  const walkCycle = useRef(0);
  const breathingCycle = useRef(0);

  const updateWalkAnimation = useCallback(
    (isWalking: boolean, delta: number) => {
      const {
        leftLegRef,
        rightLegRef,
        leftUpperArmRef,
        rightUpperArmRef,
        leftLowerArmRef,
        rightLowerArmRef,
      } = animationRefs;

      if (!isWalking) {
        // Reset to idle position — now includes lower arms
        if (leftLegRef?.current) {
          (leftLegRef.current as THREE.Group).rotation.x = 0;
        }
        if (rightLegRef?.current) {
          (rightLegRef.current as THREE.Group).rotation.x = 0;
        }
        if (leftUpperArmRef?.current) {
          (leftUpperArmRef.current as THREE.Group).rotation.set(0, 0, 0);
        }
        if (rightUpperArmRef?.current) {
          (rightUpperArmRef.current as THREE.Group).rotation.set(0, 0, 0);
        }
        if (leftLowerArmRef?.current) {
          (leftLowerArmRef.current as THREE.Group).rotation.set(0, 0, 0);
        }
        if (rightLowerArmRef?.current) {
          (rightLowerArmRef.current as THREE.Group).rotation.set(0, 0, 0);
        }
        return;
      }

      // Update walk cycle
      walkCycle.current += delta * WALK_SPEED;
      const angle = Math.sin(walkCycle.current) * WALK_AMPLITUDE;

      // Animate legs (opposite phases)
      if (leftLegRef?.current) {
        (leftLegRef.current as THREE.Group).rotation.x = angle;
      }
      if (rightLegRef?.current) {
        (rightLegRef.current as THREE.Group).rotation.x = -angle;
      }

      // Animate arms (opposite to legs)
      if (leftUpperArmRef?.current) {
        (leftUpperArmRef.current as THREE.Group).rotation.x = -angle;
      }
      if (rightUpperArmRef?.current) {
        (rightUpperArmRef.current as THREE.Group).rotation.x = angle;
      }

      // Lower arms stay straight while walking (no separate swing),
      // but must be explicitly zeroed so a leftover teleport rotation doesn't persist
      if (leftLowerArmRef?.current) {
        (leftLowerArmRef.current as THREE.Group).rotation.set(0, 0, 0);
      }
      if (rightLowerArmRef?.current) {
        (rightLowerArmRef.current as THREE.Group).rotation.set(0, 0, 0);
      }
    },
    [animationRefs]
  );

  const updateBreathingAnimation = useCallback(
    (isOnGround: boolean, delta: number) => {
      const { bodyRef } = animationRefs;

      if (!bodyRef?.current) return;

      if (!isOnGround) {
        (bodyRef.current as THREE.Mesh).scale.y = 1;
        return;
      }

      breathingCycle.current += delta * BREATHING_SPEED;
      const breathingScale = 1 + Math.sin(breathingCycle.current) * BREATHING_AMPLITUDE;

      (bodyRef.current as THREE.Mesh).scale.y = breathingScale;
    },
    [animationRefs]
  );

  const resetAnimations = useCallback(() => {
    walkCycle.current = 0;
    breathingCycle.current = 0;
  }, []);

  return {
    walkCycle,
    breathingCycle,
    updateWalkAnimation,
    updateBreathingAnimation,
    resetAnimations,
    WALK_SPEED,
    WALK_AMPLITUDE,
    BREATHING_SPEED,
    BREATHING_AMPLITUDE,
  };
}