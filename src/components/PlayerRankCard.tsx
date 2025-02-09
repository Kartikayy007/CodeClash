import Image from 'next/image';

interface PlayerRankCardProps {
  title: string;
  value: number;
  iconSrc: string;
}

const PlayerRankCard = ({ title, value, iconSrc }: PlayerRankCardProps) => (
  <div className="rounded-sm p-6 bg-white/5">
    <h3 className="text-gray-400 mb-4">{title}</h3>
    <div className="flex items-center justify-between">
      <span className="text-6xl font-bold text-white">{value}</span>
      <div className="w-24 h-24 relative">
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
