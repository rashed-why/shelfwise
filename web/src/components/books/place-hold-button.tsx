"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useCreateHoldMutation } from "@/lib/queries/holds";
import { notifyErrorFromUnknown, notifySuccess } from "@/lib/toast";

type PlaceHoldButtonProps = {
  bookId: string;
  variant?: "card" | "primary";
};

const variantClassName = {
  card: "inline-flex w-full items-center justify-center rounded-md border border-border bg-white px-2 py-1.5 text-xs font-semibold text-navy transition-colors hover:border-brand-teal hover:bg-brand-teal/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60 sm:text-[13px]",
  primary:
    "inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-teal/90 disabled:cursor-not-allowed disabled:opacity-60",
} as const;

export function PlaceHoldButton({
  bookId,
  variant = "card",
}: PlaceHoldButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = session?.accessToken;
  const createHold = useCreateHoldMutation(accessToken);

  const isBusy = status === "loading" || createHold.isPending;

  async function handleClick() {
    if (isBusy) return;

    if (!session || !accessToken) {
      const callbackUrl = encodeURIComponent(pathname || "/");
      router.push(`/login?callbackUrl=${callbackUrl}`);
      return;
    }

    try {
      await createHold.mutateAsync(bookId);
      notifySuccess("Hold placed successfully.");
    } catch (error) {
      notifyErrorFromUnknown(error, "Could not place hold.");
    }
  }

  return (
    <div className={variant === "card" ? "w-full" : undefined}>
      <button
        type="button"
        onClick={() => void handleClick()}
        disabled={isBusy}
        className={variantClassName[variant]}
      >
        {createHold.isPending ? "Placing hold…" : "Place hold"}
      </button>
    </div>
  );
}
