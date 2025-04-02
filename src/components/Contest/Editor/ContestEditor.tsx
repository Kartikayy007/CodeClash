"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import {
  Problem,
  TestCase,
  fetchProblem,
} from "@/features/battle/editor/api/problems";
import Topbar from "./Topbar";
import CodeEditor from "./CodeEditor";
import Question from "./Question";
import Submissions from "./Submissions";
import TestCases, { TestCasesRef } from "./TestCases";
import { runCode, submitCode } from "@/features/battle/editor/api/editorApi";
import ReactConfetti from "react-confetti";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";

interface ContestEditorProps {
  problemId: string;
  contestId: string;
}

interface SubmissionResult {
  status: "ACCEPTED" | "WRONG_ANSWER" | "RUNTIME_ERROR" | "COMPILATION_ERROR";
  runtime: number;
  message?: string;
  submissionId?: string;
  testCasesPassed?: number;
  totalTestCases?: number;
  executionTime?: number;
  failedTestCase?: string | null;
  score?: number;
}

const ContestEditor = ({ problemId, contestId }: ContestEditorProps) => {
  const [activeTab, setActiveTab] = useState<"description" | "submissions">(
    "description",
  );
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [isSaving, setIsSaving] = useState(false);
  const [codeByLanguage, setCodeByLanguage] = useState<Record<string, string>>({
    c: `#include <stdio.h>
    
int main() {
  // Write your code here
  
  return 0;
}`,
    cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {     
    // Write your code here

    return 0;
}`,
    python: `# Write your code here`,
    java: `class CodeClash {
    public static void main (String[] args) throws java.lang.Exception
    {
        // your code goes here

    }
}`,
    javascript: `// Write your code here
`,
  });
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [runResult, setRunResult] = useState<string | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionResult, setSubmissionResult] =
    useState<SubmissionResult | null>(null);
  const [submittedCode, setSubmittedCode] = useState("");
  const [submittedLanguage, setSubmittedLanguage] = useState("");
  const [showSubmissionResult, setShowSubmissionResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTestCase, setActiveTestCase] = useState(0);
  const testCasesRef = useRef<HTMLDivElement>(null);
  const testCasesComponentRef = useRef<TestCasesRef>(null);
  const isInitialLoad = useRef(true);
  const [isCustomInputMode, setIsCustomInputMode] = useState(false);
  const [customInput, setCustomInput] = useState("");

  // Effect for fetching problem data
  useEffect(() => {
    const getProblem = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProblem(problemId);
        setProblem(data);
        const visibleTestCases = data.testCases.filter(
          (test) => !test.isHidden,
        );
        setTestCases(visibleTestCases);
      } catch (error) {
        console.error("Error fetching problem:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getProblem();
  }, [problemId]);

  // Separate effect for initial code setup - properly includes all dependencies
  useEffect(() => {
    // Only set code if this is the initial load
    if (isInitialLoad.current) {
      setCode(codeByLanguage[language] || "");
      isInitialLoad.current = false;
    }
  }, [codeByLanguage, language]);

  useEffect(() => {
    const savedData = localStorage.getItem(`code-${problemId}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setCodeByLanguage(parsed.codeByLanguage);
        setLanguage(parsed.language);
        setCode(parsed.codeByLanguage[parsed.language] || "");
        // Reset isInitialLoad after loading saved code to prevent overwriting with defaults
        isInitialLoad.current = false;
      } catch (error) {
        console.error("Error parsing saved code:", error);
      }
    }
  }, [problemId]);

  useEffect(() => {
    if (code && language) {
      const updatedCodeByLanguage = {
        ...codeByLanguage,
        [language]: code,
      };

      const dataToSave = {
        language,
        codeByLanguage: updatedCodeByLanguage,
      };

      const saveTimer = setTimeout(() => {
        setIsSaving(true);

        try {
          localStorage.setItem(`code-${problemId}`, JSON.stringify(dataToSave));
          console.log("Auto-saved code to localStorage");
        } catch (error) {
          console.error("Error saving code to localStorage:", error);
        } finally {
          setTimeout(() => setIsSaving(false), 300);
        }
      }, 500);

      return () => clearTimeout(saveTimer);
    }
  }, [code, language, problemId, codeByLanguage]);

  const handleLanguageChange = (newLanguage: string) => {
    console.log("Language changed to:", newLanguage);
    setCodeByLanguage((prev) => ({
      ...prev,
      [language]: code,
    }));

    setLanguage(newLanguage);

    setCode(codeByLanguage[newLanguage] || "");
  };

  const scrollToTestCases = () => {
    testCasesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setTimeout(() => {
      testCasesComponentRef.current?.scrollToResults();
    }, 100);
  };

  const handleRun = async () => {
    try {
      setIsRunning(true);
      setRunError(null);
      setRunResult(null);

      const response = await runCode({
        code,
        language,
        input: isCustomInputMode
          ? customInput
          : testCases[activeTestCase]?.input || "",
        contestId,
        questionId: problemId,
      });

      if (response.body.error) {
        setRunError(response.body.error);
      } else {
        setRunResult(response.body.output);
      }
    } catch (error) {
      setRunError("Failed to run code. Please try again.");
      console.error("Run error:", error);
    } finally {
      setIsRunning(false);
      setTimeout(scrollToTestCases, 100);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmissionResult(null);
      setSubmittedCode(code);
      setSubmittedLanguage(language);

      const response = await submitCode({
        code,
        language,
        contestId,
        questionId: problemId,
      });

      if (response.status != "ACCEPTED") {
        setSubmissionResult({
          status: response.status as
            | "ACCEPTED"
            | "WRONG_ANSWER"
            | "RUNTIME_ERROR"
            | "COMPILATION_ERROR",
          runtime: response.executionTime || 0,
          message: "Failed to submit code. Please try again.",
          submissionId: response.submissionId,
          testCasesPassed: response.testCasesPassed,
          totalTestCases: response.totalTestCases,
          executionTime: response.executionTime,
          failedTestCase: response.failedTestCase,
          score: response.score,
        });
      } else {
        setSubmissionResult({
          status: response.status,
          runtime: response.executionTime || 0,
          message: "Submitted successfully",
          submissionId: response.submissionId,
          testCasesPassed: response.testCasesPassed,
          totalTestCases: response.totalTestCases,
          executionTime: response.executionTime,
          failedTestCase: response.failedTestCase,
          score: response.score,
        });
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 8000);
      }
      setShowSubmissionResult(true);
    } catch (error) {
      setSubmissionResult({
        status: "RUNTIME_ERROR",
        runtime: 0,
        message: "Failed to run. Please try again.",
      });
      setShowSubmissionResult(true);
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLanguageExtensionForResult = (lang: string) => {
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

  const renderDescriptionContent = () => {
    if (showSubmissionResult && submissionResult) {
      return (
        <div className="p-6">
          <button
            onClick={() => setShowSubmissionResult(false)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
          >
            <ArrowLeft size={20} />
            Back to Question
          </button>
          <div className="bg-[#292C33] rounded-lg p-6 shadow-md">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">
                  Submission Result
                </h3>
                <div
                  className={`px-3 py-1 rounded-md font-medium text-xl shadow-lg ${
                    submissionResult.status === "ACCEPTED"
                      ? "bg-green-900/30 text-green-400 shadow-green-500/50"
                      : submissionResult.status === "WRONG_ANSWER"
                        ? "bg-red-900/30 text-red-400 shadow-red-500/50"
                        : submissionResult.status === "RUNTIME_ERROR"
                          ? "bg-orange-900/30 text-orange-400 shadow-orange-500/50"
                          : "bg-yellow-900/30 text-yellow-400 shadow-yellow-500/50"
                  }`}
                >
                  {submissionResult.status.replace("_", " ")}
                </div>
              </div>

              {submissionResult.testCasesPassed !== undefined &&
                submissionResult.totalTestCases !== undefined && (
                  <div className="mt-2 mb-1">
                    <div className="text-sm text-gray-300 flex items-center justify-between mb-2">
                      <span>
                        Test Cases Passed:{" "}
                        <span className="font-semibold">
                          {submissionResult.testCasesPassed}/
                          {submissionResult.totalTestCases}
                        </span>
                      </span>
                      {submissionResult.score !== undefined && (
                        <span className="font-semibold text-blue-300">
                          Score: {submissionResult.score}
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          submissionResult.status === "ACCEPTED"
                            ? "bg-green-500"
                            : "bg-orange-500"
                        }`}
                        style={{
                          width: `${(submissionResult.testCasesPassed / submissionResult.totalTestCases) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

              <div className="flex flex-wrap items-center gap-4 text-sm">
                {submissionResult.executionTime !== undefined && (
                  <>
                    <div className="text-gray-300 flex items-center gap-2">
                      <span className="text-gray-500">Runtime:</span>{" "}
                      {submissionResult.executionTime} ms
                    </div>
                    <div className="h-4 border-r border-gray-700"></div>
                  </>
                )}
                <div className="text-gray-300 flex items-center gap-2">
                  <span className="text-gray-500">Language:</span>{" "}
                  {submittedLanguage.charAt(0).toUpperCase() +
                    submittedLanguage.slice(1)}
                </div>
              </div>

              <div className="mt-2 p-4 bg-[#1A1D24] rounded-lg border border-gray-800">
                <h4 className="text-gray-400 mb-2 text-sm font-medium">
                  Your Code
                </h4>
                <CodeMirror
                  value={submittedCode}
                  height="200px"
                  readOnly={true}
                  theme="dark"
                  extensions={[
                    getLanguageExtensionForResult(submittedLanguage),
                  ]}
                  className="bg-[#1C202A] rounded text-sm overflow-auto"
                />
              </div>

              {submissionResult.failedTestCase && (
                <div className="mt-2 p-4 bg-[#1A1D24] rounded-lg border border-red-900/30">
                  <h4 className="text-red-400 mb-2 text-sm font-medium">
                    Failed Test Case
                  </h4>
                  <pre className="bg-[#1C202A] p-3 rounded whitespace-pre-wrap font-mono text-sm text-white overflow-auto max-h-[200px]">
                    {submissionResult.failedTestCase}
                  </pre>
                </div>
              )}

              {submissionResult.message && (
                <div className="mt-2 p-4 bg-[#1A1D24] rounded-lg border border-gray-800">
                  <h4 className="text-gray-400 mb-2 text-sm font-medium">
                    Message
                  </h4>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">
                    {submissionResult.message}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return <Question problem={problem} isLoading={isLoading} />;
  };

  return (
    <div className="flex min-h-screen p-4 gap-4 flex-col lg:flex-row">
      {showConfetti && (
        <ReactConfetti
          recycle={false}
          numberOfPieces={500}
          gravity={0.15}
          width={window.innerWidth}
          height={window.innerHeight}
          style={{ zIndex: 1000 }}
          colors={["#22c55e"]}
        />
      )}

      <div className="overflow-scroll rounded-lg flex flex-col lg:w-[50%] w-full">
        <div className="mb-4">
          <Topbar
            onRun={handleRun}
            onSubmit={handleSubmit}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
            contestId={contestId}
          />
        </div>
        <div className="flex items-center justify-between p-4 sticky top-0 bg-[#1C202A] rounded-t-lg z-10">
          <div className="flex gap-4">
            <button
              className={`${activeTab === "description" ? "text-white bg-white/10 rounded-md px-2 py-1" : "text-gray-500"} hover:text-gray-300 font-bold text-lg`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`${activeTab === "submissions" ? "text-white bg-white/10 rounded-md px-2 py-1" : "text-gray-500"} hover:text-gray-300 font-bold text-lg`}
              onClick={() => setActiveTab("submissions")}
            >
              Submissions
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 bg-[#1C202A]">
          {activeTab === "description" ? (
            renderDescriptionContent()
          ) : (
            <Submissions problemId={problemId} />
          )}
        </div>
      </div>

      <div className="flex flex-col lg:w-[50%] w-full">
        <div className="flex flex-col h-full gap-4">
          <div>
            <CodeEditor
              code={code}
              setCode={setCode}
              language={language}
              onLanguageChange={handleLanguageChange}
              isSaving={isSaving}
            />
          </div>
          <div ref={testCasesRef} className="h-full">
            <TestCases
              ref={testCasesComponentRef}
              testCases={testCases}
              runResult={runResult}
              runError={runError}
              isRunning={isRunning}
              onCaseChange={setActiveTestCase}
              customInput={customInput}
              setCustomInput={setCustomInput}
              isCustomInputMode={isCustomInputMode}
              setIsCustomInputMode={setIsCustomInputMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestEditor;
