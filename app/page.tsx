import GameScene from "@/game/GameScene";
import IntroDialog from "@/components/IntroDialog";
import BoardViewModal from "@/game/player/components/BoardViewModal";
import AudioManager from "@/game/player/components/audio/AudioManager";
import MusicPlayer from "@/game/world/interests/MusicPlayer";
import MusicPlayerToggle from "@/game/world/interests/MusicPlayerToggle";

export default function Home() {
  return (
    <>
         <AudioManager />
      <MusicPlayer />
      <MusicPlayerToggle />
      <IntroDialog />
      <GameScene />
      <BoardViewModal />
    </>
  );
}
