"use client";

import { useState } from "react";
import NavbarPlain from "@/components/ui/NavbarPlain";
import { Clock, Award, Zap } from "lucide-react";

type MatchMode = "All" | "Standard" | "Accuracy" | "Speed";
type MatchResult = "win" | "loss";
const winTrendData = [
  Array(8).fill("inactive"),
  [
    "inactive",
    "inactive",
    "inactive",
    "inactive",
    "loss",
    "inactive",
    "inactive",
    "inactive",
  ],
  [
    "inactive",
    "inactive",
    "inactive",
    "inactive",
    "inactive",
    "win",
    "win",
    "inactive",
  ],
  Array(8).fill("inactive"),
];
interface Match {
  mode: MatchMode;
  player: string;
  opponent: string;
  result: MatchResult;
  duration: string;
  date: string;
}

export default function MatchesPage() {
  const [selectedMode, setSelectedMode] = useState<MatchMode>("All");

  const matches: Match[] = [
    {
      mode: "Standard",
      player: "You",
      opponent: "Player1",
      result: "win",
      duration: "15min",
      date: "2 hours ago",
    },
    {
      mode: "Accuracy",
      player: "You",
      opponent: "Player1",
      result: "loss",
      duration: "10min",
      date: "12 Jan 2024",
    },
    {
      mode: "Speed",
      player: "You",
      opponent: "Player1",
      result: "loss",
      duration: "10min",
      date: "12 Jan 2024",
    },
    {
      mode: "Accuracy",
      player: "You",
      opponent: "Player1",
      result: "loss",
      duration: "10min",
      date: "12 Jan 2024",
    },
    {
      mode: "Speed",
      player: "You",
      opponent: "Player1",
      result: "loss",
      duration: "10min",
      date: "12 Jan 2024",
    },
    {
      mode: "Standard",
      player: "You",
      opponent: "Player1",
      result: "loss",
      duration: "10min",
      date: "12 Jan 2024",
    },
  ];

  const filteredMatches =
    selectedMode === "All"
      ? matches
      : matches.filter((match) => match.mode === selectedMode);

  const totalMatches = matches.length;
  const wins = matches.filter((m) => m.result === "win").length;
  const winRate = Math.round((wins / totalMatches) * 10);
  const currentStreak = 6; // Mock data
  const longestStreak = 12; // Mock data

  return (
    <div className="min-h-screen bg-[#15171B]">
      <NavbarPlain />
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-8">
          <button className="text-white text-lg flex items-center gap-2">
            <span>←</span> Recent
          </button>
          <button className="text-purple-500 border-b-2 border-purple-500 pb-1">
            Matches
          </button>
          <button className="text-gray-400">Contest</button>
        </div>

        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setSelectedMode("All")}
            className={`px-4 py-2 rounded ${
              selectedMode === "All" ? "bg-[#282C34]" : "text-gray-400"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedMode("Standard")}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              selectedMode === "Standard" ? "bg-[#282C34]" : "text-gray-400"
            }`}
          >
            <Award size={16} /> Standard
          </button>
          <button
            onClick={() => setSelectedMode("Accuracy")}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              selectedMode === "Accuracy" ? "bg-[#282C34]" : "text-gray-400"
            }`}
          >
            <Clock size={16} /> Accuracy
          </button>
          <button
            onClick={() => setSelectedMode("Speed")}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              selectedMode === "Speed" ? "bg-[#282C34]" : "text-gray-400"
            }`}
          >
            <Zap size={16} /> Speed
          </button>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8">
            <div className="bg-[#1E2127] rounded-lg overflow-hidden">
              <div className="grid grid-cols-5 p-4 text-gray-400 border-b border-gray-700">
                <div>Mode</div>
                <div>Players</div>
                <div>Result</div>
                <div>Duration</div>
                <div>Date</div>
              </div>
              {filteredMatches.map((match, index) => (
                <div
                  key={index}
                  className="grid grid-cols-5 p-4 border-b border-gray-700 text-white hover:bg-[#282C34]"
                >
                  <div className="flex items-center gap-2">
                    {match.mode === "Standard" && <Award size={16} />}
                    {match.mode === "Accuracy" && <Clock size={16} />}
                    {match.mode === "Speed" && <Zap size={16} />}
                    {match.mode}
                  </div>
                  <div>
                    {match.player} vs {match.opponent}
                  </div>
                  <div>
                    <span
                      className={
                        match.result === "win"
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {match.result === "win" ? "✓" : "✗"}
                    </span>
                  </div>
                  <div>{match.duration}</div>
                  <div>{match.date}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-4 flex flex-col gap-5">
            <div className="flex gap-3 justify-between">
              <div className="bg-[#1E2127] rounded-lg p-6 col-span-2">
                <h3 className="text-white mb-4">Wins Overview</h3>
                <div className="relative w-32 h-32 mx-auto">
                  <div className="w-full h-full rounded-full bg-[#282C34] flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {winRate}/10
                      </div>
                      <div className="text-sm text-gray-400">wins</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#1E2127] rounded-lg p-6 c0l-span-2">
                <h3 className="text-white mb-4">Winning Momentum</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 mb-1">Current Streak</p>
                    <div className="flex items-center gap-2">
                      <Zap className="text-purple-500" />
                      <span className="text-2xl text-white">
                        {currentStreak}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Longest Streak</p>
                    <p className="text-white text-2xl">{longestStreak}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#1E2127] rounded-lg p-6">
              <h3 className="text-white mb-4">Win trend</h3>
              <div className="grid gap-2">
                {winTrendData.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex gap-2">
                    {row.map((status, colIndex) => (
                      <div
                        key={colIndex}
                        className={`
                          w-8 h-8 rounded-sm
                          ${
                            status === "win"
                              ? "bg-green-600"
                              : status === "loss"
                                ? "bg-red-500"
                                : "bg-[#282C34]"
                          }
                        `}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
