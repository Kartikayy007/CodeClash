import React from 'react';
import { Maximize2, ChevronDown } from 'lucide-react';

interface EditorProps {
  language: string;
  onLanguageChange: (language: string) => void;
}

const Editor = ({ language, onLanguageChange }: EditorProps) => {
  return (
    <div className="bg-[#1A1D24] w-full h-full rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-2 border-b border-[#292C33]">
        <select 
          className="bg-[#292C33] text-white px-3 py-1 rounded outline-none"
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
          <button className="p-1 hover:bg-[#292C33] rounded">
            <Maximize2 size={18} />
          </button>
          <button className="p-1 hover:bg-[#292C33] rounded">
            <ChevronDown size={18} />
          </button>
        </div>
      </div>
      <div className="h-[calc(100%-50px)] bg-[#1E1B2E]">
        {/* Monaco Editor will go here */}
      </div>
    </div>
  );
};

export default Editor; 