import { Sky } from "@react-three/drei";
import Player from "../player/Player";
import AnnouncementBoards from "./AnnouncementBoards";
import Ground from "./Ground";
import InterestProps from "./interests/InterestProps";
import TeleportEffect from "./TeleportEffect";
import WaypointMarkers from "./WaypointMarkers";
import DynamicSky from "./DynamicSky";
import DisplayRoom from "./interests/DisplayRoom";

export default function World() {
  return (
    <>
      <DynamicSky />

      <gridHelper args={[100, 100]} />
      <Ground />
      <WaypointMarkers />
      <AnnouncementBoards />
      <TeleportEffect />
      <Player />

      {/* Everything that can occlude the camera view of the player */}
      <group name="occluders">
        <DisplayRoom
          position={[0, 0, 15]}
          width={14}
          depth={14}
          height={5}
          entranceWidth={15}
          entranceSide="north"
        />
        <InterestProps />
      </group>
    </>
  );
}
