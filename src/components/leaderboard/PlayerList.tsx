import { LeaderboardPlayer } from "@/features/home/leaderboard/types/leaderboard.types";

interface PlayerListProps {
  players: LeaderboardPlayer[];
}

const PlayerList = ({ players }: PlayerListProps) => (
  <div className="rounded-lg overflow-hidden text-center">
    <div className="grid grid-cols-3 p-4 bg-white/15 rounded-lg mb-2">
      <div className="text-white font-bold">Rank</div>
      <div className="text-white font-bold">Player</div>
      <div className="text-white font-bold">Game Victories</div>
    </div>
    {players.map((player, index) => (
      <div
        key={player.id}
        className="grid grid-cols-3 p-4 hover:bg-[#282C34] rounded-md mb-2 bg-white/5 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
      >
        <div className="text-white">{index + 1}</div>
        <div className="text-white">{player.username}</div>
        <div className="text-white">{player.wins}</div>
      </div>
    ))}
  </div>
);

export default PlayerList;
