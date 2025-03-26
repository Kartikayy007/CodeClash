import React from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

/**
 * Parses constraints text and renders LaTeX expressions properly
 * @param constraints - String containing constraint text with possible LaTeX expressions
 * @returns JSX Element with formatted constraints
 */
export const parseConstraints = (constraints: string) => {
  if (!constraints) return null;
  
  
  const lines = constraints.split('\n').filter(line => line.trim() !== '');
  
  return (
    <div className="space-y-3">
      {lines.map((line, index) => {
        if (line.trim().startsWith('$') && line.trim().endsWith('$')) {
          const mathContent = line.trim().slice(1, -1);
          return (
            <div key={index} className="flex items-center gap-2 ml-4">
              <span className="text-gray-300 text-lg">•</span>
              <InlineMath math={mathContent} />
            </div>
          );
        }
        
        const latexPatterns = /\\le|\\ge|\\cdot|\\times|\\in|\^|\\leq|\\geq|\\neq|\\equiv|\\approx/i;
        
        if (latexPatterns.test(line)) {
          return (
            <div key={index} className="flex items-center gap-2 ml-4">
              <span className="text-gray-300 text-lg">•</span>
              <InlineMath math={line} />
            </div>
          );
        }
        
        if (line.includes('$')) {
          const parts = [];
          let currentText = '';
          let inMath = false;
          
          for (let i = 0; i < line.length; i++) {
            if (line[i] === '$') {
              if (inMath) {
                inMath = false;
                parts.push({ type: 'math', content: currentText });
                currentText = '';
              } else {
                inMath = true;
                if (currentText) {
                  parts.push({ type: 'text', content: currentText });
                  currentText = '';
                }
              }
            } else {
              currentText += line[i];
            }
          }
          
          if (currentText) {
            parts.push({ type: inMath ? 'math' : 'text', content: currentText });
          }
          
          return (
            <div key={index} className="flex items-start gap-2 ml-4">
              <span className="text-gray-300 text-lg mt-1">•</span>
              <div className="text-gray-300">
                {parts.map((part, pIndex) => 
                  part.type === 'math' 
                    ? <InlineMath key={pIndex} math={part.content} /> 
                    : <span key={pIndex}>{part.content}</span>
                )}
              </div>
            </div>
          );
        }
        
        return (
          <div key={index} className="flex items-center gap-2 ml-4">
            <span className="text-gray-300 text-lg">•</span>
            <span className="text-gray-300">{line}</span>
          </div>
        );
      })}
    </div>
  );
}; 