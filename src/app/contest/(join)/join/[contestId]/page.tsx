"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
// import Image from "next/image";
import LabelButton from "@/components/ui/LabelButton";
// import { ArrowLeft } from 'lucide-react';
import { Contest } from "@/features/contests/types/contest.types";
import { contestApi } from "@/features/contests/api/contestApi";
import toast from "react-hot-toast";
import Timer from "@/components/Contest/joinContest/Timer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type TabType = "Description" | "Rules" | "Score" | "Prizes";

export default function ContestDetails() {
  const params = useParams();
  const router = useRouter();
  const contestId = params?.contestId as string;
  const [activeTab, setActiveTab] = useState<TabType>("Description");
  const [contest, setContest] = useState<Contest>({
    id: "",
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    isPublic: true,
    status: "UPCOMING",
    createdAt: "",
    organizationName: null,
    rules: null,
    prizes: null,
    score: null,
    creator: {
      id: "",
      username: "",
      rating: 0,
    },
    isRegistered: false,
    isCreator: false,
    userStats: null,
    participantCount: 0,
    questionCount: 0,
    questions: [],
  });
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const fetchContestDetails = async () => {
      if (!contestId) return;

      try {
        setLoading(true);
        const response = await contestApi.getContestDetails(contestId);
        if (
          response.contest.isRegistered === true &&
          response.contest.status === "ONGOING"
        ) {
          router.push(`/contest/${contestId}`);
        }
        if (
          response.contest.isRegistered === false &&
          response.contest.status === "ONGOING"
        ) {
          toast.error("Contest has already started");
          setTimeout(() => {
            router.push(`/contest/join`);
          }, 1000);
        }
        toast.success(response.message);
        if (response.contest) {
          setContest(response.contest);
        }
      } catch (error) {
        console.error("Error fetching contest details:", error);
        toast.error("Failed to fetch contest details");
      } finally {
        setLoading(false);
      }
    };

    fetchContestDetails();
  }, [contestId, router]);

  const handleRegister = async () => {
    if (!contestId) return;

    try {
      setRegistering(true);
      const response = await contestApi.registerForContest(contest.id);

      if (response.data) {
        toast.success(response.message || "Successfully joined the contest");

        const updatedDetails = await contestApi.getContestDetails(contestId);
        if (updatedDetails.contest) {
          setContest(updatedDetails.contest);
        }
      }
    } catch (error: unknown) {
      const errorMessage = "Failed to join the contest";
      console.error(errorMessage, error);
      toast.error(errorMessage);
    } finally {
      setRegistering(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Description":
        return (
          <div className="markdown-content text-gray-300">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {contest.description || "# No description provided for this contest."}
            </ReactMarkdown>
          </div>
        );
      case "Rules":
        return (
          <div className="markdown-content text-gray-300">
            {/* <div>
              <p className="font-medium mb-2">Rules</p>
            </div> */}
            {contest.rules ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {contest.rules}
              </ReactMarkdown>
            ) : (
              <p>No rules specified for this contest.</p>
            )}
          </div>
        );
      case "Score":
        return (
          <div className="markdown-content text-gray-300">
            {/* <div>
              <p className="font-medium mb-2">Scoring</p>
            </div> */}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {contest.score || "No scoring system specified"}
            </ReactMarkdown>
          </div>
        );
      case "Prizes":
        return (
          <div className="markdown-content text-gray-300">
            {/* <div className="flex items-center gap-4 mb-4">
              <Image src="/gold.svg" alt="1st Prize" width={40} height={40} />
              <h3 className="text-xl font-medium">Prizes</h3>
            </div> */}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {contest.prizes || "No prize specified. Prizes will be announced soon."}
            </ReactMarkdown>
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
      <style jsx global>{`
        .markdown-content {
          /* Base text styling */
          color: #d1d5db;
          line-height: 1.6;
        }
        
        .markdown-content h1 {
          font-size: 1.8rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          color: white;
        }
        
        .markdown-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.4rem;
          margin-bottom: 0.8rem;
          color: white;
        }
        
        .markdown-content h3 {
          font-size: 1.3rem;
          font-weight: 600;
          margin-top: 1.3rem;
          margin-bottom: 0.6rem;
          color: white;
        }
        
        .markdown-content h4, .markdown-content h5, .markdown-content h6 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-top: 1.2rem;
          margin-bottom: 0.6rem;
          color: white;
        }
        
        .markdown-content p {
          margin-bottom: 1rem;
        }
        
        .markdown-content ul, .markdown-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .markdown-content ul {
          list-style-type: disc;
        }
        
        .markdown-content ol {
          list-style-type: decimal;
        }
        
        .markdown-content li {
          margin-bottom: 0.5rem;
        }
        
        .markdown-content a {
          color: #60a5fa;
          text-decoration: underline;
        }
        
        .markdown-content blockquote {
          border-left: 4px solid #4b5563;
          padding-left: 1rem;
          font-style: italic;
          margin: 1rem 0;
          color: #9ca3af;
        }
        
        .markdown-content pre {
          background: #1e1e1e;
          padding: 1rem;
          border-radius: 0.375rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        
        .markdown-content code {
          background: #282c34;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.9em;
        }
        
        .markdown-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }
        
        .markdown-content th, .markdown-content td {
          border: 1px solid #4b5563;
          padding: 0.5rem;
          text-align: left;
        }
        
        .markdown-content th {
          background: #282c34;
        }
        
        .markdown-content hr {
          border: 0;
          border-top: 1px solid #4b5563;
          margin: 1.5rem 0;
        }
        
        .markdown-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
        }
      `}</style>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white hover:text-gray-300 opacity-0"
          >
            {/* <ArrowLeft size={20} />
            <span>Back</span> */}
          </button>

          <div className=" w-1/2 rounded-lg px-18 py-8 flex justify-center items-center">
            <div className="hidden text-center space-y-4">
              <h1 className="text-5xl font-bold">{contest.title}</h1>
              <p className="text-gray-400">
                {new Date(contest.startTime).toLocaleString()} to{" "}
                {new Date(contest.endTime).toLocaleString()}
              </p>
              {contest.isRegistered && contest.status === "UPCOMING" && (
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">
                    Contest starts in
                  </p>
                  <Timer startTime={contest.startTime} contestId={contest.id} />
                </div>
              )}
              <p className="text-white text-center text-xl">
                {contest.organizationName}
              </p>
            </div>
          </div>
          <div>
            <LabelButton
              onClick={handleRegister}
              disabled={
                registering ||
                contest.status !== "UPCOMING" ||
                contest.isRegistered
              }
              className="w-full md:w-auto"
            >
              {registering ? "Registering..." : "Register"}
            </LabelButton>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col md:flex-row px-4 md:px-8 gap-4 md:gap-8 py-4">
          {/* Contest Info */}
          <div className="w-full md:w-1/3">
            <div className="bg-[#1A1D24] rounded-lg p-4 md:p-6 space-y-4">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Contest Details</h2>
                <p className="text-sm text-gray-400">
                  {new Date(contest.startTime).toLocaleString()} to{" "}
                  {new Date(contest.endTime).toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">
                  Created by {contest.creator.username}
                </p>
              </div>
              {contest.isRegistered && contest.status === "UPCOMING" && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Contest starts in</p>
                  <Timer startTime={contest.startTime} contestId={contest.id} />
                </div>
              )}
            </div>
          </div>

          {/* Tabs and Content */}
          <div className="flex-1">
            <div className="bg-[#1A1D24] rounded-lg p-4 md:p-6">
              {/* Tabs */}
              <div className="flex gap-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {(["Description", "Rules", "Score", "Prizes"] as const).map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2 whitespace-nowrap text-sm md:text-base ${
                        activeTab === tab
                          ? "text-white border-b-2 border-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {tab}
                    </button>
                  ),
                )}
              </div>

              {/* Content */}
              <div className="text-gray-300">{renderTabContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
