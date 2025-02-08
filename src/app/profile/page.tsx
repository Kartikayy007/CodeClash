'use client';

import { useState } from 'react';
import Image from 'next/image';
import NavbarPlain from '@/components/ui/NavbarPlain';
import { Edit } from 'lucide-react';

interface UserProfile {
  username: string;
  rank: number;
  email: string;
  phone: string;
  stats: {
    levelCP: string;
    totalPoints: number;
    totalMatchPlayed: number;
    winPercentage: number;
  };
  badges: Array<{
    id: number;
    name: string;
    rank: string;
    icon: string;
  }>;
}

export default function ProfilePage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'Current' | 'Year' | 'All'>('Current');
  const [startMonthIndex, setStartMonthIndex] = useState(0);
  const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const profile: UserProfile = {
    username: "Username",
    rank: 23000,
    email: "abc@gmail.com",
    phone: "Phone Number",
    stats: {
      levelCP: "Intermediate",
      totalPoints: 220,
      totalMatchPlayed: 26,
      winPercentage: 86,
    },
    badges: [
      { id: 1, name: "Fire Starter", rank: "10K", icon: "/badges/fire.svg" },
      { id: 2, name: "Badge 2", rank: "10K", icon: "/badges/placeholder.svg" },
      { id: 3, name: "Badge 3", rank: "10K", icon: "/badges/placeholder.svg" },
      { id: 4, name: "Badge 4", rank: "10K", icon: "/badges/placeholder.svg" },
      { id: 5, name: "Badge 5", rank: "10K", icon: "/badges/placeholder.svg" },
    ]
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getMonthData = (month: number, year: number = new Date().getFullYear()) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = getFirstDayOfMonth(month, year);
    const weeks: string[][] = [];
    let currentWeek: string[] = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      currentWeek.push('empty');
    }

    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(Math.random() > 0.7 ? 'active' : 'inactive');

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push('empty');
      }
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const generateActivityData = () => {
    const currentYear = new Date().getFullYear();
    return months.map((_, monthIndex) => getMonthData(monthIndex, currentYear));
  };

  const visibleMonths = months.slice(startMonthIndex, startMonthIndex + 4);
  const activityData = generateActivityData();
  const visibleActivityData = activityData.slice(startMonthIndex, startMonthIndex + 4);

  const handlePrevMonth = () => {
    setStartMonthIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextMonth = () => {
    setStartMonthIndex(prev => Math.min(months.length - 4, prev + 1));
  };

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div>
      <NavbarPlain />
      <div className="p-16 bg-[#15171B] min-h-screen">
        <div className="mb-12">
          <button className="text-white text-xl flex items-center gap-3">
            <span>←</span> Your Profile
          </button>
        </div>

        <div className="grid grid-cols-12 gap-12">
          <div className="col-span-4 bg-[#1E2127] rounded-lg p-8">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gray-600 rounded-full"></div>
                <div>
                  <h2 className="text-white text-2xl font-semibold">{profile.username}</h2>
                  <p className="text-gray-400 text-lg mt-1">Rank {profile.rank}</p>
                </div>
              </div>
              <button className="text-gray-400">
                <Edit size={24} />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-white text-xl mb-6">Personal Information</h3>
                <div className="space-y-4">
                  <p className="text-gray-400 text-lg flex items-center gap-3">
                    <span className="text-xl">✉</span> {profile.email}
                  </p>
                  <p className="text-gray-400 text-lg flex items-center gap-3">
                    <span className="text-xl">📱</span> {profile.phone}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-white text-xl mb-6">Stats</h3>
                <div className="space-y-4">
                  <p className="text-gray-400 text-lg flex justify-between">
                    Level of CP: <span>{profile.stats.levelCP}</span>
                  </p>
                  <p className="text-gray-400 text-lg flex justify-between">
                    Total Points: <span>{profile.stats.totalPoints}</span>
                  </p>
                  <p className="text-gray-400 text-lg flex justify-between">
                    Total Match Played: <span>{profile.stats.totalMatchPlayed}</span>
                  </p>
                  <p className="text-gray-400 text-lg flex justify-between">
                    Win Percentage: <span>{profile.stats.winPercentage}%</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-8 space-y-12">
            <div className="bg-[#1E2127] rounded-lg p-8">
              <h3 className="text-white text-xl mb-8">My Badges</h3>
              <div className="flex gap-6 overflow-x-auto pb-4">
                {profile.badges.map((badge) => (
                  <div key={badge.id} className="flex-shrink-0">
                    <div className="w-32 h-32 bg-[#282C34] rounded-lg flex items-center justify-center mb-3">
                      <Image
                        src={badge.icon}
                        alt={badge.name}
                        width={64}
                        height={64}
                      />
                    </div>
                    <p className="text-gray-400 text-center text-base">Rank: {badge.rank}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Section */}
            <div className="bg-[#1E2127] rounded-lg p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-white text-xl">20 matches in one year</h3>
                  <div className="flex gap-8 text-base text-gray-400 mt-3">
                    <p>Total active days: 13</p>
                    <p>Max Streak: 2</p>
                  </div>
                </div>
                <div className="relative">
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value as any)}
                    className="bg-[#282C34] text-white px-6 py-3 pr-12 rounded text-lg appearance-none cursor-pointer"
                  >
                    <option value="Current">Current</option>
                    <option value="Year">Year</option>
                    <option value="All">All</option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg">▼</span>
                </div>
              </div>

              <div className="relative">
                <button 
                  className={`absolute left-0 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-2xl
                    ${startMonthIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  onClick={handlePrevMonth}
                  disabled={startMonthIndex === 0}
                >
                  ←
                </button>
                <button 
                  className={`absolute right-0 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-2xl
                    ${startMonthIndex >= months.length - 4 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  onClick={handleNextMonth}
                  disabled={startMonthIndex >= months.length - 4}
                >
                  →
                </button>

                <div className="px-8">
                  <div className="flex gap-8 transition-all duration-300 justify-center">
                    {visibleActivityData.map((monthWeeks, monthIndex) => (
                      <div key={visibleMonths[monthIndex]} className="flex flex-col">
                        <div className="flex gap-2 mb-2">
                          {weekDays.map((day, index) => (
                            <div key={index} className="w-[10px] text-center">
                              <span className="text-gray-400 text-[10px]">{day}</span>
                            </div>
                          ))}
                        </div>
                        {/* Calendar grid */}
                        <div className="space-y-[3px]">
                          {monthWeeks.map((week, weekIndex) => (
                            <div key={weekIndex} className="flex gap-2">
                              {week.map((status, dayIndex) => (
                                <div
                                  key={dayIndex}
                                  className={`
                                    h-[10px] w-[10px] rounded-[1px]
                                    ${status === 'active' ? 'bg-purple-500' : 
                                      status === 'empty' ? 'bg-transparent' : 'bg-[#282C34]'}
                                  `}
                                  title={status !== 'empty' ? 
                                    `${visibleMonths[monthIndex]} ${weekDays[dayIndex]}`
                                    : ''}
                                />
                              ))}
                            </div>
                          ))}
                        </div>
                        <p className="text-gray-400 text-base text-center mt-4">
                          {visibleMonths[monthIndex]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
