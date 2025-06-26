// components/Badges.tsx
import Image from "next/image";
import { Trophy, Star, Award } from "lucide-react";

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
    <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-6 backdrop-blur-sm border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">My Badges</h3>
        <p className="text-gray-400 text-sm">Achievements and accomplishments</p>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {badges.map((badge) => (
          <div key={badge.id} className="flex-shrink-0 group">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mb-3 border border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-200 hover:scale-105 shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40">
                <Image src={badge.icon} alt={badge.name} width={64} height={64} className="drop-shadow-lg" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center border-2 border-[#1a1d26] shadow-lg">
                <Star className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-white font-medium text-sm mb-1">{badge.name}</p>
              <div className="inline-flex items-center px-2 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-medium">
                <Trophy className="w-3 h-3 mr-1" />
                {badge.rank}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {badges.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
            <Award className="w-8 h-8 text-cyan-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">No Badges Yet</h3>
          <p className="text-gray-500 text-sm">
            Start competing to earn your first badge
          </p>
        </div>
      )}
    </div>
  );
};

export default Badges;
