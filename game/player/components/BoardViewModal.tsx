"use client";

import { useGameStore } from "@/store/useGameStore";
import { getWaypointById } from "@/game/waypoints";

export default function BoardViewModal() {
  const { activeBoardId, closeBoardView } = useGameStore();
  if (!activeBoardId) return null;

  const waypoint = getWaypointById(activeBoardId);
  if (!waypoint?.boardContent) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
      onClick={closeBoardView}
    >
      <div
        style={{
          background: "#fdf6e3",
          padding: "2rem",
          borderRadius: "8px",
          maxWidth: "500px",
          width: "90%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0 }}>{waypoint.boardContent.title}</h2>
        <p>{waypoint.boardContent.body}</p>
        <button onClick={closeBoardView}>Close</button>
      </div>
    </div>
  );
}
