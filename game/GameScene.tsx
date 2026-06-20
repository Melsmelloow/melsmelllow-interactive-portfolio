"use client";

import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import World from "./world/World";
import GamifiedNavbar from "@/components/GamifiedNavbar";
import { useGameStore } from "@/store/useGameStore";

const keyboardMap = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "leftward", keys: ["KeyA", "ArrowLeft"] },
  { name: "rightward", keys: ["KeyD", "ArrowRight"] },
  { name: "jump", keys: ["Space"] },
];

export default function GameScene() {
  const { teleportTo } = useGameStore();

  const handleTeleport = (waypoint: import("@/store/useGameStore").Waypoint) => {
    teleportTo(waypoint.position, waypoint.id);
  };

  return (
    <div className="w-screen h-screen">
      <GamifiedNavbar onTeleport={handleTeleport} />
      <KeyboardControls map={keyboardMap}>
        <Canvas
          shadows
          camera={{
            position: [15, 15, 15],
            fov: 50,
          }}
        >
          <Physics>
            <World />
          </Physics>
        </Canvas>
      </KeyboardControls>
    </div>
  );
}