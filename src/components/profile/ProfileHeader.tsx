// components/ProfileHeader.tsx
import { Edit, Trophy, User } from "lucide-react";

interface ProfileHeaderProps {
  username: string;
  rank: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ username, rank }) => {
  return (
    <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-6 backdrop-blur-sm border border-cyan-500/20 shadow-lg shadow-cyan-500/10 mb-8">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center border-2 border-[#1a1d26] shadow-lg">
              <Trophy className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-white text-3xl font-bold mb-2">{username}</h2>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30">
                <Trophy className="w-4 h-4 mr-1" />
                <span className="font-semibold">Rank #{rank}</span>
              </div>
              <div className="text-cyan-400/80 text-sm font-medium">
                Competitive Coder
              </div>
            </div>
          </div>
        </div>
        <button className="text-cyan-400 hover:text-cyan-300 p-2 rounded-lg hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 transition-all duration-200 hover:scale-105">
          <Edit size={24} />
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
