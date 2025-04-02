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

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Create Date objects
      const now = new Date();
      const start = new Date(startTime);

      // Get time difference in milliseconds
      const distance = start.getTime() - now.getTime();

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
      <div className="flex flex-col items-center bg-[#db83d8] p-4 rounded-lg text-black">
        <span className="text-2xl font-bold">{padNumber(timeLeft.days)}</span>
        <span className="text-xs">Days</span>
      </div>
      <div className="text-xl font-bold">:</div>
      <div className="flex flex-col items-center bg-[#db83d8] p-4 rounded-lg text-black">
        <span className="text-2xl font-bold">{padNumber(timeLeft.hours)}</span>
        <span className="text-xs">Hours</span>
      </div>
      <div className="text-xl font-bold">:</div>
      <div className="flex flex-col items-center bg-[#db83d8] p-4 rounded-lg text-black">
        <span className="text-2xl font-bold">
          {padNumber(timeLeft.minutes)}
        </span>
        <span className="text-xs">Minutes</span>
      </div>
      <div className="text-xl font-bold">:</div>
      <div className="flex flex-col items-center bg-[#db83d8] p-4 rounded-lg text-black">
        <span className="text-2xl font-bold">
          {padNumber(timeLeft.seconds)}
        </span>
        <span className="text-xs">Seconds</span>
      </div>
    </div>
  );
}
