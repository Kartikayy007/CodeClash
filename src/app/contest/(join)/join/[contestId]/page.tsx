'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import LabelButton from '@/components/ui/LabelButton';
import { ArrowLeft } from 'lucide-react';
import { Contest } from '@/features/contests/types/contest.types';
import { contestApi } from '@/features/contests/api/contestApi';
import { toast } from '@/providers/toast-config';

type TabType = 'Description' | 'Rules' | 'Score' | 'Prizes';

export default function ContestDetails() {
  const params = useParams<{ contestId: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('Description');
  const [contest, setContest] = useState<Contest>({
    id: '',
    name: 'Code Clash: Battle of the Brains',
    startDate: '22 Jan, 2024 11:00 pm',
    endDate: '23 Jan, 2024 12:00 pm',
    banner: "",
    duration: '2 hours',
    description: 'Compete with the best minds in the ultimate coding showdown! The Competitive Programming Contest challenges participants to solve algorithmic problems within a limited timeframe. This is your chance to showcase your problem-solving skills, logical thinking, and coding expertise. Whether you\'re a beginner or a pro, this contest will push your limits and ignite your passion for coding.',
    organizer: 'organizer name',
    participants: 50,
    rules: [
      'Eligibility: Open to all individuals with basic programming knowledge.',
      'Time Limit: Contest duration is 2-3 hours.',
      'Languages Allowed: Participants can use any of the following programming languages: Python, C++, Java, or JavaScript.',
      'Scoring System: Problems are scored based on their difficulty levels. Partial points are awarded for partially correct solutions.',
      'Prohibited Activities: Plagiarism or use of any unfair means will lead to disqualification.',
      'Submission: Submit your solutions directly on the platform before the timer runs out.',
      'Technical Issues: No extra time will be provided for personal technical issues, so ensure your system is set up correctly before the contest begins.',
      'Final Decision: Judges\' decisions are final and binding.'
    ],
    prizes: {
      first: 'Cash prize of $500, a trophy, and a certificate of excellence.',
      second: 'Cash prize of $300 and a certificate of merit.',
      third: 'Cash prize of $150 and a certificate of merit.'
    },
    status: 'UPCOMING'
  });

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        setLoading(true);
        const response = await contestApi.getContestDetails(params.contestId);
        if (response.success && response.data) {
          setContest(response.data);
        }
      } catch (error) {
        toast.error('Failed to fetch contest details', { id: 'fetch-error' });
        console.error('Error fetching contest details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.contestId) {
      fetchContestDetails();
    }
  }, [params.contestId]);

  const handleRegister = async () => {
    try {
      setRegistering(true);
      const response = await contestApi.registerForContest(contest.id);
      if (response.success) {
        toast.success('Successfully registered for the contest', { id: 'register-success' });
        // Redirect to contest dashboard or confirmation page
      }
    } catch (error) {
      toast.error('Failed to register for the contest', { id: 'register-error' });
      console.error('Error registering for contest:', error);
    } finally {
      setRegistering(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Description':
        return (
          <div className="text-gray-300 whitespace-pre-wrap">
            {contest.description}
          </div>
        );
      case 'Rules':
        return (
          <div className="space-y-2 text-gray-300">
            {contest.rules.map((rule, index) => (
              <p key={index}>{index + 1}. {rule}</p>
            ))}
          </div>
        );
      case 'Score':
        return (
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="text-lg font-medium mb-2">Problem Levels:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Easy: 10 points</li>
                <li>Medium: 30 points</li>
                <li>Hard: 50 points</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Tie-breaker:</h3>
              <p>In case of a tie, the participant who solves the problems in the least amount of time will be declared the winner.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Bonus Points:</h3>
              <p>Additional points for submitting solutions early (1 point per 10 minutes saved).</p>
            </div>
          </div>
        );
      case 'Prizes':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Image src="/gold.svg" alt="1st Prize" width={40} height={40} />
              <div>
                <p className="font-medium">1st Place</p>
                <p className="text-gray-400">{contest.prizes.first}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Image src="/silver.svg" alt="2nd Prize" width={40} height={40} />
              <div>
                <p className="font-medium">2nd Place</p>
                <p className="text-gray-400">{contest.prizes.second}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Image src="/bronze.svg" alt="3rd Prize" width={40} height={40} />
              <div>
                <p className="font-medium">3rd Place</p>
                <p className="text-gray-400">{contest.prizes.third}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-700">
              <p className="text-gray-400">⭐ Top 10 Participants: Exclusive goodies and participation certificates.</p>
              <p className="text-gray-400 mt-2">🎯 Early Bird Special: A special prize for the first participant to submit all correct solutions.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#10141D] text-white flex items-center justify-center">
        <p>Loading contest details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#10141D] text-white">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white hover:text-gray-300"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <div className='bg-[#1A1D24] w-1/2 rounded-lg px-18 py-8 flex justify-center items-center'>
            <div>
              <h1 className='text-2xl font-bold'>{contest.name}</h1>
              <p className='text-gray-400'>{contest.startDate} to {contest.endDate}</p>
              <p className='text-white text-center text-sm'>
                {contest.organizer}
              </p>
            </div>
          </div>
          <LabelButton 
            onClick={handleRegister} 
            disabled={registering || contest.status !== 'UPCOMING'}
          >
            {registering ? 'Registering...' : 'Register'}
          </LabelButton>
        </div>

        <div className="flex px-8 gap-8">
          <div className="w-[200px] rounded-lg h-fit">
            {(['Description', 'Rules', 'Score', 'Prizes'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-2 rounded-lg text-lg transition-colors ${
                  activeTab === tab 
                    ? 'text-white bg-[#282C33] rounded-lg' 
                    : 'text-gray-400 hover:text-white '
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1">
            <div className=" rounded-lg p-8">
              {renderTabContent()}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
} 