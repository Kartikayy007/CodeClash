'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import Topbar from './Topbar';
import CodeEditor from './CodeEditor';
import Question from './Question';
import Submissions from './Submissions';
import TestCases from './TestCases';

interface ContestEditorProps {
  problemId: string;
}

const ContestEditor = ({ problemId }: ContestEditorProps) => {
  const [activeTab, setActiveTab] = useState<'description' | 'submissions'>('description');
  const [code, setCode] = useState('');
  const [language, ] = useState('cpp');
  const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(false);
  const [isDescriptionMaximized, setIsDescriptionMaximized] = useState(false);

  const handleRun = async () => {
    // Implement run logic
    console.log('Running code:', code);
  };

  const handleSubmit = async () => {
    // Implement submit logic
    console.log('Submitting code:', code);
  };

  return (
    <div className="flex min-h-screen p-4 gap-4 flex-col lg:flex-row">
      <div className={`overflow-scroll rounded-lg flex flex-col ${
        isDescriptionMaximized ? 'w-full' :
        isDescriptionCollapsed ? 'w-12' :
        'lg:w-[50%] w-full'
      }`}>
        <div className="mb-4">
          <Topbar
            onRun={handleRun}
            onSubmit={handleSubmit}
        />
        </div>
        <div className="flex items-center justify-between p-4 sticky top-0 bg-[#1C202A] rounded-t-lg z-10">
          <div className={`flex gap-4 ${isDescriptionCollapsed ? 'hidden' : ''}`}>
            <button
              className={`${activeTab === 'description' ? 'text-white bg-white/10 rounded-md px-2 py-1' : 'text-gray-500'} hover:text-gray-300 font-bold text-lg`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`${activeTab === 'submissions' ? 'text-white bg-white/10 rounded-md px-2 py-1' : 'text-gray-500'} hover:text-gray-300 font-bold text-lg`}
              onClick={() => setActiveTab('submissions')}
            >
              Submissions
            </button>
          </div>

          <div className={`flex gap-2 ${isDescriptionCollapsed ? 'flex-col [&>button]:rotate-90' : ''}`}>
            <button
              className="p-1 hover:bg-[#292C33] rounded"
              onClick={() => setIsDescriptionMaximized(!isDescriptionMaximized)}
            >
              {isDescriptionCollapsed ? null : isDescriptionMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button
              className="p-1 hover:bg-[#292C33] rounded"
              onClick={() => setIsDescriptionCollapsed(!isDescriptionCollapsed)}
            >
              {isDescriptionMaximized ? null : isDescriptionCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
        </div>

        <div className={`overflow-y-auto flex-1 bg-[#1C202A] ${isDescriptionCollapsed ? 'hidden' : ''}`}>
          {activeTab === 'description' ? (
            <Question problemId={problemId} />
          ) : (
            <Submissions problemId={problemId} />
          )}
        </div>
      </div>

      <div className={`flex flex-col ${
        isDescriptionMaximized ? 'hidden' :
        isDescriptionCollapsed ? 'lg:w-[calc(100%-3rem)] w-full' :
        'lg:w-[50%] w-full'
      }`}>
        <div className="flex flex-col h-full gap-4">
          <div>
            <CodeEditor 
              code={code}
              setCode={setCode}
              language={language}
            />
          </div>
          <div className="h-full">
            <TestCases />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestEditor; 