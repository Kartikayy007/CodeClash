'use client';

import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { Maximize2 } from 'lucide-react';
import { ChevronUp } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
}

const CodeEditor = ({ code, setCode, language }: CodeEditorProps) => {
  const getLanguageExtension = (lang: string) => {
    switch (lang) {
      case 'javascript':
        return javascript();
      case 'cpp':
        return cpp();
      case 'python':
        return python();
      case 'java':
        return java();
      default:
        return cpp();
    }
  };

  const defaultCode = {
    cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {     
    // Write your code here
    }
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

  return (
    <div className="h-[calc(100vh-30vh)] flex flex-col overflow-hidden rounded-lg bg-[#1C202A]">
      <div className="flex items-center justify-between p-2 bg-[#1A1D24]">
        <select
          className="bg-[#292C33] text-white px-3 py-1 rounded-lg outline-none"
          value={language}
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
          >
            <Maximize2 size={18} />
          </button>
          <button
            className="p-1 hover:bg-[#292C33] rounded transform transition-transform duration-200 hover:scale-110"
          >
            <ChevronUp size={18} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <CodeMirror
          value={code || defaultCode[language as keyof typeof defaultCode]}
          height="calc(100vh - 30vh)" 
          width="100%"
          theme="dark"
          style={{ flex: 1 }}
          onChange={setCode}
          extensions={[getLanguageExtension(language)]}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            history: true,
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
            lintKeymap: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor; 