'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import LabelButton from '@/components/ui/LabelButton';
import Image from 'next/image';

export default function CreateContest() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(formData)) {
      searchParams.append(key, value);
    }
    router.push(`/contest/create/details?${searchParams.toString()}`);
    console.log('Creating contest with data:', formData);
  };

  return (
    <div className="flex p-12 min-h-[calc(100vh-64px)]">
      <div className="w-1/2 bg-[#282D37] p-8 md:block hidden">
        <div className="flex items-center gap-2 mb-6">
          <button 
            onClick={() => router.back()}
            className="text-white hover:text-gray-300"
          >
            ← Back
          </button>
        </div>
        <div className="flex justify-center items-center h-[calc(100%-48px)]">
          <Image
            src="/_0227_Coding_3.svg"
            alt="Create Contest"
            className="max-w-[80%] h-auto"
            width={500}
            height={500}
          />
        </div>
      </div>

      <div className="w-1/2 p-8 bg-[#191C23]">
        <div className="max-w-md mx-auto w-full">
          <div className="flex justify-center items-center mb-12">
            <div className="flex gap-8">
              <button 
                onClick={() => router.push('/contest/join')}
                className="text-white/60 hover:text-white pb-1 text-lg font-medium transition-colors"
              >
                Join Contest
              </button>
              <div className="w-px bg-gray-700" />
              <button className="text-white hover:text-gray-300 border-b-2 border-white pb-1 text-lg font-medium">
                Create Contest
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-item">
              <label className="text-[#D1D1D1] text-[14px] block mb-2">Contest Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full h-[45px] px-3 sm:px-4 py-2 rounded-md bg-transparent border-2 border-[#D1D1D1] 
                  focus:outline-none transition-all duration-500 text-sm sm:text-base text-white placeholder:text-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-item">
                <label className="text-[#D1D1D1] text-[14px] block mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full h-[45px] px-3 sm:px-4 py-2 rounded-md bg-transparent border-2 border-[#D1D1D1] 
                    focus:outline-none transition-all duration-500 text-sm sm:text-base text-white"
                />
              </div>
              <div className="form-item">
                <label className="text-[#D1D1D1] text-[14px] block mb-2">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full h-[45px] px-3 sm:px-4 py-2 rounded-md bg-transparent border-2 border-[#D1D1D1] 
                    focus:outline-none transition-all duration-500 text-sm sm:text-base text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-item">
                <label className="text-[#D1D1D1] text-[14px] block mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full h-[45px] px-3 sm:px-4 py-2 rounded-md bg-transparent border-2 border-[#D1D1D1] 
                    focus:outline-none transition-all duration-500 text-sm sm:text-base text-white"
                />
              </div>
              <div className="form-item">
                <label className="text-[#D1D1D1] text-[14px] block mb-2">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full h-[45px] px-3 sm:px-4 py-2 rounded-md bg-transparent border-2 border-[#D1D1D1] 
                    focus:outline-none transition-all duration-500 text-sm sm:text-base text-white"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <LabelButton type="submit" className="w-full">
                Next
              </LabelButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
