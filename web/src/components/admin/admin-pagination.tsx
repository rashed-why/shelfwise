type AdminPaginationProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
};

const navButtonClass =
  "rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-medium text-navy transition-colors hover:border-brand-teal/30 disabled:cursor-not-allowed disabled:opacity-50";

export function AdminPagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
}: AdminPaginationProps) {
  if (totalItems === 0) {
    return null;
  }

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-3 pt-3"
      aria-label="Pagination"
    >
      <p className="text-sm text-muted">
        Showing {start}–{end} of {totalItems}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={navButtonClass}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        <span className="min-w-[6rem] text-center text-sm text-muted">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          className={navButtonClass}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </nav>
  );
}
