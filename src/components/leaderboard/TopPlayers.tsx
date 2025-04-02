import React from "react";
import Image from "next/image";
import { LeaderboardPlayer } from "@/features/home/leaderboard/types/leaderboard.types";

interface TopPlayersProps {
  topPlayers: LeaderboardPlayer[];
}

const TopPlayers: React.FC<TopPlayersProps> = ({ topPlayers }) => {
  return (
    <div className="grid grid-cols-1 gap-4 mb-8 lg:grid-cols-3">
      {topPlayers.map((player, index) => (
        <div
          key={player.id}
          className={`bg-[#212733] rounded-lg p-4 flex items-center gap-4 transition-all duration-200 hover:scale-[1.05] hover:shadow-xl cursor-pointer hover:bg-[#282C34] w-full`}
        >
          <div className="relative w-12 h-12">
            <Image
              src={`/${index === 0 ? "gold" : index === 1 ? "silver" : "bronze"}.svg`}
              alt={`${index === 0 ? "Gold" : index === 1 ? "Silver" : "Bronze"} Medal`}
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-white font-medium">{player.username}</p>
            <p className="text-gray-400">{player.wins} Victories</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopPlayers;
