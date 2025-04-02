"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { SubmissionItem } from "@/features/contests/types/contest.types";

interface SubmissionDetailsProps {
  submission: SubmissionItem;
  onBack: () => void;
}

const getLanguageExtension = (lang: string) => {
  switch (lang) {
    case "javascript":
      return javascript();
    case "cpp":
    case "c":
      return cpp();
    case "python":
      return python();
    case "java":
      return java();
    default:
      return cpp();
  }
};

const SubmissionDetails = ({ submission, onBack }: SubmissionDetailsProps) => {
  // Log the submission to debug
  console.log("Rendering submission details for:", submission);

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
      >
        <ArrowLeft size={20} />
        Back to Submissions
      </button>

      <div className="bg-[#292C33] rounded-lg p-6 shadow-md">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              {submission.question?.title || "Submission Details"}
            </h3>
            <div
              className={`px-3 py-1 rounded-md font-medium text-xl shadow-lg ${
                submission.status === "ACCEPTED"
                  ? "bg-green-900/30 text-green-400 shadow-green-500/50"
                  : submission.status === "WRONG_ANSWER"
                    ? "bg-red-900/30 text-red-400 shadow-red-500/50"
                    : submission.status === "RUNTIME_ERROR"
                      ? "bg-orange-900/30 text-orange-400 shadow-orange-500/50"
                      : "bg-yellow-900/30 text-yellow-400 shadow-yellow-500/50"
              }`}
            >
              {submission.status.replace("_", " ")}
            </div>
          </div>

          {submission.passedTestCases !== null &&
            submission.totalTestCases !== null && (
              <div className="mt-2 mb-1">
                <div className="text-sm text-gray-300 flex items-center justify-between mb-2">
                  <span>
                    Test Cases Passed:{" "}
                    <span className="font-semibold">
                      {submission.passedTestCases}/{submission.totalTestCases}
                    </span>
                  </span>
                  {submission.score !== null && (
                    <span className="font-semibold text-blue-300">
                      Score: {submission.score}
                    </span>
                  )}
                </div>
                {submission.passedTestCases !== null &&
                  submission.totalTestCases !== null && (
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          submission.status === "ACCEPTED"
                            ? "bg-green-500"
                            : "bg-orange-500"
                        }`}
                        style={{
                          width: `${(submission.passedTestCases / submission.totalTestCases) * 100}%`,
                        }}
                      ></div>
                    </div>
                  )}
              </div>
            )}

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="text-gray-300 flex items-center gap-2">
              <span className="text-gray-500">Submitted:</span>{" "}
              {new Date(submission.createdAt).toLocaleString()}
            </div>
            <div className="h-4 border-r border-gray-700"></div>

            {submission.executionTime !== null && (
              <>
                <div className="text-gray-300 flex items-center gap-2">
                  <span className="text-gray-500">Runtime:</span>{" "}
                  {submission.executionTime} ms
                </div>
                <div className="h-4 border-r border-gray-700"></div>
              </>
            )}

            <div className="text-gray-300 flex items-center gap-2">
              <span className="text-gray-500">Language:</span>{" "}
              {submission.language.charAt(0).toUpperCase() +
                submission.language.slice(1)}
            </div>
          </div>

          {submission.code ? (
            <div className="mt-2 p-4 bg-[#1A1D24] rounded-lg border border-gray-800">
              <h4 className="text-gray-400 mb-2 text-sm font-medium">
                Your Code
              </h4>
              <CodeMirror
                value={submission.code}
                height="200px"
                readOnly={true}
                theme="dark"
                extensions={[getLanguageExtension(submission.language)]}
                className="bg-[#1C202A] rounded text-sm overflow-auto"
              />
            </div>
          ) : (
            <div className="mt-2 p-4 bg-[#1A1D24] rounded-lg border border-gray-800">
              <h4 className="text-gray-400 mb-2 text-sm font-medium">Code</h4>
              <p className="text-gray-500 italic">
                Code not available for this submission
              </p>
            </div>
          )}

          {submission.failedTestCase !== null && (
            <div className="mt-2 p-4 bg-[#1A1D24] rounded-lg border border-red-900/30">
              <h4 className="text-red-400 mb-2 text-sm font-medium">
                Failed Test Case #{submission.failedTestCase}
              </h4>
              <p className="text-gray-300 text-sm">
                Your solution failed on test case #{submission.failedTestCase}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetails;
