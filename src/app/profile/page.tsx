'use client'
import { useState } from 'react';
import ProfileHeader from '@/components/ProfileHeader';
import PersonalInfo from '@/components/PersonalInfo';
import Stats from '@/components/Stats';
import Badges from '@/components/Badges';
import ActivityCalendar from '@/components/ActivityCalendar';
import PeriodSelect from '@/components/PeriodSelect';
import NavbarPlain from '@/components/ui/NavbarPlain';

const ProfilePage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'Current' | 'Year' | 'All'>('Current');
  const [startMonthIndex, setStartMonthIndex] = useState(0);
  const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  

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
            <ProfileHeader username="Username" rank={23000} />
            <PersonalInfo email="abc@gmail.com" phone="Phone Number" />
            <Stats 
              levelCP="Intermediate" 
              totalPoints={220} 
              totalMatchPlayed={26} 
              winPercentage={86} 
            />
          </div>
          <div className="col-span-8 space-y-12">
            <Badges badges={[]} />
            <div className="bg-[#1E2127] rounded-lg p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-white text-xl">20 matches in one year</h3>
                  <div className="flex gap-8 text-base text-gray-400 mt-3">
                    <p>Total active days: 13</p>
                    <p>Max Streak: 2</p>
                  </div>
                </div>
                <PeriodSelect selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} />
              </div>
              <ActivityCalendar 
                activityData={[]} 
                months={months} 
                startMonthIndex={startMonthIndex} 
                visibleMonths={months.slice(startMonthIndex, startMonthIndex + 4)} 
                handlePrevMonth={() => setStartMonthIndex(prev => Math.max(0, prev - 1))} 
                handleNextMonth={() => setStartMonthIndex(prev => Math.min(months.length - 4, prev + 1))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
