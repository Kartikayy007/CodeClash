// import { useState } from "react";
import LabelButton from "@/components/ui/LabelButton";
import { useBattleWebSocket } from "../hooks/useBattleWebSocket";
import Loader from "@/components/ui/Loader";
import { Modal, Box, Fade, Backdrop } from "@mui/material";

export const PlayButton = () => {
  const { isSearching, findMatch, isMatchmakingModalOpen } = useBattleWebSocket();

  const handlePlayNow = () => {
    findMatch("STANDARD");
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <LabelButton onClick={handlePlayNow} disabled={isSearching}>
          {isSearching ? "Searching..." : "Play Now"}
        </LabelButton>
      </div>
      <Modal
        open={isMatchmakingModalOpen}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
            style: {
              backgroundColor: "rgba(45, 39, 53, 0.7)",
              backdropFilter: "blur(5px)",
            },
          },
        }}
      >
        <Fade in={isMatchmakingModalOpen}>
          <Box sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            outline: "none",
            width: "auto",
            minWidth: "350px",
            overflow: "hidden",
          }}>
            <div className="bg-[#10141D] rounded-lg p-8 flex flex-col items-center gap-6">
              <Loader size="large" />
              <h2 className="text-2xl font-bold text-white text-center">Matching you with a worthy opponent...</h2>
              <p className="text-gray-400 text-center">Sharpening swords, preparing the arena!</p>
            </div>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default PlayButton;
