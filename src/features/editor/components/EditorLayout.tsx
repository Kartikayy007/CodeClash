import React, { useState } from 'react';
import { Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Problem } from '@/features/editor/api/problems';
import TopBar from './TopBar';
import Header from './Header';
import Question from './Question';
import Submissions from './Submissions';
import Editor from './Editor';
import TestCases from './TestCases';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setCurrentProblemIndex } from '@/features/battle/slices/battleSlice';

interface EditorLayoutProps {
  children?: React.ReactNode;
  questionData: Problem;
}

const EditorLayout = ({ questionData, children }: EditorLayoutProps) => {
  const dispatch = useDispatch();
  const { problems, currentProblemIndex } = useSelector((state: RootState) => state.battle);
  const [activeTab, setActiveTab] = useState<'description' | 'submissions'>('description');
  const [language, setLanguage] = useState('cpp');
  const [isDescriptionMaximized, setIsDescriptionMaximized] = useState(false);
  const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(false);
  const [isEditorMaximized, setIsEditorMaximized] = useState(false);
  const [isTestCaseCollapsed, setIsTestCaseCollapsed] = useState(false);

  const handleProblemChange = (index: number) => {
    dispatch(setCurrentProblemIndex(index));
  };

  const questionProps = {
    title: questionData.title,
    difficulty: questionData.difficulty,
    description: [questionData.description],
    constraints: [questionData.constraints],
    examples: questionData.testCases.filter(tc => !tc.isHidden).map((tc, idx) => ({
      id: idx + 1,
      input: tc.input,
      output: tc.output
    }))
  };

  return (
    <div className="min-h-screen bg-[#10141D] text-white">
      <Header />
      <div className="grid grid-cols-2 gap-4 px-8 py-4 h-[calc(100vh-180px)]">
        <TopBar 
          matchId={questionData.id} 
          input={questionData.testCases[0]?.input || ''} 
          onProblemChange={handleProblemChange}
        />
        <div className={`flex gap-4 mb-4 ${isDescriptionMaximized ? 'flex-col' : ''}`}>
          <div className={`bg-[#1A1D24] overflow-hidden rounded-lg flex flex-col transition-all duration-300 ease-in-out ${
            isDescriptionMaximized ? 'w-full' : 
            isDescriptionCollapsed ? 'w-12' : 
            isEditorMaximized ? 'hidden' : 'w-1/2'
          } h-screen `}>
            <div className="flex items-center justify-between p-4 sticky top-0 bg-[#1C202A] z-10">
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
              
              <div className={`flex gap-2 ml-auto ${isDescriptionCollapsed ? 'flex-col [&>button]:rotate-90' : ''}`}>
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
            
            <div className={`flex-1 overflow-y-scroll ${isDescriptionCollapsed ? 'hidden' : ''}`}>
              {activeTab === 'description' ? (
                <div className="h-full">
                  <Question problem={questionData} />
                </div>
              ) : (
                <div className="h-full overflow-y-auto">
                  <Submissions />
                </div>
              )}
            </div>
          </div>

          <div className={`flex flex-col gap-4 transition-all duration-300 ease-in-out ${
            isDescriptionMaximized ? 'hidden' : 
            isDescriptionCollapsed ? 'w-[calc(100%-56px)]' : 
            isEditorMaximized ? 'w-full' : 'w-1/2'
          } h-[calc(100vh-180px)]`}>
            {children || (
              <Editor 
                language={language as 'c' | 'cpp' | 'python' | 'java' | 'javascript'} 
                onLanguageChange={setLanguage}
                onMaximize={setIsEditorMaximized}
                className={isEditorMaximized ? 'h-[calc(100vh-180px)]' : 'h-12'}
              />
            )}
            {!isEditorMaximized && (
              <div className="h-full">
                <TestCases 
                  testCases={questionData.testCases.filter(tc => !tc.isHidden)}
                  isCollapsed={isTestCaseCollapsed}
                  onCollapse={setIsTestCaseCollapsed}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorLayout; 