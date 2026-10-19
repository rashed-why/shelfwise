export type DashboardNavItem = {
  href: string;
  label: string;
  description: string;
};

export const dashboardNavItems: DashboardNavItem[] = [
  {
    href: "/user/dashboard",
    label: "Overview",
    description: "Your reading activity at a glance.",
  },
  {
    href: "/user/holds",
    label: "My holds",
    description: "Books you have placed on hold.",
  },
  {
    href: "/user/reading-list",
    label: "Reading list",
    description: "Saved titles you want to read next.",
  },
  {
    href: "/user/account",
    label: "Account",
    description: "Profile and library preferences.",
  },
];

export function isSidebarNavActive(pathname: string, href: string) {
  if (href === "/user/dashboard" || href === "/admin") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** @deprecated Use isSidebarNavActive */
export const isDashboardNavActive = isSidebarNavActive;
