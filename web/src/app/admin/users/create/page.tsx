import { AdminUserCreateForm } from "@/components/admin/admin-user-create-form";

export default function AdminUsersCreatePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">Users</h1>
      <p className="mt-2 text-sm text-muted sm:text-base">
        Add a member account (demo local storage).
      </p>
      <div className="mt-8">
        <AdminUserCreateForm />
      </div>
    </div>
  );
}
