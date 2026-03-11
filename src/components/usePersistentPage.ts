'use client';

import { useEffect, useState } from 'react';

export function usePersistentPage(key: string, initialPage = 1) {
  const [page, setPage] = useState(initialPage);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const savedValue = Number(localStorage.getItem(key));

    if (Number.isInteger(savedValue) && savedValue >= 1) {
      setPage(savedValue);
    }

    setIsHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    localStorage.setItem(key, String(page));
  }, [isHydrated, key, page]);

  return [page, setPage] as const;
}
