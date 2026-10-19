"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { AdminPagination } from "@/components/admin/admin-pagination";
import {
  AdminTable,
  adminTableCellClass,
} from "@/components/admin/admin-table";
import {
  authFieldClass,
  authLabelClass,
  authSubmitClass,
} from "@/lib/auth-form-styles";
import {
  loadAdminBorrowed,
  markBorrowedReturned,
  saveAdminBorrowed,
  type AdminBorrowed,
} from "@/lib/admin-borrowed-storage";
import { formatAdminDate } from "@/lib/admin-format";

function statusBadgeClass(status: AdminBorrowed["status"]): string {
  switch (status) {
    case "returned":
      return "rounded-full bg-navy/10 px-2 py-0.5 text-xs font-medium text-navy";
    case "overdue":
      return "rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700";
    default:
      return "rounded-full bg-brand-teal/15 px-2 py-0.5 text-xs font-medium text-brand-teal";
  }
}

function statusLabel(status: AdminBorrowed["status"]): string {
  switch (status) {
    case "returned":
      return "Returned";
    case "overdue":
      return "Overdue";
    default:
      return "Active";
  }
}

type BorrowedView = "create" | "list";

type BorrowedListFilter = "all" | "active" | "overdue";

const BORROWED_PAGE_SIZE = 20;

type AdminBorrowedManagementProps = {
  view: BorrowedView;
};

function matchesBorrowedFilter(
  item: AdminBorrowed,
  filter: BorrowedListFilter,
): boolean {
  if (filter === "all") return true;
  return item.status === filter;
}

export function AdminBorrowedManagement({ view }: AdminBorrowedManagementProps) {
  const router = useRouter();
  const bookId = useId();
  const userNameId = useId();
  const userEmailId = useId();
  const dueId = useId();

  const [items, setItems] = useState<AdminBorrowed[]>(() => loadAdminBorrowed());
  const [listFilter, setListFilter] = useState<BorrowedListFilter>("all");
  const [listPage, setListPage] = useState(1);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function refresh() {
    setItems(loadAdminBorrowed());
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const result = saveAdminBorrowed({
      bookTitle: String(formData.get("bookTitle") ?? ""),
      userName: String(formData.get("userName") ?? ""),
      userEmail: String(formData.get("userEmail") ?? ""),
      dueAt: String(formData.get("dueAt") ?? ""),
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setStatus({ type: "error", text: result.error });
      return;
    }

    form.reset();
    refresh();
    router.push("/admin/borrowed/list");
  }

  function handleReturn(id: string) {
    const result = markBorrowedReturned(id);
    if (!result.ok) {
      setStatus({ type: "error", text: result.error });
      return;
    }
    setStatus({ type: "success", text: "Marked as returned." });
    refresh();
  }

  if (view === "create") {
    return (
      <form
        className="w-full space-y-4 rounded-xl border border-border bg-white p-5 sm:p-6"
        onSubmit={handleSubmit}
      >
        <div>
          <h2 className="text-lg font-semibold text-navy">Record a borrow</h2>
          <p className="mt-1 text-sm text-muted">
            Track who has a title out and when it is due. Stored in this browser
            only.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label htmlFor={bookId} className={authLabelClass}>
              Book title
            </label>
            <input
              id={bookId}
              name="bookTitle"
              required
              className={authFieldClass}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor={userNameId} className={authLabelClass}>
              Borrower name
            </label>
            <input
              id={userNameId}
              name="userName"
              required
              className={authFieldClass}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor={userEmailId} className={authLabelClass}>
              Borrower email
            </label>
            <input
              id={userEmailId}
              name="userEmail"
              type="email"
              required
              className={authFieldClass}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label htmlFor={dueId} className={authLabelClass}>
              Due date
            </label>
            <input
              id={dueId}
              name="dueAt"
              type="date"
              required
              className={authFieldClass}
            />
          </div>
        </div>

        {status ? (
          <p
            role="status"
            className={`text-sm ${status.type === "success" ? "text-brand-teal" : "text-red-600"}`}
          >
            {status.text}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`${authSubmitClass} max-w-xs`}
        >
          {isSubmitting ? "Saving…" : "Add borrow"}
        </button>
      </form>
    );
  }

  const filteredItems = items.filter((item) =>
    matchesBorrowedFilter(item, listFilter),
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / BORROWED_PAGE_SIZE),
  );
  const currentPage = Math.min(listPage, totalPages);
  const pageOffset = (currentPage - 1) * BORROWED_PAGE_SIZE;
  const paginatedItems = filteredItems.slice(
    pageOffset,
    pageOffset + BORROWED_PAGE_SIZE,
  );

  function changeListFilter(next: BorrowedListFilter) {
    setListFilter(next);
    setListPage(1);
  }

  const filterEmptyMessage =
    listFilter === "active"
      ? "No active borrows."
      : listFilter === "overdue"
        ? "No overdue borrows."
        : "No borrows recorded yet.";

  const filterButtonClass = (active: boolean) =>
    `rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${active
      ? "border-brand-teal/40 bg-brand-teal/15 text-navy"
      : "border-border bg-white text-muted hover:border-brand-teal/30 hover:text-navy"
    }`;

  return (
    <section className="space-y-3">
      {status ? (
        <p
          role="status"
          className={`text-sm ${status.type === "success" ? "text-brand-teal" : "text-red-600"}`}
        >
          {status.text}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-navy">Borrowed titles</h2>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter borrows by status"
        >
          <button
            type="button"
            className={filterButtonClass(listFilter === "all")}
            aria-pressed={listFilter === "all"}
            onClick={() => changeListFilter("all")}
          >
            All
          </button>
          <button
            type="button"
            className={filterButtonClass(listFilter === "active")}
            aria-pressed={listFilter === "active"}
            onClick={() => changeListFilter("active")}
          >
            Active
          </button>
          <button
            type="button"
            className={filterButtonClass(listFilter === "overdue")}
            aria-pressed={listFilter === "overdue"}
            onClick={() => changeListFilter("overdue")}
          >
            Overdue
          </button>
        </div>
      </div>

      <AdminTable
        caption="Borrowed books"
        columns={[
          "Book",
          "Borrower",
          "Borrowed",
          "Due",
          "Returned",
          "Status",
          "Actions",
        ]}
        isEmpty={paginatedItems.length === 0}
        emptyMessage={filterEmptyMessage}
      >
        {paginatedItems.map((item) => (
          <tr key={item.id}>
            <td className={`${adminTableCellClass} font-medium`}>
              {item.bookTitle}
            </td>
            <td className={adminTableCellClass}>
              <span className="block">{item.userName}</span>
              <span className="text-xs text-muted">{item.userEmail}</span>
            </td>
            <td className={`${adminTableCellClass} text-muted`}>
              {formatAdminDate(item.borrowedAt)}
            </td>
            <td className={`${adminTableCellClass} text-muted`}>
              {formatAdminDate(item.dueAt)}
            </td>
            <td className={`${adminTableCellClass} text-muted`}>
              {item.returnedAt ? formatAdminDate(item.returnedAt) : "—"}
            </td>
            <td className={adminTableCellClass}>
              <span className={statusBadgeClass(item.status)}>
                {statusLabel(item.status)}
              </span>
            </td>
            <td className={adminTableCellClass}>
              {item.status === "returned" ? (
                <span className="text-xs text-muted">—</span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleReturn(item.id)}
                  className="text-xs font-medium text-secondary hover:text-brand-teal"
                >
                  Mark returned
                </button>
              )}
            </td>
          </tr>
        ))}
      </AdminTable>

      <AdminPagination
        page={currentPage}
        pageSize={BORROWED_PAGE_SIZE}
        totalItems={filteredItems.length}
        onPageChange={setListPage}
      />
    </section>
  );
}
