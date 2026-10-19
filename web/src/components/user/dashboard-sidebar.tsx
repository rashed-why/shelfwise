"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useId, useState } from "react";
import {
  dashboardNavItems,
  isSidebarNavActive,
  type DashboardNavChildItem,
  type DashboardNavItem,
} from "@/lib/dashboard-nav";

const navLinkClass =
  "box-border w-full max-w-full cursor-pointer truncate rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors lg:py-2";

const navSubLinkClass =
  "box-border w-full max-w-full cursor-pointer truncate rounded-lg border px-3 py-2 text-left text-sm transition-colors";

type DashboardSidebarProps = {
  items?: DashboardNavItem[];
  heading?: string;
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`size-4 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function isNavGroupActive(
  pathname: string,
  item: DashboardNavItem & { children: DashboardNavChildItem[] },
): boolean {
  if (
    item.children.some((child) => isSidebarNavActive(pathname, child.href))
  ) {
    return true;
  }

  const groupBase = item.href.replace(/\/(list|create)$/, "");
  if (!pathname.startsWith(`${groupBase}/`)) {
    return false;
  }

  const rest = pathname.slice(groupBase.length + 1);
  if (!rest || rest.includes("/")) {
    return false;
  }

  return rest !== "create" && rest !== "list";
}

function SidebarNavDropdown({
  item,
  pathname,
}: {
  item: DashboardNavItem & { children: DashboardNavChildItem[] };
  pathname: string;
}) {
  const menuId = useId();
  const childActive = isNavGroupActive(pathname, item);
  const [open, setOpen] = useState(childActive);

  useEffect(() => {
    if (childActive) {
      setOpen(true);
    }
  }, [childActive]);

  return (
    <div className="w-full min-w-0">
      <button
        type="button"
        id={`${menuId}-trigger`}
        aria-expanded={open}
        aria-controls={`${menuId}-menu`}
        onClick={() => setOpen((value) => !value)}
        className={`${navLinkClass} ${childActive
          ? "border-brand-teal/40 bg-brand-teal/15 text-navy"
          : "border-transparent text-foreground hover:border-border hover:bg-brand-navy/5 hover:text-navy"
          }`}
      >
        <span className="flex w-full items-center justify-between gap-2">
          <span className="truncate">{item.label}</span>
          <ChevronIcon open={open} />
        </span>
      </button>

      {open ? (
        <div
          id={`${menuId}-menu`}
          role="group"
          aria-labelledby={`${menuId}-trigger`}
          className="mt-0.5 ml-2 flex flex-col gap-0.5 border-l border-border py-0.5 pl-2"
        >
          {item.children.map((child) => {
            const isActive = isSidebarNavActive(pathname, child.href);
            return (
              <Link
                key={child.href}
                href={child.href}
                className={`${navSubLinkClass} no-underline ${isActive
                  ? "border-brand-teal/40 bg-brand-teal/15 font-medium text-navy"
                  : "border-transparent text-muted hover:border-border hover:bg-brand-navy/5 hover:text-navy"
                  }`}
                aria-current={isActive ? "page" : undefined}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function DashboardSidebarFallback({ heading = "Dashboard" }: DashboardSidebarProps) {
  return (
    <aside
      aria-busy="true"
      aria-label={`Loading ${heading}`}
      className="w-full min-w-0 shrink-0 self-start lg:sticky lg:top-[calc(var(--site-header-height)+1rem)] lg:w-[240px] lg:min-w-[240px] lg:max-w-[240px] lg:max-h-[calc(100dvh-var(--site-header-height)-2rem)] lg:overflow-y-auto lg:overscroll-contain lg:[scrollbar-gutter:stable]"
    >
      <div className="h-3 w-20 animate-pulse rounded bg-brand-navy/10" />
      <div className="mt-3 flex flex-col gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="h-10 w-full animate-pulse rounded-lg bg-brand-navy/5"
          />
        ))}
      </div>
    </aside>
  );
}

function DashboardSidebarInner({
  items = dashboardNavItems,
  heading = "Dashboard",
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full min-w-0 shrink-0 self-start lg:sticky lg:top-[calc(var(--site-header-height)+1rem)] lg:w-[240px] lg:min-w-[240px] lg:max-w-[240px] lg:max-h-[calc(100dvh-var(--site-header-height)-2rem)] lg:overflow-y-auto lg:overscroll-contain lg:[scrollbar-gutter:stable]">
      <h2 className="text-xs font-bold tracking-wide text-navy uppercase">
        {heading}
      </h2>
      <nav className="mt-3 w-full min-w-0" aria-label={heading}>
        <div className="flex w-full min-w-0 flex-col gap-0.5">
          {items.map((item) => {
            if (item.children?.length) {
              return (
                <SidebarNavDropdown
                  key={item.href}
                  item={{ ...item, children: item.children }}
                  pathname={pathname}
                />
              );
            }

            const isActive = isSidebarNavActive(pathname, item.href);
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
  );
}

export function DashboardSidebar(props: DashboardSidebarProps) {
  return (
    <Suspense fallback={<DashboardSidebarFallback heading={props.heading} />}>
      <DashboardSidebarInner {...props} />
    </Suspense>
  );
}
