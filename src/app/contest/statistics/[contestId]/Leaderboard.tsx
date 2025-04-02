import React, { useState } from "react";
import UserPerformance from "./UserPerformance";
import Image from "next/image";

const Leaderboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<Participant | null>(null);

  const participants: Participant[] = [
    {
      rank: "1",
      username: "Abcdef",
      timeTaken: "30 min",
      questionsSolved: 5,
      score: 90.0,
      unsolved: 0,
      attempted: 5,
      submissions: [],
    },
    {
      rank: "2",
      username: "Efghij",
      timeTaken: "30 min",
      questionsSolved: 5,
      score: 80.0,
      unsolved: 0,
      attempted: 5,
      submissions: [],
    },
  ];

  const filteredParticipants = participants.filter((participant) =>
    participant.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  interface Participant {
    rank: string;
    username: string;
    timeTaken: string;
    questionsSolved: number;
    score: number;
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

  const handleUsernameClick = (participant: Participant): void => {
    setSelectedUser({
      ...participant,
      unsolved: 2,
      attempted: 5,
      submissions: [
        {
          problemName: "Two Pointer",
          language: "C++",
          timeTaken: "30 min",
          status: "Correct Answer",
          score: 90.0,
        },
        {
          problemName: "Insertion in LL",
          language: "C",
          timeTaken: "30 min",
          status: "Compilation Error",
          score: 0.0,
        },
      ],
    });
  };

  const handleClosePerformance = () => {
    setSelectedUser(null);
  };

  return (
    <div className="p-6 rounded-lg flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-white">Leaderboard</h2>
      <input
        type="text"
        placeholder="Enter Username"
        className="w-1/2 self-end p-2 mb-4 rounded bg-[#2A2D3D] text-white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {selectedUser ? (
        <UserPerformance user={selectedUser} onClose={handleClosePerformance} />
      ) : filteredParticipants.length === 0 ? (
        <div className="flex flex-col items-center h-[70vh] justify-center">
          <Image src="/nouser.svg" alt="No User Found" className="mb-4" />
          <p className="text-white">User Not Found</p>
          <p className="text-white">
            The user has not participated in the contest.
          </p>
        </div>
      ) : (
        <table className="min-w-full">
          <thead>
            <tr className="bg-[#252B39]">
              <th className="text-white py-4 text-center px-4">Rank</th>
              <th className="text-white py-4 text-center px-4">Username</th>
              <th className="text-white py-4 text-center px-4">Time Taken</th>
              <th className="text-white py-4 text-center px-4">
                Questions Solved
              </th>
              <th className="text-white py-4 text-center px-4">Score</th>
            </tr>
          </thead>
          <tbody>
            {filteredParticipants.map((participant, index) => (
              <tr
                key={participant.rank}
                className={`hover:bg-[#2A2D3D] ${index % 2 !== 0 ? "bg-[#1F232D]" : ""}`}
              >
                <td className="text-white py-4 text-center px-4">
                  {participant.rank}
                </td>
                <td
                  className="text-white py-4 text-center px-4 cursor-pointer"
                  onClick={() => handleUsernameClick(participant)}
                >
                  {participant.username}
                </td>
                <td className="text-white py-4 text-center px-4">
                  {participant.timeTaken}
                </td>
                <td className="text-white py-4 text-center px-4">
                  {participant.questionsSolved}
                </td>
                <td className="text-white py-4 text-center px-4">
                  {participant.score.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;
