"use client";

import Link from "next/link";
import { useMemo } from "react";
import { BookDetailContent } from "@/components/books/book-detail-content";
import { RELATED_BOOKS_MAX } from "@/lib/book-details";
import {
  bookRecordToDetail,
  bookRecordToListing,
} from "@/lib/home-book-showcases";
import { useBookQuery, useBooksQuery } from "@/lib/queries/books";

export function DiscoverBookDetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading book">
      <div className="h-4 w-36 animate-pulse rounded bg-brand-navy/10" />
      <div className="mt-6 flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
        <div className="mx-auto aspect-[2/3] w-full max-w-[220px] animate-pulse rounded bg-brand-navy/10 sm:mx-0" />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="h-8 w-3/4 animate-pulse rounded bg-brand-navy/10" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-brand-navy/10" />
          <div className="h-20 w-full animate-pulse rounded bg-brand-navy/10" />
        </div>
      </div>
    </div>
  );
}

type DiscoverBookDetailProps = {
  categorySlug: string;
  bookId: string;
};

export function DiscoverBookDetail({
  categorySlug,
  bookId,
}: DiscoverBookDetailProps) {

  const {
    data: bookRecord,
    isLoading: bookLoading,
    isError: bookError,
  } = useBookQuery(bookId);
  const { data: allBooks = [] } = useBooksQuery(Boolean(bookRecord));

  const book = useMemo(
    () => (bookRecord ? bookRecordToDetail(bookRecord) : null),
    [bookRecord],
  );

  const relatedBooks = useMemo(() => {
    if (!bookRecord) return [];
    return allBooks
      .filter(
        (item) =>
          item.id !== bookRecord.id &&
          item.categoryId === bookRecord.categoryId,
      )
      .slice(0, RELATED_BOOKS_MAX)
      .map(bookRecordToListing);
  }, [allBooks, bookRecord]);

  const backHref = `/discover?category=${encodeURIComponent(categorySlug || bookRecord?.category.slug || "")}`;

  if (bookLoading) {
    return <DiscoverBookDetailSkeleton />;
  }

  if (bookError || !book || !bookRecord) {
    return (
      <div>
        <Link
          href="/discover"
          className="text-sm font-medium text-secondary no-underline hover:text-brand-teal"
        >
          ← Back to Discover
        </Link>
        <p className="mt-6 text-sm text-muted">Book not found.</p>
      </div>
    );
  }

  if (bookRecord.category.slug !== categorySlug) {
    return (
      <div>
        <Link
          href={backHref}
          className="text-sm font-medium text-secondary no-underline hover:text-brand-teal"
        >
          ← Back to Discover
        </Link>
        <p className="mt-6 text-sm text-muted">Book not found in this category.</p>
      </div>
    );
  }

  return (
    <BookDetailContent
      book={book}
      bookId={bookRecord.id}
      relatedBooks={relatedBooks}
      backHref={backHref}
    />
  );
}
