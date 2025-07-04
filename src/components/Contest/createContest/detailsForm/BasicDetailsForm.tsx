import React, { useEffect } from "react";
import { ContestDetails } from "@/types/contest.types";

interface BasicDetailsFormProps {
  formData: ContestDetails;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

const BasicDetailsForm: React.FC<BasicDetailsFormProps> = ({
  formData,
  onChange,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split("T")[0];

  // Debug timezone information on component mount
  useEffect(() => {
    console.log('--- BASIC DETAILS FORM TIMEZONE DEBUG ---');
    console.log('Current date (ISO):', new Date().toISOString());
    console.log('Current date (Local):', new Date().toString());
    console.log('Current timezone offset:', new Date().getTimezoneOffset() / -60);
    console.log('Today string for min dates:', todayStr);
    console.log('Form data dates:', {
      startDate: formData.startTime.date,
      startTime: formData.startTime.time,
      endDate: formData.endTime.date,
      endTime: formData.endTime.time
    });
    
    // Test parsing the dates
    if (formData.startTime.date && formData.startTime.time) {
      const startDateTime = new Date(`${formData.startTime.date}T${formData.startTime.time}:00`);
      console.log('Parsed start date (ISO):', startDateTime.toISOString());
      console.log('Parsed start date (Local):', startDateTime.toString());
    }
  }, [formData, todayStr]);

  // Get minimum time for start time if date is today
  const getMinStartTime = (date: string) => {
    if (date === todayStr) {
      const now = new Date();
      return now.toTimeString().slice(0, 5); // Returns HH:mm format
    }
    return "00:00";
  };

  // Get minimum time for end time based on start date and time
  const getMinEndTime = () => {
    if (formData.endTime.date === formData.startTime.date) {
      return formData.startTime.time;
    }
    return "00:00";
  };
  console.log(formData.startTime);
  return (
    <div className="space-y-6">
      <div className="form-item">
        <label className="text-[#D1D1D1] text-[14px] block mb-2 font-medium">
          Contest Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onChange}
          required
          className="w-full h-[45px] px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border border-cyan-500/20 
            focus:outline-none focus:border-cyan-500/40 transition-all duration-200 text-sm sm:text-base text-white shadow-lg shadow-cyan-500/10"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="form-item">
          <label className="text-[#D1D1D1] text-[14px] block mb-2 font-medium">
            Start Date
          </label>
          <input
            type="date"
            name="startTime.date"
            value={formData.startTime.date}
            onChange={onChange}
            min={todayStr}
            required
            className="w-full h-[45px] px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border border-cyan-500/20
              focus:outline-none focus:border-cyan-500/40 transition-all duration-200 text-sm sm:text-base text-white shadow-lg shadow-cyan-500/10"
          />
        </div>
        <div className="form-item">
          <label className="text-[#D1D1D1] text-[14px] block mb-2 font-medium">
            Start Time
          </label>
          <input
            type="time"
            name="startTime.time"
            value={formData.startTime.time}
            onChange={onChange}
            min={
              formData.startTime.date === todayStr
                ? getMinStartTime(formData.startTime.date)
                : undefined
            }
            required
            className="w-full h-[45px] px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border border-cyan-500/20 
              focus:outline-none focus:border-cyan-500/40 transition-all duration-200 text-sm sm:text-base text-white shadow-lg shadow-cyan-500/10"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="form-item">
          <label className="text-[#D1D1D1] text-[14px] block mb-2 font-medium">
            End Date
          </label>
          <input
            type="date"
            name="endTime.date"
            value={formData.endTime.date}
            onChange={onChange}
            min={formData.startTime.date || todayStr}
            required
            className="w-full h-[45px] px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border border-cyan-500/20 
              focus:outline-none focus:border-cyan-500/40 transition-all duration-200 text-sm sm:text-base text-white shadow-lg shadow-cyan-500/10"
          />
        </div>
        <div className="form-item">
          <label className="text-[#D1D1D1] text-[14px] block mb-2 font-medium">
            End Time
          </label>
          <input
            type="time"
            name="endTime.time"
            value={formData.endTime.time}
            onChange={onChange}
            min={getMinEndTime()}
            required
            className="w-full h-[45px] px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border border-cyan-500/20
              focus:outline-none focus:border-cyan-500/40 transition-all duration-200 text-sm sm:text-base text-white shadow-lg shadow-cyan-500/10"
          />
        </div>
      </div>

      <div className="form-item">
        <label className="text-[#D1D1D1] text-[14px] block mb-2 font-medium">
          Organization Name
        </label>
        <input
          type="text"
          name="organizationName"
          value={formData.organizationName}
          onChange={onChange}
          className="w-full h-[45px] px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border border-cyan-500/20
            focus:outline-none focus:border-cyan-500/40 transition-all duration-200 text-sm sm:text-base text-white shadow-lg shadow-cyan-500/10"
        />
      </div>
    </div>
  );
};

export default BasicDetailsForm;
