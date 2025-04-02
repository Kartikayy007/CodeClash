import React, { useEffect, useCallback } from "react";
import LabelButton from "@/components/ui/LabelButton";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, store } from "@/store/store";
import {
  runCode,
  submitCode,
  setActiveTab,
} from "@/features/battle/editor/slices/editorSlice";
import {
  setCurrentProblemIndex,
  updateProblemStatus,
  updateMultipleProblemStatuses,
} from "@/features/battle/slices/battleSlice";
import { socketService } from "@/lib/socket";
import toast from "react-hot-toast";
import { setGameEnd } from "@/features/battle/slices/gameEndSlice";

interface TopBarProps {
  matchId: string;
  input: string;
  onProblemChange?: (index: number) => void;
}

type GameStatus =
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "TIME_LIMIT_EXCEEDED"
  | "RUNTIME_ERROR";

interface GameStateUpdate {
  userId: string;
  problemId: string;
  status: GameStatus;
}

const TopBar = ({ matchId, input, onProblemChange }: TopBarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { code, language, isRunning, isSubmitting } = useSelector(
    (state: RootState) => state.editor,
  );
  const { player1, player2, problems, currentProblemIndex } = useSelector(
    (state: RootState) => state.battle,
  );
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  console.log("userId", userId);

  console.log("🔍 Current state:", {
    userId,
    player1,
    player2,
    currentProblemIndex,
    problems,
  });

  const currentPlayer = player1?.id === userId ? player1 : player2;
  const opponentPlayer = player1?.id === userId ? player2 : player1;

  console.log("👥 Players:", {
    currentPlayer,
    opponentPlayer,
  });

  useEffect(() => {
    const handleGameStateUpdate = (
      data: GameStateUpdate | GameStateUpdate[],
    ) => {
      console.log("🎮 Game state update received in TopBar:", data);
      const myId = store.getState().auth.user?.id;
      if (Array.isArray(data)) {
        console.log("📊 Updating multiple problem statuses:", data);
        dispatch(updateMultipleProblemStatuses(data));
      } else {
        console.log("📊 Updating single problem status:", data);
        dispatch(updateProblemStatus({ ...data, myId: myId as string }));
      }
    };

    socketService.on("game_state_update", handleGameStateUpdate);

    return () => {
      socketService.off("game_state_update", handleGameStateUpdate);
    };
  }, [dispatch]);

  const handleRunCode = () => {
    const currentProblem = problems[currentProblemIndex];
    console.log("▶️ Running code for problem:", {
      currentProblem,
      code,
      language,
      input,
    });

    if (!currentProblem?.testCases?.[0]) {
      console.error("❌ No test cases available");
      return;
    }

    dispatch(
      runCode({
        code,
        language,
        contestId: matchId,
        questionId: currentProblem.id,
        input: currentProblem.testCases[0].input,
      }),
    );
  };

  const checkGameCompletion = useCallback(() => {
    if (!currentPlayer?.solvedProblems || !problems.length) return;

    console.log("🎮 Checking game completion:", {
      currentPlayer,
      opponentPlayer,
      problems,
    });

    const currentPlayerAccepted = Object.values(
      currentPlayer.solvedProblems,
    ).filter((problem) => problem.status === "ACCEPTED").length;

    const opponentAccepted = Object.values(
      opponentPlayer?.solvedProblems || {},
    ).filter((problem) => problem.status === "ACCEPTED").length;

    console.log("📊 Solved problems count:", {
      currentPlayerAccepted,
      opponentAccepted,
      totalProblems: problems.length,
    });

    if (
      currentPlayerAccepted === problems.length ||
      opponentAccepted === problems.length
    ) {
      const winner =
        currentPlayerAccepted === problems.length
          ? currentPlayer.id
          : opponentPlayer?.id;
      const loser =
        winner === currentPlayer.id ? opponentPlayer?.id : currentPlayer.id;

      if (!winner || !loser) return;

      const ratingChanges: { [key: string]: number } = {
        [winner]: 24,
        [loser]: -24,
      };

      console.log("🏆 Game completed!", {
        winner,
        ratingChanges,
      });

      dispatch(
        setGameEnd({
          winnerId: winner,
          ratingChanges,
        }),
      );
    }
  }, [currentPlayer, opponentPlayer, problems, dispatch]);

  useEffect(() => {
    checkGameCompletion();
  }, [
    currentPlayer?.solvedProblems,
    opponentPlayer?.solvedProblems,
    checkGameCompletion,
  ]);

  const handleSubmitCode = () => {
    const currentProblem = problems[currentProblemIndex];
    console.log("📤 Submitting code:", {
      currentProblem,
      code,
      language,
      matchId,
    });

    if (!currentProblem) {
      toast.error("No problem selected");
      return;
    }

    dispatch(setActiveTab("submissions"));

    dispatch(
      submitCode({
        code,
        language,
        contestId: matchId,
        questionId: currentProblem.id,
      }),
    ).then((action) => {
      console.log("📥 Submit code response:", action);
      if (submitCode.fulfilled.match(action)) {
        const status = action.payload.status;
        if (status === "ACCEPTED") {
          toast.success("All test cases passed!");
          checkGameCompletion();
        } else if (status) {
          toast.error(`Submission failed: ${status}`);
        }
      }
    });
  };

  const handleProblemClick = (index: number) => {
    console.log("🔄 Changing problem to index:", index);
    if (onProblemChange) {
      onProblemChange(index);
    } else {
      dispatch(setCurrentProblemIndex(index));
    }
  };

  const getUserProblemStatusColor = (index: number) => {
    const problem = problems[index];
    console.log("currentPlayer", currentPlayer);
    if (!problem || !currentPlayer?.solvedProblems) {
      if (currentProblemIndex === index) {
        return "border-blue-500 bg-blue-500/10 text-blue-500";
      }
      return "";
    }
    console.log("currentPlayer.solvedProblems", currentPlayer.solvedProblems);
    const status = currentPlayer.solvedProblems[problem.id]?.status;
    console.log("🎨 User problem status:", {
      problemId: problem.id,
      status,
      userId: currentPlayer.id,
    });
    if (status === "ACCEPTED") {
      return "border-green-500 bg-green-500/10 text-green-500";
    } else if (status) {
      return "border-red-500 bg-red-500/10 text-red-500";
    }
    if (currentProblemIndex === index) {
      return "border-blue-500 bg-blue-500/10 text-blue-500";
    }
    return "";
  };

  const getOpponentProblemStatusColor = (index: number) => {
    const problem = problems[index];
    if (!problem || !opponentPlayer?.solvedProblems) return "";
    console.log(problem.id, opponentPlayer.solvedProblems);
    const status = opponentPlayer.solvedProblems[problem.id]?.status;
    console.log("opponentPlayer.solvedProblems", opponentPlayer.solvedProblems);
    console.log("🎨 Opponent problem status:", {
      problemId: problem.id,
      status,
      userId: opponentPlayer?.id,
    });
    if (status === "ACCEPTED") {
      return "border-green-500 bg-green-500/10 text-green-500";
    } else if (status) {
      return "border-red-500 bg-red-500/10 text-red-500";
    }
    if (currentProblemIndex === index) {
      return "border-blue-500 bg-blue-500/10 text-blue-500";
    }
    return "";
  };

  return (
    <div className="flex items-center justify-between rounded-lg px-8 py-3 bg-[#1A1D24]">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
        <div className="text-white text-base font-medium leading-normal">
          Player 1 (You)
        </div>
        <div className="flex gap-2">
          {problems.map((_, index) => (
            <button
              key={index}
              onClick={() => handleProblemClick(index)}
              className={`w-10 h-10 py-2 rounded-md border justify-center items-center inline-flex overflow-hidden
                ${getUserProblemStatusColor(index) || "border-[#232323] text-gray-500 hover:border-gray-400 hover:text-gray-400"}`}
            >
              <p className="text-base font-medium font-['Quicksand'] leading-normal">
                {index + 1}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <LabelButton
          variant="outlined"
          customSize={{ width: "56px", height: "20px" }}
          className="text-sm whitespace-nowrap flex items-center gap-2"
          onClick={handleRunCode}
          disabled={isRunning}
        >
          <Image src="/play.svg" alt="Run" width={20} height={20} />
          <span>{isRunning ? "Running..." : "Run"}</span>
        </LabelButton>
        <LabelButton
          variant="filled"
          customSize={{ width: "56px", height: "20px" }}
          className="text-sm whitespace-nowrap flex items-center gap-2"
          onClick={handleSubmitCode}
          disabled={isSubmitting}
        >
          <Image src="/telegram-alt.svg" alt="Submit" width={20} height={20} />
          <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
        </LabelButton>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          {problems.map((_, index) => (
            <div
              key={index}
              className={`w-10 h-10 py-2 rounded-md border justify-center items-center inline-flex overflow-hidden
                ${getOpponentProblemStatusColor(index) || "border-[#232323] text-gray-500"}`}
            >
              <p className="text-base font-medium font-['Quicksand'] leading-normal">
                {index + 1}
              </p>
            </div>
          ))}
        </div>
        <div className="text-white text-base font-medium font-['Quicksand'] leading-normal">
          Player 2
        </div>
        <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default TopBar;
