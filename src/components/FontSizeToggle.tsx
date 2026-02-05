'use client';

import { useEffect, useState } from 'react';
import { FaFont } from 'react-icons/fa';
import styles from './FontSizeToggle.module.css';

type FontSize = 'small' | 'normal' | 'large' | 'xlarge';

const fontSizeMap: Record<FontSize, string> = {
  small: '14px',
  normal: '16px',
  large: '18px',
  xlarge: '20px',
};

export function FontSizeToggle() {
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('font-size') as FontSize;
    if (saved && fontSizeMap[saved]) {
      setFontSize(saved);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.style.fontSize = fontSizeMap[fontSize];
      localStorage.setItem('font-size', fontSize);
    }
  }, [fontSize, mounted]);

  if (!mounted) {
    return <div className={styles.placeholder} />;
  }

  const sizes: FontSize[] = ['small', 'normal', 'large', 'xlarge'];
  const currentIndex = sizes.indexOf(fontSize);

  const cycleFontSize = () => {
    const nextIndex = (currentIndex + 1) % sizes.length;
    setFontSize(sizes[nextIndex]);
  };

  return (
    <button
      className={styles.button}
      onClick={cycleFontSize}
      title={`Font size: ${fontSize}`}
      aria-label={`Current font size: ${fontSize}. Click to change.`}
    >
      <FaFont />
      <span className={styles.label}>A</span>
    </button>
  );
}
