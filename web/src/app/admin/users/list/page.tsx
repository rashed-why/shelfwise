import { AdminUsersTable } from "@/components/admin/admin-users-table";

export default function AdminUsersListPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">Users</h1>
      <p className="mt-2 text-sm text-muted sm:text-base">
        Registered accounts from the API. Select a user to see borrow history.
      </p>
      <div className="mt-8">
        <AdminUsersTable />
      </div>
    </div>
  );
}
