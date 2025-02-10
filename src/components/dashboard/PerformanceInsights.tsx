'use client';

import { LineChart } from '@mui/x-charts/LineChart';

interface PerformanceInsightsProps {
  className?: string;
}

const PerformanceInsights = ({ className = '' }: PerformanceInsightsProps) => {
  const stats = [
    { label: 'Win Streak', value: '5' },
    { label: 'Fastest Win', value: '10min' },
    { label: 'Contest Participation', value: '5' },
  ];

  return (
    <div className={`relative bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-lg p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Performance Insights</h2>
      </div>

      <select className="px-2 py-1 rounded border border-[#888888] text-[#e7e7e7] text-sm font-medium hover:bg-white/5 mb-6 bg-transparent cursor-pointer">
        <option value="all" className="bg-[#1a1d26]">All</option>
        <option value="week" className="bg-[#1a1d26]">Week</option>
        <option value="month" className="bg-[#1a1d26]">Month</option>
        <option value="year" className="bg-[#1a1d26]">Year</option>
      </select>

      <div className="h-[220px] mb-6">
        <LineChart
          xAxis={[{
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            scaleType: 'point',
            tickLabelStyle: {
              fill: '#D1D1D1',
            },
            tickSize: 0,
            disableLine: true,
          }]}
          yAxis={[{
            min: 0,
            max: 8,
            tickLabelStyle: {
              fill: '#D1D1D1',
            },
            tickSize: 0,
            disableLine: true,
          }]}
          series={[{
            data: [3, 7, 7, 5, 3, 7, 3],
            showMark: true,
            color: '#C879EB',
            curve: 'linear',
            valueFormatter: (value) => value === 7 ? 'W' : 'L',
          }]}
          width={400}
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
            '& .MuiLineElement-root': { 
              strokeWidth: 2,
              filter: 'drop-shadow(0 0 6px rgba(200, 121, 235, 0.6))',
            },
            '& .MuiMarkElement-root': {
              stroke: '#C879EB',
              fill: '#C879EB',
              strokeWidth: 2,
              r: 4,
              filter: 'drop-shadow(0 0 4px rgba(200, 121, 235, 0.6))',
            },
          }}
        />
      </div>

      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-[#c879eb]" />
          <div className="w-2 h-2 rounded-full bg-[#c879eb] border border-[#c879eb]" />
        </div>
        <span className="text-[#b0b0b0] text-xs">Win trend over last 7 days</span>
      </div>

      <div className="space-y-1">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 border-b border-black/20"
          >
            <span className="text-sm font-medium">{stat.label}</span>
            <span className="text-sm font-medium">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceInsights;