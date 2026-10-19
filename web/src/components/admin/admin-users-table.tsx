"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { AdminTable, adminTableCellClass } from "@/components/admin/admin-table";
import { formatAdminDate } from "@/lib/admin-format";
import { useUsersQuery } from "@/lib/queries/users";
import { notifyError } from "@/lib/toast";
import { useNotifyQueryError } from "@/lib/use-notify-query-error";
import { useEffect } from "react";

function roleBadgeClass(role: "USER" | "ADMIN"): string {
  return role === "ADMIN"
    ? "rounded-full bg-brand-teal/15 px-2 py-0.5 text-xs font-medium text-brand-teal"
    : "rounded-full bg-navy/10 px-2 py-0.5 text-xs font-medium text-navy";
}

export function AdminUsersTable() {
  const { data: session, status: sessionStatus } = useSession();
  const accessToken = session?.accessToken;
  const isAdmin = session?.user.role === "ADMIN";

  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useUsersQuery(isAdmin ? accessToken : undefined);

  useEffect(() => {
    if (session && !isAdmin) {
      notifyError("Admin access required to view the user list.");
    }
  }, [session, isAdmin]);

  useNotifyQueryError(isError, error, "Could not load users.");

  if (sessionStatus === "loading") {
    return <p className="text-sm text-muted">Loading session…</p>;
  }

  if (!session) {
    return (
      <p className="text-sm text-muted">
        <Link href="/login" className="font-medium text-secondary no-underline">
          Sign in
        </Link>{" "}
        as an admin to view users.
      </p>
    );
  }

  if (!isAdmin) {
    return (
      <p className="text-sm text-muted">
        Admin access required to view the user list.
      </p>
    );
  }

  if (isLoading) {
    return <p className="text-sm text-muted">Loading users…</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-muted">Could not load users. Try refreshing the page.</p>
    );
  }

  return (
    <section className="space-y-3">
      <p className="text-sm text-muted">
        Loaded from{" "}
        <code className="text-xs">GET /user</code> (admin JWT required).
      </p>

      <AdminTable
        caption="Registered users"
        columns={["Name", "Email", "Role", "Joined"]}
        isEmpty={users.length === 0}
        emptyMessage="No users to show."
      >
        {users.map((user) => (
          <tr key={user.id} className="hover:bg-brand-navy/[0.03]">
            <td className={`${adminTableCellClass} font-medium`}>
              <Link
                href={`/admin/users/${user.id}`}
                className="font-medium text-secondary no-underline hover:text-brand-teal"
              >
                {user.name}
              </Link>
            </td>
            <td className={adminTableCellClass}>
              <Link
                href={`/admin/users/${user.id}`}
                className="text-navy no-underline hover:text-brand-teal"
              >
                {user.email}
              </Link>
            </td>
            <td className={adminTableCellClass}>
              <span className={roleBadgeClass(user.role)}>{user.role}</span>
            </td>
            <td className={`${adminTableCellClass} text-muted`}>
              {formatAdminDate(user.createdAt)}
            </td>
          </tr>
        ))}
      </AdminTable>
    </section>
  );
}
