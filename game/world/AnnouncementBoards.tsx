"use client";

import { waypoints } from "@/game/waypoints";
import AnnouncementBoard from "./AnnouncementBoard";

export default function AnnouncementBoards() {
  return (
    <>
      {waypoints
        .filter((wp) => wp.boardContent)
        .map((wp) => (
          <AnnouncementBoard
            key={wp.id}
            id={wp.id}
            position={wp.position}
            title={wp.boardContent!.title}
            body={wp.boardContent!.body ?? ""}
          />
        ))}
    </>
  );
}