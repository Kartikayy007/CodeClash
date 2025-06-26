import React from "react";
import { ContestDetails } from "@/types/contest.types";

interface DescriptionFormProps {
  formData: ContestDetails;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

const DescriptionForm: React.FC<DescriptionFormProps> = ({
  formData,
  onChange,
}) => {
  return (
    <form className="space-y-6">
      <div>
        <label className="block text-gray-300 text-sm mb-2 font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          rows={4}
          className="w-full bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border border-cyan-500/20
            focus:outline-none focus:border-cyan-500/40 transition-all duration-200 rounded-lg px-4 py-2 text-white shadow-lg shadow-cyan-500/10"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2 font-medium">Rules</label>
        <textarea
          name="rules"
          value={formData.rules}
          onChange={onChange}
          rows={4}
          className="w-full bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border border-cyan-500/20
            focus:outline-none focus:border-cyan-500/40 transition-all duration-200 rounded-lg px-4 py-2 text-white shadow-lg shadow-cyan-500/10"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2 font-medium">Prizes</label>
        <textarea
          name="prizes"
          value={formData.prizes}
          onChange={onChange}
          rows={4}
          className="w-full bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border border-cyan-500/20
            focus:outline-none focus:border-cyan-500/40 transition-all duration-200 rounded-lg px-4 py-2 text-white shadow-lg shadow-cyan-500/10"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2 font-medium">Score</label>
        <textarea
          name="score"
          value={formData.score}
          onChange={onChange}
          rows={4}
          className="w-full bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border border-cyan-500/20
            focus:outline-none focus:border-cyan-500/40 transition-all duration-200 rounded-lg px-4 py-2 text-white shadow-lg shadow-cyan-500/10"
        />
      </div>
    </form>
  );
};

export default DescriptionForm;
