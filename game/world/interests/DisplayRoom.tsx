"use client";

import { RigidBody } from "@react-three/rapier";

interface DisplayRoomProps {
  position?: [number, number, number];
  width?: number;
  depth?: number;
  height?: number;
  wallThickness?: number;
  entranceWidth?: number; // gap size for the doorway (default: door-sized, not whole-wall)
  entranceSide?: "north" | "south" | "east" | "west";
  wallColor?: string;
  roofColor?: string;
  floorColor?: string;
}

export default function DisplayRoom({
  position = [0, 0, 0],
  width = 10,
  depth = 10,
  height = 4,
  wallThickness = 0.2,
  entranceWidth = 1.4, // ~door width, was 2.5
  entranceSide = "north", // moved from "south" to "north"
  wallColor = "#d8cfc0",
  roofColor = "#7a4f3a",
  floorColor = "#b89b73",
}: DisplayRoomProps) {
  const halfW = width / 2;
  const halfD = depth / 2;
  const t = wallThickness;

  const renderSplitWall = (
    axis: "x" | "z",
    fixedCoord: number,
    fullLength: number
  ) => {
    const gap = entranceWidth;
    const segLength = (fullLength - gap) / 2;
    if (segLength <= 0) return null;

    const offset = gap / 2 + segLength / 2;

    if (axis === "x") {
      return (
        <>
          <RigidBody type="fixed" colliders="cuboid">
            <mesh position={[-offset, height / 2, fixedCoord]}>
              <boxGeometry args={[segLength, height, t]} />
              <meshStandardMaterial color={wallColor} />
            </mesh>
          </RigidBody>
          <RigidBody type="fixed" colliders="cuboid">
            <mesh position={[offset, height / 2, fixedCoord]}>
              <boxGeometry args={[segLength, height, t]} />
              <meshStandardMaterial color={wallColor} />
            </mesh>
          </RigidBody>
        </>
      );
    } else {
      return (
        <>
          <RigidBody type="fixed" colliders="cuboid">
            <mesh position={[fixedCoord, height / 2, -offset]}>
              <boxGeometry args={[t, height, segLength]} />
              <meshStandardMaterial color={wallColor} />
            </mesh>
          </RigidBody>
          <RigidBody type="fixed" colliders="cuboid">
            <mesh position={[fixedCoord, height / 2, offset]}>
              <boxGeometry args={[t, height, segLength]} />
              <meshStandardMaterial color={wallColor} />
            </mesh>
          </RigidBody>
        </>
      );
    }
  };

  const renderSolidWall = (axis: "x" | "z", fixedCoord: number, fullLength: number) => {
    if (axis === "x") {
      return (
        <RigidBody type="fixed" colliders="cuboid">
          <mesh position={[0, height / 2, fixedCoord]}>
            <boxGeometry args={[fullLength, height, t]} />
            <meshStandardMaterial color={wallColor} />
          </mesh>
        </RigidBody>
      );
    }
    return (
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[fixedCoord, height / 2, 0]}>
          <boxGeometry args={[t, height, fullLength]} />
          <meshStandardMaterial color={wallColor} />
        </mesh>
      </RigidBody>
    );
  };

  return (
    <group position={position}>
      {/* Floor */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={floorColor} />
      </mesh>

      {/* North wall (+Z) */}
      {entranceSide === "north"
        ? renderSplitWall("x", halfD, width)
        : renderSolidWall("x", halfD, width)}

      {/* South wall (-Z) */}
      {entranceSide === "south"
        ? renderSplitWall("x", -halfD, width)
        : renderSolidWall("x", -halfD, width)}

      {/* East wall (+X) */}
      {entranceSide === "east"
        ? renderSplitWall("z", halfW, depth)
        : renderSolidWall("z", halfW, depth)}

      {/* West wall (-X) */}
      {entranceSide === "west"
        ? renderSplitWall("z", -halfW, depth)
        : renderSolidWall("z", -halfW, depth)}

      {/* Roof */}
      <mesh position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={roofColor} side={2} />
      </mesh>
    </group>
  );
}