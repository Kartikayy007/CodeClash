import { useState } from "react";
import LabelButton from "@/components/ui/LabelButton";
import { MatchmakingPopup } from "@/components/ui/MatchmakingPopup";
import { useBattleWebSocket } from "../hooks/useBattleWebSocket";

export const PlayButton = () => {
  const [isMatchmaking, setIsMatchmaking] = useState(false);
  const { findMatch, cancelMatchmaking } = useBattleWebSocket();

  const handlePlayNow = () => {
    setIsMatchmaking(true);
    findMatch("STANDARD");
  };

  const handleCancelMatchmaking = () => {
    setIsMatchmaking(false);
    cancelMatchmaking();
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <LabelButton onClick={handlePlayNow}>Play Now</LabelButton>
      </div>

      <MatchmakingPopup 
        isOpen={isMatchmaking} 
        onClose={handleCancelMatchmaking} 
      />
    </>
  );
};

export default PlayButton;
