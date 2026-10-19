"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useId } from "react";
import {
  dashboardNavItems,
  isDashboardNavActive,
} from "@/lib/dashboard-nav";

const navLinkClass =
  "box-border w-full max-w-full cursor-pointer truncate rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors lg:py-2";

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const mobileNavId = useId();

  const activeItem =
    dashboardNavItems.find((item) => isDashboardNavActive(pathname, item.href)) ??
    dashboardNavItems[0];

  return (
    <>
      <div className="w-full min-w-0 lg:hidden">
        <label
          htmlFor={mobileNavId}
          className="text-xs font-bold tracking-wide text-navy uppercase"
        >
          Menu
        </label>
        <select
          id={mobileNavId}
          value={activeItem.href}
          onChange={(event) => router.push(event.target.value)}
          className="mt-2 w-full cursor-pointer appearance-none rounded-lg border border-border bg-white py-2.5 pr-10 pl-3 text-sm font-medium text-navy outline-none focus:border-secondary focus:ring-2 focus:ring-ring/30"
          aria-label="Dashboard menu"
        >
          {dashboardNavItems.map((item) => (
            <option key={item.href} value={item.href}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <aside className="hidden w-[240px] min-w-[240px] max-w-[240px] shrink-0 grow-0 basis-[240px] self-start lg:block lg:sticky lg:top-[calc(var(--site-header-height)+1rem)] lg:max-h-[calc(100dvh-var(--site-header-height)-2rem)] lg:overflow-y-auto lg:overscroll-contain lg:[scrollbar-gutter:stable]">
        <h2 className="text-xs font-bold tracking-wide text-navy uppercase">
          Dashboard
        </h2>
        <nav className="mt-3 w-full min-w-0" aria-label="Dashboard">
          <div className="flex w-full min-w-0 flex-col gap-0.5">
            {dashboardNavItems.map((item) => {
              const isActive = isDashboardNavActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={`${navLinkClass} no-underline ${isActive
                    ? "border-brand-teal/40 bg-brand-teal/15 text-navy"
                    : "border-transparent text-foreground hover:border-border hover:bg-brand-navy/5 hover:text-navy"
                    }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}
