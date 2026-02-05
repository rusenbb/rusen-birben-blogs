'use client';

import { useState } from 'react';
import styles from './YouTubeEmbed.module.css';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  start?: number;
}

export function YouTubeEmbed({ videoId, title = 'YouTube video', start }: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}${start ? `?start=${start}` : ''}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  
  return (
    <div className={styles.container}>
      {!isLoaded ? (
        <button 
          className={styles.thumbnail}
          onClick={() => setIsLoaded(true)}
          aria-label={`Play ${title}`}
          style={{ backgroundImage: `url(${thumbnailUrl})` }}
        >
          <div className={styles.playButton}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      ) : (
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={styles.iframe}
        />
      )}
    </div>
  );
}
