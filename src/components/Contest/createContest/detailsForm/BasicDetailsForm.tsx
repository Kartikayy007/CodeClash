import React from 'react';
import { ContestDetails } from '@/types/contest.types';

interface BasicDetailsFormProps {
  formData: ContestDetails;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BasicDetailsForm: React.FC<BasicDetailsFormProps> = ({ formData, onChange }) => {
  return (
    <form className="space-y-6">
      <div>
        <label className="block text-gray-300 text-sm mb-2">Contest Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onChange}
          placeholder=""
          className="w-full bg-transparent border-2 border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C879EB]"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2">Start Time</label>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            name="startTime.date"
            value={formData.startTime.date}
            onChange={onChange}
            className="bg-transparent border-2 border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C879EB]"
          />
          <input
            type="time"
            name="startTime.time"
            value={formData.startTime.time}
            onChange={onChange}
            className="bg-transparent border-2 border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C879EB]"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2">End Time</label>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            name="endTime.date"
            value={formData.endTime.date}
            onChange={onChange}
            className="bg-transparent border-2 border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C879EB]"
          />
          <input
            type="time"
            name="endTime.time"
            value={formData.endTime.time}
            onChange={onChange}
            className="bg-transparent border-2 border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C879EB]"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2">Organization Name</label>
        <input
          type="text"
          name="organizationName"
          value={formData.organizationName}
          onChange={onChange}
          className="w-full bg-transparent border-2 border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C879EB]"
        />
      </div>
    </form>
  );
};

export default BasicDetailsForm; 