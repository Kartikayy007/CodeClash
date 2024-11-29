import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "06/11", attendance: 45 },
  { date: "07/11", attendance: 50 },
  { date: "08/11", attendance: 48 },
  { date: "09/11", attendance: 49 },
  { date: "10/11", attendance: 47 },
  { date: "11/11", attendance: 52 },
  { date: "12/11", attendance: 48 },
];

const AnimatedGraph = () => {
  return (
    <div className=" p-6 bg-white rounded-lg  mx-auto">
      <h2 className="text-xl text-gray-800 mb-4">
        Attendance Trend Over Time
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              domain={[40, 60]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#008080",
                border: "none",
                borderRadius: "4px",
              }}
              labelStyle={{ color: "#FFFFFF" }}
              itemStyle={{ color: "#FFFFFF" }}
            />
            <Line
              type="monotone"
              dataKey="attendance"
              stroke="#008080"
              strokeWidth={3}
              dot={{ fill: "#008080", r: 6 }}
              activeDot={{ r: 8 }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnimatedGraph;
