import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ContestDetails } from '@/types/contest.types';

interface BasicDetailsFormProps {
  formData: ContestDetails;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const initialFormData: ContestDetails = {
  name: '',
  startTime: {
    date: '',
    time: ''
  },
  endTime: {
    date: '',
    time: ''
  },
  organizationName: '',
  description: '',
  rules: '',
  prizes: '',
  score: ''
};

const BasicDetailsForm: React.FC<BasicDetailsFormProps> = ({ formData, onChange }) => {
  const searchParams = useSearchParams();
  const [localFormData, setLocalFormData] = useState<ContestDetails>(initialFormData);
  
  useEffect(() => {
    if (!searchParams) return;
    const name = searchParams.get('name') || '';
    const startDate = searchParams.get('startDate') || '';
    const startTime = searchParams.get('startTime') || '';
    const endDate = searchParams.get('endDate') || '';
    const endTime = searchParams.get('endTime') || '';
    const organizationName = searchParams.get('organizationName') || '';

    setLocalFormData(prev => ({
      ...prev,
      name,
      startTime: {
        date: startDate,
        time: startTime
      },
      endTime: {
        date: endDate,
        time: endTime
      },
      organizationName
    }));
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'startTime' || parent === 'endTime') {
        setLocalFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      }
    } else {
      setLocalFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    onChange(e);
  };
  
  return (
    <form className="space-y-6">
      <div>
        <label className="block text-gray-300 text-sm mb-2">Contest Name</label>
        <input
          type="text"
          name="name"
          value={localFormData.name}
          onChange={handleChange}
          placeholder=""
          className="w-full bg-transparent border-2 border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C879EB]"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2">Start Time</label>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            name="startTime.date"
            value={localFormData.startTime.date}
            onChange={handleChange}
            className="bg-transparent border-2 border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C879EB]"
          />
          <input
            type="time"
            name="startTime.time"
            value={localFormData.startTime.time}
            onChange={handleChange}
            className="bg-transparent border-2 border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C879EB]"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2">End Time</label>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            name="endTime.date"
            value={localFormData.endTime.date}
            onChange={handleChange}
            className="bg-transparent border-2 border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C879EB]"
          />
          <input
            type="time"
            name="endTime.time"
            value={localFormData.endTime.time}
            onChange={handleChange}
            className="bg-transparent border-2 border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C879EB]"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2">Organization Name</label>
        <input
          type="text"
          name="organizationName"
          value={localFormData.organizationName}
          onChange={handleChange}
          className="w-full bg-transparent border-2 border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C879EB]"
        />
      </div>
    </form>
  );
};

export default BasicDetailsForm; 