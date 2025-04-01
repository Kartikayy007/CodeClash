'use client';

import React, { useCallback, useRef } from 'react';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { lintGutter, openLintPanel, closeLintPanel, nextDiagnostic, previousDiagnostic } from '@codemirror/lint';
import { indentUnit } from '@codemirror/language';
import { createSyntaxLinter, createErrorTheme } from '@/utils/editorUtils';
import { Loader2, Code2 } from 'lucide-react';
import { keymap } from '@codemirror/view';
import { Extension } from '@codemirror/state';
import { indentWithTab, indentSelection, selectAll } from '@codemirror/commands';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
  onLanguageChange?: (language: string) => void;
  isSaving?: boolean;
}

const CodeEditor = ({ code, setCode, language, onLanguageChange, isSaving = false }: CodeEditorProps) => {
  const editorRef = useRef<EditorView | null>(null);

  const getLanguageExtension = (lang: string) => {
    switch (lang) {
      case 'javascript':
        return javascript();
      case 'cpp':
        return cpp();
      case 'python':
        return python();
      case 'java':
        return java();
      default:
        return cpp();
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onLanguageChange) {
      const newLanguage = e.target.value;
      onLanguageChange(newLanguage);
    }
  };

  const formatCode = useCallback(() => {
    if (!editorRef.current) return;
    
    selectAll(editorRef.current);
    
    indentSelection(editorRef.current);
  }, []);

  const getLintExtensions = (): Extension[] => {
    const extensions: Extension[] = [
      lintGutter(),
      createSyntaxLinter(language),
      createErrorTheme(),
      keymap.of([
        { key: "F8", run: nextDiagnostic },
        { key: "Shift-F8", run: previousDiagnostic },
        { key: "Ctrl-Shift-m", mac: "Cmd-Shift-m", run: openLintPanel },
        { key: "Escape", run: closeLintPanel },
        indentWithTab
      ])
    ];
    
    return extensions;
  };

  return (
    <div className="h-[calc(100vh-30vh)] flex flex-col overflow-hidden rounded-lg bg-[#1C202A]">
      <div className="flex items-center justify-between p-2 bg-[#1A1D24]">
        <select
          className="bg-[#292C33] text-white px-3 py-1 rounded-lg outline-none"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="javascript">JavaScript</option>
        </select>
        
        <div className="flex items-center gap-2">
        {isSaving && (
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Loader2 size={12} className="animate-spin" />
              <span>Saving...</span>
            </div>
          )}
          <button
            onClick={formatCode}
            className="flex items-center gap-1 bg-[#292C33] hover:bg-[#353945] text-white px-3 py-1 rounded-lg transition-colors"
            title="Format code"
          >
            <Code2 size={14} />
            <span className="text-xs">Format</span>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <CodeMirror
          value={code}
          height="calc(100vh - 30vh)" 
          width="100%"
          theme="dark"
          style={{ flex: 1 }}
          onChange={setCode}
          onCreateEditor={(view) => {
            editorRef.current = view;
          }}
          extensions={[
            getLanguageExtension(language),
            ...getLintExtensions(),
            indentUnit.of("    ")
          ]}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            history: true,
            foldGutter: true,
            drawSelection: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            syntaxHighlighting: true,
            bracketMatching: true,
            closeBrackets: true,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            defaultKeymap: true,
            searchKeymap: true,
            historyKeymap: true,
            foldKeymap: true,
            lintKeymap: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor; 