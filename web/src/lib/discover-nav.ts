import { categories } from "@/lib/categories";

export { categories };

export type NavLink = {
  href: string;
  label: string;
};

/** All categories listing page (Explore link in Discover menu). */
export const categoriesPageHref = "/discover";

export const authorLinks: NavLink[] = [
  { href: "/authors", label: "Browse all authors" },
  { href: "/authors/popular", label: "Popular authors" },
  { href: "/authors/new", label: "New authors" },
  { href: "/authors/a-z", label: "Authors A–Z" },
];

export const mostViewedLinks: NavLink[] = [
  { href: "/most-viewed/today", label: "Top today" },
  { href: "/most-viewed/week", label: "Top this week" },
  { href: "/most-viewed/month", label: "Top this month" },
  { href: "/most-viewed/all-time", label: "All-time favorites" },
];

export function getCategoryLinks(): NavLink[] {
  return categories.map((c) => ({
    href: `/discover/${c.slug}`,
    label: c.label,
  }));
}
