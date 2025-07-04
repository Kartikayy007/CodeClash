import React, { useEffect, useState } from "react";
import { Modal, Box, Fade, Backdrop } from "@mui/material";
import { Trophy, TrendingUp, TrendingDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { resetGameEnd } from "../slices/gameEndSlice";
import ReactConfetti from "react-confetti";

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
  const authState = useSelector((state: RootState) => state.auth);
  const userId = authState.user?.id;
  const [newRating, setNewRating] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // LOGGING for debugging
  useEffect(() => {
    console.log("[GameEndModal] userId:", userId);
    console.log("[GameEndModal] winnerId:", gameEndState.winnerId);
    console.log("[GameEndModal] gameEndState:", gameEndState);
    console.log("[GameEndModal] authState:", authState);
    if (!userId && gameEndState.isOpen) {
      console.warn("[GameEndModal] userId is missing when modal is open! This may cause winner/loser state to be wrong.");
    }
  }, [userId, gameEndState, authState]);

  const isWinner = userId === gameEndState.winnerId;

  useEffect(() => {
    if (gameEndState.isOpen) {
      // Show confetti for winner
      if (isWinner) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 8000);
      }

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
        } catch {
          // Error fetching updated rating (ignored)
        }
      };

      fetchUpdatedRating();

      const timer = setTimeout(() => {
        dispatch(resetGameEnd());
        try {
          window.location.href = "/dashboard";
        } catch {
          router.push("/dashboard");
        }
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [gameEndState, router, dispatch, isWinner]);

  // Only show modal if userId is set
  if (!userId || !gameEndState.isOpen) {
    if (!userId && gameEndState.isOpen) {
      console.warn("[GameEndModal] Not showing modal because userId is missing!");
    }
    return null;
  }

  return (
    <>
      {showConfetti && (
        <ReactConfetti
          recycle={false}
          numberOfPieces={500}
          gravity={0.15}
          width={window.innerWidth}
          height={window.innerHeight}
          style={{ zIndex: 1000 }}
          colors={["#22c55e"]}
        />
      )}
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
            <div className="bg-[#10141D] rounded-lg p-8 flex flex-col items-center gap-6 relative">
              <div
                className={`text-6xl ${isWinner ? "text-yellow-500 animate-bounce" : "text-gray-400"}`}
              >
                <Trophy />
              </div>

              <h2 className="text-3xl font-bold text-white text-center">
                {isWinner ? (
                  <>
                    🏆 CHAMPION! 🏆
                    <br />
                    <span className="text-lg text-yellow-400">You&apos;re unstoppable!</span>
                    <br />
                    <span className="text-sm text-green-400 mt-2">Rating boosted! 🚀</span>
                  </>
                ) : (
                  <>
                    💪 Better luck next time!
                    <br />
                    <span className="text-lg text-gray-400">Keep practicing!</span>
                  </>
                )}
              </h2>

              {newRating !== null && (
                <div className={`flex items-center gap-3 text-xl p-4 rounded-lg ${isWinner ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                  <span className="text-gray-300">New Rating</span>
                  <div className="flex items-center gap-2">
                    {isWinner ? (
                      <TrendingUp className="w-6 h-6 text-green-500 animate-bounce" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-red-500" />
                    )}
                    <span className={`font-bold text-2xl ${isWinner ? "text-green-500" : "text-red-500"}`}>
                      {newRating}
                    </span>
                    {isWinner && userId && (
                      <span className="text-green-400 text-sm">
                        +{gameEndState.ratingChanges[userId] || 0}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <p className="text-gray-400 text-center">
                Redirecting to dashboard in 5 seconds...
              </p>
            </div>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};
