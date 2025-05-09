import React, { useState } from "react";
import { Maximize2, Minimize2, ChevronLeft, ChevronRight } from "lucide-react";
import { Problem as SocketProblem } from "@/lib/socket";
import TopBar from "./TopBar";
import Header from "./Header";
import Question from "./Question";
// import Submissions from './submissionTab/Submissions';
import Editor from "./Editor";
import TestCases from "./TestCases";
// import SubmissionDetails from './submissionTab/SubmissionDetails';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setCurrentProblemIndex } from "@/features/battle/slices/battleSlice";
import { setActiveTab } from "@/features/battle/editor/slices/editorSlice";
import SubmissionTab from "./submissionTab/SubmissionTab";
import { TestCase } from "../api/problems";
import { GameEndModal } from "@/features/battle/components/GameEndModal";

interface EditorLayoutProps {
  questionData: SocketProblem;
  matchId: string;
  children: React.ReactNode;
}

const EditorLayout = ({ questionData, matchId }: EditorLayoutProps) => {
  const dispatch = useDispatch();
  const { activeTab } = useSelector((state: RootState) => state.editor);

  const [language, setLanguage] = useState("cpp");
  const [isDescriptionMaximized, setIsDescriptionMaximized] = useState(false);
  const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(false);
  const [isEditorMaximized] = useState(false);
  const [isTestCaseCollapsed, setIsTestCaseCollapsed] = useState(false);

  const handleProblemChange = (index: number) => {
    dispatch(setCurrentProblemIndex(index));
  };

  const tabs = [
    { id: "description", label: "Description" },
    { id: "submissions", label: "Submissions" },
  ] as const;

  return (
    <div className="flex flex-col bg-[#10141D] text-white min-h-screen ">
      <Header />

      <div className="mb-4 px-4 h-full">
        <TopBar
          matchId={matchId as string}
          input={questionData.testCases[0]?.input || ""}
          onProblemChange={handleProblemChange}
        />
      </div>

      <div className="flex-1 px-4 mb-4">
        <div
          className={`flex gap-4 ${isDescriptionMaximized ? "flex-col" : ""}`}
        >
          <div
            className={`bg-[#1A1D24] overflow-scroll rounded-lg flex flex-col ${
              isDescriptionMaximized
                ? "w-full"
                : isDescriptionCollapsed
                  ? "w-12"
                  : isEditorMaximized
                    ? "hidden"
                    : "w-1/2"
            }`}
          >
            <div className="flex items-center justify-between p-4 sticky top-0 bg-[#1C202A] z-10">
              <div
                className={`flex gap-4 ${isDescriptionCollapsed ? "hidden" : ""}`}
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`${activeTab === tab.id ? "text-white bg-white/10 rounded-md px-2 py-1" : "text-gray-500"} hover:text-gray-300 font-bold text-lg`}
                    onClick={() => dispatch(setActiveTab(tab.id))}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div
                className={`flex gap-2 ${isDescriptionCollapsed ? "flex-col [&>button]:rotate-90" : ""}`}
              >
                <button
                  className="p-1 hover:bg-[#292C33] rounded"
                  onClick={() =>
                    setIsDescriptionMaximized(!isDescriptionMaximized)
                  }
                >
                  {isDescriptionCollapsed ? null : isDescriptionMaximized ? (
                    <Minimize2 size={18} />
                  ) : (
                    <Maximize2 size={18} />
                  )}
                </button>
                <button
                  className="p-1 hover:bg-[#292C33] rounded"
                  onClick={() =>
                    setIsDescriptionCollapsed(!isDescriptionCollapsed)
                  }
                >
                  {isDescriptionMaximized ? null : isDescriptionCollapsed ? (
                    <ChevronRight size={18} />
                  ) : (
                    <ChevronLeft size={18} />
                  )}
                </button>
              </div>
            </div>

            <div
              className={`overflow-y-auto flex-1 ${isDescriptionCollapsed ? "hidden" : ""}`}
            >
              {activeTab === "description" ? (
                <div className="h-full">
                  <Question problem={questionData} />
                </div>
              ) : (
                activeTab === "submissions" && (
                  <div className="h-full">
                    <SubmissionTab matchId={matchId} />
                  </div>
                )
              )}
            </div>
          </div>

          <div
            className={`flex flex-col gap-4 fle ${
              isDescriptionMaximized
                ? "hidden"
                : isDescriptionCollapsed
                  ? "w-[calc(100%-56px)]"
                  : "w-1/2"
            }`}
          >
            <div className={`transition-all duration-300 h-1/2`}>
              <Editor
                language={
                  language as "c" | "cpp" | "python" | "java" | "javascript"
                }
                onLanguageChange={setLanguage}
                // onMaximize={setIsEditorMaximized}
              />
            </div>

            {/* TestCases container */}
            <div className={`transition-all duration-300 flex-1`}>
              <TestCases
                testCases={questionData.testCases as TestCase[]}
                isCollapsed={isTestCaseCollapsed}
                onCollapse={setIsTestCaseCollapsed}
                className={isEditorMaximized ? "hidden" : ""}
              />
            </div>
          </div>
        </div>
      </div>
      <GameEndModal />
    </div>
  );
};

export default EditorLayout;
