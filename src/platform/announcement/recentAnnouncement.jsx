// RecentAnnouncements.jsx
import React from 'react';

const RecentAnnouncements = ({ announcements }) => {
  return (
    <div className="mt-6 space-y-3">
      {announcements.length > 0 ? (
        announcements.slice(0, 5).map((announce, index) => (
          <div
            key={index}
            className="p-3 border border-[#738484] rounded-md bg-white shadow-sm"
          >
            <h3 className="font-bold text-gray-800">{announce.title}</h3>
            <p className="text-gray-600">{announce.description}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No recent announcements.</p>
      )}
    </div>
  );
};

export default RecentAnnouncements;
