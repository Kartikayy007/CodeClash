import React from "react";
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis } from "recharts";

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

interface WinTrendChartProps {
  winTrend: WinTrendResponse | null;
}

export default function WinTrendChart({ winTrend }: WinTrendChartProps) {
  // Prepare chart data
  const chartData = winTrend?.trend.map((item) => ({
    date: item.date.split("/").slice(0, 2).join("/"), // Format to DD/MM
    wins: item.wins,
    losses: item.losses,
    total: item.wins + item.losses,
    winRate: item.wins + item.losses > 0 ? (item.wins / (item.wins + item.losses)) * 100 : 0,
  })) || [];

  const chartConfig = {
    wins: {
      label: "Wins",
      color: "hsl(var(--chart-1))",
    },
    losses: {
      label: "Losses",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  if (!winTrend || chartData.length === 0) return null;

  return (
    <div className="p-4 bg-white/5 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        {/* <Calendar className="w-4 h-4 text-cyan-400" /> */}
        <h4 className="text-lg md:text-xl font-semibold">7-Day Win Trend</h4>
      </div>
      <ChartContainer config={chartConfig} className="h-[150px] w-full">
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
            top: 12,
            bottom: 12,
          }}
        >
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 10, fill: 'rgba(134, 239, 172, 0.6)' }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 10, fill: 'rgba(134, 239, 172, 0.6)' }}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent />}
          />
          <Line
            dataKey="wins"
            type="monotone"
            stroke="rgb(34, 197, 94)"
            strokeWidth={2}
            dot={{
              fill: "rgb(34, 197, 94)",
              strokeWidth: 2,
              r: 3,
            }}
            activeDot={{
              r: 4,
              stroke: "rgb(34, 197, 94)",
              strokeWidth: 2,
            }}
          />
          <Line
            dataKey="losses"
            type="monotone"
            stroke="rgb(239, 68, 68)"
            strokeWidth={2}
            dot={{
              fill: "rgb(239, 68, 68)",
              strokeWidth: 2,
              r: 3,
            }}
            activeDot={{
              r: 4,
              stroke: "rgb(239, 68, 68)",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ChartContainer>
      <div className="flex items-center justify-center gap-4 mt-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-green-400">Wins</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span className="text-red-400">Losses</span>
        </div>
        <div className="text-cyan-400/60">
          Current Streak: {winTrend.winStreak}
        </div>
      </div>
    </div>
  );
} 