interface StatsProps {
    levelCP: string;
    totalPoints: number;
    totalMatchPlayed: number;
    winPercentage: number;
  }
  
  const Stats: React.FC<StatsProps> = ({ levelCP, totalPoints, totalMatchPlayed, winPercentage }) => {
    return (
      <div>
        <h3 className="text-white text-xl mb-6">Stats</h3>
        <div className="space-y-4">
          <p className="text-gray-400 text-lg flex justify-between">
            Level of CP: <span>{levelCP}</span>
          </p>
          <p className="text-gray-400 text-lg flex justify-between">
            Total Points: <span>{totalPoints}</span>
          </p>
          <p className="text-gray-400 text-lg flex justify-between">
            Total Match Played: <span>{totalMatchPlayed}</span>
          </p>
          <p className="text-gray-400 text-lg flex justify-between">
            Win Percentage: <span>{winPercentage.toFixed(1)}%</span>
          </p>
        </div>
      </div>
    );
  };
  
  export default Stats;
  