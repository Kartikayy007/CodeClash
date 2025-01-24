import React, { useState } from 'react';
import { Maximize2, ChevronLeft } from 'lucide-react';
import TopBar from './TopBar';
import Header from './Header';
import Question from './Question';
import Submissions from './Submissions';
import Editor from './Editor';
import TestCases from './TestCases';

interface EditorLayoutProps {
  children?: React.ReactNode;
  questionData: {
    title: string;
    difficulty: string;
    description: string[];
    constraints: string[];
    examples: {
      id: number;
      input: string;
      output: string;
      explanation?: string;
    }[];
  };
}

const EditorLayout = ({ children, questionData }: EditorLayoutProps) => {
  const [activeTab, setActiveTab] = useState<'description' | 'submissions'>('description');
  const [language, setLanguage] = useState('cpp');

  return (
    <div className="min-h-screen bg-[#10141D] text-white">
      <Header />
      <div className="grid grid-cols-2 gap-4 px-8 py-4 h-[calc(100vh-130px)]">
        <TopBar />
        <div className="flex gap-4 mb-4">
          <div className="bg-[#1A1D24] w-1/2 h-screen rounded-lg flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[#292C33] sticky top-0 bg-[#1A1D24] z-10">
              <div className="flex gap-4">
                <button 
                  className={`${activeTab === 'description' ? 'text-white' : 'text-gray-500'} hover:text-gray-300`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button 
                  className={`${activeTab === 'submissions' ? 'text-white' : 'text-gray-500'} hover:text-gray-300`}
                  onClick={() => setActiveTab('submissions')}
                >
                  Submissions
                </button>
              </div>
              
              <div className="flex gap-2">
                <button className="p-1 hover:bg-[#292C33] rounded">
                  <Maximize2 size={18} />
                </button>
                <button className="p-1 hover:bg-[#292C33] rounded">
                  <ChevronLeft size={18} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'description' ? (
                <Question 
                  title={questionData.title}
                  difficulty={questionData.difficulty}
                  description={questionData.description}
                  constraints={questionData.constraints}
                  examples={questionData.examples}
                />
              ) : (
                <Submissions />
              )}
            </div>
          </div>

          <div className="flex flex-col w-1/2 gap-4">
            <Editor language={language} onLanguageChange={setLanguage} />
            <TestCases />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorLayout; 