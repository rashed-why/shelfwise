import { mostViewedBooks, type BookListing } from "@/lib/books";
import { bookSlugFromHref } from "@/lib/book-paths";
import { categories } from "@/lib/categories";
import { getBooksForCategory } from "@/lib/category-books";

export type BookDetail = {
  slug: string;
  title: string;
  author: string;
  coverUrl: string;
  summary: string;
};

const extraSummaries: Record<string, string> = {
  "the-alchemist":
    "A shepherd named Santiago follows his dream from Spain to the Egyptian desert, learning that the journey matters as much as the destination.",
};

function slugFromHref(href: string) {
  return bookSlugFromHref(href);
}

function buildCatalog(): Map<string, BookDetail> {
  const map = new Map<string, BookDetail>();

  function add(book: {
    title: string;
    author: string;
    href: string;
    coverUrl: string;
  }) {
    const slug = slugFromHref(book.href);
    if (map.has(slug)) return;

    map.set(slug, {
      slug,
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl,
      summary:
        extraSummaries[slug] ??
        `${book.title} by ${book.author} — available to borrow on Shelfwise.`,
    });
  }

  for (const book of mostViewedBooks) {
    add(book);
  }

  for (const category of categories) {
    for (const book of getBooksForCategory(category.slug)) {
      add(book);
    }
  }

  return map;
}

const bookCatalog = buildCatalog();

export function getAllBookSlugs(): string[] {
  return [...bookCatalog.keys()];
}

export function getBookBySlug(slug: string): BookDetail | undefined {
  return bookCatalog.get(slug);
}

export const RELATED_BOOKS_MAX = 6;

function bookDetailToListing(detail: BookDetail): BookListing {
  return {
    id: detail.slug,
    title: detail.title,
    author: detail.author,
    href: `/books/${detail.slug}`,
    coverUrl: detail.coverUrl,
  };
}

export function getRelatedBooks(
  slug: string,
  limit = RELATED_BOOKS_MAX,
): BookListing[] {
  const related: BookDetail[] = [];

  for (const book of mostViewedBooks) {
    const bookSlug = slugFromHref(book.href);
    if (bookSlug === slug) continue;
    const detail = bookCatalog.get(bookSlug);
    if (detail) related.push(detail);
    if (related.length >= limit) return related.map(bookDetailToListing);
  }

  for (const [bookSlug, detail] of bookCatalog) {
    if (bookSlug === slug || related.some((item) => item.slug === bookSlug)) {
      continue;
    }
    related.push(detail);
    if (related.length >= limit) break;
  }

  return related.map(bookDetailToListing);
}
