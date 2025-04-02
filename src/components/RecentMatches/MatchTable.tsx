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
      <div className="bg-[#1A1D24] rounded-lg p-6">
        <div className="text-gray-400 text-center">No matches found</div>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1D24] rounded-lg p-6">
      <div className="overflow-x-auto">
        <table className="min-w-full ">
          <thead>
            <tr>
              <th className="w-1/5 md:w-1/4">Mode</th>
              <th className="w-1/5 md:w-1/4">Player</th>
              <th className="w-1/5 md:w-1/4">Opponent</th>
              <th className="w-1/5 md:w-1/4">Result</th>
              <th className="w-1/5 md:w-1/4">Duration</th>
              <th className="w-1/5 md:w-1/4">Date</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match, index) => (
              <tr key={index}>
                <td className="text-center truncate px-4">
                  {match.mode.charAt(0) + match.mode.slice(1).toLowerCase()}
                </td>
                <td className="text-center px-4">{match.player}</td>
                <td className="text-center px-4">{match.opponent}</td>
                <td className="text-center px-4">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      match.result === "win"
                        ? "bg-green-500/20 text-green-500"
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {match.result.toUpperCase()}
                  </span>
                </td>
                <td className="text-center px-4">{match.duration}</td>
                <td className="text-center px-4">{match.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
