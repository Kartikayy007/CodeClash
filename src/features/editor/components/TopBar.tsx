import React from 'react'
import LabelButton from '@/components/ui/LabelButton';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { runCode } from '@/features/editor/slices/editorSlice';
import { setCurrentProblemIndex } from '@/features/battle/slices/battleSlice';

interface TopBarProps {
  matchId: string;
  input: string;
  onProblemChange?: (index: number) => void;
}

const TopBar = ({ matchId, input, onProblemChange }: TopBarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { code, language, isRunning } = useSelector((state: RootState) => state.editor);
  const { problems, currentProblemIndex } = useSelector((state: RootState) => state.battle);

  const handleRunCode = () => {
    const currentProblem = problems[currentProblemIndex];
    const testCaseInput = currentProblem.testCases[0]?.input || '';
    
    dispatch(runCode({
      code,
      language,
      matchId,
      input: testCaseInput
    }));
  };

  const handleProblemClick = (index: number) => {
    if (onProblemChange) {
      onProblemChange(index);
    } else {
      dispatch(setCurrentProblemIndex(index));
    }
  };

  return (
    <div className="flex items-center justify-between rounded-lg px-8 py-3 bg-[#1A1D24]">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
        <div className="text-white text-base font-medium leading-normal">Player 1 (You)</div>
        <div className="flex gap-2">
          {problems.map((_, index) => (
            <button
              key={index}
              onClick={() => handleProblemClick(index)}
              className={`w-10 h-10 py-2 rounded-md border justify-center items-center inline-flex overflow-hidden
                ${currentProblemIndex === index 
                  ? 'border-blue-500 bg-blue-500/10 text-blue-500' 
                  : 'border-[#232323] text-gray-500 hover:border-gray-400 hover:text-gray-400'}`}
            >
              <p className="text-base font-medium font-['Quicksand'] leading-normal">
                {index + 1}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <LabelButton
          variant="outlined"
          customSize={{ width: '56px', height: '20px' }}
          className="text-sm whitespace-nowrap flex items-center gap-2"
          onClick={handleRunCode}
          disabled={isRunning}
        >
          <Image 
            src="/play.svg"
            alt="Run"
            width={20}
            height={20}
          />
          <span>{isRunning ? 'Running...' : 'Run'}</span>
        </LabelButton>
        <LabelButton
          variant="filled"
          customSize={{ width: '56px', height: '20px' }}
          className="text-sm whitespace-nowrap flex items-center gap-2"
        >
          <Image
            src="/telegram-alt.svg"
            alt="Submit"
            width={20}
            height={20}
          />
          <span>Submit</span>
        </LabelButton>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          {problems.map((_, index) => (
            <div
              key={index}
              className={`w-10 h-10 py-2 rounded-md border justify-center items-center inline-flex overflow-hidden
                ${currentProblemIndex === index 
                  ? 'border-blue-500 bg-blue-500/10 text-blue-500' 
                  : 'border-[#232323] text-gray-500'}`}
            >
              <p className="text-base font-medium font-['Quicksand'] leading-normal">
                {index + 1}
              </p>
            </div>
          ))}
        </div>
        <div className="text-white text-base font-medium font-['Quicksand'] leading-normal">Player 2</div>
        <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default TopBar;
