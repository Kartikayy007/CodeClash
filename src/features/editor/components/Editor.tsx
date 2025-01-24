import React, { useState } from 'react';
import { Maximize2, Minimize2, ChevronDown, ChevronUp } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { EditorView } from '@codemirror/view';

interface EditorProps {
  language: 'c' | 'cpp' | 'python' | 'java' | 'javascript';
  onLanguageChange: (language: string) => void;
  onMaximize: (isMaximized: boolean) => void;
  className?: string;
}

const CodeEditor = ({ language, onLanguageChange, onMaximize, className = '' }: EditorProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const handleMaximize = () => {
    const newMaximizedState = !isMaximized;
    setIsMaximized(newMaximizedState);
    onMaximize(newMaximizedState);
  };

  const defaultCode = {
    cpp: `#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n    }\n};`,
    python: `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Write your code here\n        pass`,
    java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n    }\n}`,
    javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    // Write your code here\n};`,
    c: `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your code here\n}`
  };

  const getLanguageExtension = (lang: string) => {
    switch (lang) {
      case 'cpp':
      case 'c':
        return cpp();
      case 'javascript':
        return javascript();
      case 'python':
        return python();
      case 'java':
        return java();
      default:
        return cpp();
    }
  };

  return (
    <div className={`bg-[#1A1D24] w-full rounded-lg overflow-hidden transform transition-all duration-300 ease-in-out ${
      isCollapsed ? 'h-[50px]' : 'h-full'
    } ${className}`}>
      <div className="flex items-center justify-between p-2 border-b border-[#292C33] bg-[#1A1D24] z-10">
        <select 
          className="bg-[#292C33] text-white px-3 py-1 rounded-lg outline-none"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
        >
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="javascript">JavaScript</option>
        </select>
        <div className="flex gap-2">
          <button 
            className="p-1 hover:bg-[#292C33] rounded transform transition-transform duration-200 hover:scale-110"
            onClick={handleMaximize}
          >
            {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <button 
            className="p-1 hover:bg-[#292C33] rounded transform transition-transform duration-200 hover:scale-110"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>
      <div className={`transform transition-all duration-300 ease-in-out origin-top ${
        isCollapsed ? 'hidden' : 'h-[calc(100%-34px)]'
      } bg-[#1E1B2E] flex flex-col`}>
        <CodeMirror
          value={defaultCode[language]}
          height="calc(100vh - 400px)" 
          width="100%"
          theme="dark"
          style={{ flex: 1 }}
          className="h-full"
          extensions={[
            getLanguageExtension(language),
            EditorView.lineWrapping
          ]}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            foldGutter: true,
            drawSelection: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            syntaxHighlighting: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            defaultKeymap: true,
            searchKeymap: true,
            historyKeymap: true,
            foldKeymap: true,
            completionKeymap: true,
            lintKeymap: true
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;