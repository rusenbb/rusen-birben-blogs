import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import { Callout } from './src/components/Callout';
import { CodeBlock } from './src/components/CodeBlock';
import { YouTubeEmbed } from './src/components/YouTubeEmbed';
import { MermaidDiagram } from './src/components/MermaidDiagram';
import { OptimizedImage } from './src/components/OptimizedImage';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Custom components available in MDX
    Callout,
    CodeBlock,
    YouTube: YouTubeEmbed,
    Mermaid: MermaidDiagram,
    Image: OptimizedImage,
    
    // Override default HTML elements
    img: (props) => (
      <OptimizedImage
        src={props.src || ''}
        alt={props.alt || ''}
        width={800}
        height={400}
        className="mdx-image"
      />
    ),
    pre: (props) => {
      const { children, ...rest } = props;
      return <CodeBlock {...rest}>{children}</CodeBlock>;
    },
    
    // Add styling to common elements
    h1: (props) => <h1 style={{ marginTop: '2rem', marginBottom: '1rem' }} {...props} />,
    h2: (props) => <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }} {...props} />,
    h3: (props) => <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }} {...props} />,
    p: (props) => <p style={{ marginBottom: '1rem', lineHeight: '1.8' }} {...props} />,
    ul: (props) => <ul style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }} {...props} />,
    ol: (props) => <ol style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }} {...props} />,
    li: (props) => <li style={{ marginBottom: '0.5rem' }} {...props} />,
    blockquote: (props) => (
      <blockquote
        style={{
          borderLeft: '4px solid var(--accent)',
          paddingLeft: '1rem',
          margin: '1.5rem 0',
          fontStyle: 'italic',
          color: 'var(--text-secondary)',
        }}
        {...props}
      />
    ),
    hr: () => <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid var(--border)' }} />,
    
    ...components,
  };
}
