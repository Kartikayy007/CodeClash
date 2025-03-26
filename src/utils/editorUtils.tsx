import { linter, Diagnostic } from '@codemirror/lint';
import { syntaxTree } from '@codemirror/language';
import { EditorView } from '@codemirror/view';

/**
 * Creates a syntax linter for CodeMirror editor
 * @param language - The programming language being edited
 * @returns A linter extension for CodeMirror
 */
export const createSyntaxLinter = (language: string) => {
  return linter(view => {
    const diagnostics: Diagnostic[] = [];
    
    const tree = syntaxTree(view.state);
    tree.cursor().iterate(node => {
      if (node.type.isError) {
        const start = node.from;
        const end = node.to === start ? start + 1 : node.to;
        
        diagnostics.push({
          from: start,
          to: end,
          severity: 'error',
          message: 'Syntax error',
          source: language
        });
      }
    });
    
    const content = view.state.doc.toString();
    const brackets: Record<string, string> = { '(': ')', '{': '}', '[': ']' };
    const stack: Array<{char: string, pos: number}> = [];
    
    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      
      if (Object.keys(brackets).includes(char)) {
        stack.push({ char, pos: i });
      } else if (Object.values(brackets).includes(char)) {
        const expectedOpeningEntries = Object.entries(brackets).filter(([, v]) => v === char);
        const expectedOpening = expectedOpeningEntries.length > 0 ? expectedOpeningEntries[0][0] : '';
        
        if (stack.length === 0 || stack[stack.length - 1].char !== expectedOpening) {
          diagnostics.push({
            from: i,
            to: i + 1,
            severity: 'error',
            message: `Unmatched closing ${char}`,
            source: language
          });
        } else {
          stack.pop();
        }
      }
    }
    
    stack.forEach(({char, pos}) => {
      diagnostics.push({
        from: pos,
        to: pos + 1,
        severity: 'error',
        message: `Unclosed ${char}`,
        source: language
      });
    });
    
    return diagnostics;
  });
};

/**
 * Creates a custom error theme for CodeMirror editor
 * @returns A theme extension for CodeMirror
 */
export const createErrorTheme = () => {
  return EditorView.theme({
    ".cm-diagnosticUnderline": {
      backgroundImage: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"6\" height=\"3\"><path fill=\"red\" d=\"M0,2.5 C1,1.5 2,0.5 3,1.5 S5,3.5 6,2.5\"/></svg>')",
      backgroundPosition: "bottom",
      backgroundRepeat: "repeat-x",
      paddingBottom: "3px"
    },
    ".cm-gutterElement.cm-activeLineGutter.cm-lint-marker-error": {
      color: "#f44336",
      fontWeight: "bold"
    },
    ".cm-tooltip-lint": {
      backgroundColor: "#1C202A",
      border: "1px solid #292C33",
      borderRadius: "4px",
      padding: "4px 8px"
    },
    ".cm-diagnostic": {
      padding: "3px 6px"
    },
    ".cm-diagnostic-error": {
      backgroundColor: "rgba(244, 67, 54, 0.1)",
      border: "none",
      borderLeft: "2px solid #f44336"
    }
  });
}; 