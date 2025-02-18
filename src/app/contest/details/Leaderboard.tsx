import React, { useState } from 'react';
import UserPerformance from './UserPerformance';

const Leaderboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null); // State to manage selected user

  const participants = [
    { rank: 1, username: 'Abcdef', timeTaken: '30 min', questionsSolved: 5, score: 90.00 },
    { rank: 2, username: 'Efghij', timeTaken: '30 min', questionsSolved: 5, score: 80.00 },
    { rank: 3, username: 'Qwetyu', timeTaken: '30 min', questionsSolved: 4, score: 70.00 },
    { rank: 4, username: 'Ytrefg', timeTaken: '30 min', questionsSolved: 4, score: 60.00 },
    { rank: 5, username: 'Dfghksis', timeTaken: '1 hr', questionsSolved: 4, score: 50.00 },
    { rank: 6, username: 'Asdfhjc', timeTaken: '1 hr', questionsSolved: 3, score: 46.00 },
    { rank: 7, username: 'Zxfdeytfb', timeTaken: '1 hr', questionsSolved: 3, score: 40.00 },
    { rank: 8, username: 'Qeryuincksm', timeTaken: '1 hr', questionsSolved: 3, score: 30.00 },
    { rank: 9, username: 'Qpryu n n', timeTaken: '1 hr', questionsSolved: 3, score: 20.00 },
    { rank: 10, username: 'Ghijlikhg', timeTaken: '1 hr 10 min', questionsSolved: 1, score: 2.00 },
  ];

  const filteredParticipants = participants.filter(participant =>
    participant.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUsernameClick = (participant) => {
    // Set the selected user and show the performance component
    setSelectedUser({
      ...participant,
      unsolved: 2, // Example data
      attempted: 5, // Example data
      submissions: [
        { problemName: 'Two Pointer', language: 'C++', timeTaken: '30 min', status: 'Correct Answer', score: 90.00 },
        { problemName: 'Insertion in LL', language: 'C', timeTaken: '30 min', status: 'Compilation Error', score: 0.00 },
        // Add more submissions as needed
      ],
    });
  };

  const handleClosePerformance = () => {
    setSelectedUser(null); // Close the performance view
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
          <img src="/nouser.svg" alt="No User Found" className="mb-4" />
          <p className="text-white">User Not Found</p>
          <p className="text-white">The user has not participated in the contest.</p>
        </div>
      ) : (
        <table className="min-w-full">
          <thead>
            <tr className="bg-[#252B39]">
              <th className="text-white py-4 text-center px-4">Rank</th>
              <th className="text-white py-4 text-center px-4">Username</th>
              <th className="text-white py-4 text-center px-4">Time Taken</th>
              <th className="text-white py-4 text-center px-4">Questions Solved</th>
              <th className="text-white py-4 text-center px-4">Score</th>
            </tr>
          </thead>
          <tbody>
            {filteredParticipants.map((participant, index) => (
              <tr key={participant.rank} className={`hover:bg-[#2A2D3D] ${index % 2 !== 0 ? 'bg-[#1F232D]' : ''}`}>
                <td className="text-white py-4 text-center px-4">{participant.rank.toString().padStart(2, '0')}</td>
                <td className="text-white py-4 text-center px-4 cursor-pointer" onClick={() => handleUsernameClick(participant)}>
                  {participant.username}
                </td>
                <td className="text-white py-4 text-center px-4">{participant.timeTaken}</td>
                <td className="text-white py-4 text-center px-4">{participant.questionsSolved}</td>
                <td className="text-white py-4 text-center px-4">{participant.score.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard; 