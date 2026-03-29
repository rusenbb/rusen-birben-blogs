'use client';

import { useState, ReactNode } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';

interface CodeBlockProps {
  children: ReactNode;
  className?: string;
  filename?: string;
  highlightLines?: string;
}

export function CodeBlock({ children, className, filename, highlightLines }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Extract language from className (e.g., "language-typescript" -> "typescript")
  const language = className?.replace('language-', '') || 'text';

  // Get the raw code text
  const codeText = extractText(children);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Parse highlight lines (e.g., "1,3-5,7" -> [1, 3, 4, 5, 7])
  const highlightedLines = parseHighlightLines(highlightLines);

  // Wrap lines with highlighting if needed
  const processedChildren = highlightLines
    ? wrapLinesWithHighlighting(children, highlightedLines)
    : children;

  return (
    <div className="code-block">
      <div className="code-block-header">
        <span className="code-block-filename">
          {filename || language}
        </span>
        <button
          className="code-block-copy"
          onClick={handleCopy}
          title="Copy code"
          aria-label="Copy code to clipboard"
        >
          {copied ? <FaCheck /> : <FaCopy />}
        </button>
      </div>
      <pre className={className}>
        <code className={className}>
          {processedChildren}
        </code>
      </pre>
    </div>
  );
}

function extractText(node: ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (!node) return '';

  if (Array.isArray(node)) {
    return node.map(extractText).join('');
  }

  if (typeof node === 'object' && 'props' in node) {
    return extractText((node as any).props.children);
  }

  return '';
}

function parseHighlightLines(highlightLines?: string): number[] {
  if (!highlightLines) return [];

  const lines: number[] = [];
  const parts = highlightLines.split(',');

  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      for (let i = start; i <= end; i++) {
        lines.push(i);
      }
    } else {
      lines.push(Number(part));
    }
  }

  return lines;
}

interface TextSegment {
  text: string;
  className?: string;
}

/**
 * Flattens a React element tree (e.g., hljs syntax spans) into a linear
 * sequence of text segments, each carrying the innermost applicable className.
 * This preserves syntax highlighting information while enabling line-based splitting.
 */
function flattenToSegments(node: ReactNode): TextSegment[] {
  if (typeof node === 'string') return [{ text: node }];
  if (typeof node === 'number') return [{ text: String(node) }];
  if (!node) return [];

  if (Array.isArray(node)) {
    return node.flatMap(flattenToSegments);
  }

  if (typeof node === 'object' && 'props' in node) {
    const { className, children } = (node as any).props;
    const childSegments = flattenToSegments(children);
    if (className) {
      return childSegments.map((seg: TextSegment) => ({
        text: seg.text,
        className: seg.className || className,
      }));
    }
    return childSegments;
  }

  return [];
}

/**
 * Splits syntax-highlighted children into lines and wraps highlighted lines,
 * preserving hljs className on each text segment.
 */
function wrapLinesWithHighlighting(children: ReactNode, highlightedLines: number[]): ReactNode {
  if (!children || highlightedLines.length === 0) return children;

  const segments = flattenToSegments(children);

  // Group segments into lines by splitting at newline characters
  const lines: TextSegment[][] = [[]];
  for (const segment of segments) {
    const parts = segment.text.split('\n');
    for (let i = 0; i < parts.length; i++) {
      if (i > 0) lines.push([]);
      if (parts[i]) {
        lines[lines.length - 1].push({
          text: parts[i],
          className: segment.className,
        });
      }
    }
  }

  return lines.map((lineSegments, index) => {
    const lineNumber = index + 1;
    const isHighlighted = highlightedLines.includes(lineNumber);

    return (
      <span
        key={lineNumber}
        className={isHighlighted ? 'hljs-line-highlighted' : undefined}
      >
        {lineSegments.map((seg, i) =>
          seg.className ? (
            <span key={i} className={seg.className}>{seg.text}</span>
          ) : (
            seg.text
          )
        )}
        {index < lines.length - 1 ? '\n' : ''}
      </span>
    );
  });
}
