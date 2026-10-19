import { notFound } from "next/navigation";
import { AdminUserBorrowHistory } from "@/components/admin/admin-user-borrow-history";
import { findAdminDemoUser } from "@/lib/admin-users-demo";

type AdminUserDetailPageProps = {
  params: Promise<{ userId: string }>;
};

export default async function AdminUserDetailPage({
  params,
}: AdminUserDetailPageProps) {
  const { userId } = await params;
  const user = findAdminDemoUser(userId);

  if (!user) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">User details</h1>
      <p className="mt-2 text-sm text-muted sm:text-base">
        Borrow history and account summary.
      </p>

      <div className="mt-8">
        <AdminUserBorrowHistory user={user} />
      </div>
    </div>
  );
}
