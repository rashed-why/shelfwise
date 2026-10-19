import Link from "next/link";
import { adminNavItems } from "@/lib/admin-nav";

export default function AdminOverviewPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">Overview</h1>
      <p className="mt-2 text-sm text-muted sm:text-base">
        Add categories, authors, and books from the menu. Entries are stored locally in
        your browser for this demo—no API calls.
      </p>

      <div className="mt-8 flex w-full flex-wrap gap-4 sm:flex-nowrap sm:gap-6">
        {adminNavItems
          .filter((item) => item.href !== "/admin")
          .map((item) => (
            <div
              key={item.href}
              className="flex min-w-0 flex-[1_1_calc(50%-0.5rem)] sm:flex-1"
            >
              <Link
                href={item.href}
                className="flex h-full w-full min-w-0 flex-col rounded-xl border border-border bg-white px-4 py-4 no-underline transition-colors hover:border-brand-teal/40 hover:bg-brand-teal/5"
              >
                <span className="font-semibold text-navy">{item.label}</span>
                <p className="mt-1 text-sm text-muted">{item.description}</p>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}
