"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { contestApi } from "@/features/contests/api/contestApi";
import toast from "react-hot-toast";
import {
  Contest,
  LeaderboardEntry,
} from "@/features/contests/types/contest.types";
// import LabelButton from "@/components/ui/LabelButton";
import { Timer } from "lucide-react";
import ProblemSet from "@/components/Contest/PreviewContest/ProblemSet";
import Leaderboard from "@/components/Contest/contestPage/Leaderboard";
import MySubmissions from "@/components/Contest/contestPage/MySubmissions";

interface ApiError {
  response: {
    data: {
      message: string;
    };
  };
}

type TabType = "Problem Set" | "Leaderboard" | "My Submissions";

export default function ContestPage() {
  const router = useRouter();
  const params = useParams();
  const contestId = params?.contestId as string;
  const [activeTab, setActiveTab] = useState<TabType>("Problem Set");
  const [timeLeft, setTimeLeft] = useState(3600);
  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardPage] = useState(1);
  const [, setTotalPages] = useState(0);
  const [loadingProblems, setLoadingProblems] = useState(false);
  const [, setLoadingLeaderboard] = useState(false);
  const [, setLoadingInsights] = useState(false);

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        setLoading(true);
        setLoadingProblems(true);
        const response = await contestApi.getContestDetails(contestId);

        if (response.contest) {
          setContest(response.contest);

          if (response.contest.status === "UPCOMING") {
            router.push(`/contest/join/${contestId}`);
            return;
          }

          if (response.contest.status === "ONGOING") {
            const endTime = new Date(response.contest.endTime).getTime();
            const now = new Date().getTime();
            const timeLeftInSeconds = Math.floor((endTime - now) / 1000);
            setTimeLeft(timeLeftInSeconds > 0 ? timeLeftInSeconds : 0);
          }
        }
      } catch (error: ApiError | unknown) {
        const err = error as ApiError;
        toast.error(
          err?.response?.data?.message || "Failed to fetch contest details",
        );
        router.push("/dashboard");
      } finally {
        setLoading(false);
        setLoadingProblems(false);
      }
    };

    fetchContestDetails();
  }, [contestId, router]);

  useEffect(() => {
    if (!contest || contest.status !== "ONGOING") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/contest/join");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [contest, router]);

  useEffect(() => {
    if (activeTab !== "Leaderboard" || !contestId) return;

    const fetchLeaderboard = async () => {
      try {
        setLoadingLeaderboard(true);
        const response = await contestApi.getLeaderboard(
          contestId,
          leaderboardPage,
        );
        setLeaderboard(response.leaderboard);
        console.log(response)
        setTotalPages(response.pagination.pages);
      } catch (error) {
        const err = error as ApiError;
        toast.error(
          err?.response?.data?.message || "Failed to fetch leaderboard",
        );
      } finally {
        setLoadingLeaderboard(false);
      }
    };

    fetchLeaderboard();

    const updateInterval = setInterval(
      async () => {
        try {
          const updateResponse = await contestApi.updateLeaderboard(contestId);
          if (updateResponse.success) {
            fetchLeaderboard();
          }
        } catch (error) {
          console.error("Failed to update leaderboard:", error);
        }
      },
      15 * 60 * 1000,
    );

    return () => clearInterval(updateInterval);
  }, [contestId, activeTab, leaderboardPage]);

  useEffect(() => {
    if (!contestId || !contest) return;

    setLoadingInsights(true);
    const timer = setTimeout(() => {
      setLoadingInsights(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [contestId, contest]);

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${secs.toString().padStart(2, "0")}s`);

    return parts.join(" ");
  };

  // const formatEndTime = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('en-US', {
  //     weekday: 'short',
  //     month: 'short',
  //     day: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     hour12: true
  //   });
  // };

  const handleSolveProblem = (problemId: string) => {
    router.push(`/contest/${contestId}/problem/${problemId}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Problem Set":
        return (
          <ProblemSet
            problems={
              contest?.questions.map((q) => ({
                id: q.id,
                title: q.title,
                rating: q.rating || 0,
                score: q.score || 0,
                difficulty: q.difficulty,
                status: q.submissions?.accepted && q.submissions.accepted > 0 ? "SOLVED" : null,
              })) || []
            }
            onSolveProblem={handleSolveProblem}
            isLoading={loadingProblems}
          />
        );
      case "Leaderboard":
        return <Leaderboard contestId={contestId} />;
      case "My Submissions":
        return <MySubmissions contestId={contestId} />;
    }
  };

const loadingQuotes = [
  "Every expert was once a beginner. Every pro was once an amateur.",
  "The only way to do great work is to love what you do.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "Victory belongs to the most persevering.",
  "Champions are made when nobody's watching.",
  "The battlefield is won in the mind before it's won in the field.",
  "Preparation prevents poor performance.",
  "Train hard, fight easy.",
  "Excellence is never an accident. It is always the result of high intention.",
  "The harder you work, the luckier you get.",
  "Discipline is the bridge between goals and accomplishment.",
  "Focus on the process, not the outcome.",
  "Great things never come from comfort zones.",
  "Your only limit is your mindset.",
  "Winners never quit, quitters never win."
];

const getRandomQuote = () => {
  return loadingQuotes[Math.floor(Math.random() * loadingQuotes.length)];
};

if (loading) {
  return (
    <div className="min-h-screen bg-[#10141D] text-white flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="flex items-center justify-center mb-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
        
        <div className="mb-6">
          <p className="text-lg md:text-xl font-medium text-gray-300">
            &quot;{getRandomQuote()}&quot;
          </p>
        </div>
      </div>
    </div>
  );
}

  if (!contest || contest.status !== "ONGOING") {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#10141D] text-white">
      <div className="flex flex-col h-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 md:p-8 gap-4 bg-[#10151c]">
          <div className="flex flex-col gap-2 min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold truncate">
              {contest.title}
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div className="w-full sm:w-auto flex items-center justify-center">
              
              <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-gray-900 shadow-lg border border-gray-700 min-w-0">
                <Timer
                  size={20}
                  className={`sm:w-6 sm:h-6 flex-shrink-0 ${timeLeft <= 300 
                  ? "text-red-500 animate-pulse" 
                  : "text-white"
                  }`}
                />
                <span
                  className={`text-lg sm:text-xl md:text-2xl font-bold tracking-wider min-w-0 ${
                  timeLeft <= 300 
                    ? "text-red-500 animate-pulse" 
                    : "text-white"
                  }`}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            {/* <div className="flex justify-end w-full sm:w-auto">
              <LabelButton
                variant="red"
                onClick={() => router.push("/contest/join")}
                className="whitespace-nowrap w-full sm:w-auto"
              >
                LEAVE
              </LabelButton>
            </div> */}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 md:gap-8 px-4 sm:px-6 md:px-8">
          <div className="flex-1 w-full overflow-hidden">
            <div className="flex gap-3 sm:gap-4 md:gap-8 mb-4 md:mb-8 overflow-x-auto pb-2 scrollbar-hide">
              {(
                ["Problem Set", "Leaderboard", "My Submissions"] as TabType[]
              ).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 whitespace-nowrap text-sm sm:text-base transition-colors duration-200 ${
                    activeTab === tab
                      ? "text-white border-b-2 border-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="w-full">{renderTabContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
