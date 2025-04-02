import React, { useState } from "react";
import SubmissionDetail from "./SubmissionDetail";
import { LeaderboardEntry } from "@/features/contests/types/contest.types";

interface ExtendedLeaderboardEntry extends LeaderboardEntry {
  unsolved: number;
  attempted: number;
  submissions: Array<{
    problemName: string;
    language: string;
    timeTaken: string;
    status: string;
    score: number;
  }>;
}

interface UserPerformanceProps {
  user: ExtendedLeaderboardEntry;
  onClose: () => void;
}

const UserPerformance = ({ user, onClose }: UserPerformanceProps) => {
  const [selectedSubmission, setSelectedSubmission] = useState<
    (typeof user.submissions)[0] | null
  >(null);

  const handleSubmissionClick = (submission: (typeof user.submissions)[0]) => {
    setSelectedSubmission(submission);
  };

  const handleCloseSubmissionDetail = () => {
    setSelectedSubmission(null); // Close the submission detail view
  };

  return (
    <div className="p-6 rounded-lg bg-[#10141D]">
      <h2 className="text-xl font-bold mb-4 text-white">
        Analyzing {user.username}&apos;s Performance
      </h2>
      <div className="text-white mb-4 flex justify-between px-4 py-4 bg-[#ffffff1d]">
        <p>Rank: {user.rank}</p>
        <p>Score: {user.score}</p>
        <p>Solved: {user.questionsSolved}</p>
        <p>Unsolved: {user.unsolved}</p>
        <p>Attempted: {user.attempted}</p>
        <p>No. of Submissions: {user.submissions.length}</p>
      </div>
      <h3 className="text-lg font-bold text-white mt-12">Submissions</h3>
      {selectedSubmission ? (
        <SubmissionDetail
          submission={selectedSubmission}
          onClose={handleCloseSubmissionDetail}
        />
      ) : (
        <table className="min-w-full mt-2">
          <thead>
            <tr className="bg-[#252B39]">
              <th className="text-white py-4 px-4">Problem Name</th>
              <th className="text-white py-4 px-4">Language</th>
              <th className="text-white py-4 px-4">Time Taken</th>
              <th className="text-white py-4 px-4">Status</th>
              <th className="text-white py-4 px-4">Score</th>
            </tr>
          </thead>
          <tbody>
            {user.submissions.map((submission, index) => (
              <tr
                key={index}
                className={`${index % 2 !== 0 ? "bg-[#1F232D]" : ""}`}
                onClick={() => handleSubmissionClick(submission)}
              >
                <td className="text-white py-4 px-4 text-center">
                  {submission.problemName}
                </td>
                <td className="text-white py-4 px-4 text-center">
                  {submission.language}
                </td>
                <td className="text-white py-4 px-4 text-center">
                  {submission.timeTaken}
                </td>
                <td className="text-white py-4 px-4 text-center">
                  {submission.status}
                </td>
                <td className="text-white py-4 px-4 text-center">
                  {submission.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        onClick={onClose}
        className="mt-4 bg-gray-500 text-white py-2 px-4 rounded"
      >
        Close
      </button>
    </div>
  );
};

export default UserPerformance;
