import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface TimerProps {
  startTime: string;
  contestId: string;
  className?: string;
}

export default function Timer({
  startTime,
  contestId,
  className = "",
}: TimerProps) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  console.log("startTime", startTime);

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Create Date objects
      const now = new Date();
      const start = new Date(startTime);
      
      // Debug timezone info
      console.log('--- TIMER COMPONENT TIMEZONE DEBUG ---');
      console.log('Input startTime string:', startTime);
      console.log('Current time (ISO):', now.toISOString());
      console.log('Current time (Local):', now.toString());
      console.log('Current timezone offset:', now.getTimezoneOffset() / -60);
      console.log('Parsed start time (ISO):', start.toISOString());
      console.log('Parsed start time (Local):', start.toString());
      console.log('Time difference (ms):', start.getTime() - now.getTime());
      
      const distance = start.getTime() - now.getTime();
      console.log("start, now", start.getTime(), now.getTime());

      if (distance < 0) {
        clearInterval(timer);
        router.push(`/contest/${contestId}`);
        return null;
      }

      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      };
    };

    const initialTimeLeft = calculateTimeLeft();
    if (initialTimeLeft) {
      setTimeLeft(initialTimeLeft);
    }

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      if (newTimeLeft) {
        setTimeLeft(newTimeLeft);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, contestId, router]);

  const padNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <div className="flex flex-col items-center bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-xl text-white border border-cyan-400/30 shadow-lg shadow-cyan-500/25">
        <span className="text-2xl font-bold">{padNumber(timeLeft.days)}</span>
        <span className="text-xs font-medium">Days</span>
      </div>
      <div className="text-xl font-bold text-cyan-400">:</div>
      <div className="flex flex-col items-center bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-xl text-white border border-cyan-400/30 shadow-lg shadow-cyan-500/25">
        <span className="text-2xl font-bold">{padNumber(timeLeft.hours)}</span>
        <span className="text-xs font-medium">Hours</span>
      </div>
      <div className="text-xl font-bold text-cyan-400">:</div>
      <div className="flex flex-col items-center bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-xl text-white border border-cyan-400/30 shadow-lg shadow-cyan-500/25">
        <span className="text-2xl font-bold">
          {padNumber(timeLeft.minutes)}
        </span>
        <span className="text-xs font-medium">Minutes</span>
      </div>
      <div className="text-xl font-bold text-cyan-400">:</div>
      <div className="flex flex-col items-center bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-xl text-white border border-cyan-400/30 shadow-lg shadow-cyan-500/25">
        <span className="text-2xl font-bold">
          {padNumber(timeLeft.seconds)}
        </span>
        <span className="text-xs font-medium">Seconds</span>
      </div>
    </div>
  );
}
