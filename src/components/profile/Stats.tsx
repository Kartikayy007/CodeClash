import { Trophy, Target, TrendingUp, Award } from "lucide-react";

interface StatsProps {
  levelCP: string;
  totalPoints: number;
  totalMatchPlayed: number;
  winPercentage: number;
}

const Stats: React.FC<StatsProps> = ({
  levelCP,
  totalPoints,
  totalMatchPlayed,
  winPercentage,
}) => {
  const stats = [
    {
      label: "Level of CP",
      value: levelCP,
      icon: Trophy,
      color: "text-yellow-400",
      borderColor: "border-yellow-400/30",
    },
    {
      label: "Total Points",
      value: totalPoints.toLocaleString(),
      icon: Award,
      color: "text-purple-400",
      borderColor: "border-purple-400/30",
    },
    {
      label: "Matches Played",
      value: totalMatchPlayed.toLocaleString(),
      icon: Target,
      color: "text-blue-400",
      borderColor: "border-blue-400/30",
    },
    {
      label: "Win Percentage",
      value: `${winPercentage.toFixed(1)}%`,
      icon: TrendingUp,
      color: winPercentage >= 60 ? "text-emerald-400" : winPercentage >= 40 ? "text-yellow-400" : "text-red-400",
      borderColor: winPercentage >= 60 ? "border-emerald-400/30" : winPercentage >= 40 ? "border-yellow-400/30" : "border-red-400/30",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl p-6 backdrop-blur-sm border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Performance Stats</h3>
        <p className="text-gray-400 text-sm">Your competitive coding statistics</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className={`group p-4 rounded-lg border ${stat.borderColor} bg-gradient-to-br from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 transition-all duration-200 hover:scale-105`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color.replace('text-', 'bg-')}/20 border ${stat.borderColor}`}>
                  <IconComponent className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                  <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stats;
