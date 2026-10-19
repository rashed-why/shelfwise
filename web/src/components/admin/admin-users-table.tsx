"use client";

import Link from "next/link";
import { AdminTable, adminTableCellClass } from "@/components/admin/admin-table";
import { loadAllAdminUsers } from "@/lib/admin-users-demo";
import { formatAdminDate } from "@/lib/admin-format";

function roleBadgeClass(role: "USER" | "ADMIN"): string {
  return role === "ADMIN"
    ? "rounded-full bg-brand-teal/15 px-2 py-0.5 text-xs font-medium text-brand-teal"
    : "rounded-full bg-navy/10 px-2 py-0.5 text-xs font-medium text-navy";
}

export function AdminUsersTable() {
  const users = loadAllAdminUsers();

  return (
    <section className="space-y-3">
      <p className="text-sm text-muted">
        Sample accounts for this demo. Connect{" "}
        <code className="text-xs">GET /user</code> when admin sign-in is wired
        up.
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
              {formatAdminDate(user.joinedAt)}
            </td>
          </tr>
        ))}
      </AdminTable>
    </section>
  );
}
