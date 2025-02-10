import Image from 'next/image';
import { LeaderboardPlayer } from '@/features/home/leaderboard/types/leaderboard.types';

interface TopPlayersProps {
  topPlayers: LeaderboardPlayer[];
}

const TopPlayers = ({ topPlayers }: TopPlayersProps) => {
  const getDisplayIndex = (index: number) => {
    switch(index) {
      case 0: return 1; 
      case 1: return 0;
      case 2: return 2; 
      default: return index;
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 mb-8 relative">
      {topPlayers.slice(0, 3).map((player, index) => {
        const displayIndex = getDisplayIndex(index);
        return (
          <div 
            key={player.id} 
        className={`bg-[#212733] rounded-lg p-4 flex items-center gap-4 mt-8 ${
          index === 0 ? 'shadow-lg mb-6 mt-0' : ''
        } transition-all duration-200 hover:scale-[1.05] hover:shadow-xl cursor-pointer hover:bg-[#282C34]`}
          
            style={{
              order: displayIndex
            }}
          >
            <div className="relative w-12 h-12">
              <Image
                src={`/${index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze'}.svg`}
                alt={`${index === 0 ? 'Gold' : index === 1 ? 'Silver' : 'Bronze'} Medal`}
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-white font-medium">{player.username}</p>
              <p className="text-gray-400">{player.wins} Victories</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TopPlayers;
