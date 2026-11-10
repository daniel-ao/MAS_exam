import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  block?: boolean;
  displayMode?: boolean;
  className?: string;
}

export const MathView: React.FC<MathViewProps> = ({ math, block = false, displayMode, className = '' }) => {
  const isBlock = displayMode !== undefined ? displayMode : block;
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: isBlock,
        throwOnError: false,
        strict: false
      });
    } catch (e) {
      console.error('KaTeX rendering error for:', math, e);
      return `<code class="text-rose-600 font-mono text-sm">${math}</code>`;
    }
  }, [math, isBlock]);

  return (
    <span
      className={`${isBlock ? 'block my-3 overflow-x-auto text-center' : 'inline-block mx-0.5'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MathView;


