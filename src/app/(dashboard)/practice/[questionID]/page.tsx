"use client";

import React from "react";
import { useParams } from "next/navigation";
import ContestEditor from "@/components/Contest/Editor/ContestEditor";

export default function PracticeProblemPage() {
  const params = useParams();
  const questionID = params?.questionID as string;

  if (!questionID) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#10141D]">
        Problem not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#10141D]">
      <ContestEditor problemId={questionID} />
    </div>
  );
}
