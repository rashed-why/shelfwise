import { AdminUserBorrowHistory } from "@/components/admin/admin-user-borrow-history";

type AdminUserDetailPageProps = {
  params: Promise<{ userId: string }>;
};

export default async function AdminUserDetailPage({
  params,
}: AdminUserDetailPageProps) {
  const { userId } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">User details</h1>
      <p className="mt-2 text-sm text-muted sm:text-base">
        Borrow history and account summary.
      </p>

      <div className="mt-8">
        <AdminUserBorrowHistory userId={userId} />
      </div>
    </div>
  );
}
