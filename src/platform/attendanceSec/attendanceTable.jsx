import React from "react";

const AttendanceTable = () => {
  const data = [
    { title: "Revision Class", date: "2 Nov", time: "9:00 PM", attendance: "Present" },
    { title: "Revision Class", date: "2 Nov", time: "9:00 PM", attendance: "Absent" },
    { title: "Revision Class", date: "2 Nov", time: "9:00 PM", attendance: "Absent" },
    { title: "Revision Class", date: "2 Nov", time: "9:00 PM", attendance: "Present" },
    { title: "Revision Class", date: "2 Nov", time: "9:00 PM", attendance: "Absent" },
    { title: "Revision Class", date: "2 Nov", time: "9:00 PM", attendance: "Present" },
    { title: "Revision Class", date: "2 Nov", time: "9:00 PM", attendance: "Absent" },
  ];

  return (
    <div className="p-6 rounded-lg overflow-y-auto">
      <table className="w-full border-collapse border text-center border-[#5D6C6C] rounded-lg text-left text-sm text-[#394141]">
        <thead >
          <tr className="bg-[#D9DEDE]">
            <th className="p-6 border border-[#5D6C6C]  font-medium ">Lecture Title</th>
            <th className="p-6 border border-[#5D6C6C] font-medium">Date</th>
            <th className="p-6 border border-[#5D6C6C] font-medium">Time</th>
            <th className="p-6 border border-[#5D6C6C] font-medium">Attendance</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-[#EEF0F0]"
              } `}
            >
              <td className="p-6 ">{item.title}</td>
              <td className="p-6 ">{item.date}</td>
              <td className="p-6 ">{item.time}</td>
              <td className="p-6 ">
                <span
                  className={`px-4 py-2 rounded-lg text-xs ${
                    item.attendance === "Present"
                      ? "bg-[#9DD89F]"
                      : "bg-[#F1B0B0] "
                  }`}
                >
                  {item.attendance}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
