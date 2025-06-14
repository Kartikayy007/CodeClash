"use client";
import React, { useEffect } from "react";
import { socketService } from "@/lib/socket";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import LabelButton from "@/components/ui/LabelButton";
import UserStats from "@/components/dashboard/UserStats";
import PerformanceInsights from "@/components/dashboard/PerformanceInsights";
import Leaderboard from "@/components/dashboard/Leaderboard";
import RecentMatches from "@/components/dashboard/RecentMatches";
import RecentContests from "@/components/dashboard/RecentContests";
import ManageContest from "@/components/dashboard/ManageContest";
import { PlayButton } from "@/features/battle/components/PlayButton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && !socketService.isConnected()) {
      socketService.connect(token);
    }
    return () => {};
  }, []);

  return (
    <div className="min-h-screen bg-background py-2 md:p-2">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6 lg:hidden">
          <div className="flex-1">
            <PlayButton />
          </div>
          <div className="flex-1">
            <LabelButton
              variant="filled"
              onClick={() => router.push("/contest/join")}
              className="w-full"
            >
              Play Contest
            </LabelButton>
          </div>
        </div>

        {/* Desktop Layout - 3 columns */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            <UserStats />
            <Leaderboard className="flex-1" />
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-6">
            <RecentContests className="flex-1" />
            <RecentMatches className="flex-1" />
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-6">
            {/* Desktop Action Buttons */}
            <div className="flex gap-3">
              <div className="flex-1">
                <PlayButton />
              </div>
              <div className="flex-1">
                <LabelButton
                  variant="filled"
                  onClick={() => router.push("/contest/join")}
                  className="w-full"
                >
                  Play Contest
                </LabelButton>
              </div>
            </div>
            <PerformanceInsights className="flex-1" />
            <ManageContest />
          </div>
        </div>

        {/* Tablet Layout - 2 columns */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-6 lg:hidden">
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            <UserStats />
            <RecentMatches className="flex-1" />
            <ManageContest />
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-6">
            <PerformanceInsights className="flex-1" />
            <Leaderboard className="flex-1" />
            <RecentContests className="flex-1" />
          </div>
        </div>

        {/* Mobile Layout - Single column */}
        <div className="flex flex-col gap-6 md:hidden">
          <UserStats />
          <PerformanceInsights />
          <RecentMatches />
          <Leaderboard />
          <RecentContests />
          <ManageContest />
        </div>
      </div>
    </div>
  );
}
