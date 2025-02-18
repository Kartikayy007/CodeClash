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
  const params = useParams();
  const router = useRouter();
  const contestId = params?.contestId as string;
  const [activeTab, setActiveTab] = useState<TabType>('Description');
  const [contest, setContest] = useState<Contest>({
    id: '',
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    isPublic: true,
    status: 'UPCOMING',
    createdAt: '',
    organizationName: null,
    rules: null,
    prizes: null,
    score: null,
    creator: {
      id: '',
      username: '',
      rating: 0
    },
    isRegistered: false,
    isCreator: false,
    userStats: null,
    participantCount: 0,
    questionCount: 0,
    questions: []
  });
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const fetchContestDetails = async () => {
      if (!contestId) return;
      
      try {
        setLoading(true);
        const response = await contestApi.getContestDetails(contestId);
        
        if (response.contest) {
          setContest(response.contest);
        }
      } catch (error) {
        console.error('Error fetching contest details:', error);
        toast.error('Failed to fetch contest details', 'fetch-error');
      } finally {
        setLoading(false);
      }
    };

    fetchContestDetails();
  }, [contestId]);

  const handleRegister = async () => {
    if (!contestId) return;

    try {
      setRegistering(true);
      const response = await contestApi.registerForContest(contest.id);
      if (response.success) {
        toast.success('Successfully registered for the contest', 'register-success');
        // Refresh contest details to update registration status
        const updatedDetails = await contestApi.getContestDetails(contestId);
        if (updatedDetails.contest) {
          setContest(updatedDetails.contest);
        }
      }
    } catch (error) {
      console.error('Error registering for contest:', error);
      toast.error('Failed to register for the contest', 'register-error');
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
            {contest.rules ? contest.rules.split('\n').map((rule, index) => (
              <p key={index}>{index + 1}. {rule}</p>
            )) : (
              <p>No rules specified for this contest.</p>
            )}
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
                <p className="text-gray-400">{contest.prizes || 'No prize specified'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Image src="/silver.svg" alt="2nd Prize" width={40} height={40} />
              <div>
                <p className="font-medium">2nd Place</p>
                <p className="text-gray-400">Cash prize of $300 and a certificate of merit.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Image src="/bronze.svg" alt="3rd Prize" width={40} height={40} />
              <div>
                <p className="font-medium">3rd Place</p>
                <p className="text-gray-400">Cash prize of $150 and a certificate of merit.</p>
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
            <div className='text-center'>
              <h1 className='text-2xl font-bold'>{contest.title}</h1>
              <p className='text-gray-400'>{new Date(contest.startTime).toLocaleString()} to {new Date(contest.endTime).toLocaleString()}</p>
              <p className='text-white text-center text-sm'>
                {contest.creator.username}
              </p>
            </div>
          </div>
          <LabelButton
            onClick={handleRegister}
            disabled={registering || contest.status !== 'UPCOMING' || contest.isRegistered}
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
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1">
            <div className="bg-[#1A1D24] rounded-lg p-8">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 