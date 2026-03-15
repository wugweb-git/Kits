import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange?: (page: number) => void;
  size?: 'sm' | 'md' | 'lg';
  showFirstLast?: boolean;
  showEllipsis?: boolean;
  maxVisible?: number;
  disabled?: boolean;
  ariaLabel?: string;
  compact?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onChange,
  size = 'md',
  showFirstLast = false,
  showEllipsis = true,
  maxVisible = 7,
  disabled = false,
  ariaLabel = 'Pagination',
  compact = false,
}: PaginationProps) {
  const handlePageChange = (page: number) => {
    if (disabled || page < 1 || page > totalPages || page === currentPage) return;
    onChange?.(page);
  };

  const handleKeyDown = (e: React.KeyboardEvent, page: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePageChange(page);
    }
  };

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    if (totalPages <= maxVisible || !showEllipsis) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | 'ellipsis')[] = [];
    const halfVisible = Math.floor(maxVisible / 2);

    if (currentPage <= halfVisible + 1) {
      // Near start
      for (let i = 1; i <= maxVisible - 2; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - halfVisible) {
      // Near end
      pages.push(1);
      pages.push('ellipsis');
      for (let i = totalPages - (maxVisible - 3); i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Middle
      pages.push(1);
      pages.push('ellipsis');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(totalPages);
    }

    return pages;
  };

  const sizeClasses = {
    sm: 'pagination-sm',
    md: 'pagination-md',
    lg: 'pagination-lg',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  const iconSize = iconSizes[size];

  // Compact mode - just prev, current indicator, next
  if (compact) {
    return (
      <nav
        aria-label={ariaLabel}
        className={`pagination-nav ${sizeClasses[size]}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-2)',
          fontFamily: 'Inter Tight, sans-serif',
        }}
      >
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={disabled || currentPage === 1}
          aria-label="Previous page"
          className="pagination-button pagination-nav-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: size === 'sm' ? '4px' : size === 'md' ? '6px' : '8px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: disabled || currentPage === 1 ? 'var(--muted-foreground)' : 'var(--foreground)',
            cursor: disabled || currentPage === 1 ? 'not-allowed' : 'pointer',
            transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
            opacity: disabled || currentPage === 1 ? 0.4 : 1,
          }}
        >
          <ChevronLeft size={iconSize} />
        </button>

        <div
          style={{
            fontSize: size === 'sm' ? 'var(--text-xs)' : size === 'md' ? 'var(--text-sm)' : 'var(--text-base)',
            color: 'var(--foreground)',
            fontWeight: 'var(--font-weight-medium)',
            whiteSpace: 'nowrap',
          }}
        >
          Page {currentPage} of {totalPages}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={disabled || currentPage === totalPages}
          aria-label="Next page"
          className="pagination-button pagination-nav-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: size === 'sm' ? '4px' : size === 'md' ? '6px' : '8px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: disabled || currentPage === totalPages ? 'var(--muted-foreground)' : 'var(--foreground)',
            cursor: disabled || currentPage === totalPages ? 'not-allowed' : 'pointer',
            transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
            opacity: disabled || currentPage === totalPages ? 0.4 : 1,
          }}
        >
          <ChevronRight size={iconSize} />
        </button>
      </nav>
    );
  }

  const pages = getPageNumbers();

  return (
    <nav
      aria-label={ariaLabel}
      className={`pagination-nav ${sizeClasses[size]}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-1)',
        fontFamily: 'Inter Tight, sans-serif',
      }}
    >
      <style>{`
        .pagination-button {
          font-family: Inter Tight, sans-serif;
          transition: all var(--motion-duration-fast) var(--motion-easing-standard);
        }

        .pagination-button:hover:not(:disabled) {
          background: var(--surface-700);
          border-color: var(--accent);
        }

        .pagination-button:focus-visible {
          outline: 2px solid var(--ring);
          outline-offset: 2px;
        }

        .pagination-page-button {
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
        }

        .pagination-page-button:hover:not(:disabled):not(.active) {
          background: var(--surface-700);
          border-color: var(--border);
        }

        .pagination-page-button.active {
          background: var(--accent);
          color: var(--accent-foreground);
          border-color: var(--accent);
          font-weight: var(--font-weight-medium);
        }

        .pagination-page-button:disabled {
          cursor: not-allowed;
          opacity: 0.4;
        }

        .pagination-ellipsis {
          color: var(--muted-foreground);
          user-select: none;
        }
      `}</style>

      {/* First page button */}
      {showFirstLast && (
        <button
          onClick={() => handlePageChange(1)}
          disabled={disabled || currentPage === 1}
          aria-label="First page"
          className="pagination-button pagination-nav-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: size === 'sm' ? '4px' : size === 'md' ? '6px' : '8px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: disabled || currentPage === 1 ? 'var(--muted-foreground)' : 'var(--foreground)',
            cursor: disabled || currentPage === 1 ? 'not-allowed' : 'pointer',
            opacity: disabled || currentPage === 1 ? 0.4 : 1,
          }}
        >
          <ChevronsLeft size={iconSize} />
        </button>
      )}

      {/* Previous button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={disabled || currentPage === 1}
        aria-label="Previous page"
        className="pagination-button pagination-nav-button"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: size === 'sm' ? '4px' : size === 'md' ? '6px' : '8px',
          background: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          color: disabled || currentPage === 1 ? 'var(--muted-foreground)' : 'var(--foreground)',
          cursor: disabled || currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: disabled || currentPage === 1 ? 0.4 : 1,
        }}
      >
        <ChevronLeft size={iconSize} />
      </button>

      {/* Page numbers */}
      {pages.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <div
              key={`ellipsis-${index}`}
              className="pagination-ellipsis"
              style={{
                padding: size === 'sm' ? '4px 6px' : size === 'md' ? '6px 8px' : '8px 10px',
                fontSize: size === 'sm' ? 'var(--text-xs)' : size === 'md' ? 'var(--text-sm)' : 'var(--text-base)',
              }}
            >
              ...
            </div>
          );
        }

        const isActive = page === currentPage;

        return (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            onKeyDown={(e) => handleKeyDown(e, page)}
            disabled={disabled}
            aria-label={`Page ${page}`}
            aria-current={isActive ? 'page' : undefined}
            className={`pagination-button pagination-page-button ${isActive ? 'active' : ''}`}
            style={{
              padding: size === 'sm' ? '4px 8px' : size === 'md' ? '6px 10px' : '8px 12px',
              fontSize: size === 'sm' ? 'var(--text-xs)' : size === 'md' ? 'var(--text-sm)' : 'var(--text-base)',
              borderRadius: 'var(--radius-sm)',
              color: isActive ? 'var(--accent-foreground)' : 'var(--foreground)',
              minWidth: size === 'sm' ? '24px' : size === 'md' ? '28px' : '32px',
            }}
          >
            {page}
          </button>
        );
      })}

      {/* Next button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={disabled || currentPage === totalPages}
        aria-label="Next page"
        className="pagination-button pagination-nav-button"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: size === 'sm' ? '4px' : size === 'md' ? '6px' : '8px',
          background: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          color: disabled || currentPage === totalPages ? 'var(--muted-foreground)' : 'var(--foreground)',
          cursor: disabled || currentPage === totalPages ? 'not-allowed' : 'pointer',
          opacity: disabled || currentPage === totalPages ? 0.4 : 1,
        }}
      >
        <ChevronRight size={iconSize} />
      </button>

      {/* Last page button */}
      {showFirstLast && (
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={disabled || currentPage === totalPages}
          aria-label="Last page"
          className="pagination-button pagination-nav-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: size === 'sm' ? '4px' : size === 'md' ? '6px' : '8px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: disabled || currentPage === totalPages ? 'var(--muted-foreground)' : 'var(--foreground)',
            cursor: disabled || currentPage === totalPages ? 'not-allowed' : 'pointer',
            opacity: disabled || currentPage === totalPages ? 0.4 : 1,
          }}
        >
          <ChevronsRight size={iconSize} />
        </button>
      )}
    </nav>
  );
}
