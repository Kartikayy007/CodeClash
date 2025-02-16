'use client';

import React, { useState, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import LabelButton from '@/components/ui/LabelButton';
import ProblemDetailsForm from './problemForm/problemDetails';
import TestCasesForm from './problemForm/Testcase';
import { Problem, ProblemFormData } from '@/types/problem.types';

type ProblemSection = 'details' | 'testcases';

interface CreateProblemProps {
  onBack: () => void;
  onSave: (data: Problem) => void;
}

const CreateProblem: React.FC<CreateProblemProps> = ({ onBack, onSave }) => {
  const [activeSection, setActiveSection] = useState<ProblemSection>('details');
  const [formData, setFormData] = useState<ProblemFormData>({
    name: '',
    rating: '',
    maxScore: '',
    description: '',
    inputFormat: '',
    constraints: '',
    outputFormat: '',
    testCases: [
      {
        input: '',
        output: '',
        sample: true,
        strength: 10
      },
      {
        input: '',
        output: '',
        sample: true,
        strength: 10
      }
    ]
  });
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const formRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: boolean } = {};
    let isValid = true;
    let hasDetailsErrors = false;
    let hasTestCaseErrors = false;

    if (!formData.name.trim()) {
      newErrors.name = true;
      isValid = false;
      hasDetailsErrors = true;
    }
    if (!formData.rating.trim()) {
      newErrors.rating = true;
      isValid = false;
      hasDetailsErrors = true;
    }
    if (!formData.maxScore.trim()) {
      newErrors.maxScore = true;
      isValid = false;
      hasDetailsErrors = true;
    }
    if (!formData.description.trim()) {
      newErrors.description = true;
      isValid = false;
      hasDetailsErrors = true;
    }
    if (!formData.inputFormat.trim()) {
      newErrors.inputFormat = true;
      isValid = false;
      hasDetailsErrors = true;
    }
    if (!formData.constraints.trim()) {
      newErrors.constraints = true;
      isValid = false;
      hasDetailsErrors = true;
    }
    if (!formData.outputFormat.trim()) {
      newErrors.outputFormat = true;
      isValid = false;
      hasDetailsErrors = true;
    }

    // Validate test cases
    if (formData.testCases.length === 0) {
      newErrors.testCases = true;
      isValid = false;
      hasTestCaseErrors = true;
    } else {
      formData.testCases.forEach((tc, index) => {
        if (!tc.input.trim() || !tc.output.trim()) {
          newErrors[`testCase${index}`] = true;
          isValid = false;
          hasTestCaseErrors = true;
        }
      });
    }

    setErrors(newErrors);
    if (!isValid) {
      const formElement = formRef.current;
      if (formElement) {
        formElement.classList.add('shake-animation');
        setTimeout(() => {
          formElement.classList.remove('shake-animation');
        }, 500);

        // Switch to the section with errors
        if (hasDetailsErrors && activeSection !== 'details') {
          setActiveSection('details');
        } else if (hasTestCaseErrors && activeSection !== 'testcases') {
          setActiveSection('testcases');
        }

        // Focus the first error field
        const firstErrorField = formElement.querySelector('[data-error="true"]') as HTMLElement;
        if (firstErrorField) {
          firstErrorField.focus();
        }
      }
    }
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Convert form data to Problem type
      const problemData: Problem = {
        name: formData.name,
        maxScore: parseInt(formData.maxScore),
        rating: parseInt(formData.rating),
        description: formData.description,
        inputFormat: formData.inputFormat,
        constraints: formData.constraints,
        outputFormat: formData.outputFormat,
        testCases: formData.testCases.map(tc => ({
          input: tc.input,
          output: tc.output,
          sample: tc.sample,
          strength: tc.strength
        }))
      };
      onSave(problemData);
    }
  };

  const handleTestCaseChange = (index: number, field: keyof typeof formData.testCases[0], value: string | boolean | number) => {
    setFormData(prev => {
      // If the index is equal to the length, we're adding a new test case
      if (index === prev.testCases.length) {
        return {
          ...prev,
          testCases: [
            ...prev.testCases,
            {
              input: '',
              output: '',
              sample: true,
              strength: 10,
              [field]: value
            }
          ]
        };
      }
      // Otherwise, we're updating an existing test case
      return {
        ...prev,
        testCases: prev.testCases.map((tc, i) =>
          i === index ? { ...tc, [field]: value } : tc
        )
      };
    });
    // Clear error for this test case when user makes changes
    if (errors[`testCase${index}`]) {
      setErrors(prev => ({ ...prev, [`testCase${index}`]: false }));
    }
  };

  const handleDeleteTestCase = (index: number) => {
    setFormData(prev => ({
      ...prev,
      testCases: prev.testCases.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-[#10141D] text-white">
      <style jsx global>{`
        .shake-animation {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
        }

        @keyframes shake {
          10%, 90% {
            transform: translate3d(-1px, 0, 0);
          }
          
          20%, 80% {
            transform: translate3d(2px, 0, 0);
          }

          30%, 50%, 70% {
            transform: translate3d(-4px, 0, 0);
          }

          40%, 60% {
            transform: translate3d(4px, 0, 0);
          }
        }

        .error-outline {
          border-color: #EF4444 !important;
          animation: errorShake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>

      <div className="flex flex-col h-full" ref={formRef}>
        <div className="flex flex-1">
          <div className="w-56">
            <div className="space-y-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-white hover:text-gray-300"
              >
                <ArrowLeft size={20} />
                <span>Back</span>
              </button>
              <button
                onClick={() => setActiveSection('details')}
                className={`w-full text-left px-4 py-2 rounded-lg ${activeSection === 'details'
                  ? 'bg-[#1A1D24] text-white'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                Basic Details
              </button>
              <button
                onClick={() => setActiveSection('testcases')}
                className={`w-full text-left px-4 py-2 rounded-lg ${activeSection === 'testcases'
                  ? 'bg-[#1A1D24] text-white'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                Test Cases
              </button>
              <div className="mt-8">
                <LabelButton onClick={handleSubmit} className="w-full">
                  Save Problem
                </LabelButton>
              </div>
            </div>
          </div>

          <div className="flex-1 ml-8">
            {activeSection === 'details' ? (
              <ProblemDetailsForm 
                formData={formData} 
                onChange={handleInputChange}
                errors={errors}
              />
            ) : (
              <TestCasesForm
                testCases={formData.testCases}
                onChange={handleTestCaseChange}
                onDelete={handleDeleteTestCase}
                errors={errors}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProblem;
