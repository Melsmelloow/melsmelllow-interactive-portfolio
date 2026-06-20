import * as THREE from "three";

export interface PlayerState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  onGround: boolean;
  isIdle: boolean;
  isJumping: boolean;
}

export interface PlayerKeys {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
  space: boolean;
}

export interface PlayerAnimationState {
  isWalking: boolean;
  walkCycle: number;
  breathingCycle: number;
}

export interface CharacterPartProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  ref?: React.RefObject<THREE.Mesh | THREE.Group | null>;
}