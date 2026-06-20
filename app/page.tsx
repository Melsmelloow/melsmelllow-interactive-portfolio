import GameScene from "@/game/GameScene";
import IntroDialog from "@/components/IntroDialog";

export default function Home() {
  return (
    <>
      <IntroDialog />
      <GameScene />
    </>
  );
}
