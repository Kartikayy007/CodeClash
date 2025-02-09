'use client';

import { useState } from 'react';
import NavbarPlain from '@/components/ui/NavbarPlain';
import ContestFilters from '@/components/ContestFilters';
import ContestTable from '@/components/ContestTable';

export default function ContestsPage() {
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Scheduled' | 'Ongoing' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const contests = [
    {
      name: 'Abcdef',
      startDate: '1 Jan 2024',
      duration: '1 hour',
      participants: 20
    },
    {
      name: 'Efghij',
      startDate: '1 Jan 2024',
      duration: '2 hour',
      participants: 10
    },
    {
      name: 'Qwetyu',
      startDate: '2 Jan 2024',
      duration: '20 mins',
      participants: 15
    },
    {
      name: 'Asdfhjc',
      startDate: '2 Jan 2024',
      duration: '40 mins',
      participants: 10
    }
  ];

  return (
    <div className="min-h-screen bg-[#15171B]">
      <NavbarPlain />
      <div className="p-12">
        <div className="flex items-center justify-between mb-8">
          {/* Search and Create Contest button */}
        </div>

        <div className='flex'>
          <ContestFilters selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />
          <ContestTable contests={contests} />
        </div>
      </div>
    </div>
  );
}
