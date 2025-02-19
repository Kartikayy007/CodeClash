'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LabelButton from '@/components/ui/LabelButton';
import BasicDetailsForm from '@/components/Contest/createContest/detailsForm/BasicDetailsForm';
import DescriptionForm from '@/components/Contest/createContest/detailsForm/DescriptionForm';
import Problems from '@/components/Contest/createContest/problems/problems';
import { ContestDetails, ContestSection } from '@/types/contest.types';
import { ArrowLeft } from 'lucide-react';
import { contestApi } from '@/features/contests/api/contestApi';
import { toast } from 'react-hot-toast';
import PreviewContest from '@/components/Contest/PreviewContest/PreviewContest';
import { initializeForm } from '@/features/contests/slices/createContestSlice';
import { useDispatch } from 'react-redux';

interface Problem {
  id?: string;
  name: string;
  title: string;
  maxScore: number;
  score: number;
  rating: number;
  description: string;
  inputFormat: string;
  constraints: string;
  outputFormat: string;
  testCases: Array<{
    input: string;
    output: string;
    sample: boolean;
    strength: number;
  }>;
}

type ActiveTab = 'details' | 'problems' | 'settings';

const Details = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<ActiveTab>('details');
  const [activeSection, setActiveSection] = useState<ContestSection>('basic');
  const [formData, setFormData] = useState<ContestDetails>({
    name: '',
    startTime: {
      date: '',
      time: ''
    },
    endTime: {
      date: '',
      time: ''
    },
    organizationName: '',
    description: '',
    rules: '',
    prizes: '',
    score: ''
  });

  const [problems, setProblems] = useState<Problem[]>([]);
  const [, setShowCreateProblem] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const dispatch = useDispatch();

  const [isDirty, setIsDirty] = useState(false);
  const [initialFormData, setInitialFormData] = useState<ContestDetails | null>(null);

  useEffect(() => {
    const fetchContestDetails = async () => {
      const contestId = searchParams?.get('contestId');
      if (!contestId) return;

      try {
        const response = await contestApi.getContestDetails(contestId);
        console.log('Response:', response);
        
        if (!response.contest) {
          throw new Error('No contest data received from API');
        }

        const contestData = response.contest;
        console.log('Contest Data:', contestData);

        const startTime = new Date(contestData.startTime);
        const endTime = new Date(contestData.endTime);

        if (!startTime.getTime() || !endTime.getTime()) {
          throw new Error('Invalid date format received');
        }

        const formattedData = {
          name: contestData.title || '',
          startTime: {
            date: startTime.toISOString().split('T')[0],
            time: startTime.toTimeString().slice(0, 5)
          },
          endTime: {
            date: endTime.toISOString().split('T')[0],
            time: endTime.toTimeString().slice(0, 5)
          },
          organizationName: contestData.organizationName || '',
          description: contestData.description || '',
          rules: contestData.rules || '',
          prizes: contestData.prizes || '',
          score: contestData.score || ''
        };

        setFormData(formattedData);
        setInitialFormData(formattedData); // Store initial state
        setIsDirty(false); // Reset dirty state

        // Set problems if they exist
        if (Array.isArray(contestData.questions)) {
          setProblems(contestData.questions.map((q: any) => ({
            id: q.id,
            name: q.title || '',
            title: q.title || '',
            maxScore: Number(q.score) || 0,
            score: Number(q.score) || 0,
            rating: Number(q.rating) || 0,
            description: q.description || '',
            inputFormat: q.inputFormat || '',
            constraints: q.constraints || '',
            outputFormat: q.outputFormat || '',
            testCases: Array.isArray(q.testCases) ? q.testCases.map((tc: any) => ({
              input: tc.input || '',
              output: tc.output || '',
              sample: !tc.isHidden,
              strength: 1
            })) : []
          })));
        }

        dispatch(initializeForm({
          name: contestData.title,
          description: contestData.description,
          startTime: {
            date: startTime.toISOString().split('T')[0],
            time: startTime.toTimeString().slice(0, 5)
          },
          endTime: {
            date: endTime.toISOString().split('T')[0],
            time: endTime.toTimeString().slice(0, 5)
          }
        }));

      } catch (error) {
        console.error('Error fetching contest details:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to fetch contest details');
      }
    };

    fetchContestDetails();
  }, [searchParams, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let newFormData: ContestDetails;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      newFormData = {
        ...formData,
        [parent]: {
          ...(formData[parent as keyof ContestDetails] as any),
          [child]: value
        }
      };
    } else {
      newFormData = {
        ...formData,
        [name]: value
      };
    }

    setFormData(newFormData);
    
    // Check if form is dirty by comparing with initial data
    if (initialFormData) {
      const isDifferent = JSON.stringify(newFormData) !== JSON.stringify(initialFormData);
      setIsDirty(isDifferent);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const contestId = searchParams?.get('contestId');
    if (!contestId || !isDirty) return;

    try {
      const response = await contestApi.updateContest(contestId, {
        title: formData.name,
        description: formData.description,
        startTime: `${formData.startTime.date} ${formData.startTime.time}:00`,
        endTime: `${formData.endTime.date} ${formData.endTime.time}:00`,
        rules: formData.rules,
        prizes: formData.prizes,
        score: formData.score,
        organizationName: formData.organizationName  
      });
      
      setInitialFormData(formData); // Update initial state
      setIsDirty(false); // Reset dirty state
      toast.success('Contest updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update contest');
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleAddProblem = () => {
  };

  const handleCreateProblem = () => {
    setShowCreateProblem(true);
  };

  const handleDeleteProblem = async (index: number) => {
    const problem = problems[index];
    const contestId = searchParams?.get('contestId');

    if (!contestId) {
      toast.error('Contest ID not found');
      return;
    }

    if (!problem.id) {
      setProblems(prev => prev.filter((_, i) => i !== index));
      return;
    }

    try {
      await contestApi.deleteQuestion({
        contestId,
        questionId: problem.id
      });

      setProblems(prev => prev.filter((_, i) => i !== index));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete problem');
    }
  };

  const handleSaveProblem = async (problemData: Problem) => {
    const contestId = searchParams?.get('contestId');
    if (!contestId) {
      toast.error('Contest ID not found');
      return;
    }
    console.log('Problem Data:', problemData);
    try {
      await contestApi.addQuestion({
        contestId,
        title: problemData.name,
        description: problemData.description,
        inputFormat: problemData.inputFormat,
        outputFormat: problemData.outputFormat,
        constraints: problemData.constraints,
        difficulty: problemData.rating < 1000 ? 'EASY' : 
        problemData.rating < 2000 ? 'MEDIUM' : 'HARD',
        rating: problemData.rating,
        score: problemData.maxScore,
        timeLimit: 1000,
        memoryLimit: 256,
        testCases: problemData.testCases.map(tc => ({
          input: tc.input,
          output: tc.output,
          isHidden: !tc.sample
        }))
      });

      setProblems(prev => [...prev, problemData]);
      toast.success('Problem added successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add problem');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="flex gap-8 ">
            <div className="w-56">
              <div className="space-y-4">
                <button 
                  onClick={() => setActiveSection('basic')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeSection === 'basic' 
                      ? 'bg-[#1A1D24] text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Basic Details
                </button>
                <button 
                  onClick={() => setActiveSection('description')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeSection === 'description' 
                      ? 'bg-[#1A1D24] text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Contest Description
                </button>
              </div>
            </div>

            <div className="flex-1">
              {activeSection === 'basic' ? (
                <>
                  <h2 className="text-white text-lg mb-6">Basic Details</h2>
                  <BasicDetailsForm formData={formData} onChange={handleInputChange} />
                </>
              ) : (
                <>
                  <h2 className="text-white text-lg mb-6">Contest Description</h2>
                  <DescriptionForm formData={formData} onChange={handleInputChange} />
                </>
              )}
            </div>
          </div>
        );
      case 'problems':
        return (
          <Problems 
            problems={problems}
            onAddProblem={handleAddProblem}
            onCreateProblem={handleCreateProblem}
            onDeleteProblem={handleDeleteProblem}
            onSaveProblem={handleSaveProblem}
          />
        );
      case 'settings':
        return <div>Settings Content</div>;
      default:
        return null;
    }
  };

  if (showPreview) {
    const contestId = searchParams?.get('contestId');
    if (!contestId) {
      toast.error('Contest ID not found');
      return null;
    }

    return (
      <div className="min-h-screen bg-[#10141D]">
        <div className="p-8">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={() => setShowPreview(false)}
                className="text-white hover:text-gray-300 flex items-center gap-2"
              >
                <ArrowLeft size={20} />
                Back to Edit
              </button>
            </div>
            <PreviewContest
              contest={{
                id: contestId,
                name: formData.name,
                startTime: `${formData.startTime.date} ${formData.startTime.time}`,
                endTime: `${formData.endTime.date} ${formData.endTime.time}`,
                organizationName: formData.organizationName,
                description: formData.description,
                rules: formData.rules,
                prizes: formData.prizes,
                score: formData.score,
                problems: problems.map(p => ({
                  ...p,
                  title: p.name,
                  maxScore: p.maxScore || 0,
                  score: p.score || 0,
                  rating: p.rating || 0
                }))
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => router.back()}
              className="text-white hover:text-gray-300 pb-2 flex items-center gap-2 "
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setActiveTab('details')}
              className={`pb-2 ${
                activeTab === 'details' 
                  ? 'text-[#C879EB] border-b-2 border-[#C879EB]' 
                  : 'text-white hover:text-gray-400 transition-all duration-200'
              }`}
            >
              Details
            </button>
            <button 
              onClick={() => setActiveTab('problems')}
              className={`pb-2 ${
                activeTab === 'problems' 
                  ? 'text-[#C879EB] border-b-2 border-[#C879EB]' 
                  : 'text-white hover:text-gray-400 transition-all duration-200'
              }`}
            >
              Problems
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`pb-2 ${
                activeTab === 'settings' 
                  ? 'text-[#C879EB] border-b-2 border-[#C879EB]' 
                  : 'text-white hover:text-gray-400 transition-all duration-200'
              }`}
            >
              Settings
            </button>
          </div>

          <div className="flex items-center justify-center gap-4">
            <LabelButton 
              variant="outlined"
              onClick={handlePreview}
            >
              Live Preview
            </LabelButton>
            <LabelButton 
              onClick={handleSubmit}
              disabled={!isDirty}
              className={!isDirty ? 'opacity-50 cursor-not-allowed' : ''}
            >
              Save Changes
            </LabelButton>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default Details;
