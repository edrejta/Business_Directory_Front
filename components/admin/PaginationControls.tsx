"use client";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  label: string;
};

export default function PaginationControls({ currentPage, totalPages, onPageChange, label }: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const visiblePages = pages.filter((page) => Math.abs(page - currentPage) <= 1 || page === 1 || page === totalPages);

  return (
    <nav className="mt-3" aria-label={label}>
      <ul className="pagination pagination-sm mb-0 flex-wrap">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            type="button"
            className="page-link"
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
              <li className="page-item disabled" aria-hidden="true" key={`gap-${previousPage}-${page}`}>
                <span className="page-link">...</span>
              </li>,
            );
          }

          items.push(
            <li key={page} className={`page-item ${page === currentPage ? "active" : ""}`}>
              <button type="button" className="page-link" onClick={() => onPageChange(page)}>
                {page}
              </button>
            </li>,
          );

          return items;
        })}

        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button
            type="button"
            className="page-link"
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
