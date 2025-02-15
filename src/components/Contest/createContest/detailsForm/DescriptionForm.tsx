import React from 'react';
import { ContestDetails } from '@/types/contest.types';

interface DescriptionFormProps {
  formData: ContestDetails;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const DescriptionForm: React.FC<DescriptionFormProps> = ({ formData, onChange }) => {
  return (
    <form className="space-y-6">
      <div>
        <label className="block text-gray-300 text-sm mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          rows={4}
          className="w-full bg-transparent border-2 border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C879EB]"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2">Rules</label>
        <textarea
          name="rules"
          value={formData.rules}
          onChange={onChange}
          rows={4}
          className="w-full bg-transparent border-2 border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C879EB]"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2">Prizes</label>
        <textarea
          name="prizes"
          value={formData.prizes}
          onChange={onChange}
          rows={4}
          className="w-full bg-transparent border-2 border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C879EB]"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2">Score</label>
        <textarea
          name="score"
          value={formData.score}
          onChange={onChange}
          rows={4}
          className="w-full bg-transparent border-2 border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C879EB]"
        />
      </div>
    </form>
  );
};

export default DescriptionForm; 