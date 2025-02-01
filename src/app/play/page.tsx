'use client';

import { PlayButton } from '@/features/battle/components/PlayButton';

export default function PlayPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-[#111827] min-h-screen">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-white">Ready to Code Battle?</h1>
        <p className="text-lg text-muted-foreground text-white">
          Click Play to find an opponent and start coding!
        </p>
        <PlayButton />
      </div>
    </div>
  );
} 