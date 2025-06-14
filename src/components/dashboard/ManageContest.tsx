import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Users, Calendar, Copy, ExternalLink } from "lucide-react";

interface ManageContestProps {
  className?: string;
}

const ManageContest = ({ className = "" }: ManageContestProps) => {
  const router = useRouter();
  const [contestCode, setContestCode] = useState<string | null>(null);

  useEffect(() => {
    const code = localStorage.getItem("contestCode");
    setContestCode(code);
  }, []);

  return (
    <div className={`w-full bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-lg p-6 border border-transparent hover:border-white/30 transition-all duration-300 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-semibold text-white">Contest Status</h2>
      </div>

      {contestCode ? (
        <div className="space-y-4">
          {/* Active Contest Card */}
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Active Contest</span>
              </div>
              <button
                onClick={() => router.push("/contest/manage")}
                className="flex items-center gap-1 text-green-400 hover:text-green-300 text-sm transition-colors"
              >
                Manage
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Contest Access</span>
                <button
                  onClick={() => router.push(`/contest/${contestCode}`)}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  Go to Contest
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">No Active Contest</h3>
          <p className="text-gray-500 text-sm mb-4">
            Register for a contest to see your contest details here
          </p>
          <button
            onClick={() => router.push("/contest/join")}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Join a Contest
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageContest;
