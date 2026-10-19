"use client";

import Link from "next/link";
import { BookShowcaseSection } from "@/components/home/book-showcase-section";
import { categoriesPageHref } from "@/lib/discover-nav";
import { buildCategoryBookShowcases } from "@/lib/home-book-showcases";
import { BOOK_SHOWCASE_MAX_ITEMS } from "@/lib/books";
import { useCategoriesQuery } from "@/lib/queries/categories";
import { useBooksQuery } from "@/lib/queries/books";
import { useNotifyQueryError } from "@/lib/use-notify-query-error";

function ShowcaseSkeleton() {
  return (
    <div className="space-y-10" aria-busy="true" aria-label="Loading book showcases">
      {Array.from({ length: 3 }, (_, sectionIndex) => (
        <section
          key={sectionIndex}
          className="bg-white px-4 py-10 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="h-6 w-40 animate-pulse rounded bg-border" />
            <div className="mt-6 flex flex-wrap gap-4 sm:gap-6 lg:flex-nowrap">
              {Array.from({ length: BOOK_SHOWCASE_MAX_ITEMS }, (_, bookIndex) => (
                <div
                  key={bookIndex}
                  className="flex min-w-0 flex-[1_1_calc(50%-0.5rem)] sm:flex-[1_1_calc(33.333%-1rem)] lg:flex-1"
                >
                  <div className="w-full animate-pulse">
                    <div className="aspect-[2/3] rounded bg-border" />
                    <div className="mt-3 h-4 w-full rounded bg-border" />
                    <div className="mt-2 h-3 w-2/3 rounded bg-border" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

export function HomeCategoryShowcases() {
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategoriesQuery();
  const {
    data: books = [],
    isLoading: booksLoading,
    isError: booksError,
  } = useBooksQuery();

  const isLoading = categoriesLoading || booksLoading;
  const isError = categoriesError || booksError;

  useNotifyQueryError(isError, null, "Could not load books right now.");

  if (isLoading) {
    return <ShowcaseSkeleton />;
  }

  if (isError) {
    return (
      <section className="bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-muted">
            Could not load books right now.{" "}
            <Link href={categoriesPageHref} className="text-brand-teal hover:underline">
              Browse discover
            </Link>
          </p>
        </div>
      </section>
    );
  }

  const showcases = buildCategoryBookShowcases(categories, books);

  return (
    <>
      {showcases.map((category) => (
        <BookShowcaseSection
          key={category.slug}
          title={category.title}
          headingId={`category-${category.slug}`}
          viewAllHref={category.viewAllHref}
          books={category.books}
        />
      ))}
    </>
  );
}
