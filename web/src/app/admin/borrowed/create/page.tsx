import { AdminBorrowedManagement } from "@/components/admin/admin-borrowed-management";

export default function AdminBorrowedCreatePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">Borrowed</h1>
      <p className="mt-2 text-sm text-muted sm:text-base">
        Record a new loan and due date.
      </p>

      <div className="mt-8">
        <AdminBorrowedManagement view="create" />
      </div>
    </div>
  );
}
