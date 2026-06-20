"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { Character, type CharacterRefs } from "./components";
import { usePlayerMovement } from "./hooks/usePlayerMovement";
import { usePlayerPhysics } from "./hooks/usePlayerPhysics";
import { usePlayerCamera } from "./hooks/usePlayerCamera";
import { usePlayerAnimation } from "./hooks/usePlayerAnimation";
import { useGameStore } from "@/store/useGameStore";

interface PlayerProps {
  showBass?: boolean;
  logoTexturePath?: string;
}

// Teleportation animation phases
type TeleportPhase =
  | "idle"
  | "preparing"
  | "posing"
  | "vanishing"
  | "traveling"
  | "arriving"
  | "complete";

// Teleportation animation timing (in seconds)
const TELEPORT_TIMING = {
  prepare: 0.3, // Time to raise arms
  pose: 0.5, // Time holding the finger-to-forehead pose
  vanish: 0.3, // Time to fade out
  travel: 0.1, // Instant travel time
  arrive: 0.3, // Time to fade in at destination
  total: 1.5, // Total animation duration
};

export default function Player({
  showBass = false,
  logoTexturePath = "/top.jpg",
}: PlayerProps) {
  // Main player group ref
  const playerRef = useRef<THREE.Group>(null);

  // Character refs for animation
  const [characterRefs, setCharacterRefs] = useState<CharacterRefs | null>(
    null,
  );

  // Camera
  const { camera, scene } = useThree();

  // Game store for teleportation
  const {
    teleportTarget,
    isTeleporting,
    currentWaypoint,
    completeTeleport,
    setCurrentWaypoint,
  } = useGameStore();

  // Teleportation animation state
  const teleportPhase = useRef<TeleportPhase>("idle");
  const teleportStartTime = useRef<number>(0);
  const teleportStartPosition = useRef<THREE.Vector3 | null>(null);
  const originalMaterialOpacity = useRef<Map<THREE.Mesh, number>>(new Map());
  const isTeleportAnimating = useRef(false);

  // Custom hooks for separation of concerns
  
  const { updateCamera, getAzimuth } = usePlayerCamera(camera);
  const { updateMovement, isMoving, isJumpRequested } = usePlayerMovement(
    playerRef,
    getAzimuth,
  );
  const { applyGravity, jump, onGround } = usePlayerPhysics(playerRef);
const { updateWalkAnimation, updateBreathingAnimation } = usePlayerAnimation(
  characterRefs
    ? {
        ...characterRefs,
        // characterRefs already has leftLowerArmRef/rightLowerArmRef by name match
      }
    : {},
);

  // Handle character refs ready
  const handleRefsReady = useCallback((refs: CharacterRefs) => {
    setCharacterRefs(refs);
  }, []);

  // Check for waypoint proximity to update current location
  useEffect(() => {
    if (!playerRef.current) return;

    const checkProximity = () => {
      const playerPos = playerRef.current?.position;
      if (!playerPos) return;

      // Check distance to each waypoint
      import("@/game/waypoints").then(({ waypoints }) => {
        for (const waypoint of waypoints) {
          const distance = playerPos.distanceTo(waypoint.position);
          if (distance < 3) {
            // Within 3 units of waypoint
            if (currentWaypoint !== waypoint.id) {
              setCurrentWaypoint(waypoint.id);
            }
            return;
          }
        }
        // Not near any waypoint
        if (currentWaypoint !== null) {
          setCurrentWaypoint(null);
        }
      });
    };

    // Check every 500ms
    const interval = setInterval(checkProximity, 500);
    return () => clearInterval(interval);
  }, [currentWaypoint, setCurrentWaypoint]);

  // Initialize materials for fade effect
  useEffect(() => {
    if (characterRefs && originalMaterialOpacity.current.size === 0) {
      const meshes: THREE.Mesh[] = [];
      playerRef.current?.traverse((child) => {
        if (child.type === "Mesh") {
          meshes.push(child as THREE.Mesh);
        }
      });

      meshes.forEach((mesh) => {
        const material = mesh.material as THREE.MeshStandardMaterial;
        if (material) {
          originalMaterialOpacity.current.set(mesh, material.opacity ?? 1);
        }
      });
    }
  }, [characterRefs]);

  // Handle teleportation start
  useEffect(() => {
    if (
      isTeleporting &&
      teleportTarget &&
      playerRef.current &&
      !isTeleportAnimating.current
    ) {
      teleportPhase.current = "preparing";
      teleportStartPosition.current = playerRef.current.position.clone();
      teleportStartTime.current = performance.now();
      isTeleportAnimating.current = true;
    }
  }, [isTeleporting, teleportTarget]);

  // Animate a simple "waving goodbye" teleportation
  const animateTeleportPose = useCallback(
    (elapsed: number, phase: TeleportPhase) => {
      if (!characterRefs) return;

      const {
        leftUpperArmRef,
        leftLowerArmRef,
        leftLegRef,
        rightLegRef,
        rightUpperArmRef,
        rightLowerArmRef,
      } = characterRefs;

      // Helper to safely set rotation
      const setRotation = (
        ref: React.RefObject<THREE.Group | null>,
        x: number,
        y: number,
        z: number,
      ) => {
        if (ref.current) {
          ref.current.rotation.set(x, y, z);
        }
      };
      if (phase === "preparing") {
        const t = Math.min(elapsed / TELEPORT_TIMING.prepare, 1);
        const easeOut = 1 - Math.pow(1 - t, 3);

        setRotation(rightUpperArmRef, 0, 0, Math.PI * 0.5 * easeOut);
        setRotation(rightLowerArmRef, 0, 0, Math.PI * 0.5 * easeOut);
      } else if (phase === "posing") {
        const poseElapsed = elapsed - TELEPORT_TIMING.prepare;
        const waveAngle = Math.sin(poseElapsed * 6) * 0.3; // 6 rad/s, 0.3 rad swing

        setRotation(rightUpperArmRef, 0, 0, Math.PI * 0.5); // hold raised
        setRotation(rightLowerArmRef, 0, 0, Math.PI * 0.5 + waveAngle); // base bend + wiggle
      }
    },
    [characterRefs],
  );

  // Apply fade effect to character
  const setCharacterOpacity = useCallback((opacity: number) => {
    if (!playerRef.current) return;

    playerRef.current.traverse((child) => {
      if (child.type === "Mesh") {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;
        if (material) {
          material.transparent = true;
          material.opacity = opacity;
          material.depthWrite = opacity > 0.5;
        }
      }
    });
  }, []);

  // Create particle burst effect
  const createParticleBurst = useCallback(
    (
      position: THREE.Vector3,
      count: number = 100,
      color: string = "#ffffff",
    ) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const velocities = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      const colorObj = new THREE.Color(color);

      for (let i = 0; i < count; i++) {
        positions[i * 3] = position.x;
        positions[i * 3 + 1] = position.y + 1;
        positions[i * 3 + 2] = position.z;

        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const speed = 3 + Math.random() * 5;

        velocities[i * 3] = speed * Math.sin(phi) * Math.cos(theta);
        velocities[i * 3 + 1] = speed * Math.sin(phi) * Math.sin(theta) + 2;
        velocities[i * 3 + 2] = speed * Math.cos(phi);

        colors[i * 3] = colorObj.r;
        colors[i * 3 + 1] = colorObj.g;
        colors[i * 3 + 2] = colorObj.b;
      }

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.2,
        transparent: true,
        opacity: 1,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const points = new THREE.Points(geometry, material);
      points.userData = { velocities, startTime: performance.now(), color };
      scene.add(points);

      return points;
    },
    [scene],
  );

  // Animate particle systems
  const animateParticles = useCallback(() => {
    const currentTime = performance.now();
    const toRemove: THREE.Points[] = [];

    scene.traverse((object) => {
      if (object.type === "Points" && object.userData.velocities) {
        const points = object as THREE.Points;
        const positions = points.geometry.attributes.position
          .array as Float32Array;
        const velocities = object.userData.velocities as Float32Array;
        const elapsed = (currentTime - object.userData.startTime) / 1000;

        for (let i = 0; i < velocities.length / 3; i++) {
          positions[i * 3] += velocities[i * 3] * 0.016;
          positions[i * 3 + 1] += velocities[i * 3 + 1] * 0.016;
          positions[i * 3 + 2] += velocities[i * 3 + 2] * 0.016;

          // Gravity
          velocities[i * 3 + 1] -= 9.8 * 0.016;
        }

        points.geometry.attributes.position.needsUpdate = true;
        (points.material as THREE.PointsMaterial).opacity = Math.max(
          0,
          1 - elapsed * 2,
        );

        if (elapsed > 0.5) {
          toRemove.push(points);
        }
      }
    });

    toRemove.forEach((p) => {
      scene.remove(p);
      p.geometry.dispose();
      (p.material as THREE.PointsMaterial).dispose();
    });
  }, [scene]);

  // Main game loop
  useFrame((_, delta) => {
    if (!playerRef.current) return;

    // Handle teleportation animation
    if (
      isTeleportAnimating.current &&
      teleportStartPosition.current &&
      teleportTarget
    ) {
      const elapsed = (performance.now() - teleportStartTime.current) / 1000;
      const currentPhase = teleportPhase.current;

      // Update animation based on phase
      if (currentPhase === "preparing" || currentPhase === "posing") {
        animateTeleportPose(elapsed, currentPhase);

        // Transition between phases
        if (
          currentPhase === "preparing" &&
          elapsed >= TELEPORT_TIMING.prepare
        ) {
          teleportPhase.current = "posing";
        } else if (
          currentPhase === "posing" &&
          elapsed >= TELEPORT_TIMING.prepare + TELEPORT_TIMING.pose
        ) {
          teleportPhase.current = "vanishing";
          // Create vanish particle effect at start position
          createParticleBurst(teleportStartPosition.current, 150, "#00ffff");
        }
      }

      // Vanishing phase - fade out
      if (currentPhase === "vanishing") {
        const vanishElapsed =
          elapsed - TELEPORT_TIMING.prepare - TELEPORT_TIMING.pose;
        const fadeProgress = Math.min(
          vanishElapsed / TELEPORT_TIMING.vanish,
          1,
        );
        setCharacterOpacity(1 - fadeProgress);

        if (fadeProgress >= 1) {
          // Actually teleport (move to new position while invisible)
          playerRef.current.position.copy(teleportTarget);
          playerRef.current.position.y = 0;
          teleportPhase.current = "arriving";
          teleportStartTime.current = performance.now();

          // Create arrival particle effect
          createParticleBurst(teleportTarget, 150, "#ffff00");
        }
      }

      // Arriving phase - fade in
      if (currentPhase === "arriving") {
        const arriveElapsed =
          (performance.now() - teleportStartTime.current) / 1000;
        const fadeProgress = Math.min(
          arriveElapsed / TELEPORT_TIMING.arrive,
          1,
        );
        setCharacterOpacity(fadeProgress);

        // Reset arm positions during fade in
        if (characterRefs) {
          const resetT = 1 - fadeProgress;
          if (characterRefs.rightUpperArmRef.current) {
            characterRefs.rightUpperArmRef.current.rotation.set(
              Math.PI * 0.4 * resetT,
              0,
              0,
            );
          }
          if (characterRefs.rightLowerArmRef.current) {
            characterRefs.rightLowerArmRef.current.rotation.set(
              -Math.PI * 0.3 * resetT,
              0,
              0,
            );
          }
          if (characterRefs.leftUpperArmRef.current) {
            characterRefs.leftUpperArmRef.current.rotation.set(
              Math.PI * 0.4 * resetT,
              0,
              0,
            );
          }
          if (characterRefs.leftLowerArmRef.current) {
            characterRefs.leftLowerArmRef.current.rotation.set(
              -Math.PI * 0.3 * resetT,
              0,
              0,
            );
          }
        }

        if (fadeProgress >= 1) {
          // Teleportation complete!
          setCharacterOpacity(1);
          teleportPhase.current = "idle"; // Reset to idle to restore player control
          isTeleportAnimating.current = false;
          completeTeleport();

          // Clean up any remaining particles
          scene.traverse((object) => {
            if (object.type === "Points" && object.userData.velocities) {
              const points = object as THREE.Points;
              scene.remove(points);
              points.geometry.dispose();
              (points.material as THREE.PointsMaterial).dispose();
            }
          });
        }
      }

      // Animate particles
      animateParticles();

      // Update camera during teleport
      updateCamera(playerRef.current.position, false);
      return; // Skip normal movement during teleport
    }

    // Update movement (skip if teleporting)
    if (!isTeleporting && teleportPhase.current === "idle") {
      updateMovement(delta);
    }

    // Handle jumping
    if (isJumpRequested() && teleportPhase.current === "idle") {
      jump();
    }

    // Apply physics (gravity)
    if (teleportPhase.current === "idle") {
      applyGravity(delta);
    }

    // Update camera to follow player
    updateCamera(playerRef.current.position, isMoving());

    // Update animations
    const isWalking =
      isMoving() && onGround && teleportPhase.current === "idle";
    updateWalkAnimation(isWalking, delta);
    updateBreathingAnimation(
      onGround && teleportPhase.current === "idle",
      delta,
    );
  });

  return (
    <RigidBody colliders="cuboid" enabledRotations={[false, false, false]}>
      <group ref={playerRef}>
        <Character
          ref={handleRefsReady}
          showBass={showBass}
          logoTexturePath={logoTexturePath}
        />
      </group>
    </RigidBody>
  );
}
