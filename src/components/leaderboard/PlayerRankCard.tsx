import Image from 'next/image';

interface PlayerRankCardProps {
  title: string;
  value: number;
  iconSrc: string;
}

const PlayerRankCard = ({ title, value, iconSrc }: PlayerRankCardProps) => (
  <div className="rounded-sm p-4 bg-white/5 flex flex-col items-center">
    <h3 className="text-gray-400 mb-2 text-center text-sm md:text-base">{title}</h3>
    <div className="flex items-center justify-between w-full">
      <span className="text-4xl md:text-6xl font-bold text-white">{value}</span>
      <div className="hidden md:block w-16 h-16 md:w-24 md:h-24 relative">
        <Image
          src={iconSrc}
          alt={title}
          fill
          className="object-contain"
        />
      </div>
    </div>
  </div>
);

export default PlayerRankCard;
