import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, ExternalLink, Clock, CheckCircle } from "lucide-react";

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

  const contestItems = [
    {
      title: "Recent Contest",
      description: "View your latest contest performances and results.",
      id: 1,
      icon: <Trophy className="h-[16px] w-[16px] text-white" />,
    },
    {
      title: "Past Contest",
      description: "Browse through your contest history and achievements.",
      id: 2,
      icon: <CheckCircle className="h-[16px] w-[16px] text-white" />,
    },
    {
      title: "Upcoming Contest",
      description: "Check out upcoming contests and register to participate.",
      id: 3,
      icon: <Clock className="h-[16px] w-[16px] text-white" />,
    },
  ];

  return (
    <div className={`w-full bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-lg p-6  
    ${className}`}>
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-cyan-500/20 flex-shrink-0">
        <h2 className="text-lg font-semibold text-white">Contest Status</h2>
      </div>

    </div>
  );

};

export default ManageContest;
