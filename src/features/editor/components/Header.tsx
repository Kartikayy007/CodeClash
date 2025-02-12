import { Timer } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import LabelButton from '@/components/ui/LabelButton'

const Header = () => {
  const [timeLeft, setTimeLeft] = useState(5 * 60); 

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="flex items-center justify-between px-6 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 ">
            <Image
            src="/logo.svg"
            alt="Code Clash"
            width={162}
            height={40}
            priority
          />
        </div>

        <div className="flex justify-center items-center gap-4">
          <Timer size={30} className={timeLeft <= 60 ? 'text-red-500 animate-pulse' : ''} />
          <div className={`flex items-center gap-2 rounded-md px-2 py-1 ${
            timeLeft <= 60 ? ' bg-red-500/10' : 'bg-[#292C33]'
          }`}>
            <span className={`font-bold  text-3xl ${
              timeLeft <= 60 ? 'text-red-500' : 'text-white'
            }`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <a href="/dashboard">
          <LabelButton variant="red" customSize={{ width: '56px', height: '20px' }}>
            END
          </LabelButton>
        </a>
        </header>
  )
}

export default Header
