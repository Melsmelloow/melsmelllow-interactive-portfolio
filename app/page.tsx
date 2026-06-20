import GameScene from "@/game/GameScene";
import IntroDialog from "@/components/IntroDialog";
import BoardViewModal from "@/game/player/components/BoardViewModal";

export default function Home() {
  return (
    <>
      <IntroDialog />
      <GameScene />
        <BoardViewModal />
    </>
  );
}
