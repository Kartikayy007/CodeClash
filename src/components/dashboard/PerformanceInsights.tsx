"use client";

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PerformanceInsightsProps {
  className?: string;
}

const PerformanceInsights: React.FC<PerformanceInsightsProps> = ({
  className = "",
}) => {
  const [chartWidth, setChartWidth] = useState(400);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  const mockData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Rating",
        data: [1200, 1250, 1180, 1320, 1280, 1350],
        borderColor: "#8B5CF6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1F2937",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#374151",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: "#374151",
        },
        ticks: {
          color: "#9CA3AF",
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: "#374151",
        },
        ticks: {
          color: "#9CA3AF",
          font: {
            size: 12,
          },
        },
      },
    },
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        // Mobile
        setChartWidth(window.innerWidth * 0.85);
      } else if (window.innerWidth < 1024) {
        // Tablet
        setChartWidth(window.innerWidth * 0.4);
      } else {
        // Desktop
        setChartWidth(window.innerWidth * 0.25);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return (
      <div
        className={`relative bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-lg p-4 md:p-6 ${className}`}
      >
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <div className="h-6 bg-gray-700 rounded w-40 animate-pulse"></div>
        </div>
        <div className="h-48 md:h-56 bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-lg p-4 md:p-6 border border-transparent hover:border-white/30 transition-all duration-300 ${className}`}
    >
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-semibold">Performance Insights</h2>
      </div>

      <div className="h-48 md:h-56 lg:h-64">
        <Line data={mockData} options={options} />
      </div>

      {/* Mobile stats summary */}
      <div className="mt-4 grid grid-cols-3 gap-3 sm:hidden">
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-400">Current</p>
          <p className="text-sm font-bold">1350</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-400">Peak</p>
          <p className="text-sm font-bold">1350</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-400">Growth</p>
          <p className="text-sm font-bold text-green-400">+150</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceInsights;
