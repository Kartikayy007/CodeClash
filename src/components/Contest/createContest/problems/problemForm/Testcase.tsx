import React from "react";
import { Trash } from "lucide-react";

interface TestCase {
  input: string;
  output: string;
  sample: boolean;
  strength: number;
}

interface TestCasesFormProps {
  testCases: TestCase[];
  onChange: (
    index: number,
    field: keyof TestCase,
    value: string | boolean | number,
  ) => void;
  onDelete: (index: number) => void;
  errors: { [key: string]: boolean };
}

const TestCasesForm: React.FC<TestCasesFormProps> = ({
  testCases,
  onChange,
  onDelete,
  errors,
}) => {
  React.useEffect(() => {
    if (testCases.length === 0) {
      for (let i = 0; i < 2; i++) {
        const newTestCase: TestCase = {
          input: "",
          output: "",
          sample: true,
          strength: 10,
        };
        onChange(i, "input", newTestCase.input);
        onChange(i, "output", newTestCase.output);
        onChange(i, "sample", newTestCase.sample);
        onChange(i, "strength", newTestCase.strength);
      }
    }
  }, [onChange, testCases.length]);

  const handleAddTestCase = (e: React.MouseEvent) => {
    e.preventDefault();
    const newIndex = testCases.length;
    onChange(newIndex, "input", "");
  };

  const handleDeleteTestCase = (index: number) => {
    if (testCases.length <= 2) {
      return;
    }
    onDelete(index);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-[#1a1d26] to-[#1e222c] rounded-xl overflow-hidden border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
        <div className="grid grid-cols-6 p-4 text-white border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
          <div className="text-center font-semibold">S.No</div>
          <div className="text-center font-semibold">Input</div>
          <div className="text-center font-semibold">Output</div>
          <div className="text-center font-semibold">Sample</div>
          <div className="text-center font-semibold">Strength</div>
          <div className="text-center font-semibold">Action</div>
        </div>

        <div className="divide-y divide-cyan-500/20">
          {testCases.map((testCase, index) => (
            <div key={index} className="grid grid-cols-6 p-4 items-center hover:bg-gradient-to-r hover:from-cyan-500/5 hover:to-blue-500/5 transition-all duration-200">
              <div className="text-center text-cyan-400 font-medium">{index + 1}</div>
              <div className="px-2">
                <input
                  type="text"
                  value={testCase.input}
                  onChange={(e) => onChange(index, "input", e.target.value)}
                  data-error={errors[`testCase${index}`] || undefined}
                  className={`w-full bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border rounded-lg px-2 py-1 text-white shadow-lg shadow-cyan-500/10
                    ${errors[`testCase${index}`] && !testCase.input ? "border-red-500 error-outline" : "border-cyan-500/20"}
                    focus:outline-none focus:border-cyan-500/40 transition-all duration-200`}
                />
                {errors[`testCase${index}`] && !testCase.input && (
                  <p className="text-red-500 text-xs mt-1">Input is required</p>
                )}
              </div>
              <div className="px-2">
                <input
                  type="text"
                  value={testCase.output}
                  onChange={(e) => onChange(index, "output", e.target.value)}
                  data-error={errors[`testCase${index}`] || undefined}
                  className={`w-full bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border rounded-lg px-2 py-1 text-white shadow-lg shadow-cyan-500/10
                    ${errors[`testCase${index}`] && !testCase.output ? "border-red-500 error-outline" : "border-cyan-500/20"}
                    focus:outline-none focus:border-cyan-500/40 transition-all duration-200`}
                />
                {errors[`testCase${index}`] && !testCase.output && (
                  <p className="text-red-500 text-xs mt-1">
                    Output is required
                  </p>
                )}
              </div>
              <div className="text-center">
                <input
                  type="checkbox"
                  checked={testCase.sample}
                  onChange={(e) => onChange(index, "sample", e.target.checked)}
                  className="form-checkbox w-4 h-4 text-cyan-500 bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border-cyan-500/20 rounded focus:ring-cyan-500/40 focus:ring-offset-0"
                />
              </div>
              <div className="px-2">
                <input
                  type="number"
                  value={testCase.strength}
                  onChange={(e) =>
                    onChange(index, "strength", parseInt(e.target.value))
                  }
                  className="w-full bg-gradient-to-br from-[#1a1d26] to-[#1e222c] border border-cyan-500/20 rounded-lg px-2 py-1 text-white shadow-lg shadow-cyan-500/10 focus:outline-none focus:border-cyan-500/40 transition-all duration-200"
                />
              </div>
              <div className="text-center">
                <button
                  onClick={() => handleDeleteTestCase(index)}
                  className={`p-1 rounded transition-all duration-200 ${testCases.length <= 2 ? "text-gray-500 cursor-not-allowed hover:bg-transparent" : "text-red-400 hover:bg-red-500/20"}`}
                  disabled={testCases.length <= 2}
                  title={
                    testCases.length <= 2
                      ? "Cannot delete when only 2 test cases remain"
                      : "Delete test case"
                  }
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleAddTestCase}
        className="px-4 py-2 text-cyan-400 hover:text-white transition-colors duration-200 font-medium"
      >
        + Add TestCase
      </button>

      {errors.testCases && testCases.length < 2 && (
        <p className="text-red-500 text-sm">
          At least two test cases are required
        </p>
      )}
    </div>
  );
};

export default TestCasesForm;
