import React from 'react';

const SubmissionDetail = ({ submission, onClose }) => {
  return (
    <div className="p-6 rounded-lg bg-[#10141D]">
      <h2 className="text-xl font-bold mb-4 text-white">Submission Details</h2>
      <div className="text-white mb-4 flex justify-between px-4 py-4 bg-[#ffffff1d]">
        <p>Time: {submission.time}</p>
        <p>Testcases: {submission.testcases}</p>
        <p>Status: {submission.status}</p>
        <p>Score: {submission.score}</p>
      </div>
      <h3 className="text-lg font-bold text-white mt-12">Analysis</h3>
      <p className="text-white">Input value: {submission.inputValue}</p>
      <p className="text-white">Expected Output: {submission.expectedOutput}</p>
      <p className="text-white">Your Output: {submission.yourOutput}</p>
      <h3 className="text-lg font-bold text-white mt-12">Your Code:</h3>
      <pre className="bg-[#2A2D3D] p-4 rounded text-white">{submission.code}</pre>
      <button onClick={onClose} className="mt-4 bg-gray-500 text-white py-2 px-4 rounded">Close</button>
    </div>
  );
};

export default SubmissionDetail; 