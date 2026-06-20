import { Sky } from "@react-three/drei";
import Ground from "./Ground";
import Buildings from "../buildings/Buildings";
import Player from "../player/Player";
import Trees from "./Trees";
import WaypointMarkers from "./WaypointMarkers";
import TeleportEffect from "./TeleportEffect";

export default function World() {
  return (
    <>
      <Sky sunPosition={[100, 20, 100]} />

      <ambientLight intensity={1} />
      <gridHelper args={[100, 100]} />
      <directionalLight position={[10, 10, 5]} intensity={2} castShadow />

      <Ground />
      <Buildings />
      <WaypointMarkers />
      <TeleportEffect />
      <Player />
      {/* <Trees /> */}
    </>
  );
}
