import React,{useEffect,useState} from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
const AnimatedGraph = ({classCode}) => {
  const [data,setData]=useState([]);
  useEffect(()=>{
    const fetchData = async()=>{
        const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/classroom/attendance?classCode=${classCode}`, { headers });
            if (response.data.success) {
                setData(response.data.last7Lectures);
            }
        } catch (error) {
            console.log('Error fetching attendance data:', error);
        }
    }
    fetchData();
},[])
const minAttendance = Math.min(...data.map(item => item.attendance));
  const maxAttendance = Math.max(...data.map(item => item.attendance));
  return (
    <div className=" p-6 bg-white rounded-lg  mx-auto">
      <h2 className="text-xl text-gray-800 mb-4">
        Attendance Trend Over Time
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              domain={[minAttendance, maxAttendance]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#008080",
                border: "none",
                borderRadius: "4px",
              }}
              labelStyle={{ color: "#FFFFFF" }}
              itemStyle={{ color: "#FFFFFF" }}
            />
            <Line
              type="monotone"
              dataKey="attendance"
              stroke="#008080"
              strokeWidth={3}
              dot={{ fill: "#008080", r: 6 }}
              activeDot={{ r: 8 }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnimatedGraph;