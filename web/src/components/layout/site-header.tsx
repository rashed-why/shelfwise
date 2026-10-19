import Image from "next/image";
import Link from "next/link";
import { DiscoverMenu } from "@/components/discover/discover-menu";
import { SiteHeaderAuthButton } from "@/components/layout/site-header-auth-button";
import { getLogoAsset } from "@/lib/logo";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function SiteHeader() {
  const logo = getLogoAsset();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white [--site-header-height:6.75rem] sm:[--site-header-height:4.25rem]">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-6 md:gap-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:contents sm:gap-4">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src={logo.src}
              alt="Selfwise"
              width={logo.width}
              height={logo.height}
              priority
              unoptimized
              sizes="(max-width: 640px) 120px, 180px"
              className="h-8 w-auto max-h-10 object-contain object-left sm:h-11 sm:max-h-12"
            />
          </Link>

          <DiscoverMenu />

          <SiteHeaderAuthButton />
        </div>

        <form
          action="/search"
          method="get"
          role="search"
          className="relative min-w-0 w-full sm:min-w-0 sm:flex-1"
        >
          <label htmlFor="site-search" className="sr-only">
            Search
          </label>
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted" />
          <input
            id="site-search"
            name="q"
            type="search"
            placeholder="Search books, authors, topics…"
            className="w-full rounded-full border border-border bg-white py-2 pr-4 pl-10 text-sm text-foreground outline-none placeholder:text-muted focus:border-secondary focus:ring-2 focus:ring-ring/30 sm:py-2.5"
          />
        </form>
      </div>
    </header>
  );
}
