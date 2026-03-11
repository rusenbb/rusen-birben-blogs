import Link from 'next/link';
import styles from './Pagination.module.css';

interface PaginationProps {
  basePath: string;
  currentPage: number;
  totalPages: number;
  pageParam?: string;
  anchor?: string;
  otherParams?: Record<string, string | number | undefined>;
  labels: {
    previous: string;
    next: string;
    page: string;
    navigation: string;
  };
}

function buildPageHref(
  basePath: string,
  targetPage: number,
  pageParam: string,
  anchor?: string,
  otherParams?: Record<string, string | number | undefined>
) {
  const params = new URLSearchParams();

  Object.entries(otherParams || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  });

  if (targetPage > 1) {
    params.set(pageParam, String(targetPage));
  } else {
    params.delete(pageParam);
  }

  const query = params.toString();
  return `${basePath}${query ? `?${query}` : ''}${anchor || ''}`;
}

export function Pagination({
  basePath,
  currentPage,
  totalPages,
  pageParam = 'page',
  anchor,
  otherParams,
  labels,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const prevHref = currentPage > 1
    ? buildPageHref(basePath, currentPage - 1, pageParam, anchor, otherParams)
    : null;
  const nextHref = currentPage < totalPages
    ? buildPageHref(basePath, currentPage + 1, pageParam, anchor, otherParams)
    : null;

  return (
    <nav className={styles.pagination} aria-label={labels.navigation}>
      {prevHref ? (
        <Link href={prevHref} className={styles.arrowLink}>
          {labels.previous}
        </Link>
      ) : (
        <span className={`${styles.arrowLink} ${styles.disabled}`} aria-hidden="true">
          {labels.previous}
        </span>
      )}

      <div className={styles.pages}>
        {pageNumbers.map((pageNumber) => {
          const href = buildPageHref(basePath, pageNumber, pageParam, anchor, otherParams);
          const isCurrent = pageNumber === currentPage;

          return isCurrent ? (
            <span
              key={pageNumber}
              className={`${styles.pageLink} ${styles.current}`}
              aria-current="page"
              aria-label={`${labels.page} ${pageNumber}`}
            >
              {pageNumber}
            </span>
          ) : (
            <Link key={pageNumber} href={href} className={styles.pageLink} aria-label={`${labels.page} ${pageNumber}`}>
              {pageNumber}
            </Link>
          );
        })}
      </div>

      {nextHref ? (
        <Link href={nextHref} className={styles.arrowLink}>
          {labels.next}
        </Link>
      ) : (
        <span className={`${styles.arrowLink} ${styles.disabled}`} aria-hidden="true">
          {labels.next}
        </span>
      )}
    </nav>
  );
}
