"use client";

import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts";
import axios from "axios";

interface WinTrendData {
  date: string;
  wins: number;
  losses: number;
}

interface WinTrendResponse {
  success: boolean;
  trend: WinTrendData[];
  winStreak: number;
  maxWinStreak: number;
}

interface PerformanceInsightsProps {
  className?: string;
}

const PerformanceInsights: React.FC<PerformanceInsightsProps> = ({
  className = "",
}) => {
  const [trendData, setTrendData] = useState<WinTrendData[]>([]);
  const [, setWinStreak] = useState(0);
  const [, setMaxWinStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [chartWidth, setChartWidth] = useState<number>(0); // Default width

  // const stats = [
  //   { label: 'Win Streak', value: winStreak },
  //   { label: 'Max Win Streak', value: maxWinStreak },
  //   { label: 'Contest Participation', value: trendData.reduce((acc, curr) => acc + curr.wins + curr.losses, 0) },
  // ];

  useEffect(() => {
    const fetchWinTrend = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get<WinTrendResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/win-trend`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.success) {
          setTrendData(response.data.trend);
          setWinStreak(response.data.winStreak);
          setMaxWinStreak(response.data.maxWinStreak);
        }
      } catch (error) {
        console.error("Failed to fetch win trend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWinTrend();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        const width = window.innerWidth * 0.7;
        setChartWidth(width);
      } else {
        const width = window.innerWidth * 0.3; // Set to 90% of the window width
        setChartWidth(width);
      }
    };

    handleResize(); // Set initial width
    window.addEventListener("resize", handleResize); // Update width on resize

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup listener
    };
  }, []);

  if (loading) {
    return (
      <div
        className={`relative bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-lg p-6 ${className}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Performance Insights</h2>
        </div>
        <div className="h-[220px] flex items-center justify-center">
          <p className="text-gray-400">Loading performance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-lg p-6 ${className}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Performance Insights</h2>
      </div>

      <div className="h-[220px] mb-6 mt-[30%]">
        <LineChart
          xAxis={[
            {
              data: trendData.map((item) =>
                item.date.split("/").slice(0, 2).join("/"),
              ),
              scaleType: "point",
              tickLabelStyle: {
                fill: "#D1D1D1",
              },
              tickSize: 0,
              disableLine: true,
            },
          ]}
          yAxis={[
            {
              min: 0,
              max: 8,
              tickLabelStyle: {
                fill: "#D1D1D1",
              },
              tickSize: 0,
              disableLine: true,
            },
          ]}
          series={[
            {
              data: trendData.map((item) => item.wins),
              showMark: true,
              color: "#C879EB",
              curve: "linear",
              valueFormatter: (value: number | null) =>
                value === null ? "" : value > 0 ? "W" : "L",
            },
          ]}
          width={chartWidth} // Use the measured width
          height={220}
          margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
          disableAxisListener
          slots={{
            axisContent: () => (
              <g>
                {Array.from({ length: 8 }).map((_, i) => (
                  <line
                    key={`h-${i}`}
                    x1="0"
                    x2="100%"
                    y1={`${(i / 7) * 100}%`}
                    y2={`${(i / 7) * 100}%`}
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeDasharray="3 3"
                  />
                ))}
                {Array.from({ length: 7 }).map((_, i) => (
                  <line
                    key={`v-${i}`}
                    x1={`${(i / 6) * 100}%`}
                    x2={`${(i / 6) * 100}%`}
                    y1="0"
                    y2="100%"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeDasharray="3 3"
                  />
                ))}
              </g>
            ),
          }}
          sx={{
            "& .MuiLineElement-root": {
              strokeWidth: 2,
              filter: "drop-shadow(0 0 6px rgba(200, 121, 235, 0.6))",
            },
            "& .MuiMarkElement-root": {
              stroke: "#C879EB",
              fill: "#C879EB",
              strokeWidth: 2,
              r: 4,
              filter: "drop-shadow(0 0 4px rgba(200, 121, 235, 0.6))",
            },
          }}
        />
      </div>
    </div>
  );
};

export default PerformanceInsights;
