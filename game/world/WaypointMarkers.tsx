"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { waypoints } from "@/game/waypoints";
import { useGameStore } from "@/store/useGameStore";

interface WaypointMarkerProps {
  position: THREE.Vector3;
  label: string;
  id: string;
  isActive: boolean;
  isCurrentLocation: boolean;
}

function WaypointMarker({ position, label, id, isActive, isCurrentLocation }: WaypointMarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const { teleportTo, currentWaypoint } = useGameStore();

  const color = useMemo(() => {
    if (isCurrentLocation) return "#22c55e"; // Green for current location
    if (isActive) return "#f59e0b"; // Amber for active/hovered
    return "#6366f1"; // Indigo for inactive
  }, [isCurrentLocation, isActive]);

  // Animation for the marker
  useFrame((state) => {
    if (meshRef.current) {
      // Bobbing animation
      meshRef.current.position.y = position.y + 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      // Always face the camera
      meshRef.current.lookAt(camera.position);
    }

    if (glowRef.current) {
      // Pulsing glow animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      glowRef.current.scale.set(scale, scale, scale);
      glowRef.current.position.y = position.y + 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  const handleClick = () => {
    if (!isCurrentLocation) {
      teleportTo(position, id);
    }
  };

  return (
    <group>
      {/* Glow effect */}
      <mesh ref={glowRef} position={[position.x, position.y + 1.5, position.z]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main marker */}
      <mesh
        ref={meshRef}
        position={[position.x, position.y + 1.5, position.z]}
        onClick={handleClick}
        onPointerOver={() => document.body.style.cursor = "pointer"}
        onPointerOut={() => document.body.style.cursor = "auto"}
      >
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Vertical beam of light */}
      <mesh position={[position.x, position.y + 3, position.z]}>
        <cylinderGeometry args={[0.1, 0.1, 6, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Ground ring */}
      <mesh position={[position.x, position.y + 0.05, position.z]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.8, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Label (only visible when close or active) */}
      {(isActive || isCurrentLocation) && (
        <mesh position={[position.x, position.y + 2.5, position.z]}>
          <planeGeometry args={[2, 0.5]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

export default function WaypointMarkers() {
  const { currentWaypoint, teleportTarget } = useGameStore();
  const [hoveredWaypoint, setHoveredWaypoint] = useState<string | null>(null);

  return (
    <group>
      {waypoints.map((waypoint) => (
        <WaypointMarker
          key={waypoint.id}
          id={waypoint.id}
          label={waypoint.label}
          position={waypoint.position}
          isActive={hoveredWaypoint === waypoint.id || teleportTarget !== null}
          isCurrentLocation={currentWaypoint === waypoint.id}
        />
      ))}
    </group>
  );
}