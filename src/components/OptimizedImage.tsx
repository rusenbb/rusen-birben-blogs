'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './OptimizedImage.module.css';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill,
  priority = false,
  className,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75,
  placeholder,
  blurDataURL,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div 
        className={`${styles.error} ${className || ''}`}
        style={!fill ? { width, height } : undefined}
      >
        <span>Failed to load image</span>
      </div>
    );
  }

  return (
    <div 
      className={`${styles.container} ${className || ''}`}
      style={!fill ? { width, height } : undefined}
    >
      {isLoading && !priority && (
        <div className={styles.placeholder}>
          <div className={styles.spinner} />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        sizes={sizes}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        className={`${styles.image} ${isLoading ? styles.loading : styles.loaded}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setError(true);
        }}
      />
    </div>
  );
}

// Lightbox component for zooming images
export function LightboxImage({
  src,
  alt,
  ...props
}: Omit<OptimizedImageProps, 'fill'> & { src: string; alt: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div onClick={() => setIsOpen(true)} className={styles.lightboxTrigger}>
        <OptimizedImage src={src} alt={alt} {...props} />
      </div>
      
      {isOpen && (
        <div 
          className={styles.lightboxOverlay}
          onClick={() => setIsOpen(false)}
        >
          <button 
            className={styles.lightboxClose}
            onClick={() => setIsOpen(false)}
            aria-label="Close lightbox"
          >
            ×
          </button>
          <img 
            src={src} 
            alt={alt} 
            className={styles.lightboxImage}
          />
        </div>
      )}
    </>
  );
}
