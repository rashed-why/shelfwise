export type DashboardNavItem = {
  href: string;
  label: string;
  description: string;
};

export const dashboardNavItems: DashboardNavItem[] = [
  {
    href: "/dashboard",
    label: "Overview",
    description: "Your reading activity at a glance.",
  },
  {
    href: "/dashboard/holds",
    label: "My holds",
    description: "Books you have placed on hold.",
  },
  {
    href: "/dashboard/reading-list",
    label: "Reading list",
    description: "Saved titles you want to read next.",
  },
  {
    href: "/dashboard/account",
    label: "Account",
    description: "Profile and library preferences.",
  },
];

export function isDashboardNavActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
