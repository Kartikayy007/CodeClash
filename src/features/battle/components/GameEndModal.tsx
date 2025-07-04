import React, { useEffect, useState } from "react";
import { Modal, Box, Fade, Backdrop } from "@mui/material";
import { Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { resetGameEnd } from "../slices/gameEndSlice";

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

export const GameEndModal = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const gameEndState = useSelector((state: RootState) => state.gameEnd);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [newRating, setNewRating] = useState<number | null>(null);

  console.log("GameEndModal render:", { gameEndState, userId });

  const isWinner = userId === gameEndState.winnerId;

  useEffect(() => {
    if (gameEndState.isOpen) {
      console.log("GameEndModal: Modal opened", gameEndState);

      // Fetch updated user profile to get new rating
      const fetchUpdatedRating = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          if (!token) return;

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/profile`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data.rating) {
              setNewRating(data.data.rating);
              console.log("New rating fetched:", data.data.rating);
            }
          }
        } catch (error) {
          console.error("Error fetching updated rating:", error);
        }
      };

      fetchUpdatedRating();

      const timer = setTimeout(() => {
        console.log("GameEndModal: Redirecting to dashboard...");
        dispatch(resetGameEnd());
        // Use window.location.href for more reliable navigation
        try {
          window.location.href = "/dashboard";
        } catch (error) {
          console.error("Navigation error:", error);
          // Fallback to router
          router.push("/dashboard");
        }
      }, 5000);

      return () => {
        clearTimeout(timer);
        console.log("GameEndModal: Cleanup timer");
      };
    }
  }, [gameEndState, router, dispatch]);

  if (!gameEndState.isOpen) {
    console.log("GameEndModal: Not showing because isOpen is false");
    return null;
  }

  return (
    <Modal
      open={gameEndState.isOpen}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          style: {
            backgroundColor: "rgba(45, 39, 53, 0.8)",
            backdropFilter: "blur(5px)",
          },
        },
      }}
    >
      <Fade in={gameEndState.isOpen}>
        <Box sx={modalStyle}>
          <div className="bg-[#10141D] rounded-lg p-8 flex flex-col items-center gap-6">
            <div
              className={`text-6xl ${isWinner ? "text-yellow-500 animate-bounce" : "text-gray-400"}`}
            >
              <Trophy />
            </div>

            <h2 className="text-3xl font-bold text-white">
              {isWinner ? "Victory!" : "Better luck next time!"}
            </h2>

            {newRating !== null && (
              <div className="flex items-center gap-2 text-xl">
                <span className="text-gray-300">New Rating</span>
                <div className="text-cyan-400 font-bold">
                  {newRating}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <p className="text-gray-400 text-center">
                Redirecting to dashboard in 5 seconds...
              </p>
              
              <button
                onClick={() => {
                  dispatch(resetGameEnd());
                  window.location.href = "/dashboard";
                }}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
              >
                Go to Dashboard Now
              </button>
            </div>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};
