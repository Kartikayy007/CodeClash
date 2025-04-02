// components/Badges.tsx
import Image from "next/image";

interface Badge {
  id: number;
  name: string;
  rank: string;
  icon: string;
}

interface BadgesProps {
  badges: Badge[];
}

const Badges: React.FC<BadgesProps> = ({ badges }) => {
  return (
    <div className="bg-[#1E2127] rounded-lg p-8">
      <h3 className="text-white text-xl mb-8">My Badges</h3>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {badges.map((badge) => (
          <div key={badge.id} className="flex-shrink-0">
            <div className="w-32 h-32 bg-[#282C34] rounded-lg flex items-center justify-center mb-3">
              <Image src={badge.icon} alt={badge.name} width={64} height={64} />
            </div>
            <p className="text-gray-400 text-center text-base">
              Rank: {badge.rank}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Badges;
