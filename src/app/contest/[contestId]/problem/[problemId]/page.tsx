"use client";

import React, { useState, useEffect } from "react";
import ContestEditor from "@/components/Contest/Editor/ContestEditor";
import { useParams } from "next/navigation";
import { contestApi } from "@/features/contests/api/contestApi";
import { Timer, Calendar } from "lucide-react";

const ProblemPage = () => {
  const params = useParams();
  const problemId = params?.problemId as string;
  const contestId = params?.contestId as string;
  const [endTime, setEndTime] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        const response = await contestApi.getContestDetails(contestId);
        if (response.contest) {
          setEndTime(response.contest.endTime);
          const endTimeMs = new Date(response.contest.endTime).getTime();
          const now = new Date().getTime();
          const timeLeftInSeconds = Math.floor((endTimeMs - now) / 1000);
          setTimeLeft(timeLeftInSeconds > 0 ? timeLeftInSeconds : 0);
        }
      } catch (error) {
        console.error("Failed to fetch contest details:", error);
      }
    };

    fetchContestDetails();
  }, [contestId]);

  useEffect(() => {
    if (!endTime) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

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

  const formatEndTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-[#10141D]">
      <div className="flex md:-mt-16 mt-0 flex-col sm:flex-row items-center justify-end gap-4 p-4 text-white bg-[#10151c]">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2A2F3E] h-9 w-full sm:w-auto">
          <Timer
            size={18}
            className={timeLeft <= 300 ? "text-red-500 animate-pulse" : "text-blue-400"}
          />
          <span
            className={`text-base font-medium ${
              timeLeft <= 300 ? "text-red-500" : "text-blue-400"
            }`}
          >
            {formatTime(timeLeft)}
          </span>
        </div>
        {endTime && (
          <div className="flex  items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2A2F3E] h-9 w-full sm:w-auto">
            <Calendar size={18} className="text-gray-400" />
            <span className="text-sm text-gray-400">
              Contest ends {formatEndTime(endTime)}
            </span>
          </div>
        )}
      </div>
      <ContestEditor problemId={problemId} contestId={contestId} />
    </div>
  );
};

export default ProblemPage;
