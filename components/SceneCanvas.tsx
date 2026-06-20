"use client";

import { Canvas } from "@react-three/fiber";

export default function SceneCanvas({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Canvas
      shadows
      camera={{
        position: [0, 5, 10],
        fov: 50,
      }}
    >
      {children}
    </Canvas>
  );
}