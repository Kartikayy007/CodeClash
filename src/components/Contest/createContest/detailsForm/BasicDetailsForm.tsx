import React from "react";
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

  return (
    <div className="space-y-6">
      <div className="form-item">
        <label className="text-[#D1D1D1] text-[14px] block mb-2">
          Contest Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onChange}
          required
          className="w-full h-[45px] px-3 sm:px-4 py-2 rounded-md bg-transparent border-2 border-white 
            focus:outline-none transition-all duration-500 text-sm sm:text-base text-white focus:border-[#C879EB]"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="form-item">
          <label className="text-[#D1D1D1] text-[14px] block mb-2">
            Start Date
          </label>
          <input
            type="date"
            name="startTime.date"
            value={formData.startTime.date}
            onChange={onChange}
            min={todayStr}
            required
            className="w-full h-[45px] px-3 sm:px-4 py-2 rounded-md bg-transparent border-2 border-white
              focus:outline-none transition-all duration-500 text-sm sm:text-base text-white focus:border-[#C879EB]"
          />
        </div>
        <div className="form-item">
          <label className="text-[#D1D1D1] text-[14px] block mb-2">
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
            className="w-full h-[45px] px-3 sm:px-4 py-2 rounded-md bg-transparent border-2 border-white 
              focus:outline-none transition-all duration-500 text-sm sm:text-base text-white focus:border-[#C879EB]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="form-item">
          <label className="text-[#D1D1D1] text-[14px] block mb-2">
            End Date
          </label>
          <input
            type="date"
            name="endTime.date"
            value={formData.endTime.date}
            onChange={onChange}
            min={formData.startTime.date || todayStr}
            required
            className="w-full h-[45px] px-3 sm:px-4 py-2 rounded-md bg-transparent border-2 border-white 
              focus:outline-none transition-all duration-500 text-sm sm:text-base text-white focus:border-[#C879EB]"
          />
        </div>
        <div className="form-item">
          <label className="text-[#D1D1D1] text-[14px] block mb-2">
            End Time
          </label>
          <input
            type="time"
            name="endTime.time"
            value={formData.endTime.time}
            onChange={onChange}
            min={getMinEndTime()}
            required
            className="w-full h-[45px] px-3 sm:px-4 py-2 rounded-md bg-transparent border-2 border-white
              focus:outline-none transition-all duration-500 text-sm sm:text-base text-white focus:border-[#C879EB]"
          />
        </div>
      </div>

      <div className="form-item">
        <label className="text-[#D1D1D1] text-[14px] block mb-2">
          Organization Name
        </label>
        <input
          type="text"
          name="organizationName"
          value={formData.organizationName}
          onChange={onChange}
          className="w-full h-[45px] px-3 sm:px-4 py-2 rounded-md bg-transparent border-2 border-white
            focus:outline-none transition-all duration-500 text-sm sm:text-base text-white focus:border-[#C879EB]"
        />
      </div>
    </div>
  );
};

export default BasicDetailsForm;
