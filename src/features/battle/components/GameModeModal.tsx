import React, { useState } from "react";
import { X } from "lucide-react";
import { Modal, Box, Fade, Backdrop } from "@mui/material";
import { useBattleWebSocket } from "../hooks/useBattleWebSocket";
import { toast } from "@/providers/toast-config";
import Image from "next/image";
import LabelButton from "@/components/ui/LabelButton";

interface GameModeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type GameMode = "STANDARD" | "SPEED" | "ACCURACY";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  outline: "none",
  width: "auto",
  minWidth: "400px",
  overflow: "hidden",
};

const modes = [
  { id: "STANDARD" as const, label: "Standard", icon: "/scale.svg" },
  { id: "SPEED" as const, label: "Speed", icon: "/speed.svg" },
  { id: "ACCURACY" as const, label: "Accuracy", icon: "/accuracy.svg" },
];

export const GameModeModal: React.FC<GameModeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>(modes[0].id);
  const { isSearching, error, findMatch } = useBattleWebSocket();

  if (error) {
    toast.error("Failed to find match", error);
  }

  const handleFindMatch = () => {
    findMatch(selectedMode);
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          style: {
            backgroundColor: "rgba(45, 39, 53, 0.5)",
            backdropFilter: "blur(5px)",
          },
        },
      }}
    >
      <Fade in={isOpen}>
        <Box sx={modalStyle}>
          <div className="bg-[#10141D] rounded-lg p-6 flex flex-col">
            <div className="flex justify-end items-center">
              <button
                onClick={onClose}
                className="text-white transition-colors"
              >
                <X size={25} />
              </button>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-8">
                <h2 className="text-3xl font-semibold text-[#E7E7E7]">
                  Select Your Mode
                </h2>
                <div className="flex flex-col gap-4">
                  {modes.map((mode) => (
                    <label
                      key={mode.id}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded cursor-pointer transition-all
                        border ${
                          selectedMode === mode.id
                            ? "bg-[#ffffff1a] border-purple-500" // Change to purple border
                            : "border-transparent hover:bg-[#ffffff1a]"
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="gameMode"
                        value={mode.id}
                        checked={selectedMode === mode.id}
                        onChange={() => setSelectedMode(mode.id)}
                        className="outline-none focus:outline-none appearance-none"
                      />
                      <div className="flex items-center gap-2">
                        <Image
                          src={mode.icon}
                          alt={mode.label}
                          width={20}
                          height={20}
                          className="text-[#E7E7E7]"
                        />
                        <span className="text-xl font-semibold text-[#E7E7E7]">
                          {mode.label}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <LabelButton
                  variant="filled"
                  onClick={handleFindMatch}
                  disabled={isSearching}
                >
                  {isSearching ? "Searching..." : "Play Game"}
                </LabelButton>
                <LabelButton variant="outlined" onClick={onClose}>
                  Invite Friend
                </LabelButton>
              </div>
            </div>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};
