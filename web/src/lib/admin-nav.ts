import type { DashboardNavItem } from "@/lib/dashboard-nav";

export const adminNavItems: DashboardNavItem[] = [
  {
    href: "/admin",
    label: "Overview",
    description: "Catalog management at a glance.",
  },
  {
    href: "/admin/categories",
    label: "Categories",
    description: "Add new browse categories.",
  },
  {
    href: "/admin/authors",
    label: "Authors",
    description: "Add authors for book entries.",
  },
  {
    href: "/admin/books",
    label: "Books",
    description: "Add titles to the catalog.",
  },
];
