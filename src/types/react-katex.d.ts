declare module 'react-katex' {
  import * as React from 'react';

  interface KaTeXProps {
    math: string;
    block?: boolean;
    errorColor?: string;
    renderError?: (error: Error | TypeError) => React.ReactNode;
    settings?: {
      strict?: boolean;
      throwOnError?: boolean;
      maxSize?: number;
      maxExpand?: number;
    };
  }

  export const InlineMath: React.FC<KaTeXProps>;
  export const BlockMath: React.FC<KaTeXProps>;
}
