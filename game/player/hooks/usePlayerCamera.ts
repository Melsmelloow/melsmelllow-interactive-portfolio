"use client";

import { useRef, useCallback, useEffect } from "react";
import { Camera } from "@react-three/fiber";
import * as THREE from "three";

const CAMERA_DISTANCE = 14;
const CAMERA_SMOOTHING = 0.1;
const ORBIT_SPEED = 0.005;
const PITCH_SPEED = 0.005;

// Polar angle measured from the vertical (Y) axis.
// Smaller = looking more from above, larger = looking more from the side.
const DEFAULT_POLAR = Math.atan2(8, Math.hypot(8, 8)); // matches original (8,8,8) offset
const MIN_POLAR = 0.2; // prevent looking from directly overhead
const MAX_POLAR = Math.PI / 2 - 0.1; // prevent dipping below horizontal
const POLAR_RESET_SPEED = 0.08; // lerp speed when snapping back to default

export function usePlayerCamera(camera: Camera) {
  const azimuth = useRef(Math.PI / 4);
  const polar = useRef(DEFAULT_POLAR);
  const isDragging = useRef(false);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isDragging.current = true;
        lastMouseX.current = e.clientX;
        lastMouseY.current = e.clientY;
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      const deltaX = e.clientX - lastMouseX.current;
      const deltaY = e.clientY - lastMouseY.current;

      azimuth.current -= deltaX * ORBIT_SPEED;

      // Dragging up (negative deltaY) should look more downward -> increase polar
      polar.current = THREE.MathUtils.clamp(
        polar.current + deltaY * PITCH_SPEED,
        MIN_POLAR,
        MAX_POLAR,
      );

      lastMouseX.current = e.clientX;
      lastMouseY.current = e.clientY;
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const updateCamera = useCallback(
    (playerPosition: THREE.Vector3, isPlayerMoving: boolean = false) => {
      if (!camera) return;

      // Reset pitch back to default once the player starts moving
      if (isPlayerMoving) {
        polar.current = THREE.MathUtils.lerp(
          polar.current,
          DEFAULT_POLAR,
          POLAR_RESET_SPEED,
        );
      }

      // Spherical -> Cartesian using azimuth (horizontal) and polar (vertical)
      const horizontalRadius = CAMERA_DISTANCE * Math.cos(polar.current);
      const height = CAMERA_DISTANCE * Math.sin(polar.current);

      const offsetX = Math.sin(azimuth.current) * horizontalRadius;
      const offsetZ = Math.cos(azimuth.current) * horizontalRadius;

      const targetPosition = new THREE.Vector3(
        playerPosition.x + offsetX,
        playerPosition.y + height,
        playerPosition.z + offsetZ,
      );

      camera.position.lerp(targetPosition, CAMERA_SMOOTHING);
      camera.lookAt(playerPosition);
    },
    [camera],
  );

  const getAzimuth = useCallback(() => azimuth.current, []);

  return {
    updateCamera,
    getAzimuth,
  };
}
