"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { homePathForRole } from "@/lib/post-login-redirect";

const authWrapClass =
  "ml-auto flex shrink-0 items-center gap-2 sm:order-last sm:ml-0";

const authButtonClass =
  "rounded-full bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-teal/90 sm:px-5 sm:py-2.5";

const dashboardButtonClass =
  "rounded-full border border-border bg-white px-3 py-2 text-sm font-semibold text-navy no-underline transition-colors hover:border-brand-teal hover:bg-brand-teal/5 sm:px-5 sm:py-2.5";

export function SiteHeaderAuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className={authWrapClass}>
        <span
          className={`${authButtonClass} pointer-events-none opacity-70`}
          aria-hidden
        >
          Sign in
        </span>
      </div>
    );
  }

  if (session?.user) {
    const dashboardHref = homePathForRole(session.user.role);

    return (
      <div className={authWrapClass}>
        <Link href={dashboardHref} className={dashboardButtonClass}>
          Dashboard
        </Link>
        <button
          type="button"
          className={`${authButtonClass} cursor-pointer border-0`}
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className={authWrapClass}>
      <Link href="/login" className={`${authButtonClass} no-underline`}>
        Sign in
      </Link>
    </div>
  );
}
