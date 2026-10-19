"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { getApiAssetUrl } from "@/lib/api-client";
import { useMyReadingListQuery } from "@/lib/queries/reading-list";
import { useNotifyQueryError } from "@/lib/use-notify-query-error";

function formatDueDate(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(new Date(iso));
}

function statusLabel(status: string) {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "OVERDUE":
      return "Overdue";
    case "RETURNED":
      return "Returned";
    default:
      return status;
  }
}

export function MyReadingListPanel() {
  const { data: session, status: sessionStatus } = useSession();
  const accessToken = session?.accessToken;
  const { data: items = [], isLoading, isError, error } =
    useMyReadingListQuery(accessToken);

  useNotifyQueryError(isError, error, "Could not load reading list.");

  if (sessionStatus === "loading") {
    return <p className="text-sm text-muted">Loading…</p>;
  }

  if (!session || !accessToken) {
    return (
      <p className="text-sm text-muted">
        <Link href="/login" className="font-medium text-secondary hover:text-brand-teal">
          Sign in
        </Link>{" "}
        to see your reading list.
      </p>
    );
  }

  if (isLoading) {
    return <p className="text-sm text-muted">Loading your reading list…</p>;
  }

  if (isError) {
    return (
      <p className="mt-2 text-sm text-muted sm:text-base">
        Could not load your reading list. Try refreshing the page.
      </p>
    );
  }

  const activeItems = items.filter((item) => item.status !== "RETURNED");

  if (activeItems.length === 0) {
    return (
      <>
        <p className="mt-2 text-sm text-muted sm:text-base">
          Books you borrow from the library will appear here with due dates and
          status.
        </p>

        <div className="mt-8 rounded-xl border border-dashed border-border bg-brand-navy/[0.03] px-6 py-12 text-center">
          <p className="text-sm font-medium text-navy">Your reading list is empty</p>
          <p className="mt-1 text-sm text-muted">
            Place a hold on{" "}
            <Link
              href="/discover"
              className="font-medium text-secondary hover:text-brand-teal"
            >
              Discover
            </Link>{" "}
            or wait for staff to check out a title to you.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <p className="mt-2 text-sm text-muted sm:text-base">
        {activeItems.length} active title{activeItems.length === 1 ? "" : "s"} on
        your list.
      </p>

      <ul className="mt-8 space-y-4">
        {activeItems.map((item) => (
          <li
            key={item.id}
            className="flex gap-4 rounded-xl border border-border bg-white p-4 shadow-sm"
          >
            <div
              className="relative h-24 w-16 shrink-0 overflow-hidden bg-brand-navy/5"
              style={{
                backgroundImage: `url(${getApiAssetUrl(item.book.image)})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              role="img"
              aria-label={`Cover of ${item.book.title}`}
            />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-navy">{item.book.title}</p>
              <p className="mt-0.5 text-sm text-muted">{item.book.author.name}</p>
              <p className="mt-2 text-sm text-foreground">
                Due {formatDueDate(item.dueAt)} ·{" "}
                <span className="font-medium">{statusLabel(item.status)}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
