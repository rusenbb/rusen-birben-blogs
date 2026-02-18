'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { FaSun, FaMoon, FaDownload, FaTrash, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { renderMarkdown, defaultFrontmatter, serializeFrontmatter, parseFrontmatter } from '@/lib/markdown-client';
import type { Frontmatter } from '@/lib/markdown-client';
import postStyles from '@/app/[locale]/blog/[slug]/post.module.css';
import styles from './preview.module.css';

const STORAGE_KEY = 'preview-draft';

interface Draft {
  markdown: string;
  frontmatter: Frontmatter;
}

function loadDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveDraft(draft: Draft) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // quota exceeded — silently ignore
  }
}

export function PreviewEditor() {
  const [mounted, setMounted] = useState(false);
  const [markdown, setMarkdown] = useState('');
  const [fm, setFm] = useState<Frontmatter>(defaultFrontmatter);
  const [html, setHtml] = useState('');
  const [rendering, setRendering] = useState(false);
  const [showFrontmatter, setShowFrontmatter] = useState(false);
  const { theme, setTheme } = useTheme();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydration guard + load draft
  useEffect(() => {
    setMounted(true);
    const draft = loadDraft();
    if (draft) {
      setMarkdown(draft.markdown);
      setFm(draft.frontmatter);
    }
  }, []);

  // Debounced rendering
  const scheduleRender = useCallback((md: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (!md.trim()) {
        setHtml('');
        setRendering(false);
        return;
      }
      setRendering(true);
      try {
        const result = await renderMarkdown(md);
        setHtml(result);
      } catch {
        setHtml('<p style="color:red">Rendering error</p>');
      }
      setRendering(false);
    }, 300);
  }, []);

  // Re-render when markdown changes
  useEffect(() => {
    scheduleRender(markdown);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [markdown, scheduleRender]);

  // Persist to localStorage
  useEffect(() => {
    if (!mounted) return;
    saveDraft({ markdown, frontmatter: fm });
  }, [markdown, fm, mounted]);

  // Frontmatter field updater
  const updateFm = useCallback(<K extends keyof Frontmatter>(key: K, value: Frontmatter[K]) => {
    setFm(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleDownload = useCallback(() => {
    const front = serializeFrontmatter(fm);
    const file = front + '\n' + markdown;
    const slug = fm.title
      ? fm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      : 'draft';
    const blob = new Blob([file], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [fm, markdown]);

  const handleClear = useCallback(() => {
    if (!confirm('Clear draft? This cannot be undone.')) return;
    setMarkdown('');
    setFm(defaultFrontmatter());
    setHtml('');
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const handlePaste = useCallback((text: string) => {
    if (text.startsWith('---')) {
      const { frontmatter, content } = parseFrontmatter(text);
      setFm(frontmatter);
      setMarkdown(content);
      setShowFrontmatter(true);
    } else {
      setMarkdown(text);
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className={styles.page}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <span className={styles.toolbarTitle}>Preview</span>

        {rendering && (
          <span className={styles.renderingIndicator}>rendering...</span>
        )}

        <button
          className={`${styles.toolbarButton} ${showFrontmatter ? styles.toolbarButtonActive : ''}`}
          onClick={() => setShowFrontmatter(v => !v)}
        >
          {showFrontmatter ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
          Frontmatter
        </button>

        <button className={styles.toolbarButton} onClick={handleDownload}>
          <FaDownload size={10} />
          Download .md
        </button>

        <button className={styles.toolbarButton} onClick={handleClear}>
          <FaTrash size={10} />
          Clear
        </button>

        <button
          className={styles.toolbarButton}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle theme"
        >
          {theme === 'dark' ? <FaSun size={12} /> : <FaMoon size={12} />}
        </button>
      </div>

      {/* Frontmatter panel */}
      {showFrontmatter && (
        <div className={styles.frontmatterPanel}>
          <div className={styles.frontmatterGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Title</label>
              <input
                className={styles.fieldInput}
                value={fm.title}
                onChange={e => updateFm('title', e.target.value)}
                placeholder="Post title"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Date</label>
              <input
                className={styles.fieldInput}
                type="date"
                value={fm.date}
                onChange={e => updateFm('date', e.target.value)}
              />
            </div>
            <div className={`${styles.fieldGroup} ${styles.fieldFullWidth}`}>
              <label className={styles.fieldLabel}>Description</label>
              <input
                className={styles.fieldInput}
                value={fm.description}
                onChange={e => updateFm('description', e.target.value)}
                placeholder="Short description"
              />
            </div>
            <div className={`${styles.fieldGroup} ${styles.fieldFullWidth}`}>
              <label className={styles.fieldLabel}>Tags (comma-separated)</label>
              <input
                className={styles.fieldInput}
                value={fm.tags.join(', ')}
                onChange={e => {
                  const raw = e.target.value;
                  // Keep trailing empty entries so the comma stays while typing
                  const parts = raw.split(',').map(t => t.trim());
                  updateFm('tags', parts);
                }}
                onBlur={() => {
                  // Clean up empty entries when the field loses focus
                  updateFm('tags', fm.tags.filter(Boolean));
                }}
                placeholder="rust, webdev, tutorial"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Translation Key</label>
              <input
                className={styles.fieldInput}
                value={fm.translationKey}
                onChange={e => updateFm('translationKey', e.target.value)}
                placeholder="shared-key"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Series</label>
              <input
                className={styles.fieldInput}
                value={fm.series}
                onChange={e => updateFm('series', e.target.value)}
                placeholder="Series name"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Series Order</label>
              <input
                className={styles.fieldInput}
                type="number"
                value={fm.seriesOrder ?? ''}
                onChange={e => {
                  const v = e.target.value;
                  updateFm('seriesOrder', v === '' ? null : parseInt(v, 10));
                }}
                placeholder="1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Split pane */}
      <div className={styles.splitPane}>
        <div className={styles.editorPane}>
          <textarea
            className={styles.editor}
            value={markdown}
            onChange={e => setMarkdown(e.target.value)}
            onPaste={e => {
              const text = e.clipboardData.getData('text/plain');
              if (text.startsWith('---')) {
                e.preventDefault();
                handlePaste(text);
              }
            }}
            placeholder="Write markdown here..."
            spellCheck={false}
          />
        </div>
        <div className={styles.previewPane}>
          <div className={styles.previewInner}>
            {/* Post header from frontmatter */}
            {(fm.title || fm.description || fm.tags.some(Boolean)) && (
              <header className={postStyles.header}>
                {fm.title && <h1 className={postStyles.title}>{fm.title}</h1>}
                {fm.description && (
                  <p className={postStyles.description}>{fm.description}</p>
                )}
                {fm.tags.some(Boolean) && (
                  <div className={postStyles.tags}>
                    {fm.tags.filter(Boolean).map(tag => (
                      <span key={tag} className={postStyles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </header>
            )}

            {/* Rendered markdown */}
            <div
              className={postStyles.content}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
