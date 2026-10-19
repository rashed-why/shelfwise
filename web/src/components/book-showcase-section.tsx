import Link from "next/link";
import { BookCard } from "@/components/book-card";
import {
  BOOK_SHOWCASE_MAX_ITEMS,
  type BookListing,
} from "@/lib/books";

type BookShowcaseSectionProps = {
  title: string;
  headingId: string;
  viewAllHref: string;
  books: BookListing[];
  maxItems?: number;
};

export function BookShowcaseSection({
  title,
  headingId,
  viewAllHref,
  books,
  maxItems = BOOK_SHOWCASE_MAX_ITEMS,
}: BookShowcaseSectionProps) {
  const items = books.slice(0, maxItems);

  return (
    <section
      className="bg-white px-4 py-10 sm:px-6 lg:px-8"
      aria-labelledby={headingId}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2
            id={headingId}
            className="text-lg font-bold tracking-wide text-foreground uppercase sm:text-xl"
          >
            {title}
          </h2>
          <Link
            href={viewAllHref}
            className="rounded-md text-sm font-medium text-brand-teal no-underline transition-colors hover:text-primary hover:underline hover:underline-offset-4"
          >
            View all
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 sm:gap-6 lg:flex-nowrap">
          {items.map((book) => (
            <div
              key={book.id}
              className="flex min-w-0 flex-[1_1_calc(50%-0.5rem)] sm:flex-[1_1_calc(33.333%-1rem)] lg:flex-1"
            >
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
