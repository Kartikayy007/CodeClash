'use client';

import React from 'react';
import { Play, Send, ChevronLeft, ChevronRight, Grid } from 'lucide-react';
import LabelButton from '@/components/ui/LabelButton';

interface TopbarProps {
  onRun: () => void;
  onSubmit: () => void;
}

const Topbar = ({
  onRun,
  onSubmit
}: TopbarProps) => {
  return (
    <div className="h-16 bg-[#1C202A] rounded-lg flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <button className="p-2 text-[#999] hover:bg-[#292C33] hover:text-[#fff] rounded-lg">
          <Grid size={20} />
        </button>
        <div className="flex items-center gap-2">
          <button className="p-1 text-[#999] hover:bg-[#292C33] hover:text-[#fff] rounded-lg">
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-2">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                className={`w-8 h-8 p-5 rounded flex items-center justify-center border border-[#999] text-[#999] ${
                  num === 1 ? 'bg-[#292C33]' : 'hover:bg-[#292C33]'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <button className="p-1 text-[#999] hover:bg-[#292C33] hover:text-[#fff] rounded-lg">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">

        <div className="flex gap-3">
          <LabelButton
            onClick={onRun}
            variant="outlined"
            className="flex items-center gap-2 py-2"
          >
            <Play size={16} />
            Run
          </LabelButton>
          <LabelButton
            onClick={onSubmit}
            variant="filled"
            className="flex items-center gap-2 px-1 py-2"
          >
            <Send size={16} />
            Submit
          </LabelButton>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
