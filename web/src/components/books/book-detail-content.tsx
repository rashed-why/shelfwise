import Image from "next/image";
import Link from "next/link";
import { BookCard } from "@/components/books/book-card";
import type { BookDetail } from "@/lib/book-details";
import type { BookListing } from "@/lib/books";

type BookDetailContentProps = {
  book: BookDetail;
  relatedBooks: BookListing[];
  backHref: string;
  backLabel?: string;
};

export function BookDetailContent({
  book,
  relatedBooks,
  backHref,
  backLabel = "← Back to Discover",
}: BookDetailContentProps) {
  return (
    <>
      <Link
        href={backHref}
        className="text-sm font-medium text-secondary no-underline hover:text-brand-teal"
      >
        {backLabel}
      </Link>

      <div className="mt-6 flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
        <div className="relative mx-auto aspect-[2/3] w-full max-w-[220px] shrink-0 overflow-hidden bg-brand-navy/5 shadow-md shadow-brand-navy/10 sm:mx-0">
          <Image
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
            fill
            priority
            sizes="220px"
            className="object-cover object-center"
            unoptimized
          />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-navy sm:text-3xl">
            {book.title}
          </h1>
          <p className="mt-2 text-base font-medium text-muted">{book.author}</p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground sm:text-base">
            {book.summary}
          </p>

          <Link
            href={`/books/${book.slug}/hold`}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-brand-teal/90"
          >
            Place hold
          </Link>
        </div>
      </div>

      {relatedBooks.length > 0 ? (
        <section
          className="mt-12 border-t border-border pt-10"
          aria-labelledby="related-books-heading"
        >
          <h2
            id="related-books-heading"
            className="text-lg font-bold tracking-wide text-foreground uppercase sm:text-xl"
          >
            Related books
          </h2>

          <div className="mt-6 flex w-full flex-wrap gap-4 sm:gap-6 lg:flex-nowrap">
            {relatedBooks.map((item) => (
              <div
                key={item.id}
                className="flex min-w-0 flex-[1_1_calc(50%-0.5rem)] sm:flex-[1_1_calc(33.333%-1rem)] lg:flex-1"
              >
                <BookCard book={item} />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
