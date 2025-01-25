import Image from 'next/image';

export default function UserStats() {
  return (
    <div className="relative bg-gradient-to-r from-[#1a1d26] to-[#1e222c] rounded-lg p-6">
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-600" />
        <div className="text-lg font-semibold">UserName</div>
      </div>
      
      <div className="flex gap-8 mt-8">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center">
            <Image src="/solar_ranking-linear.svg" alt="rank" width={24} height={24} />
          </div>
          <div className="flex flex-col">
            <div className="text-white/60 text-sm font-medium">rank</div>
            <div className="text-sm font-medium">1234</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center">
            <Image src="/cil_badge.svg" alt="achievements" width={24} height={24} />
          </div>
          <div className="flex flex-col">
            <div className="text-white/60 text-sm font-medium">achievements</div>
            <div className="text-sm font-medium">1</div>
          </div>
        </div>
      </div>
    </div>
  );
};