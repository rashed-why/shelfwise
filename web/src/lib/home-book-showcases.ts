import { getApiAssetUrl } from "@/lib/api-client";
import type { BookDetail } from "@/lib/book-details";
import type { BookListing } from "@/lib/books";
import type { BookRecord } from "@/lib/books-api";
import type { CategoryRecord } from "@/lib/categories-api";
import type { CategoryBookShowcase } from "@/lib/category-books";

export const FEATURED_CATEGORY_SHOWCASE_COUNT = 5;

export function bookRecordToListing(book: BookRecord): BookListing {
  return {
    id: book.id,
    title: book.title,
    author: book.author.name,
    href: `/discover/${book.category.slug}/${book.id}`,
    coverUrl: getApiAssetUrl(book.image),
  };
}

export function bookRecordToDetail(book: BookRecord): BookDetail {
  const summary = book.summary?.trim();

  return {
    slug: book.id,
    title: book.title,
    author: book.author.name,
    coverUrl: getApiAssetUrl(book.image),
    summary:
      summary ||
      `${book.title} by ${book.author.name} — available to borrow on Shelfwise.`,
  };
}

export function buildCategoryBookShowcases(
  categories: CategoryRecord[],
  books: BookRecord[],
  featuredCount = FEATURED_CATEGORY_SHOWCASE_COUNT,
): CategoryBookShowcase[] {
  const booksByCategoryId = new Map<string, BookRecord[]>();

  for (const book of books) {
    const categoryBooks = booksByCategoryId.get(book.categoryId) ?? [];
    categoryBooks.push(book);
    booksByCategoryId.set(book.categoryId, categoryBooks);
  }

  return categories.slice(0, featuredCount).map((category) => ({
    slug: category.slug,
    title: category.label,
    viewAllHref: `/discover?category=${encodeURIComponent(category.slug)}`,
    books: (booksByCategoryId.get(category.id) ?? []).map(bookRecordToListing),
  }));
}
