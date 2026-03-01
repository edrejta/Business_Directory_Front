"use client";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  label: string;
};

const buttonBase =
  "inline-flex min-w-8 items-center justify-center rounded-md border border-[var(--coffee-border)] px-2 py-1 text-xs font-medium text-[var(--coffee-text)] transition-colors hover:bg-[var(--coffee-border)] disabled:cursor-not-allowed disabled:opacity-50";

export default function PaginationControls({ currentPage, totalPages, onPageChange, label }: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const visiblePages = pages.filter((page) => Math.abs(page - currentPage) <= 1 || page === 1 || page === totalPages);

  return (
    <nav className="mt-3" aria-label={label}>
      <ul className="flex flex-wrap items-center gap-1">
        <li>
          <button
            type="button"
            className={buttonBase}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </li>

        {visiblePages.flatMap((page, index) => {
          const previousPage = visiblePages[index - 1];
          const shouldRenderGap = typeof previousPage === "number" && page - previousPage > 1;
          const items = [];

          if (shouldRenderGap) {
            items.push(
              <li aria-hidden="true" key={`gap-${previousPage}-${page}`}>
                <span className="inline-flex min-w-8 items-center justify-center px-1 text-xs text-[var(--coffee-muted)]">...</span>
              </li>,
            );
          }

          items.push(
            <li key={page}>
              <button
                type="button"
                className={`${buttonBase} ${
                  page === currentPage
                    ? "border-[var(--coffee-primary)] bg-[var(--coffee-primary)] text-[var(--coffee-bg)] hover:bg-[var(--coffee-primary)]"
                    : ""
                }`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            </li>,
          );

          return items;
        })}

        <li>
          <button
            type="button"
            className={buttonBase}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}
