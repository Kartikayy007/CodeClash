'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchProfile } from '@/features/home/profile/thunks/profileThunks';
import ProfileHeader from '@/components/profile/ProfileHeader';
import PersonalInfo from '@/components/profile/PersonalInfo';
import Stats from '@/components/profile/Stats';
import Badges from '@/components/profile/Badges';
import ActivityCalendar from '@/components/profile/ActivityCalendar';
import PeriodSelect from '@/components/profile/PeriodSelect';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, error } = useSelector((state: RootState) => state.profile);
  const [selectedPeriod, setSelectedPeriod] = useState<'Current' | 'Year' | 'All'>('Current');
  const [startMonthIndex, setStartMonthIndex] = useState(0);
  const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const formatActivityData = () => {
    const today = new Date();
    const activityData = [];
    
    for (let i = 365; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const count = profile ? Math.floor(Math.random() * 5) : 0;
      activityData.push({
        date: date.toISOString().split('T')[0],
        count,
        level: count as 0 | 1 | 2 | 3 | 4
      });
    }
    
    return activityData;
  };

  useEffect(() => {
    dispatch(fetchProfile())
      .unwrap()
      .catch((error) => {
        toast.error(error || 'Failed to fetch profile');
        router.push('/login');
      });
  }, [dispatch, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#15171B] flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#15171B] flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-16 bg-[#15171B] min-h-screen">
        <div className="mb-12">
          <button 
            className="text-white text-xl flex items-center gap-3"
            onClick={() => router.back()}
          >
            <span>←</span> Your Profile
          </button>
        </div>
        <div className="grid grid-cols-12 gap-12">
          <div className="col-span-4 bg-[#1E2127] rounded-lg p-8">
            <ProfileHeader 
              username={profile?.username || 'Username'} 
              rank={profile?.rating || 0} 
            />
            <PersonalInfo 
              email={profile?.email || ''} 
              phone="Phone Number" 
            />
            <Stats 
              levelCP={profile?.skillLevel || 'Intermediate'} 
              totalPoints={profile?.rating || 0} 
              totalMatchPlayed={profile?.totalMatches || 0} 
              winPercentage={profile?.winRate || 0} 
            />
          </div>
          <div className="col-span-8 space-y-12">
            <Badges badges={[]} />
            <div className="bg-[#1E2127] rounded-lg p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-white text-xl">{profile?.totalMatches || 0} matches in one year</h3>
                  <div className="flex gap-8 text-base text-gray-400 mt-3">
                    <p>Total active days: {profile?.wins || 0}</p>
                    <p>Max Streak: {profile?.maxWinStreak || 0}</p>
                  </div>
                </div>
                <PeriodSelect selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} />
              </div>
              <ActivityCalendar 
                activityData={formatActivityData()} 
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
