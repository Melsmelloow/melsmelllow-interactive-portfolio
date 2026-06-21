"use client";

import { useRef, useCallback, useEffect } from "react";
import { Camera } from "@react-three/fiber";
import * as THREE from "three";

const CAMERA_DISTANCE = 18;
const CAMERA_SMOOTHING = 0.1;
const ORBIT_SPEED = 0.005;
const PITCH_SPEED = 0.005;

const DEFAULT_POLAR = Math.atan2(8, Math.hypot(8, 8));
const MIN_POLAR = 0.2;
const MAX_POLAR = Math.PI / 2 - 0.1;
const POLAR_RESET_SPEED = 0.08;

// --- Zoom settings (new) ---
const MIN_CAMERA_DISTANCE = 5;
const MAX_CAMERA_DISTANCE = 25;
const ZOOM_SPEED = 0.02;
const DISTANCE_RESET_SPEED = 0.08;

// --- Occlusion fade settings ---
const FADE_OPACITY = 0.15;
const FADE_SPEED = 0.15;
const RAYCAST_PADDING = 0.3;

export function usePlayerCamera(camera: Camera) {
  const azimuth = useRef(Math.PI / 4);
  const polar = useRef(DEFAULT_POLAR);
  const distance = useRef(CAMERA_DISTANCE);
  const isDragging = useRef(false);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);

  const raycaster = useRef(new THREE.Raycaster());
  const fadedMaterials = useRef<Map<THREE.Material, number>>(new Map());

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

    // New: wheel handler, additive — doesn't touch drag logic at all
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      distance.current = THREE.MathUtils.clamp(
        distance.current + e.deltaY * ZOOM_SPEED,
        MIN_CAMERA_DISTANCE,
        MAX_CAMERA_DISTANCE,
      );
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const updateOcclusion = useCallback(
    (scene: THREE.Object3D, playerPosition: THREE.Vector3) => {
      const camPos = camera.position;
      const dir = new THREE.Vector3()
        .subVectors(camPos, playerPosition)
        .normalize();
      const dist = camPos.distanceTo(playerPosition);

      const origin = playerPosition.clone().addScaledVector(dir, RAYCAST_PADDING);

      raycaster.current.set(origin, dir);
      raycaster.current.far = dist - RAYCAST_PADDING;

      const hits = raycaster.current.intersectObject(scene, true);

      const hitMaterials = new Set<THREE.Material>();
      for (const hit of hits) {
        const mesh = hit.object as THREE.Mesh;
        if (!mesh.isMesh) continue;
        if (mesh.userData.noOcclusionFade) continue;

        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

        for (const mat of mats) {
          if (!mat.transparent) {
            mat.transparent = true;
          }
          hitMaterials.add(mat);
          if (!fadedMaterials.current.has(mat)) {
            fadedMaterials.current.set(mat, mat.opacity ?? 1);
          }
        }
      }

      for (const mat of hitMaterials) {
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, FADE_OPACITY, FADE_SPEED);
      }

      for (const [mat, originalOpacity] of fadedMaterials.current) {
        if (hitMaterials.has(mat)) continue;

        mat.opacity = THREE.MathUtils.lerp(mat.opacity, originalOpacity, FADE_SPEED);

        if (Math.abs(mat.opacity - originalOpacity) < 0.01) {
          mat.opacity = originalOpacity;
          if (originalOpacity >= 1) {
            mat.transparent = false;
          }
          fadedMaterials.current.delete(mat);
        }
      }
    },
    [camera],
  );

  const updateCamera = useCallback(
    (playerPosition: THREE.Vector3, isPlayerMoving: boolean = false) => {
      if (!camera) return;

      if (isPlayerMoving) {
        polar.current = THREE.MathUtils.lerp(
          polar.current,
          DEFAULT_POLAR,
          POLAR_RESET_SPEED,
        );
        distance.current = THREE.MathUtils.lerp(
          distance.current,
          CAMERA_DISTANCE,
          DISTANCE_RESET_SPEED,
        );
      }

      const horizontalRadius = distance.current * Math.cos(polar.current);
      const height = distance.current * Math.sin(polar.current);

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
    updateOcclusion,
    getAzimuth,
  };
}