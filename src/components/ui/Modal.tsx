import React from "react";
import { X } from "lucide-react";
import { Modal as MuiModal, Box, Fade, Backdrop } from "@mui/material";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

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

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  return (
    <MuiModal
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
                  {title}
                </h2>
                <div className="flex flex-col gap-4">{children}</div>
              </div>
            </div>
          </div>
        </Box>
      </Fade>
    </MuiModal>
  );
};

export default Modal;
