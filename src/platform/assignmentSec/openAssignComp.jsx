import React from "react";

const submissions = [
  { student: "Aakash", time: "2 Nov", attachment: "file name", grade: "Not Graded" },
  { student: "Amit", time: "2 Nov", attachment: "file name", grade: "Not Graded" },
  { student: "Sarthak", time: "2 Nov", attachment: "file name", grade: "Not Graded" },
  { student: "Sam", time: "2 Nov", attachment: "file name", grade: "Not Graded" },
  { student: "Rahul", time: "2 Nov", attachment: "file name", grade: "Not Graded" },
  { student: "Krish", time: "2 Nov", attachment: "file name", grade: "Not Graded" },
];

const SummaryCard = ({ title, value, bgColor }) => (
  <div className={`flex flex-col items-center justify-center w-1/4 p-4 rounded-lg ${bgColor}`}>
    <h2 className="text-3xl font-bold">{value}</h2>
    <p className="text-lg text-gray-700">{title}</p>
  </div>
);

const AssignOpenComp = () => {
  return (
    <div className="p-8 mt-[50px]   bg-[#E1EAE8] min-h-screen ">

      <h1 className="text-2xl   mb-8">Mid-Term Essay Submissions</h1>


      <div className="flex justify-between mb-8 text-center">
        <SummaryCard title="Total Students" value={60} bgColor="bg-[#FFF3D4]" />
        <SummaryCard title="Student Completed" value={42} bgColor="bg-[#C8EAC9]"/>
        <SummaryCard title="Not Completed" value={18} bgColor="bg-[#F8D0D0]" />
      </div>


      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-[#D9DEDE]">
            <th className="border border-gray-300 px-4 py-2 text-center h-[50px] text-xl font-medium">Student</th>
            <th className="border border-gray-300 px-4 py-2 text-center h-[50px] text-xl font-medium">Submission Time</th>
            <th className="border border-gray-300 px-4 py-2 text-center h-[50px] text-xl font-medium">Attachment</th>
            <th className="border border-gray-300 px-4 py-2 text-center h-[50px] text-xl font-medium">Grade</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission, index) => (
            <tr key={index} className="even:bg-[#EEF0F0] odd:bg-[#FAFAFA] h-[50px]">
              <td className="border border-gray-300 px-4 py-2 text-center">{submission.student}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{submission.time}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <a href="#" className="text-blue-500 hover:underline">{submission.attachment}</a>
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">{submission.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignOpenComp;
