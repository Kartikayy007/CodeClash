// components/ProfileHeader.tsx
import { Edit } from "lucide-react";

interface ProfileHeaderProps {
  username: string;
  rank: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ username, rank }) => {
  return (
    <div className="flex items-start justify-between mb-8">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-gray-600 rounded-full"></div>
        <div>
          <h2 className="text-white text-2xl font-semibold">{username}</h2>
          <p className="text-gray-400 text-lg mt-1">Rank {rank}</p>
        </div>
      </div>
      <button className="text-gray-400">
        <Edit size={24} />
      </button>
    </div>
  );
};

export default ProfileHeader;
