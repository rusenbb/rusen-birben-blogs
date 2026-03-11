import Link from 'next/link';
import styles from './Pagination.module.css';

interface PaginationLabels {
  previous: string;
  next: string;
  page: string;
  navigation: string;
}

interface SharedPaginationProps {
  currentPage: number;
  totalPages: number;
  labels: PaginationLabels;
}

interface LinkPaginationProps extends SharedPaginationProps {
  getHref: (pageNumber: number) => string;
  onPageChange?: never;
}

interface ButtonPaginationProps extends SharedPaginationProps {
  onPageChange: (pageNumber: number) => void;
  getHref?: never;
}

type PaginationProps = LinkPaginationProps | ButtonPaginationProps;

function hasHrefBuilder(props: PaginationProps): props is LinkPaginationProps {
  return typeof props.getHref === 'function';
}

export function Pagination(props: PaginationProps) {
  const { currentPage, totalPages, labels } = props;

  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const renderPageControl = (pageNumber: number) => {
    const isCurrent = pageNumber === currentPage;
    const className = `${styles.pageLink} ${isCurrent ? styles.current : ''}`.trim();
    const ariaLabel = `${labels.page} ${pageNumber}`;

    if (hasHrefBuilder(props)) {
      return isCurrent ? (
        <span key={pageNumber} className={className} aria-current="page" aria-label={ariaLabel}>
          {pageNumber}
        </span>
      ) : (
        <Link key={pageNumber} href={props.getHref(pageNumber)} className={styles.pageLink} aria-label={ariaLabel}>
          {pageNumber}
        </Link>
      );
    }

    return (
      <button
        key={pageNumber}
        type="button"
        className={className}
        onClick={() => props.onPageChange(pageNumber)}
        aria-current={isCurrent ? 'page' : undefined}
        aria-label={ariaLabel}
      >
        {pageNumber}
      </button>
    );
  };

  const renderEdgeControl = (direction: 'previous' | 'next') => {
    const isPrevious = direction === 'previous';
    const label = isPrevious ? labels.previous : labels.next;
    const targetPage = isPrevious ? currentPage - 1 : currentPage + 1;
    const isDisabled = isPrevious ? !hasPrev : !hasNext;
    const className = `${styles.arrowLink} ${isDisabled ? styles.disabled : ''}`.trim();

    if (hasHrefBuilder(props)) {
      return isDisabled ? (
        <span className={className} aria-hidden="true">
          {label}
        </span>
      ) : (
        <Link href={props.getHref(targetPage)} className={styles.arrowLink}>
          {label}
        </Link>
      );
    }

    return (
      <button
        type="button"
        className={className}
        onClick={() => props.onPageChange(targetPage)}
        disabled={isDisabled}
      >
        {label}
      </button>
    );
  };

  return (
    <nav className={styles.pagination} aria-label={labels.navigation}>
      {renderEdgeControl('previous')}

      <div className={styles.pages}>
        {pageNumbers.map((pageNumber) => renderPageControl(pageNumber))}
      </div>

      {renderEdgeControl('next')}
    </nav>
  );
}
