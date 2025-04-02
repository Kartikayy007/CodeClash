import React from "react";

interface SubmissionDetailProps {
  submission: {
    problemName: string;
    language: string;
    timeTaken: string;
    status: string;
    score: number;
  };
  onClose: () => void;
}

const SubmissionDetail = ({ submission, onClose }: SubmissionDetailProps) => {
  return (
    <div className="p-6 rounded-lg bg-[#10141D]">
      <h2 className="text-xl font-bold mb-4 text-white">Submission Details</h2>
      <div className="text-white mb-4 flex justify-between px-4 py-4 bg-[#ffffff1d]">
        <p>Time: {submission.timeTaken}</p>
        <p>Status: {submission.status}</p>
        <p>Score: {submission.score}</p>
      </div>
      <h3 className="text-lg font-bold text-white mt-12">Analysis</h3>
      <p className="text-white">Problem Name: {submission.problemName}</p>
      <p className="text-white">Language: {submission.language}</p>
      <button
        onClick={onClose}
        className="mt-4 bg-gray-500 text-white py-2 px-4 rounded"
      >
        Close
      </button>
    </div>
  );
};

export default SubmissionDetail;
