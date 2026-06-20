"use client";

import Desktop from "./Desktop";
import BassDisplay from "./BassDisplay";
import SpiderManFigure from "./Spider-ManFigure";

// Positioned around the "About" waypoint at (0, 0, 15)
const ABOUT_CENTER: [number, number, number] = [0, 0, 15];

export default function InterestProps() {
  return (
    <group position={ABOUT_CENTER} scale={[2,2,2]}>
      <Desktop position={[-2.5, 0, -1]} rotation={[0, 0.4, 0]} />
      <SpiderManFigure position={[2.2, 0, -1.5]} rotation={[0, -0.3, 0]} />
      <BassDisplay position={[2.8, 0, 1.5]} rotation={[0, -1.2, 0]} />
    </group>
  );
}
