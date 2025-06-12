import React, { useEffect, useState } from "react";
import Link from "next/link";

interface RecentContestsProps {
  className?: string;
}

interface Contest {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  score: number;
  participantCount: number;
  hasReview: boolean;
}

export default function RecentContests({
  className = "",
}: RecentContestsProps) {
  const [contests, setContests] = useState<Contest[]>([]);
  const [debugData, setDebugData] = useState<null | object>(null);
  const [showDebug, setShowDebug] = useState(false);

  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    const fetchContests = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.error("No access token found in local storage");
        return;
      }

      try {
        const response = await fetch(
          "https://codeclash.goyalshivansh.tech/api/v1/contest/my-contests",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched contests data:", data);

        // Store debug data
        if (isDev) {
          setDebugData(data);
        }

        if (data.contests && Array.isArray(data.contests)) {
          setContests(data.contests);
        } else {
          console.error("Expected contests array but got:", data);
          setContests([]);
        }
      } catch (error) {
        console.error("Error fetching contests:", error);
        setContests([]);
        if (isDev) {
          setDebugData({ error: error.message });
        }
      }
    };

    fetchContests();
  }, [isDev]);

    // Function to calculate duration
  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = end.getTime() - start.getTime(); // Duration in milliseconds

    const hours = Math.floor((duration % (1000 * 3600 * 24)) / (1000 * 3600));
    const minutes = Math.floor((duration % (1000 * 3600)) / (1000 * 60));

    return `${hours} hr ${minutes} min`;
  };

  return (
    <div
      className={`relative bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-lg p-6 duration-300 ${className}`}
    >
      {/* Debug Overlay - Only shown in development */}
      {isDev && debugData && (
        <>
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="absolute top-2 right-2 z-10 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
          >
            {showDebug ? 'Hide' : 'API'}
          </button>

          
          
          {showDebug && (
            <div className="absolute top-10 right-2 z-20 bg-black/90 border border-gray-600 rounded-lg p-3 max-w-sm max-h-80 overflow-auto">
              <div>
            isdev: {isDev ? 'true' : 'false'}
            <br />
            debugData: {debugData ? 'true' : 'false'}
            <br />
            showDebug: {showDebug ? 'true' : 'false'}
            <br />
            contests length: {contests.length}
          </div>
              <div className="text-xs text-white">
                <div className="text-green-400 font-bold mb-2">API Response:</div>
                <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                  {JSON.stringify(debugData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Past Contests</h2>
        <Link
          href="/recent-contests"
          className="text-base hover:text-white/80"
          prefetch={true}
        >
          View All
        </Link>
      </div>

      {/* <div className="flex gap-3 mb-6">
        <button className="px-2 py-1 bg-[#3d3d3d] rounded text-sm font-medium">
          Participated
        </button>
        <button className="px-2 py-1 rounded border border-[#888888] text-[#e7e7e7] text-sm font-medium hover:bg-white/5">
          Created
        </button>
      </div> */}

      <div className="grid grid-cols-4 bg-white/10 rounded-lg px-8 py-2 mb-4 text-sm font-medium text-center">
        <span>Contest Name</span>
        <span>Score</span>
        <span>Players</span>
        <span>Duration</span>
      </div>

      <div className="space-y-2">
        {contests.length > 0 ? (
          contests.slice(0, 3).map((contest, index) => (
            <div
              key={index}
              className="grid grid-cols-5 bg-white/5 rounded-lg px-4 py-2"
            >
              <div className="flex items-center gap-2 col-span-2">
                <div className="w-4 h-4" />
                <span className="text-base font-medium">{contest.title}</span>
              </div>
              <span className="text-sm">{contest.score}</span>
              <span className="text-sm">{contest.participantCount}</span>
              <div className="flex justify-between items-center">
                <span className="text-sm">
                  {calculateDuration(contest.startTime, contest.endTime)}
                </span>
                {contest.hasReview && (
                  <button className="text-[#b0b0b0] text-sm font-medium hover:text-white">
                    Review
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p className="text-lg mb-2">No contests found</p>
            <p className="text-sm">Join contests to see your participation history here</p>
          </div>
        )}
      </div>
    </div>
  );
}
