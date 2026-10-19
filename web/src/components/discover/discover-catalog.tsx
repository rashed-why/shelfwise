"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useId, useMemo } from "react";
import { BookCard } from "@/components/books/book-card";
import { DiscoverCategorySelect } from "@/components/discover/discover-category-select";
import { categories } from "@/lib/categories";
import {
  DISCOVER_CATEGORY_BOOK_COUNT,
  getBooksForCategory,
} from "@/lib/category-books";

function resolveCategorySlug(slug: string | null | undefined) {
  if (slug && categories.some((c) => c.slug === slug)) return slug;
  return categories[0]?.slug ?? "self-help";
}

const categoryButtonClass =
  "box-border w-full max-w-full cursor-pointer truncate rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors lg:py-2";

export function DiscoverCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categorySelectId = useId();
  const activeSlug = resolveCategorySlug(searchParams.get("category"));

  function selectCategory(slug: string) {
    router.replace(`/discover?category=${encodeURIComponent(slug)}`, {
      scroll: false,
    });
  }

  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === activeSlug) ?? categories[0],
    [activeSlug],
  );

  const books = useMemo(
    () =>
      getBooksForCategory(activeSlug).slice(0, DISCOVER_CATEGORY_BOOK_COUNT),
    [activeSlug],
  );

  if (!activeCategory) return null;

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
            onChange={selectCategory}
          />
        </div>
      </div>

      <aside
        className="hidden box-border w-[240px] min-w-[240px] max-w-[240px] shrink-0 grow-0 basis-[240px] self-start overflow-hidden lg:block lg:sticky lg:top-[calc(var(--site-header-height)+1rem)] lg:z-10 lg:max-h-[calc(100dvh-var(--site-header-height)-2rem)] lg:overflow-y-auto lg:overscroll-contain lg:[scrollbar-gutter:stable]"
      >
        <h2 className="text-xs font-bold tracking-wide text-navy uppercase">
          Categories
        </h2>
        <nav className="mt-3 w-full min-w-0" aria-label="Browse categories">
          <div className="flex w-full min-w-0 flex-col gap-0.5">
            {categories.map((category) => {
              const isActive = category.slug === activeSlug;
              return (
                <div key={category.slug} className="w-full min-w-0 max-w-full">
                  <button
                    type="button"
                    title={category.label}
                    onClick={() => selectCategory(category.slug)}
                    className={`${categoryButtonClass} ${isActive
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
          {books.map((book) => (
            <div
              key={book.id}
              className="flex w-[calc(50%-0.5rem)] min-w-0 sm:w-auto sm:flex-1"
            >
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
