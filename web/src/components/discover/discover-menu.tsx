import Link from "next/link";
import { categoriesPageHref } from "@/lib/discover-nav";

const discoverNavClass =
  "shrink-0 rounded-full px-2.5 py-2 text-sm font-semibold text-navy no-underline transition-colors hover:bg-brand-navy/5 hover:text-secondary sm:px-3";

export function DiscoverMenu() {
  return (
    <Link href={categoriesPageHref} className={discoverNavClass}>
      Discover
    </Link>
  );
}
