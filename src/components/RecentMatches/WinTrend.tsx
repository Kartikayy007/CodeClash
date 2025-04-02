// components/ui/WinTrend.tsx
import React from "react";

interface WinTrendProps {
  winTrendData: string[][];
}

const WinTrend: React.FC<WinTrendProps> = ({ winTrendData }) => {
  return (
    <div className="bg-[#1E2127] rounded-lg p-6">
      <h3 className="text-white mb-4">Win trend</h3>
      <div className="grid gap-2">
        {winTrendData.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {row.map((status, colIndex) => (
              <div
                key={colIndex}
                className={`w-8 h-8 rounded-sm ${
                  status === "win"
                    ? "bg-green-600"
                    : status === "loss"
                      ? "bg-red-500"
                      : "bg-[#282C34]"
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WinTrend;
