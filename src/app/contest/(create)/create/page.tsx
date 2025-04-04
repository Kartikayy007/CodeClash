"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LabelButton from "@/components/ui/LabelButton";
import Image from "next/image";
import { contestApi } from "@/features/contests/api/contestApi";
import { toast } from "react-hot-toast";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function CreateContest() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    description: "",
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split("T")[0];

  const getMinStartTime = (date: string) => {
    if (date === todayStr) {
      const now = new Date();
      const utcHours = now.getUTCHours();
      const utcMinutes = now.getUTCMinutes();
      return `${utcHours.toString().padStart(2, "0")}:${utcMinutes.toString().padStart(2, "0")}`;
    }
    return "00:00";
  };

  const getMinEndTime = () => {
    if (formData.endDate === formData.startDate) {
      return formData.startTime;
    }
    return "00:00";
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "endDate") {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(value);
      if (endDate < startDate) {
        return;
      }
    }

    if (name === "endTime" && formData.endDate === formData.startDate) {
      if (value < formData.startTime) {
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const startDateTime = new Date(
        `${formData.startDate}T${formData.startTime}:00`,
      );
      const endDateTime = new Date(
        `${formData.endDate}T${formData.endTime}:00`,
      );
      
      console.log(startDateTime);
      const response = await contestApi.createContest({
        title: formData.name,
        description: formData.description,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      });

      toast.success("Contest created successfully!");

      const params = new URLSearchParams({
        contestId: response.contest.id,
        title: response.contest.title,
        startTime: response.contest.startTime,
        endTime: response.contest.endTime,
      });

      router.push(`/contest/create/details?${params.toString()}`);
    } catch (error) {
      const err = error as ApiError;
      toast.error(err?.response?.data?.message || "Failed to create contest");
    }
  };

  return (
    <div className="flex flex-col md:flex-row p-6 min-h-[calc(100vh-64px)]">
      <div className="hidden md:block w-1/2 bg-[#282D37] p-8">
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

      <div className="w-full md:w-1/2 p-8 bg-[#191C23]">
        <div className="max-w-md mx-auto w-full flex flex-col gap-16">
          <div className="flex justify-center items-center mb-12">
            <div className="flex gap-8">
              <button
                onClick={() => router.push("/contest/join")}
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
              <label className="text-[#D1D1D1] text-[14px] block mb-2">
                Contest Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full h-[45px] px-3 sm:px-4 py-2 rounded-md bg-transparent border-2 border-[#D1D1D1] 
                  focus:outline-none transition-all duration-500 text-sm sm:text-base text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-item">
                <label className="text-[#D1D1D1] text-[14px] block mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  min={todayStr}
                  required
                  className=" w-full h-[45px] px-3 sm:px-4 py-2 rounded-md bg-transparent border-2 border-[#D1D1D1] 
                    focus:outline-none transition-all duration-500 text-sm sm:text-base text-white"
                />
              </div>
              <div className="form-item">
                <label className="text-[#D1D1D1] text-[14px] block mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  min={getMinStartTime(formData.startDate)}
                  required
                  className="w-full h-[45px] px-3 sm:px-4 py-2 rounded-md bg-transparent border-2 border-[#D1D1D1] 
                    focus:outline-none transition-all duration-500 text-sm sm:text-base text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-item">
                <label className="text-[#D1D1D1] text-[14px] block mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  min={formData.startDate || todayStr}
                  required
                  className="w-full h-[45px] px-3 sm:px-4 py-2 rounded-md bg-transparent border-2 border-[#D1D1D1] 
                    focus:outline-none transition-all duration-500 text-sm sm:text-base text-white"
                />
              </div>
              <div className="form-item">
                <label className="text-[#D1D1D1] text-[14px] block mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  min={getMinEndTime()}
                  required
                  className="w-full h-[45px] px-3 sm:px-4 py-2 rounded-md bg-transparent border-2 border-[#D1D1D1] 
                    focus:outline-none transition-all duration-500 text-sm sm:text-base text-white"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <LabelButton type="submit" className="w-full">
                Create Contest
              </LabelButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
