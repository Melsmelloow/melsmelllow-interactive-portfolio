import { Sky } from "@react-three/drei";
import Player from "../player/Player";
import AnnouncementBoards from "./AnnouncementBoards";
import Ground from "./Ground";
import InterestProps from "./interests/InterestProps";
import TeleportEffect from "./TeleportEffect";
import WaypointMarkers from "./WaypointMarkers";
import DynamicSky from "./DynamicSky";

export default function World() {
  return (
    <>
       <DynamicSky />

      <gridHelper args={[100, 100]} />
      <Ground />
      {/* <Buildings /> */}
      <WaypointMarkers />
      <AnnouncementBoards />
      <TeleportEffect />
      <Player />
      {/* <Trees /> */}

      {/* About me props */}
      <InterestProps />
    </>
  );
}