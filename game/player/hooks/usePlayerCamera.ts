import { useRef, useCallback } from "react";
import { Camera } from "@react-three/fiber";
import * as THREE from "three";

const CAMERA_OFFSET = new THREE.Vector3(8, 8, 8);
const CAMERA_SMOOTHING = 0.1;

export function usePlayerCamera(camera: Camera) {
  const smoothOffset = useRef(CAMERA_OFFSET.clone());

  const updateCamera = useCallback(
    (playerPosition: THREE.Vector3) => {
      if (!camera) return;

      // Calculate target camera position
      const targetPosition = playerPosition.clone().add(CAMERA_OFFSET);

      // Smooth camera movement
      camera.position.lerp(targetPosition, CAMERA_SMOOTHING);
      camera.lookAt(playerPosition);
    },
    [camera]
  );

  const setCameraOffset = useCallback((offset: THREE.Vector3) => {
    smoothOffset.current.copy(offset);
  }, []);

  return {
    updateCamera,
    setCameraOffset,
    CAMERA_OFFSET,
  };
}