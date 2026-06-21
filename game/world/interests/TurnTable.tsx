"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAudioStore } from "@/store/useAudioStore";
import NowPlayingHologram from "./NowPlayingHologram";

interface TurntableProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  baseColor?: string;
  platterColor?: string;
  vinylColor?: string;
  rpm?: number;
}

export default function Turntable({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  baseColor = "#3a2f28",
  platterColor = "#c9c2b3",
  vinylColor = "#1c1c1c",
  rpm = 33,
}: TurntableProps) {
  const groupRef = useRef<THREE.Group>(null);
  const vinylGroupRef = useRef<THREE.Group>(null);

  const isPlaying = useAudioStore((s) => s.isPlaying);
  const togglePlayback = useAudioStore((s) => s.togglePlayback);
  const openPlayer = useAudioStore((s) => s.openPlayer);
  const setTurntablePosition = useAudioStore((s) => s.setTurntablePosition);

  // Register this turntable's actual WORLD position once it's mounted/placed
  useEffect(() => {
    if (!groupRef.current) return;
    const worldPos = new THREE.Vector3();
    groupRef.current.getWorldPosition(worldPos);
    setTurntablePosition(worldPos);
  }, [setTurntablePosition]);

  useFrame((_, delta) => {
    if (!isPlaying || !vinylGroupRef.current) return;
    const radiansPerSecond = (rpm / 60) * Math.PI * 2;
    vinylGroupRef.current.rotation.y += radiansPerSecond * delta;
  });

  const handleClick = (e: THREE.Event) => {
    e.stopPropagation?.();
    togglePlayback();
    openPlayer();
  };

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onClick={handleClick}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    >
      {/* Body/base */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.9, 0.08, 0.7]} />
        <meshStandardMaterial color={baseColor} />
      </mesh>

      {/* Platter */}
      <mesh position={[-0.1, 0.09, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.02, 24]} />
        <meshStandardMaterial color={platterColor} />
      </mesh>

      {/* Vinyl + label */}
      <group ref={vinylGroupRef} position={[-0.1, 0.1, 0]}>
        <mesh position={[0, 0.005, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.005, 24]} />
          <meshStandardMaterial color={vinylColor} />
        </mesh>
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.005, 16]} />
          <meshStandardMaterial color="#e63946" emissive="#e63946" emissiveIntensity={0.15} />
        </mesh>
        <mesh position={[0, 0.013, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.01, 8]} />
          <meshStandardMaterial color="#e8e8e8" />
        </mesh>
      </group>

      {/* Tonearm base */}
      <mesh position={[0.3, 0.1, -0.25]}>
        <cylinderGeometry args={[0.03, 0.03, 0.04, 8]} />
        <meshStandardMaterial color="#5a5a5a" />
      </mesh>
      {/* Tonearm */}
      <mesh position={[0.18, 0.13, -0.15]} rotation={[0, 0.6, 0]}>
        <boxGeometry args={[0.35, 0.02, 0.02]} />
        <meshStandardMaterial color="#e0e0e0" metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Hologram, floating above the deck */}
      <NowPlayingHologram position={[0, 0.55, 0]} />
    </group>
  );
}