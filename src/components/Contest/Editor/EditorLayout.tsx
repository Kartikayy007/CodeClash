"use client";

import React from "react";
import Topbar from "./Topbar";

interface EditorLayoutProps {
  children: React.ReactNode;
  topbarProps: {
    onRun: () => void;
    onSubmit: () => void;
    language: string;
    setLanguage: (lang: string) => void;
    contestId: string;
  };
}

const EditorLayout = ({ children, topbarProps }: EditorLayoutProps) => {
  return (
    <div className="flex flex-col h-screen">
      <Topbar {...topbarProps} />
      <div className="flex flex-1 overflow-hidden">{children}</div>
    </div>
  );
};

export default EditorLayout;
