interface Player {
    id: number;
    username: string;
    victories: number;
    rank: number;
  }
  
  interface PlayerListProps {
    players: Player[];
  }
  
  const PlayerList = ({ players }: PlayerListProps) => (
    <div className="rounded-lg overflow-hidden text-center">
      <div className="grid grid-cols-3 p-4 bg-[#15171B]">
        <div className="text-white">Rank</div>
        <div className="text-white">Player</div>
        <div className="text-white">Game Victories</div>
      </div>
      {players.map((player) => (
        <div
          key={player.id}
          className="grid grid-cols-3 p-4 hover:bg-[#282C34] rounded-md mb-2 bg-white/5"
        >
          <div className="text-white">{player.rank}.</div>
          <div className="text-white">{player.username}</div>
          <div className="text-white">{player.victories}</div>
        </div>
      ))}
    </div>
  );
  
  export default PlayerList;
  