import React from 'react'

const Submissions = () => {
  const submissions = [
    {
      id: 1,
      status: 'Accepted',
      runtime: '56 ms',
      memory: '42.1 MB',
      language: 'C++',
      timestamp: '2 minutes ago'
    },
    {
      id: 2,
      status: 'Wrong Answer',
      runtime: '62 ms',
      memory: '41.8 MB',
      language: 'C++',
      timestamp: '5 minutes ago'
    }
  ];

  return (
    <div className="p-6">
      <div className="space-y-4">
        {submissions.map((submission) => (
          <div 
            key={submission.id}
            className="bg-[#292C33] p-4 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <span className={`${
                submission.status === 'Accepted' ? 'text-green-500' : 'text-red-500'
              }`}>
                {submission.status}
              </span>
              <span className="text-gray-400">{submission.runtime}</span>
              <span className="text-gray-400">{submission.memory}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">{submission.language}</span>
              <span className="text-gray-400">{submission.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Submissions
