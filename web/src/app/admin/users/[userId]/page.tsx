import { Suspense } from "react";
import { AdminUserBorrowHistory } from "@/components/admin/admin-user-borrow-history";

type AdminUserDetailPageProps = {
  params: Promise<{ userId: string }>;
};

async function AdminUserDetailContent({
  params,
}: Pick<AdminUserDetailPageProps, "params">) {
  const { userId } = await params;

  return (
    <>
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">User details</h1>
      <p className="mt-2 text-sm text-muted sm:text-base">
        Borrow history and account summary.
      </p>

      <div className="mt-8">
        <AdminUserBorrowHistory userId={userId} />
      </div>
    </>
  );
}

function AdminUserDetailFallback() {
  return (
    <div aria-busy="true" aria-label="Loading user details">
      <div className="h-8 w-48 animate-pulse rounded bg-brand-navy/10" />
      <div className="mt-2 h-4 w-72 animate-pulse rounded bg-brand-navy/10" />
      <div className="mt-8 h-40 w-full animate-pulse rounded-lg bg-brand-navy/5" />
    </div>
  );
}

export default function AdminUserDetailPage({
  params,
}: AdminUserDetailPageProps) {
  return (
    <div>
      <Suspense fallback={<AdminUserDetailFallback />}>
        <AdminUserDetailContent params={params} />
      </Suspense>
    </div>
  );
}
