"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import LabelButton from "@/components/ui/LabelButton";
// import { ArrowLeft } from 'lucide-react';
import { Contest } from "@/features/contests/types/contest.types";
import { contestApi } from "@/features/contests/api/contestApi";
import toast from "react-hot-toast";
import Timer from "@/components/Contest/joinContest/Timer";

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
          <div className="text-gray-300 whitespace-pre-wrap">
            {contest.description || "No description provided for this contest."}
          </div>
        );
      case "Rules":
        return (
          <div className="space-y-2 text-gray-300">
            <div>
              <p className="font-medium">Rules</p>
            </div>
            {contest.rules ? (
              contest.rules.split("\n").map((rule, index) => (
                <p key={index}>
                  {index + 1}. {rule}
                </p>
              ))
            ) : (
              <p>No rules specified for this contest.</p>
            )}
          </div>
        );
      case "Score":
        return (
          <div className="space-y-4 text-gray-300">
            <div>
              <p className="font-medium">Scoring</p>
              <p>{contest.score || "No scoring system specified"}</p>
            </div>
          </div>
        );
      case "Prizes":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Image src="/gold.svg" alt="1st Prize" width={40} height={40} />
              {contest.prizes ||
                "No prize specified Prices will be announced soon."}
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
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-8 gap-4 bg-[#10151c]">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-4xl font-bold truncate">
              {contest.title}
            </h1>
          </div>
          <div className="w-full md:w-auto">
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
