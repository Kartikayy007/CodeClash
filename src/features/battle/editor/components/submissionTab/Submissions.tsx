import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  Check,
  X,
  AlertTriangle,
  Clock,
  Settings,
  BarChart,
  Lock,
  Infinity,
  HelpCircle,
} from "lucide-react";
import { fetchSubmissionsByMatchId } from "../../slices/submissionSlice";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "ACCEPTED":
      return <Check className="w-4 h-4 text-green-500" />;
    case "TIME_LIMIT_EXCEEDED":
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case "RUNTIME_ERROR":
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case "WRONG_ANSWER":
      return <X className="w-4 h-4 text-red-500" />;
    case "COMPILATION_ERROR":
      return <Settings className="w-4 h-4 text-blue-500" />;
    case "MEMORY_LIMIT_EXCEEDED":
      return <BarChart className="w-4 h-4 text-purple-500" />;
    case "SEGMENTATION_FAULT":
      return <Lock className="w-4 h-4 text-orange-500" />;
    case "INFINITE_LOOP":
      return <Infinity className="w-4 h-4 text-red-500" />;
    default:
      return <HelpCircle className="w-4 h-4 text-gray-500" />;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "ACCEPTED":
      return "Accepted";
    case "TIME_LIMIT_EXCEEDED":
      return "Time Limit Exceeded";
    case "RUNTIME_ERROR":
      return "Runtime Error";
    case "WRONG_ANSWER":
      return "Wrong Answer";
    case "COMPILATION_ERROR":
      return "Compilation Error";
    case "MEMORY_LIMIT_EXCEEDED":
      return "Memory Limit Exceeded";
    case "SEGMENTATION_FAULT":
      return "Segmentation Fault";
    case "INFINITE_LOOP":
      return "Infinite Loop";
    default:
      return "Undefined Behavior";
  }
};

interface SubmissionsProps {
  onSelectSubmission: (submissionId: string) => void;
}

const Submissions: React.FC<SubmissionsProps> = ({ onSelectSubmission }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { submissions, loading } = useSelector(
    (state: RootState) => state.submissions,
  );
  const { matchId } = useSelector((state: RootState) => state.battle);
  console.log(submissions);

  useEffect(() => {
    if (matchId) {
      dispatch(fetchSubmissionsByMatchId(matchId));
    }
  }, [dispatch, matchId]);

  return (
    <div className="h-full bg-[#1A1D24] text-white">
      <div className="grid grid-cols-4 p-4 text-lg font-semibold text-white">
        <div className="text-center">Time</div>
        <div className="text-center">Test Cases</div>
        <div className="text-center">Status</div>
        <div className="text-center">Score</div>
      </div>
      {loading ? (
        <div className="px-6">
          <div className="rounded-lg overflow-hidden">
            <h1 className="text-center mt-16 py-8 text-gray-400">
              Loading Submissions...
            </h1>
          </div>
        </div>
      ) : (
        <div className="px-6">
          <div className="rounded-lg overflow-hidden">
            {submissions.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No submissions yet
              </div>
            ) : (
              submissions.map((submission) => (
                <button
                  key={submission.id}
                  onClick={() => onSelectSubmission(submission.id)}
                  className="w-full grid grid-cols-4 p-4 mb-4 rounded-lg bg-[#1A1D24] items-center border border-[#5D5D5D] text-[#5D5D5D] hover:border-gray-400 hover:text-gray-400 transition-colors"
                >
                  <div className="text-sm">
                    {new Date(submission.createdAt)
                      .toLocaleString("en-US", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                      .replace(",", "")}
                  </div>
                  <div className="text-sm">
                    {submission.testCasesPassed}/{submission.totalTestCases}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {getStatusIcon(submission.status)}
                    </span>
                    <span className="text-sm">
                      {getStatusText(submission.status)}
                    </span>
                  </div>
                  <div className="text-sm"></div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Submissions;
