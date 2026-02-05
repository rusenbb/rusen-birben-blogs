'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { FaSun, FaMoon, FaDesktop } from 'react-icons/fa';
import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={styles.container}>
        <div className={styles.placeholder} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${theme === 'light' ? styles.active : ''}`}
        onClick={() => setTheme('light')}
        title="Light theme"
        aria-label="Switch to light theme"
      >
        <FaSun />
      </button>
      <button
        className={`${styles.button} ${theme === 'dark' ? styles.active : ''}`}
        onClick={() => setTheme('dark')}
        title="Dark theme"
        aria-label="Switch to dark theme"
      >
        <FaMoon />
      </button>
      <button
        className={`${styles.button} ${theme === 'system' ? styles.active : ''}`}
        onClick={() => setTheme('system')}
        title="System theme"
        aria-label="Use system theme"
      >
        <FaDesktop />
      </button>
    </div>
  );
}
