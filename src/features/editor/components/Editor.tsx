import React, { useState } from 'react';
import { Maximize2, Minimize2, ChevronDown, ChevronUp } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { EditorView } from '@codemirror/view';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { setCode, setLanguage } from '../slices/editorSlice';

interface EditorProps {
  language: 'c' | 'cpp' | 'python' | 'java' | 'javascript';
  onLanguageChange: (language: string) => void;
  onMaximize: (isMaximized: boolean) => void;
  className?: string;
}

const CodeEditor = ({ 
  language, 
  onLanguageChange, 
  onMaximize, 
  className = '',
}: EditorProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { code } = useSelector((state: RootState) => state.editor);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const handleMaximize = () => {
    const newMaximizedState = !isMaximized;
    setIsMaximized(newMaximizedState);
    onMaximize(newMaximizedState);
  };

  const handleCodeChange = (value: string) => {
    dispatch(setCode(value));
  };

  const handleLanguageChange = (value: string) => {
    dispatch(setLanguage(value));
    onLanguageChange(value);
  };

  const defaultCode = {
    cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {     
    // Write your code here
    return 0;
}`,
    python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Write your code here
        pass`,
    java: `

    `,
    javascript: `// Write your code here
    `,
    c: `
      #include <stdio.h>
      int main() {
        // Write your code here
      }
    `
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
    <div className={`bg-[#1A1D24] w-full rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-[#1A1D24] ">
        <select 
          className="bg-[#292C33] text-white px-3 py-1 rounded-lg outline-none"
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
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
        isCollapsed ? 'hidden' : 'h-full'
      } bg-[#1E1B2E] flex flex-col`}>
        <CodeMirror
          value={code || defaultCode[language]}
          height="calc(100vh - 50vh)" 
          width="100%"
          theme="dark"
          style={{ flex: 1 }}
          className="h-full"
          onChange={handleCodeChange}
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