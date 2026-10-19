import Link from "next/link";
import { categories } from "@/lib/categories";
import { categoriesPageHref } from "@/lib/discover-nav";

const BROWSE_GENRES_CARD_COUNT = 12;

export function BrowseGenresSection() {
  const genreCards = categories.slice(0, BROWSE_GENRES_CARD_COUNT);

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

        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
          {genreCards.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/discover/${category.slug}`}
                className="flex min-h-[5.5rem] items-center justify-center rounded-xl border border-border bg-linear-to-br from-brand-teal/8 to-secondary/5 p-4 text-center no-underline transition-colors hover:border-brand-teal/40 hover:from-brand-teal/12 hover:to-secondary/10"
              >
                <span className="text-sm font-semibold leading-snug text-navy">
                  {category.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
