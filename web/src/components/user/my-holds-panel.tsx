"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { getApiAssetUrl } from "@/lib/api-client";
import { useCancelHoldMutation, useMyHoldsQuery } from "@/lib/queries/holds";
import { notifyErrorFromUnknown, notifySuccess } from "@/lib/toast";
import { useNotifyQueryError } from "@/lib/use-notify-query-error";

function formatHoldDate(iso: string) {
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

export function MyHoldsPanel() {
  const { data: session, status: sessionStatus } = useSession();
  const accessToken = session?.accessToken;
  const { data: holds = [], isLoading, isError, error } = useMyHoldsQuery(
    accessToken,
  );
  const cancelHold = useCancelHoldMutation(accessToken);

  useNotifyQueryError(isError, error, "Could not load holds.");

  function handleCancelHold(holdId: string) {
    cancelHold.mutate(holdId, {
      onSuccess: () => {
        notifySuccess("Hold removed.");
      },
      onError: (mutationError) => {
        notifyErrorFromUnknown(mutationError, "Could not remove hold.");
      },
    });
  }

  if (sessionStatus === "loading") {
    return <p className="text-sm text-muted">Loading…</p>;
  }

  if (!session || !accessToken) {
    return (
      <p className="text-sm text-muted">
        <Link href="/login" className="font-medium text-secondary hover:text-brand-teal">
          Sign in
        </Link>{" "}
        to see your holds.
      </p>
    );
  }

  if (isLoading) {
    return <p className="text-sm text-muted">Loading your holds…</p>;
  }

  if (isError) {
    return (
      <p className="mt-2 text-sm text-muted sm:text-base">
        Could not load your holds. Try refreshing the page.
      </p>
    );
  }

  const activeHolds = holds.filter((hold) => hold.status !== "RETURNED");

  if (activeHolds.length === 0) {
    return (
      <>
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
            Holds you place will appear here with status and due date.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <p className="mt-2 text-sm text-muted sm:text-base">
        {activeHolds.length} active hold{activeHolds.length === 1 ? "" : "s"}.
      </p>

      <ul className="mt-8 space-y-4">
        {activeHolds.map((hold) => (
          <li
            key={hold.id}
            className="flex gap-4 rounded-xl border border-border bg-white p-4 shadow-sm"
          >
            <div
              className="relative h-24 w-16 shrink-0 overflow-hidden bg-brand-navy/5"
              style={{
                backgroundImage: `url(${getApiAssetUrl(hold.book.image)})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              role="img"
              aria-label={`Cover of ${hold.book.title}`}
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="font-semibold text-navy">{hold.book.title}</p>
              <p className="mt-0.5 text-sm text-muted">{hold.book.author.name}</p>
              <p className="mt-2 text-sm text-foreground">
                Due {formatHoldDate(hold.dueAt)} ·{" "}
                <span className="font-medium">{statusLabel(hold.status)}</span>
              </p>
              <button
                type="button"
                onClick={() => handleCancelHold(hold.id)}
                disabled={cancelHold.isPending}
                className="mt-3 w-fit cursor-pointer rounded-md border border-border bg-white px-3 py-1.5 text-xs font-semibold text-navy transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancelHold.isPending && cancelHold.variables === hold.id
                  ? "Removing…"
                  : "Remove hold"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
