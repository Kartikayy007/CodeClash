import Image from 'next/image';

interface TopPlayersProps {
  topPlayers: { username: string; victories: number }[];
}

const TopPlayers = ({ topPlayers }: TopPlayersProps) => (
  <div className="grid grid-cols-3 gap-4 mb-8 relative">
    {topPlayers.map((player, index) => (
      <div key={index} className={`bg-[#212733] rounded-lg p-4 flex items-center gap-4 mt-8 ${index === 1 ? 'shadow-lg mb-6 mt-0' : ''}`}>
        <div className="relative w-12 h-12">
          <Image
            src={`/${index === 1 ? 'gold' : index === 0 ? 'silver' : 'bronze'}.svg`}
            alt={`${index === 1 ? 'Gold' : index === 0 ? 'Silver' : 'Bronze'} Medal`}
            fill
            className="object-contain"
          />
        </div>
        <div>
          <p className="text-white font-medium">{player.username}</p>
          <p className="text-gray-400">{player.victories} Victories</p>
        </div>
      </div>
    ))}
  </div>
);

export default TopPlayers;
