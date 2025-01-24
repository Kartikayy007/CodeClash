'use client';

import React from 'react';
import EditorLayout from '@/features/editor/components/EditorLayout';
import { useParams } from 'next/navigation';

const BattleRoom = () => {
  const params = useParams();
  const roomId = params?.roomId as string;

  const questionData = {
    title: "Two Sum",
    difficulty: "Easy",
    description: [
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to targets."
    ],
    constraints: [
      "You may assume that each input would have exactly one solution, and you may not use the same element twice.",
      "You can return the answer in any order."
    ],
    examples: [
      {
        id: 1,
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        id: 2,
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]"
      },
      {
        id: 3,
        input: "nums = [3,3], target = 6",
        output: "[0,1]"
      }
    ]
  };

  return (
    <EditorLayout questionData={questionData} />
  );
};

export default BattleRoom;
