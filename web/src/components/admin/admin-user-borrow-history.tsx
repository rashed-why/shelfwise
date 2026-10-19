"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { AdminPagination } from "@/components/admin/admin-pagination";
import {
  AdminTable,
  adminTableCellClass,
} from "@/components/admin/admin-table";
import type { BorrowedRecord } from "@/lib/borrowed-api";
import { formatAdminDate } from "@/lib/admin-format";
import { useBorrowedQuery } from "@/lib/queries/borrowed";
import { useUserQuery } from "@/lib/queries/users";
import type { UserRecord } from "@/lib/users-api";
import { notifyError } from "@/lib/toast";
import { useNotifyQueryError } from "@/lib/use-notify-query-error";
const HISTORY_PAGE_SIZE = 20;

function roleBadgeClass(role: UserRecord["role"]): string {
  return role === "ADMIN"
    ? "rounded-full bg-brand-teal/15 px-2 py-0.5 text-xs font-medium text-brand-teal"
    : "rounded-full bg-navy/10 px-2 py-0.5 text-xs font-medium text-navy";
}

type BorrowedStatus = "active" | "returned" | "overdue";

function borrowStatusFromApi(status: BorrowedRecord["status"]): BorrowedStatus {
  return status.toLowerCase() as BorrowedStatus;
}

function statusBadgeClass(status: BorrowedStatus): string {
  switch (status) {
    case "returned":
      return "rounded-full bg-navy/10 px-2 py-0.5 text-xs font-medium text-navy";
    case "overdue":
      return "rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700";
    default:
      return "rounded-full bg-brand-teal/15 px-2 py-0.5 text-xs font-medium text-brand-teal";
  }
}

function statusLabel(status: BorrowedStatus): string {
  switch (status) {
    case "returned":
      return "Returned";
    case "overdue":
      return "Overdue";
    default:
      return "Active";
  }
}

type AdminUserBorrowHistoryProps = {
  userId: string;
};

export function AdminUserBorrowHistory({ userId }: AdminUserBorrowHistoryProps) {
  const [page, setPage] = useState(1);
  const { data: session, status: sessionStatus } = useSession();
  const accessToken = session?.accessToken;
  const isAdmin = session?.user.role === "ADMIN";

  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
    error: userFetchError,
  } = useUserQuery(isAdmin ? accessToken : undefined, userId);

  const {
    data: borrowed = [],
    isLoading: borrowedLoading,
    isError: borrowedError,
    error: borrowedFetchError,
  } = useBorrowedQuery(isAdmin ? accessToken : undefined);

  useEffect(() => {
    if (session && !isAdmin) {
      notifyError("Admin access required to view user details.");
    }
  }, [session, isAdmin]);

  useNotifyQueryError(userError, userFetchError, "Could not load user.");
  useNotifyQueryError(
    borrowedError,
    borrowedFetchError,
    "Could not load borrow history.",
  );

  const history = useMemo(
    () => borrowed.filter((item) => item.userId === userId),
    [borrowed, userId],
  );

  const totalPages = Math.max(1, Math.ceil(history.length / HISTORY_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const offset = (currentPage - 1) * HISTORY_PAGE_SIZE;
  const pageItems = history.slice(offset, offset + HISTORY_PAGE_SIZE);

  if (sessionStatus === "loading") {
    return <p className="text-sm text-muted">Loading session…</p>;
  }

  if (!session) {
    return (
      <p className="text-sm text-muted">
        <Link href="/login" className="font-medium text-secondary no-underline">
          Sign in
        </Link>{" "}
        as an admin to view user details.
      </p>
    );
  }

  if (!isAdmin) {
    return (
      <p className="text-sm text-muted">
        Admin access required to view user details.
      </p>
    );
  }

  if (userLoading || borrowedLoading) {
    return <p className="text-sm text-muted">Loading user details…</p>;
  }

  if (userError || !user) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/users/list"
          className="inline-block text-sm font-medium text-secondary no-underline hover:text-brand-teal"
        >
          ← Back to users
        </Link>
        <p className="text-sm text-muted">
          User not found or could not be loaded.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/users/list"
        className="inline-block text-sm font-medium text-secondary no-underline hover:text-brand-teal"
      >
        ← Back to users
      </Link>

      <div className="rounded-xl border border-border bg-white p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-navy">{user.name}</h2>
        <p className="mt-1 text-sm text-muted">{user.email}</p>
        <p className="mt-3">
          <span className={roleBadgeClass(user.role)}>{user.role}</span>
          <span className="ml-3 text-sm text-muted">
            Joined {formatAdminDate(user.createdAt)}
          </span>
        </p>
      </div>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-navy">Borrow history</h3>
        <AdminTable
          caption={`Borrow history for ${user.name}`}
          columns={["Book", "Borrowed", "Due", "Returned", "Status"]}
          isEmpty={pageItems.length === 0}
          emptyMessage="This user has no borrow records yet."
        >
          {pageItems.map((item) => {
            const status = borrowStatusFromApi(item.status);
            return (
              <tr key={item.id}>
                <td className={`${adminTableCellClass} font-medium`}>
                  {item.book.title}
                </td>
                <td className={`${adminTableCellClass} text-muted`}>
                  {formatAdminDate(item.createdAt)}
                </td>
                <td className={`${adminTableCellClass} text-muted`}>
                  {formatAdminDate(item.dueAt)}
                </td>
                <td className={`${adminTableCellClass} text-muted`}>
                  {item.returnedAt ? formatAdminDate(item.returnedAt) : "—"}
                </td>
                <td className={adminTableCellClass}>
                  <span className={statusBadgeClass(status)}>
                    {statusLabel(status)}
                  </span>
                </td>
              </tr>
            );
          })}
        </AdminTable>

        <AdminPagination
          page={currentPage}
          pageSize={HISTORY_PAGE_SIZE}
          totalItems={history.length}
          onPageChange={setPage}
        />
      </section>
    </div>
  );
}
