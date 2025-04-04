"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import LabelButton from "@/components/ui/LabelButton";
import { Pencil, Trash } from "lucide-react";
import CreateProblem from "./createProblem";
import Image from "next/image";
import LibProblems from "./problemLibrary/libProblems";
import { Problem } from "@/types/problem.types";
import { toast } from "react-hot-toast";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface ProblemComponentProps {
  problems: Problem[];
  onAddProblem: () => void;
  onCreateProblem: () => void;
  onDeleteProblem: (index: number) => void;
  onSaveProblem: (problemData: {
    name: string;
    title: string;
    maxScore: number;
    score: number;
    rating: number;
    description: string;
    inputFormat: string;
    constraints: string;
    outputFormat: string;
    testCases: Array<{
      input: string;
      output: string;
      sample: boolean;
      strength: number;
    }>;
  }) => Promise<void>;
}

const Problems: React.FC<ProblemComponentProps> = ({
  problems = [],
  onDeleteProblem,
  onSaveProblem,
}) => {
  const [, setEditingProblem] = useState<Problem | null>(null);
  const [editedProblem, setEditedProblem] = useState<Problem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProblemIndex, setSelectedProblemIndex] = useState<
    number | null
  >(null);
  const [showCreateProblem, setShowCreateProblem] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEditClick = (problem: Problem) => {
    setEditingProblem(problem);
    setEditedProblem({ ...problem });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProblem((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]:
          name === "rating" || name === "maxScore" ? parseInt(value) : value,
      };
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedProblem) return;

    try {
      await onSaveProblem({
        name: editedProblem.name,
        title: editedProblem.name,
        maxScore: editedProblem.maxScore,
        score: 0,
        rating: editedProblem.rating,
        description: "",
        inputFormat: "",
        constraints: "",
        outputFormat: "",
        testCases: [],
      });
      toast.success("Problem updated successfully");
      setIsEditModalOpen(false);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update problem",
      );
    }
  };

  const handleDeleteClick = (index: number) => {
    setSelectedProblemIndex(index);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedProblemIndex !== null) {
      const problem = problems[selectedProblemIndex];
      if (problem.id) {
        try {
          await onDeleteProblem(selectedProblemIndex);
          toast.success("Problem deleted successfully");
        } catch (error) {
          const err = error as ApiError;
          toast.error(
            err?.response?.data?.message || "Failed to delete problem",
          );
        }
      }
      setShowDeleteConfirm(false);
      setSelectedProblemIndex(null);
    }
  };

  const handleCreateProblemClick = () => {
    setShowCreateProblem(true);
  };

  const handleSaveProblem = async (data: Problem) => {
    try {
      await onSaveProblem({
        name: data.name,
        title: data.name,
        maxScore: data.maxScore || 0,
        score: data.maxScore || 0,
        rating: data.rating || 1000,
        description: data.description || "",
        inputFormat: data.inputFormat || "",
        constraints: data.constraints || "",
        outputFormat: data.outputFormat || "",
        testCases:
          data.testCases?.map((tc) => ({
            input: tc.input || "",
            output: tc.output || "",
            sample: !tc.sample,
            strength: tc.strength || 1,
          })) || [],
      });
      setShowCreateProblem(false);
      toast.success("Problem added successfully");
    } catch (error) {
      toast.error("Failed to add problem");
      console.error("Error adding problem:", error);
    }
  };

  const handleAddFromLibrary = () => {
    setShowLibrary(true);
  };

  const handleLibraryBack = () => {
    setShowLibrary(false);
  };

  const handleAddProblems = (selectedProblems: Problem[]) => {
    selectedProblems.forEach((problem) => {
      onSaveProblem({
        name: problem.name,
        title: problem.name,
        maxScore: problem.maxScore || 100,
        score: problem.maxScore || 100,
        rating: problem.rating || 1000,
        description: problem.description || "",
        inputFormat: problem.inputFormat || "",
        constraints: problem.constraints || "",
        outputFormat: problem.outputFormat || "",
        testCases:
          problem.testCases?.map((tc) => ({
            input: tc.input || "",
            output: tc.output || "",
            sample: tc.sample,
            strength: tc.strength || 1,
          })) || [],
      });
    });
    setShowLibrary(false);
  };

  if (showLibrary) {
    return (
      <LibProblems
        onBack={handleLibraryBack}
        onAddProblems={handleAddProblems}
      />
    );
  }

  if (showCreateProblem) {
    return (
      <CreateProblem
        onBack={() => setShowCreateProblem(false)}
        onSave={handleSaveProblem}
      />
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-full gap-4 md:gap-8">
      {/* Sidebar buttons - stack vertically on mobile, horizontal on small screens, vertical on medium+ */}
      <div className="flex flex-row md:flex-col gap-3 md:gap-4 md:w-56 max-h-[100px]">
        <LabelButton
          variant="light"
          onClick={handleAddFromLibrary}
          className="flex-1 md:w-full"
        >
          Add from Library
        </LabelButton>
        <LabelButton
          variant="outlined"
          onClick={handleCreateProblemClick}
          className="flex-1 md:w-full"
        >
          Create New Problem
        </LabelButton>
      </div>

      {/* Main content area */}
      <div className="flex-1 w-full">
        {problems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <Image
              src="/no-problems.svg"
              alt="No problems"
              width={250}
              height={250}
              className="w-48 md:w-64 lg:w-80 h-auto"
              priority
            />
            <h1 className="text-white text-xl md:text-2xl font-bold mt-4 text-center">
              No Problems added!
            </h1>
            <p className="text-gray-400 mt-2 md:mt-4 text-center text-sm md:text-base px-2">
              You haven&apos;t added any problems to this contest yet. Start by
              adding one now!
            </p>
          </div>
        ) : (
          <div className="bg-[#1A1D24] rounded-lg overflow-hidden w-full">
            {/* Table header - hide "Rating" column on smallest screens */}
            <div className="grid grid-cols-6 md:grid-cols-8 p-3 md:p-4 text-white border-b border-gray-700 text-sm md:text-base">
              <div className="col-span-4 md:col-span-5">Problem Name</div>
              <div className="col-span-2 md:col-span-2 text-center">
                Max Score
              </div>
              <div className="hidden md:block col-span-1 text-center">
                Rating
              </div>
            </div>

            {/* Problems list with responsive layout */}
            <div className="divide-y divide-[#282C33]">
              {problems.map((problem, index) => (
                <div
                  key={index}
                  className="grid grid-cols-6 md:grid-cols-8 px-3 md:px-6 py-3 md:py-4 text-white items-center hover:bg-[#282C33] transition-colors group"
                >
                  <div className="col-span-4 md:col-span-5 font-medium truncate pr-2 text-sm md:text-base">
                    {problem.name}
                  </div>
                  <div className="col-span-1 md:col-span-2 text-center text-white/80 text-sm md:text-base">
                    {problem.maxScore}
                  </div>
                  <div className="col-span-1 flex items-center justify-end md:justify-between">
                    <span className="hidden md:block flex-1 text-center text-white/80">
                      {problem.rating}
                    </span>
                    <div className="flex gap-1 md:gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditClick(problem)}
                        className="p-1 hover:bg-white/10 rounded"
                        aria-label="Edit problem"
                      >
                        <Pencil size={14} className="md:size-6" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(index)}
                        className="p-1 hover:bg-white/10 rounded text-red-500"
                        aria-label="Delete problem"
                      >
                        <Trash size={14} className="md:size-6" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal - keep as is but make interior form responsive */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Problem"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4 md:space-y-6">
          <div className="form-group">
            <label className="text-[#D1D1D1] text-xs md:text-sm block mb-1 md:mb-2">
              Problem Title
            </label>
            <input
              type="text"
              name="name"
              value={editedProblem?.name || ""}
              onChange={handleEditInputChange}
              className="w-full h-10 md:h-[45px] px-3 md:px-4 py-2 rounded-md bg-transparent border-2 border-[#D1D1D1] 
              focus:outline-none transition-all duration-500 text-sm text-white placeholder:text-gray-400"
            />
          </div>

          <div className="flex flex-col gap-3 md:gap-4">
            <div className="form-group">
              <label className="text-[#D1D1D1] text-xs md:text-sm block mb-1 md:mb-2">
                Max Score
              </label>
              <input
                type="number"
                name="maxScore"
                value={editedProblem?.maxScore || ""}
                onChange={handleEditInputChange}
                className="w-full h-10 md:h-[45px] px-3 md:px-4 py-2 rounded-md bg-transparent border-2 border-[#D1D1D1] 
                focus:outline-none transition-all duration-500 text-sm text-white placeholder:text-gray-400"
              />
            </div>

            <div className="form-group">
              <label className="text-[#D1D1D1] text-xs md:text-sm block mb-1 md:mb-2">
                Rating
              </label>
              <input
                type="number"
                name="rating"
                value={editedProblem?.rating || ""}
                onChange={handleEditInputChange}
                className="w-full h-10 md:h-[45px] px-3 md:px-4 py-2 rounded-md bg-transparent border-2 border-[#D1D1D1] 
                focus:outline-none transition-all duration-500 text-sm text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex w-full gap-3 md:gap-4 mt-6 md:mt-8">
            <LabelButton
              variant="outlined"
              onClick={() => setIsEditModalOpen(false)}
              type="button"
              className="text-sm"
            >
              Cancel
            </LabelButton>
            <LabelButton type="submit" className="text-sm">
              Save Changes
            </LabelButton>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation - made responsive */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1A1D24] p-4 md:p-6 rounded-lg w-full max-w-xs md:max-w-md">
            <h3 className="text-base md:text-lg font-medium mb-2 md:mb-4">
              Delete Problem
            </h3>
            <p className="text-gray-400 text-sm md:text-base mb-4 md:mb-6">
              Are you sure you want to delete this problem?
            </p>
            <div className="flex justify-end gap-3 md:gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 md:px-4 py-1.5 md:py-2 text-gray-400 hover:text-white text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3 md:px-4 py-1.5 md:py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm md:text-base"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Problems;
