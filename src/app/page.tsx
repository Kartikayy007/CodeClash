'use client';

import { useRouter } from 'next/navigation';
import LabelButton from "@/components/ui/LabelButton";

const Page = () => {
  const router = useRouter();

  return (
    <div>
      <h1 className="text-4xl font-extrabold flex flex-col gap-12 justify-center items-center h-screen bg-[#10141D]">  
        <h1 className='text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-white text-left mt-2'>
          Welcome to CodeClash!
        </h1>
        <LabelButton 
          variant="outlined"
          onClick={() => router.push('/get-started')}
          className="text-base sm:text-lg text-[#D1D1D1] hover:opacity-80 transition-opacity"
        >
          Get Started
        </LabelButton>
      </h1>
    </div>
  );
};

export default Page;
