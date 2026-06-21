"use client";

import Desktop from "./Desktop";
import BassDisplay from "./BassDisplay";
import SpiderManFigure from "./Spider-ManFigure";
import ConcertPoster from "./ConcertPoster";
import Turntable from "./TurnTable";
import TurntableTable from "./TurnTableTable";

// Positioned around the "About" waypoint at (0, 0, 15)
const ABOUT_CENTER: [number, number, number] = [0, 0, 15];

export default function InterestProps() {
  const maydayParadePosterUrl = "/mayday-parade.jpg";
  return (
    <group position={ABOUT_CENTER} scale={[2, 2, 2]}>
      {/* Desktop in the top-right corner */}
      <Desktop position={[2.3, 0, -2.5]} rotation={[0, 0, 0]} />

      {/* Spider-Man figure on the left */}
      <SpiderManFigure position={[-2.9, 0, -3]} rotation={[0, 0.5, 0]} />

      {/* Bass display on the left, slightly forward of Spider-Man */}
      <BassDisplay position={[-2, 0, -3]} rotation={[0, 1.2, 0]} />

      {/* Turntable, mirroring the AnnouncementBoard's +2 offset on the opposite side */}

      {/* Turntable table, opposite the desk */}
      <TurntableTable position={[2.8, 0, 0]}rotation={[0, Math.PI / 2, 0]} />

      <ConcertPoster
        position={[0, 1.4, -3.4]}
        rotation={[0, 0, 0]}
        imagePath={maydayParadePosterUrl}
        width={1.2}
        height={1.6}
      />
      <ConcertPoster
        position={[1.1, 1.4, -3.4]}
        rotation={[0, 0, 0]}
        imagePath="/neckdeep.jpg"
        width={1.2}
        height={1.6}
      />
      <ConcertPoster
        position={[-1.1, 1.4, -3.4]}
        rotation={[0, 0, 0]}
        imagePath="/top-poster.jpg"
        width={1.2}
        height={1.6}
      />
    </group>
  );
}
