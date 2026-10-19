"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminPagination } from "@/components/admin/admin-pagination";
import {
  AdminTable,
  adminTableCellClass,
} from "@/components/admin/admin-table";
import { loadAdminBorrowedByEmail } from "@/lib/admin-borrowed-storage";
import { formatAdminDate } from "@/lib/admin-format";
import type { AdminUserRow } from "@/lib/admin-users-demo";

const HISTORY_PAGE_SIZE = 20;

function roleBadgeClass(role: AdminUserRow["role"]): string {
  return role === "ADMIN"
    ? "rounded-full bg-brand-teal/15 px-2 py-0.5 text-xs font-medium text-brand-teal"
    : "rounded-full bg-navy/10 px-2 py-0.5 text-xs font-medium text-navy";
}

function statusBadgeClass(
  status: "active" | "returned" | "overdue",
): string {
  switch (status) {
    case "returned":
      return "rounded-full bg-navy/10 px-2 py-0.5 text-xs font-medium text-navy";
    case "overdue":
      return "rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700";
    default:
      return "rounded-full bg-brand-teal/15 px-2 py-0.5 text-xs font-medium text-brand-teal";
  }
}

function statusLabel(status: "active" | "returned" | "overdue"): string {
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
  user: AdminUserRow;
};

export function AdminUserBorrowHistory({ user }: AdminUserBorrowHistoryProps) {
  const [page, setPage] = useState(1);
  const history = loadAdminBorrowedByEmail(user.email);

  const totalPages = Math.max(1, Math.ceil(history.length / HISTORY_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const offset = (currentPage - 1) * HISTORY_PAGE_SIZE;
  const pageItems = history.slice(offset, offset + HISTORY_PAGE_SIZE);

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
            Joined {formatAdminDate(user.joinedAt)}
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
          {pageItems.map((item) => (
            <tr key={item.id}>
              <td className={`${adminTableCellClass} font-medium`}>
                {item.bookTitle}
              </td>
              <td className={`${adminTableCellClass} text-muted`}>
                {formatAdminDate(item.borrowedAt)}
              </td>
              <td className={`${adminTableCellClass} text-muted`}>
                {formatAdminDate(item.dueAt)}
              </td>
              <td className={`${adminTableCellClass} text-muted`}>
                {item.returnedAt
                  ? formatAdminDate(item.returnedAt)
                  : "—"}
              </td>
              <td className={adminTableCellClass}>
                <span className={statusBadgeClass(item.status)}>
                  {statusLabel(item.status)}
                </span>
              </td>
            </tr>
          ))}
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
