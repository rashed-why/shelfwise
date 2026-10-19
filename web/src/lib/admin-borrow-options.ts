import { loadAdminBooks } from "@/lib/admin-catalog-storage";
import {
  loadAllAdminUsers,
  type AdminUserRow,
} from "@/lib/admin-users-demo";
import { mostViewedBooks } from "@/lib/books";
import { categories } from "@/lib/categories";
import { getBooksForCategory } from "@/lib/category-books";

export type BorrowBookOption = {
  id: string;
  title: string;
  author: string;
};

export function loadAvailableBorrowBooks(): BorrowBookOption[] {
  const seen = new Set<string>();
  const result: BorrowBookOption[] = [];

  function add(title: string, author: string, id: string) {
    const key = title.trim().toLowerCase();
    if (!key || seen.has(key)) {
      return;
    }
    seen.add(key);
    result.push({
      id,
      title: title.trim(),
      author: author.trim() || "Unknown author",
    });
  }

  for (const book of mostViewedBooks) {
    add(book.title, book.author, book.id);
  }

  for (const category of categories) {
    for (const book of getBooksForCategory(category.slug)) {
      add(book.title, book.author, book.id);
    }
  }

  for (const book of loadAdminBooks()) {
    add(book.title, book.author, book.id);
  }

  return result.sort((a, b) => a.title.localeCompare(b.title));
}

export function loadAvailableBorrowers(): AdminUserRow[] {
  return loadAllAdminUsers();
}
