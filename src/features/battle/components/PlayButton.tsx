import { useState } from "react";
import LabelButton from "@/components/ui/LabelButton";
import { GameModeModal } from "./GameModeModal";

export const PlayButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <LabelButton onClick={() => setIsModalOpen(true)}>Play Now</LabelButton>
      </div>

      <GameModeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default PlayButton;
