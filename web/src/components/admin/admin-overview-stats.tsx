"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useAdminStatsQuery } from "@/lib/queries/admin-stats";
import { useNotifyQueryError } from "@/lib/use-notify-query-error";

type StatCard = {
  label: string;
  valueKey: keyof import("@/lib/admin-stats-api").AdminStats;
  href: string;
  highlight?: "danger";
};

const statCards: StatCard[] = [
  { label: "Categories", valueKey: "categories", href: "/admin/categories/list" },
  { label: "Authors", valueKey: "authors", href: "/admin/authors/list" },
  { label: "Books", valueKey: "books", href: "/admin/books/list" },
  { label: "Users", valueKey: "users", href: "/admin/users/list" },
  { label: "Borrowed", valueKey: "borrowed", href: "/admin/borrowed/list" },
  {
    label: "Overdue",
    valueKey: "overdue",
    href: "/admin/borrowed/list",
    highlight: "danger",
  },
];

function formatCount(value: number | undefined): string {
  if (value === undefined) {
    return "—";
  }
  return value.toLocaleString();
}

export function AdminOverviewStats() {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken;
  const { data: stats, isLoading, isError, error } = useAdminStatsQuery(accessToken);

  useNotifyQueryError(
    Boolean(accessToken && isError),
    error,
    "Could not load statistics.",
  );

  if (status === "loading" || (accessToken && isLoading)) {
    return (
      <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-white px-4 py-4 animate-pulse"
          >
            <div className="h-3 w-16 rounded bg-border" />
            <div className="mt-3 h-8 w-10 rounded bg-border" />
          </div>
        ))}
      </div>
    );
  }

  if (!session || !accessToken) {
    return (
      <p className="mt-6 text-sm text-muted">
        Sign in as an admin to view live statistics.
      </p>
    );
  }

  if (isError) {
    return (
      <p className="mt-6 text-sm text-muted">
        Could not load statistics. Try refreshing the page.
      </p>
    );
  }

  return (
    <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
      {statCards.map((card) => {
        const value = stats?.[card.valueKey];
        const valueClass =
          card.highlight === "danger" && value && value > 0
            ? "text-red-600"
            : "text-navy";

        return (
          <Link
            key={card.label}
            href={card.href}
            className="flex min-w-0 flex-col rounded-xl border border-border bg-white px-4 py-4 no-underline transition-colors hover:border-brand-teal/40 hover:bg-brand-teal/5"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-muted sm:text-sm sm:normal-case sm:tracking-normal">
              {card.label}
            </span>
            <span className={`mt-2 text-2xl font-bold tabular-nums sm:text-3xl ${valueClass}`}>
              {formatCount(value)}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
