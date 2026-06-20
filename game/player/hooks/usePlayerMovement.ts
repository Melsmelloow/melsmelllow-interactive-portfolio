import { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import type { PlayerKeys } from "../types/player.types";

const MOVEMENT_SPEED = 5;

export function usePlayerMovement(playerRef: React.RefObject<THREE.Group | null>) {
  const keys = useRef<PlayerKeys>({
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
  });

  const targetRotation = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
          keys.current.w = true;
          break;
        case "KeyA":
          keys.current.a = true;
          break;
        case "KeyS":
          keys.current.s = true;
          break;
        case "KeyD":
          keys.current.d = true;
          break;
        case "Space":
          keys.current.space = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
          keys.current.w = false;
          break;
        case "KeyA":
          keys.current.a = false;
          break;
        case "KeyS":
          keys.current.s = false;
          break;
        case "KeyD":
          keys.current.d = false;
          break;
        case "Space":
          keys.current.space = false;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const updateMovement = useCallback(
    (delta: number) => {
      if (!playerRef.current) return;

      const { w, a, s, d } = keys.current;

      // Calculate movement direction
      if (w) {
        targetRotation.current = Math.PI;
        playerRef.current.position.z -= MOVEMENT_SPEED * delta;
      }
      if (s) {
        targetRotation.current = 0;
        playerRef.current.position.z += MOVEMENT_SPEED * delta;
      }
      if (a) {
        targetRotation.current = -Math.PI / 2;
        playerRef.current.position.x -= MOVEMENT_SPEED * delta;
      }
      if (d) {
        targetRotation.current = Math.PI / 2;
        playerRef.current.position.x += MOVEMENT_SPEED * delta;
      }

      // Smooth rotation
      playerRef.current.rotation.y = THREE.MathUtils.lerp(
        playerRef.current.rotation.y,
        targetRotation.current,
        0.15
      );
    },
    [playerRef]
  );

  const isMoving = useCallback(() => {
    const { w, a, s, d } = keys.current;
    return w || a || s || d;
  }, []);

  const isJumpRequested = useCallback(() => {
    return keys.current.space;
  }, []);

  const getVelocity = useCallback(() => {
    const { w, a, s, d } = keys.current;
    return new THREE.Vector3(
      d ? MOVEMENT_SPEED : a ? -MOVEMENT_SPEED : 0,
      0,
      s ? MOVEMENT_SPEED : w ? -MOVEMENT_SPEED : 0
    );
  }, []);

  return {
    keys,
    targetRotation,
    updateMovement,
    isMoving,
    isJumpRequested,
    getVelocity,
    MOVEMENT_SPEED,
  };
}