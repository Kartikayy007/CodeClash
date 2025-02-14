import React from 'react';

interface TestCase {
  input: string;
  output: string;
  sample: boolean;
  strength: number;
}

interface TestCasesFormProps {
  testCases: TestCase[];
  onChange: (index: number, field: keyof TestCase, value: string | boolean | number) => void;
  errors: { [key: string]: boolean };
}

const TestCasesForm: React.FC<TestCasesFormProps> = ({ testCases, onChange, errors }) => {
  const handleAddTestCase = () => {
    onChange(testCases.length, 'input', '');
    onChange(testCases.length, 'output', '');
    onChange(testCases.length, 'sample', true);
    onChange(testCases.length, 'strength', 10);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#1A1D24] rounded-lg overflow-hidden">
        <div className="grid grid-cols-5 p-4 text-white border-b border-gray-700">
          <div className="text-center">S.No</div>
          <div className="text-center">Input</div>
          <div className="text-center">Output</div>
          <div className="text-center">Sample</div>
          <div className="text-center">Strength</div>
        </div>

        <div className="divide-y divide-gray-700">
          {testCases.map((testCase, index) => (
            <div key={index} className="grid grid-cols-5 p-4 items-center">
              <div className="text-center">{index + 1}</div>
              <div className="px-2">
                <input
                  type="text"
                  value={testCase.input}
                  onChange={(e) => onChange(index, 'input', e.target.value)}
                  data-error={errors[`testCase${index}`] || undefined}
                  className={`w-full bg-transparent border rounded px-2 py-1
                    ${errors[`testCase${index}`] && !testCase.input ? 'border-red-500 error-outline' : 'border-gray-700'}`}
                />
                {errors[`testCase${index}`] && !testCase.input && (
                  <p className="text-red-500 text-xs mt-1">Input is required</p>
                )}
              </div>
              <div className="px-2">
                <input
                  type="text"
                  value={testCase.output}
                  onChange={(e) => onChange(index, 'output', e.target.value)}
                  data-error={errors[`testCase${index}`] || undefined}
                  className={`w-full bg-transparent border rounded px-2 py-1
                    ${errors[`testCase${index}`] && !testCase.output ? 'border-red-500 error-outline' : 'border-gray-700'}`}
                />
                {errors[`testCase${index}`] && !testCase.output && (
                  <p className="text-red-500 text-xs mt-1">Output is required</p>
                )}
              </div>
              <div className="text-center">
                <input
                  type="checkbox"
                  checked={testCase.sample}
                  onChange={(e) => onChange(index, 'sample', e.target.checked)}
                  className="form-checkbox"
                />
              </div>
              <div className="px-2">
                <input
                  type="number"
                  value={testCase.strength}
                  onChange={(e) => onChange(index, 'strength', parseInt(e.target.value))}
                  className="w-full bg-transparent border border-gray-700 rounded px-2 py-1"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={handleAddTestCase}
        className="px-4 py-2 text-[#C879EB] hover:text-white transition-colors"
      >
        + Add TestCase
      </button>

      {errors.testCases && testCases.length === 0 && (
        <p className="text-red-500 text-sm">At least one test case is required</p>
      )}
    </div>
  );
};

export default TestCasesForm; 