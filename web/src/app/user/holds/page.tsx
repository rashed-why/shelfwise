import Link from "next/link";

export default function DashboardHoldsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">My holds</h1>
      <p className="mt-2 text-sm text-muted sm:text-base">
        You have no active holds yet. Browse{" "}
        <Link
          href="/discover"
          className="font-medium text-secondary no-underline hover:text-brand-teal"
        >
          Discover
        </Link>{" "}
        to place a hold on a title.
      </p>

      <div className="mt-8 rounded-xl border border-dashed border-border bg-brand-navy/[0.03] px-6 py-12 text-center">
        <p className="text-sm font-medium text-navy">No holds to show</p>
        <p className="mt-1 text-sm text-muted">
          Holds you place will appear here with status and pickup details.
        </p>
      </div>
    </div>
  );
}
