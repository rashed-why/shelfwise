"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState, type ReactNode } from "react";
import { AdminPagination } from "@/components/admin/admin-pagination";
import {
  AdminTable,
  adminTableCellClass,
} from "@/components/admin/admin-table";
import { formatAdminDate } from "@/lib/admin-format";
import type { AdminHoldRecord } from "@/lib/holds-api";
import { useCreateBorrowedMutation } from "@/lib/queries/borrowed";
import { useAdminHoldsQuery } from "@/lib/queries/holds";
import {
  notifyError,
  notifyErrorFromUnknown,
  notifySuccess,
} from "@/lib/toast";
import { useNotifyQueryError } from "@/lib/use-notify-query-error";

type HoldStatusUi = "active" | "returned" | "overdue";
type HoldListFilter = "all" | "active" | "overdue";

const HOLDS_PAGE_SIZE = 20;

function holdStatusFromApi(status: AdminHoldRecord["status"]): HoldStatusUi {
  return status.toLowerCase() as HoldStatusUi;
}

function statusBadgeClass(status: HoldStatusUi): string {
  switch (status) {
    case "returned":
      return "rounded-full bg-navy/10 px-2 py-0.5 text-xs font-medium text-navy";
    case "overdue":
      return "rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700";
    default:
      return "rounded-full bg-brand-teal/15 px-2 py-0.5 text-xs font-medium text-brand-teal";
  }
}

function statusLabel(status: HoldStatusUi): string {
  switch (status) {
    case "returned":
      return "Returned";
    case "overdue":
      return "Overdue";
    default:
      return "Active";
  }
}

function matchesHoldFilter(status: HoldStatusUi, filter: HoldListFilter): boolean {
  if (filter === "all") return true;
  return status === filter;
}

function AdminSessionGate({
  children,
}: {
  children: (accessToken: string) => ReactNode;
}) {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken;
  const isAdmin = session?.user.role === "ADMIN";

  useEffect(() => {
    if (session && !isAdmin) {
      notifyError("Admin access required to view hold requests.");
    }
  }, [session, isAdmin]);

  if (status === "loading") {
    return <p className="text-sm text-muted">Loading session…</p>;
  }

  if (!session || !accessToken) {
    return (
      <p className="text-sm text-muted">
        <Link href="/login" className="font-medium text-secondary no-underline">
          Sign in
        </Link>{" "}
        as an admin to view hold requests.
      </p>
    );
  }

  if (!isAdmin) {
    return (
      <p className="text-sm text-muted">
        Admin access required to view hold requests.
      </p>
    );
  }

  return children(accessToken);
}

function AdminHoldList({ accessToken }: { accessToken: string }) {
  const { data: items = [], isLoading, isError, error } =
    useAdminHoldsQuery(accessToken);
  const createBorrowed = useCreateBorrowedMutation(accessToken);
  const [listFilter, setListFilter] = useState<HoldListFilter>("active");
  const [listPage, setListPage] = useState(1);

  useNotifyQueryError(isError, error, "Could not load holds.");

  function handleBookHold(hold: AdminHoldRecord) {
    createBorrowed.mutate(
      {
        userId: hold.userId,
        bookIds: [hold.bookId],
        dueAt: new Date(hold.dueAt).toISOString(),
      },
      {
        onSuccess: () => {
          notifySuccess(`Recorded borrow for “${hold.book.title}” (${hold.user.name}).`);
        },
        onError: (mutationError) => {
          notifyErrorFromUnknown(mutationError, "Could not record borrow.");
        },
      },
    );
  }

  if (isLoading) {
    return <p className="text-sm text-muted">Loading hold requests…</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-muted">
        Could not load hold requests. Try refreshing the page.
      </p>
    );
  }

  const filteredItems = items.filter((item) =>
    matchesHoldFilter(holdStatusFromApi(item.status), listFilter),
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / HOLDS_PAGE_SIZE),
  );
  const currentPage = Math.min(listPage, totalPages);
  const pageOffset = (currentPage - 1) * HOLDS_PAGE_SIZE;
  const paginatedItems = filteredItems.slice(
    pageOffset,
    pageOffset + HOLDS_PAGE_SIZE,
  );

  function changeListFilter(next: HoldListFilter) {
    setListFilter(next);
    setListPage(1);
  }

  const filterEmptyMessage =
    listFilter === "active"
      ? "No active holds."
      : listFilter === "overdue"
        ? "No overdue holds."
        : "No hold requests yet.";

  const filterButtonClass = (active: boolean) =>
    `rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
      active
        ? "border-brand-teal/40 bg-brand-teal/15 text-navy"
        : "border-border bg-white text-muted hover:border-brand-teal/30 hover:text-navy"
    }`;

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Loaded from <code className="text-xs">GET /holds</code> (admin JWT).
        </p>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter holds by status"
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
        caption="Hold requests"
        columns={["Book", "Patron", "Placed", "Due", "Status", "Actions"]}
        isEmpty={paginatedItems.length === 0}
        emptyMessage={filterEmptyMessage}
      >
        {paginatedItems.map((item) => (
          <tr key={item.id}>
            <td className={`${adminTableCellClass} font-medium`}>
              {item.book.title}
            </td>
            <td className={adminTableCellClass}>
              <span className="block">{item.user.name}</span>
              <span className="text-xs text-muted">{item.user.email}</span>
            </td>
            <td className={`${adminTableCellClass} text-muted`}>
              {formatAdminDate(item.createdAt)}
            </td>
            <td className={`${adminTableCellClass} text-muted`}>
              {formatAdminDate(item.dueAt)}
            </td>
            <td className={adminTableCellClass}>
              <span className={statusBadgeClass(holdStatusFromApi(item.status))}>
                {statusLabel(holdStatusFromApi(item.status))}
              </span>
            </td>
            <td className={adminTableCellClass}>
              {item.status === "RETURNED" ? (
                <span className="text-xs text-muted">—</span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleBookHold(item)}
                  disabled={createBorrowed.isPending}
                  className="text-xs font-medium text-secondary hover:text-brand-teal disabled:opacity-60"
                >
                  {createBorrowed.isPending &&
                  createBorrowed.variables?.bookIds[0] === item.bookId &&
                  createBorrowed.variables?.userId === item.userId
                    ? "Recording…"
                    : "Record borrow"}
                </button>
              )}
            </td>
          </tr>
        ))}
      </AdminTable>

      <AdminPagination
        page={currentPage}
        pageSize={HOLDS_PAGE_SIZE}
        totalItems={filteredItems.length}
        onPageChange={setListPage}
      />
    </section>
  );
}

export function AdminHoldsManagement() {
  return (
    <AdminSessionGate>
      {(accessToken) => <AdminHoldList accessToken={accessToken} />}
    </AdminSessionGate>
  );
}
