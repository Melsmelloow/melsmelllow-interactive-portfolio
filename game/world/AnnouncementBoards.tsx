"use client";

import { waypoints } from "@/game/waypoints";
import AnnouncementBoard from "./AnnouncementBoard";

export default function AnnouncementBoards() {
  return (
    <>
      {waypoints
        .filter((wp) => wp.boardContent)
        .map((wp) => {
          const content = wp.boardContent!;
          // Fall back to the waypoint's own position/no-rotation if the board
          // doesn't specify its own (keeps simple waypoints like "home" working as-is)
          const boardPosition = content.position ?? wp.position;
          const boardRotation = content.rotation ?? [0, 0, 0];

          return (
            <AnnouncementBoard
              key={wp.id}
              id={wp.id}
              position={boardPosition}
              rotation={boardRotation}
              title={content.title}
              body={content.body ?? ""}
            />
          );
        })}
    </>
  );
}