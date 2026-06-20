import { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import type { PlayerKeys } from "../types/player.types";

const MOVEMENT_SPEED = 5;

export function usePlayerMovement(
  playerRef: React.RefObject<THREE.Group | null>,
  getAzimuth: () => number,
) {
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
      if (!w && !a && !s && !d) return;

      // Raw input vector in "camera-local" space:
      // local -Z = forward (away from camera), local +X = right
      let inputX = 0;
      let inputZ = 0;
      if (w) inputZ -= 1;
      if (s) inputZ += 1;
      if (a) inputX -= 1;
      if (d) inputX += 1;

      // Normalize so diagonal movement isn't faster
      const length = Math.hypot(inputX, inputZ);
      if (length > 0) {
        inputX /= length;
        inputZ /= length;
      }

      // Rotate the input vector by the camera's azimuth so movement
      // is relative to where the camera is currently looking
      const angle = getAzimuth();
      const sin = Math.sin(angle);
      const cos = Math.cos(angle);
      const worldX = inputX * cos + inputZ * sin;
      const worldZ = -inputX * sin + inputZ * cos;

      playerRef.current.position.x += worldX * MOVEMENT_SPEED * delta;
      playerRef.current.position.z += worldZ * MOVEMENT_SPEED * delta;

      // Face the direction of movement (independent of camera, as requested)
      if (worldX !== 0 || worldZ !== 0) {
        targetRotation.current = Math.atan2(worldX, worldZ);
      }

      // Smooth rotation
      playerRef.current.rotation.y = THREE.MathUtils.lerp(
        playerRef.current.rotation.y,
        targetRotation.current,
        0.15,
      );
    },
    [playerRef, getAzimuth],
  );

  const isMoving = useCallback(() => {
    const { w, a, s, d } = keys.current;
    return w || a || s || d;
  }, []);

  const isJumpRequested = useCallback(() => {
    return keys.current.space;
  }, []);

  return {
    keys,
    targetRotation,
    updateMovement,
    isMoving,
    isJumpRequested,
    MOVEMENT_SPEED,
  };
}