import { AdminHoldsManagement } from "@/components/admin/admin-holds-management";

export default function AdminHoldsListPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">Hold requests</h1>
      <p className="mt-2 text-sm text-muted sm:text-base">
        User-placed holds waiting to be checked out. Record a borrow to move titles
        to the patron reading list and clear matching holds.
      </p>

      <div className="mt-8">
        <AdminHoldsManagement />
      </div>
    </div>
  );
}
