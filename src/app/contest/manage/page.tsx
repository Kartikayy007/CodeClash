'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LabelButton from '@/components/ui/LabelButton';
import BasicDetailsForm from '@/components/Contest/createContest/detailsForm/BasicDetailsForm';
import DescriptionForm from '@/components/Contest/createContest/detailsForm/DescriptionForm';
import Problems from '@/components/Contest/createContest/problems/problems';
import { ContestDetails, ContestSection } from '@/types/contest.types';
import { ArrowLeft } from 'lucide-react';

interface Problem {
  name: string;
  maxScore: number;
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

type ActiveTab = 'Contest' | 'Questions';
const Details = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<ActiveTab>('Contest');
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

  // Mock problems data
  const [problems, setProblems] = useState<Problem[]>([]);
  const [showCreateProblem, setShowCreateProblem] = useState(false);

  useEffect(() => {
    if (!searchParams) return;
    
    // Get contest data from URL parameters
    const name = searchParams.get('name') || '';
    const startDate = searchParams.get('startDate') || '';
    const startTime = searchParams.get('startTime') || '';
    const endDate = searchParams.get('endDate') || '';
    const endTime = searchParams.get('endTime') || '';

    setFormData(prev => ({
      ...prev,
      name,
      startTime: {
        date: startDate,
        time: startTime
      },
      endTime: {
        date: endDate,
        time: endTime
      }
    }));
  }, [searchParams]);

  useEffect(() => {
    // Set initial form data
    setFormData({
      name: '',
      startTime: { date: '', time: '' },
      endTime: { date: '', time: '' },
      organizationName: '',
      description: '',
      rules: '',
      prizes: '',
      score: ''
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => {
        const parentObj = prev[parent as keyof ContestDetails];
        if (typeof parentObj === 'object' && parentObj !== null) {
          return {
            ...prev,
            [parent]: {
              ...parentObj,
              [child]: value
            }
          };
        }
        return prev;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contest details:', formData);
    // Handle form submission
  };

  const handlePreview = () => {
    // Handle preview logic
  };

  const handleAddProblem = () => {
    // Handle adding problem from library
  };

  const handleCreateProblem = () => {
    setShowCreateProblem(true);
  };

  const handleDeleteProblem = (index: number) => {
    setProblems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveProblem = (problemData: Problem) => {
    setProblems(prev => [...prev, problemData]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Contest':
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
                  Description
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
                  <h2 className="text-white text-lg mb-6">Description</h2>
                  <DescriptionForm formData={formData} onChange={handleInputChange} />
                </>
              )}
            </div>
          </div>
        );
      case 'Questions':
        return (
          <div>
            <h1 className='text-2xl font-bold text-white' >Questions</h1>
          </div>
        );
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => router.back()}
              className="text-white hover:text-gray-300 pb-2 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {formData.name}
            </button>
            <button 
              onClick={() => setActiveTab('details')}
              className={`pb-2 ${
                activeTab === 'details' 
                  ? 'text-[#C879EB] border-b-2 border-[#C879EB]' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Details
            </button>
            <button 
              onClick={() => setActiveTab('problems')}
              className={`pb-2 ${
                activeTab === 'problems' 
                  ? 'text-[#C879EB] border-b-2 border-[#C879EB]' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Problems
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`pb-2 ${
                activeTab === 'settings' 
                  ? 'text-[#C879EB] border-b-2 border-[#C879EB]' 
                  : 'text-gray-400 hover:text-white'
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
            <LabelButton onClick={handleSubmit}>
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
