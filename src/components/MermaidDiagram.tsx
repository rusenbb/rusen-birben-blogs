'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    const renderDiagram = async () => {
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'strict',
        });

        const { svg } = await mermaid.render(`mermaid-${Date.now()}`, chart);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (error) {
        console.error('Failed to render Mermaid diagram:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<pre style="color: red;">Error rendering diagram</pre>`;
        }
      }
    };

    renderDiagram();
  }, [chart, isClient]);

  if (!isClient) {
    return (
      <div className="mermaid">
        <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>
          Loading diagram...
        </div>
      </div>
    );
  }

  return (
    <div className="mermaid" ref={containerRef}>
      <pre style={{ display: 'none' }}>{chart}</pre>
    </div>
  );
}
