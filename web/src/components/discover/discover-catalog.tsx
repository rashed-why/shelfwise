"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useId, useMemo } from "react";
import { BookCard } from "@/components/books/book-card";
import { DiscoverCategorySelect } from "@/components/discover/discover-category-select";
import type { CategoryRecord } from "@/lib/categories-api";
import { BOOK_SHOWCASE_MAX_ITEMS } from "@/lib/books";
import { bookRecordToListing } from "@/lib/home-book-showcases";
import { useCategoriesQuery } from "@/lib/queries/categories";
import { useBooksQuery } from "@/lib/queries/books";
import { useNotifyQueryError } from "@/lib/use-notify-query-error";

function resolveCategorySlug(
  slug: string | null | undefined,
  categories: CategoryRecord[],
) {
  if (slug && categories.some((category) => category.slug === slug)) {
    return slug;
  }
  return categories[0]?.slug ?? "";
}

const categoryButtonClass =
  "box-border w-full max-w-full cursor-pointer truncate rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors lg:py-2";

function DiscoverCatalogSkeleton() {
  return (
    <div
      className="flex w-full flex-col gap-6 lg:flex-row lg:gap-x-8"
      aria-busy="true"
      aria-label="Loading discover catalog"
    >
      <div className="h-11 w-full animate-pulse rounded-lg bg-brand-navy/5 lg:hidden" />
      <div className="hidden h-64 w-[240px] shrink-0 animate-pulse rounded-lg bg-brand-navy/5 lg:block" />
      <div className="min-h-96 min-w-0 flex-1 animate-pulse rounded-lg bg-brand-navy/5" />
    </div>
  );
}

export function DiscoverCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categorySelectId = useId();

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategoriesQuery();
  const {
    data: apiBooks = [],
    isLoading: booksLoading,
    isError: booksError,
  } = useBooksQuery();

  const activeSlug = resolveCategorySlug(
    searchParams.get("category"),
    categories,
  );

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: category.slug,
        label: category.label,
      })),
    [categories],
  );

  const activeCategory = useMemo(
    () =>
      categories.find((category) => category.slug === activeSlug) ??
      categories[0],
    [categories, activeSlug],
  );

  const books = useMemo(() => {
    if (!activeCategory) return [];
    return apiBooks
      .filter((book) => book.categoryId === activeCategory.id)
      .map(bookRecordToListing);
  }, [apiBooks, activeCategory]);

  const bookSlots = useMemo(
    () =>
      Array.from({ length: BOOK_SHOWCASE_MAX_ITEMS }, (_, index) => books[index] ?? null),
    [books],
  );

  const bookSlotWrapperClass =
    "flex w-[calc(50%-0.5rem)] min-w-0 sm:w-auto sm:flex-1";

  function selectCategory(slug: string) {
    router.replace(`/discover?category=${encodeURIComponent(slug)}`, {
      scroll: false,
    });
  }

  const catalogLoadFailed = categoriesError || booksError;
  useNotifyQueryError(
    catalogLoadFailed,
    null,
    "Could not load the catalog. Try refreshing the page.",
  );

  if (categoriesLoading || booksLoading) {
    return <DiscoverCatalogSkeleton />;
  }

  if (catalogLoadFailed) {
    return (
      <p className="text-sm text-muted">
        Could not load the catalog. Try refreshing the page.
      </p>
    );
  }

  if (!activeCategory) {
    return (
      <p className="text-sm text-muted">
        No categories yet.{" "}
        <Link href="/" className="text-brand-teal hover:underline">
          Back to home
        </Link>
      </p>
    );
  }

  return (
    <div className="flex w-full min-w-0 flex-col items-stretch gap-6 self-stretch lg:flex-row lg:items-start lg:gap-x-8">
      <div className="w-full min-w-0 lg:hidden">
        <label
          htmlFor={categorySelectId}
          className="text-xs font-bold tracking-wide text-navy uppercase"
        >
          Category
        </label>
        <div className="mt-2">
          <DiscoverCategorySelect
            inputId={categorySelectId}
            value={activeSlug}
            options={categoryOptions}
            onChange={selectCategory}
          />
        </div>
      </div>

      <aside className="hidden box-border w-[240px] min-w-[240px] max-w-[240px] shrink-0 grow-0 basis-[240px] self-start overflow-hidden lg:block lg:sticky lg:top-[calc(var(--site-header-height)+1rem)] lg:z-10 lg:max-h-[calc(100dvh-var(--site-header-height)-2rem)] lg:overflow-y-auto lg:overscroll-contain lg:[scrollbar-gutter:stable]">
        <h2 className="text-xs font-bold tracking-wide text-navy uppercase">
          Categories
        </h2>
        <nav className="mt-3 w-full min-w-0" aria-label="Browse categories">
          <div className="flex w-full min-w-0 flex-col gap-0.5">
            {categories.map((category) => {
              const isActive = category.slug === activeSlug;
              return (
                <div key={category.id} className="w-full min-w-0 max-w-full">
                  <button
                    type="button"
                    title={category.label}
                    onClick={() => selectCategory(category.slug)}
                    className={`${categoryButtonClass} ${
                      isActive
                        ? "border-brand-teal/40 bg-brand-teal/15 text-navy"
                        : "border-transparent text-foreground hover:border-border hover:bg-brand-navy/5 hover:text-navy"
                    }`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {category.label}
                  </button>
                </div>
              );
            })}
          </div>
        </nav>
      </aside>

      <section className="w-full min-w-0 lg:min-h-0 lg:flex-1 lg:basis-0">
        <h2 className="text-xl font-bold text-navy sm:text-2xl">
          {activeCategory.label}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {books.length} {books.length === 1 ? "title" : "titles"} in this
          category
        </p>

        <div className="mt-6 flex w-full flex-wrap gap-x-4 gap-y-6 sm:flex-nowrap sm:gap-6">
          {bookSlots.map((book, index) => (
            <div
              key={book?.id ?? `discover-slot-${index}`}
              className={bookSlotWrapperClass}
              aria-hidden={book ? undefined : true}
            >
              {book ? <BookCard book={book} /> : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
