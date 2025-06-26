// components/ui/MatchTable.tsx
import React from "react";
import { MatchMode } from "@/features/home/matches/types/matches.types";

interface Match {
  mode: MatchMode;
  player: string;
  opponent: string;
  result: "win" | "loss";
  duration: string;
  date: string;
}

interface MatchTableProps {
  matches: Match[];
}

export default function MatchTable({ matches }: MatchTableProps) {
  if (!matches.length) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-cyan-400/60 text-lg font-medium mb-2">No matches found</div>
          <div className="text-gray-500 text-sm">Start playing to see your match history</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-cyan-500/20">
              <th className="text-left py-4 px-6 text-cyan-400 font-semibold text-sm uppercase tracking-wider">
                Mode
              </th>
              <th className="text-left py-4 px-6 text-cyan-400 font-semibold text-sm uppercase tracking-wider">
                Player
              </th>
              <th className="text-left py-4 px-6 text-cyan-400 font-semibold text-sm uppercase tracking-wider">
                Opponent
              </th>
              <th className="text-center py-4 px-6 text-cyan-400 font-semibold text-sm uppercase tracking-wider">
                Result
              </th>
              <th className="text-center py-4 px-6 text-cyan-400 font-semibold text-sm uppercase tracking-wider">
                Duration
              </th>
              <th className="text-center py-4 px-6 text-cyan-400 font-semibold text-sm uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-500/10">
            {matches.map((match, index) => (
              <tr 
                key={index} 
                className="hover:bg-gradient-to-r hover:from-cyan-500/5 hover:to-blue-500/5 transition-all duration-200 group"
              >
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30">
                    {match.mode.charAt(0) + match.mode.slice(1).toLowerCase()}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="text-white font-medium group-hover:text-cyan-400 transition-colors duration-200">
                    {match.player}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-gray-300 group-hover:text-cyan-400/80 transition-colors duration-200">
                    {match.opponent}
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                      match.result === "win"
                        ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30 shadow-lg shadow-green-500/25"
                        : "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30 shadow-lg shadow-red-500/25"
                    }`}
                  >
                    {match.result.toUpperCase()}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="text-gray-300 group-hover:text-cyan-400/80 transition-colors duration-200 font-mono text-sm">
                    {match.duration}
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="text-gray-400 group-hover:text-cyan-400/60 transition-colors duration-200 text-sm">
                    {match.date}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
