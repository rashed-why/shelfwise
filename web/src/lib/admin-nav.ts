import type { DashboardNavItem } from "@/lib/dashboard-nav";

export const adminNavItems: DashboardNavItem[] = [
  {
    href: "/admin",
    label: "Overview",
    description: "Catalog management at a glance.",
  },
  {
    href: "/admin/categories/list",
    label: "Categories",
    description: "Add new browse categories.",
    children: [
      { href: "/admin/categories/create", label: "Create" },
      { href: "/admin/categories/list", label: "List" },
    ],
  },
  {
    href: "/admin/authors/list",
    label: "Authors",
    description: "Add authors for book entries.",
    children: [
      { href: "/admin/authors/create", label: "Create" },
      { href: "/admin/authors/list", label: "List" },
    ],
  },
  {
    href: "/admin/books/list",
    label: "Books",
    description: "Add titles to the catalog.",
    children: [
      { href: "/admin/books/create", label: "Create" },
      { href: "/admin/books/list", label: "List" },
    ],
  },
  {
    href: "/admin/users/list",
    label: "Users",
    description: "Manage member accounts and roles.",
    children: [
      { href: "/admin/users/create", label: "Create" },
      { href: "/admin/users/list", label: "List" },
    ],
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
