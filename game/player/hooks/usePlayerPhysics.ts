import { useRef, useCallback, useState } from "react";
import * as THREE from "three";

const GRAVITY = -9.81;
const JUMP_FORCE = 5;
const GROUND_LEVEL = 1;

export function usePlayerPhysics(playerRef: React.RefObject<THREE.Group | null>) {
  const velocityY = useRef(0);
  const [onGround, setOnGround] = useState(true);
  const [isJumping, setIsJumping] = useState(false);

  const applyGravity = useCallback(
    (delta: number) => {
      if (!playerRef.current) return;

      // Apply gravity
      velocityY.current += GRAVITY * delta;

      // Apply vertical velocity
      playerRef.current.position.y += velocityY.current * delta;

      // Ground collision
      if (playerRef.current.position.y <= GROUND_LEVEL) {
        playerRef.current.position.y = GROUND_LEVEL;
        velocityY.current = 0;
        
        if (!onGround) {
          setOnGround(true);
          setIsJumping(false);
        }
      } else {
        if (onGround) {
          setOnGround(false);
        }
      }
    },
    [playerRef, onGround]
  );

  const jump = useCallback(() => {
    if (onGround && playerRef.current) {
      velocityY.current = JUMP_FORCE;
      setOnGround(false);
      setIsJumping(true);
    }
  }, [onGround]);

  const resetPhysics = useCallback(() => {
    velocityY.current = 0;
    setOnGround(true);
    setIsJumping(false);
  }, []);

  return {
    velocityY,
    onGround,
    isJumping,
    applyGravity,
    jump,
    resetPhysics,
    GRAVITY,
    JUMP_FORCE,
    GROUND_LEVEL,
  };
}