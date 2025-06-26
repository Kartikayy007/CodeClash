import React from "react";

interface ProblemDetailsFormData {
  name: string;
  rating: string;
  maxScore: string;
  description: string;
  inputFormat: string;
  constraints: string;
  outputFormat: string;
}

interface ProblemDetailsFormProps {
  formData: ProblemDetailsFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  errors: { [key: string]: boolean };
}

const ProblemDetailsForm: React.FC<ProblemDetailsFormProps> = ({
  formData,
  onChange,
  errors,
}) => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <label className="block text-[#D1D1D1] text-[14px] mb-2 font-medium">
          Problem Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onChange}
          data-error={errors.name || undefined}
          className={`w-full h-[45px] px-4 py-2 rounded-lg bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border shadow-lg shadow-cyan-500/10
            ${errors.name ? "border-red-500 error-outline" : "border-cyan-500/20"}
            focus:outline-none focus:border-cyan-500/40 transition-all duration-200 text-sm text-white`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">Problem name is required</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-[#D1D1D1] text-[14px] mb-2 font-medium">
            Rating
          </label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={onChange}
            data-error={errors.rating || undefined}
            className={`w-full h-[45px] px-4 py-2 rounded-lg bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border shadow-lg shadow-cyan-500/10
              ${errors.rating ? "border-red-500 error-outline" : "border-cyan-500/20"}
              focus:outline-none focus:border-cyan-500/40 transition-all duration-200 text-sm text-white`}
          />
          {errors.rating && (
            <p className="text-red-500 text-sm mt-1">Rating is required</p>
          )}
        </div>
        <div>
          <label className="block text-[#D1D1D1] text-[14px] mb-2 font-medium">
            Max Score
          </label>
          <input
            type="number"
            name="maxScore"
            value={formData.maxScore}
            onChange={onChange}
            data-error={errors.maxScore || undefined}
            className={`w-full h-[45px] px-4 py-2 rounded-lg bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border shadow-lg shadow-cyan-500/10
              ${errors.maxScore ? "border-red-500 error-outline" : "border-cyan-500/20"}
              focus:outline-none focus:border-cyan-500/40 transition-all duration-200 text-sm text-white`}
          />
          {errors.maxScore && (
            <p className="text-red-500 text-sm mt-1">Max score is required</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-[#D1D1D1] text-[14px] mb-2 font-medium">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          data-error={errors.description || undefined}
          rows={6}
          className={`w-full px-4 py-2 rounded-lg bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border shadow-lg shadow-cyan-500/10
            ${errors.description ? "border-red-500 error-outline" : "border-cyan-500/20"}
            focus:outline-none focus:border-cyan-500/40 transition-all duration-200 text-sm text-white`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">Description is required</p>
        )}
      </div>

      <div>
        <label className="block text-[#D1D1D1] text-[14px] mb-2 font-medium">
          Input Format
        </label>
        <textarea
          name="inputFormat"
          value={formData.inputFormat}
          onChange={onChange}
          data-error={errors.inputFormat || undefined}
          rows={4}
          className={`w-full px-4 py-2 rounded-lg bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border shadow-lg shadow-cyan-500/10
            ${errors.inputFormat ? "border-red-500 error-outline" : "border-cyan-500/20"}
            focus:outline-none focus:border-cyan-500/40 transition-all duration-200 text-sm text-white`}
        />
        {errors.inputFormat && (
          <p className="text-red-500 text-sm mt-1">Input format is required</p>
        )}
      </div>

      <div>
        <label className="block text-[#D1D1D1] text-[14px] mb-2 font-medium">
          Constraints
        </label>
        <textarea
          name="constraints"
          value={formData.constraints}
          onChange={onChange}
          data-error={errors.constraints || undefined}
          rows={4}
          className={`w-full px-4 py-2 rounded-lg bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border shadow-lg shadow-cyan-500/10
            ${errors.constraints ? "border-red-500 error-outline" : "border-cyan-500/20"}
            focus:outline-none focus:border-cyan-500/40 transition-all duration-200 text-sm text-white`}
        />
        {errors.constraints && (
          <p className="text-red-500 text-sm mt-1">Constraints are required</p>
        )}
      </div>

      <div>
        <label className="block text-[#D1D1D1] text-[14px] mb-2 font-medium">
          Output Format
        </label>
        <textarea
          name="outputFormat"
          value={formData.outputFormat}
          onChange={onChange}
          data-error={errors.outputFormat || undefined}
          rows={4}
          className={`w-full px-4 py-2 rounded-lg bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border shadow-lg shadow-cyan-500/10
            ${errors.outputFormat ? "border-red-500 error-outline" : "border-cyan-500/20"}
            focus:outline-none focus:border-cyan-500/40 transition-all duration-200 text-sm text-white`}
        />
        {errors.outputFormat && (
          <p className="text-red-500 text-sm mt-1">Output format is required</p>
        )}
      </div>
    </div>
  );
};

export default ProblemDetailsForm;
