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
  {
    href: "/admin/users",
    label: "Users",
    description: "Manage member accounts and roles.",
  },
  {
    href: "/admin/borrowed/list",
    label: "Borrowed",
    description: "Track active loans and returns.",
    children: [
      { href: "/admin/borrowed/create", label: "Create" },
      { href: "/admin/borrowed/list", label: "List" },
    ],
  },
];
