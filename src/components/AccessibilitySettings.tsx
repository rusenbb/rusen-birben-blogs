'use client';

import { useEffect, useState } from 'react';
import { FaUniversalAccess } from 'react-icons/fa';
import { ThemeToggle } from './ThemeToggle';
import { FontSizeToggle } from './FontSizeToggle';
import styles from './AccessibilitySettings.module.css';

export function AccessibilitySettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check system preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      document.documentElement.setAttribute('data-reduced-motion', e.matches ? 'true' : 'false');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-reduced-motion', reducedMotion ? 'true' : 'false');
      localStorage.setItem('reduced-motion', reducedMotion ? 'true' : 'false');
    }
  }, [reducedMotion, mounted]);

  if (!mounted) {
    return <div className={styles.placeholder} />;
  }

  return (
    <div className={styles.container}>
      <button
        className={`${styles.trigger} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Accessibility settings"
        aria-expanded={isOpen}
      >
        <FaUniversalAccess />
      </button>
      
      {isOpen && (
        <div className={styles.panel}>
          <div className={styles.section}>
            <span className={styles.label}>Theme</span>
            <ThemeToggle />
          </div>
          
          <div className={styles.section}>
            <span className={styles.label}>Font Size</span>
            <FontSizeToggle />
          </div>
          
          <div className={styles.section}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className={styles.checkbox}
              />
              <span>Reduce motion</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
