'use client';

import { useRef, useEffect } from 'react';
import styles from './PostContent.module.css';

interface Props {
  html: string;
  className?: string;
}

export function PostContent({ html, className }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = contentRef.current;
    const tooltip = tooltipRef.current;
    if (!container || !tooltip) return;

    const show = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a.post-reference') as HTMLAnchorElement | null;
      if (!target) return;

      const title = target.dataset.refTitle || '';
      const description = target.dataset.refDescription || '';
      const series = target.dataset.refSeries || '';
      const order = target.dataset.refOrder || '';

      let html = `<strong class="${styles.tooltipTitle}">${title}</strong>`;
      if (description) {
        // Truncate long descriptions
        const truncated = description.length > 120
          ? description.slice(0, 120) + '...'
          : description;
        html += `<p class="${styles.tooltipDescription}">${truncated}</p>`;
      }
      if (series && order) {
        html += `<span class="${styles.tooltipBadge}">${series} · #${order}</span>`;
      }

      tooltip.innerHTML = html;
      tooltip.style.display = 'block';

      // Position above the reference link
      const rect = target.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();

      let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
      let top = rect.top - tooltipRect.height - 8;

      // Viewport clamping
      if (left < 8) left = 8;
      if (left + tooltipRect.width > window.innerWidth - 8) {
        left = window.innerWidth - tooltipRect.width - 8;
      }
      if (top < 8) {
        top = rect.bottom + 8; // flip below if no space above
      }

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top + window.scrollY}px`;
    };

    const hide = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (related?.closest('a.post-reference')) return;
      tooltip.style.display = 'none';
    };

    container.addEventListener('mouseover', show);
    container.addEventListener('mouseout', hide);

    return () => {
      container.removeEventListener('mouseover', show);
      container.removeEventListener('mouseout', hide);
    };
  }, []);

  return (
    <>
      <div
        ref={contentRef}
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <div
        ref={tooltipRef}
        className={styles.tooltip}
        style={{ display: 'none' }}
        aria-hidden="true"
      />
    </>
  );
}
