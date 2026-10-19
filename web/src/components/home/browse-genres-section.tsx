"use client";

import Link from "next/link";
import { categoriesPageHref } from "@/lib/discover-nav";
import { useCategoriesQuery } from "@/lib/queries/categories";
import { useNotifyQueryError } from "@/lib/use-notify-query-error";

const BROWSE_GENRES_CARD_COUNT = 12;

export function BrowseGenresSection() {
  const { data: categories = [], isLoading, isError } = useCategoriesQuery();
  const genreCards = categories.slice(0, BROWSE_GENRES_CARD_COUNT);

  useNotifyQueryError(isError, null, "Could not load genres right now.");

  return (
    <section
      className="bg-white px-4 py-10 sm:px-6 lg:px-8"
      aria-labelledby="browse-genres-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2
            id="browse-genres-heading"
            className="text-lg font-bold tracking-wide text-foreground uppercase sm:text-xl"
          >
            Browse genres
          </h2>
          <Link
            href={categoriesPageHref}
            className="rounded-md text-sm font-medium text-brand-teal no-underline transition-colors hover:text-primary hover:underline hover:underline-offset-4"
          >
            View all
          </Link>
        </div>

        {isLoading ? (
          <ul
            className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6"
            aria-busy="true"
            aria-label="Loading genres"
          >
            {Array.from({ length: BROWSE_GENRES_CARD_COUNT }, (_, index) => (
              <li key={index}>
                <div className="flex min-h-[5.5rem] animate-pulse items-center justify-center rounded-xl border border-border bg-muted/20 p-4">
                  <span className="h-4 w-3/4 rounded bg-border" />
                </div>
              </li>
            ))}
          </ul>
        ) : isError ? (
          <p className="mt-6 text-sm text-muted">
            Could not load genres right now.{" "}
            <Link href={categoriesPageHref} className="text-brand-teal hover:underline">
              Browse discover
            </Link>
          </p>
        ) : (
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
            {genreCards.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/discover?category=${encodeURIComponent(category.slug)}`}
                  className="flex min-h-[5.5rem] items-center justify-center rounded-xl border border-border bg-linear-to-br from-brand-teal/8 to-secondary/5 p-4 text-center no-underline transition-colors hover:border-brand-teal/40 hover:from-brand-teal/12 hover:to-secondary/10"
                >
                  <span className="text-sm font-semibold leading-snug text-navy">
                    {category.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
