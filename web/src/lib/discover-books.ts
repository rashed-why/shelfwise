import { categories } from "@/lib/categories";
import { getBooksForCategory } from "@/lib/category-books";
import { bookSlugFromHref } from "@/lib/book-paths";

export function getDiscoverCategorySlugs(): string[] {
  return categories.map((category) => category.slug);
}

export function isDiscoverCategory(slug: string): boolean {
  return categories.some((category) => category.slug === slug);
}

export function getAllDiscoverBookParams(): {
  category: string;
  bookSlug: string;
}[] {
  return categories.flatMap((category) =>
    getBooksForCategory(category.slug).map((book) => ({
      category: category.slug,
      bookSlug: bookSlugFromHref(book.href),
    })),
  );
}

export function isDiscoverBookInCategory(
  categorySlug: string,
  bookSlug: string,
): boolean {
  if (!isDiscoverCategory(categorySlug)) return false;

  return getBooksForCategory(categorySlug).some(
    (book) => bookSlugFromHref(book.href) === bookSlug,
  );
}
