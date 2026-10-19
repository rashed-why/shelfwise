import { categories } from "@/lib/categories";
import type { BookListing } from "@/lib/books";

export type CategoryBookShowcase = {
  slug: string;
  title: string;
  viewAllHref: string;
  books: BookListing[];
};

const FEATURED_CATEGORY_COUNT = 5;

/** Books shown in the discover page main panel (every category). */
export const DISCOVER_CATEGORY_BOOK_COUNT = 4;

function booksForCategory(slug: string, items: Omit<BookListing, "id">[]): BookListing[] {
  return items.map((book, index) => ({
    ...book,
    id: `${slug}-${index + 1}`,
    href: `/discover/${slug}/${book.href.replace("/books/", "")}`,
  }));
}

const booksByCategorySlug: Record<string, Omit<BookListing, "id">[]> = {
  "self-help": [
    { title: "Atomic Habits", author: "James Clear", href: "/books/atomic-habits", coverUrl: "https://covers.openlibrary.org/b/id/8225261-L.jpg" },
    { title: "The 7 Habits of Highly Effective People", author: "Stephen R. Covey", href: "/books/seven-habits", coverUrl: "https://covers.openlibrary.org/b/id/6981017-L.jpg" },
    { title: "Mindset", author: "Carol S. Dweck", href: "/books/mindset", coverUrl: "https://covers.openlibrary.org/b/id/8259592-L.jpg" },
    { title: "The Power of Now", author: "Eckhart Tolle", href: "/books/the-power-of-now", coverUrl: "https://covers.openlibrary.org/b/id/7222266-L.jpg" },
    { title: "Can't Hurt Me", author: "David Goggins", href: "/books/cant-hurt-me", coverUrl: "https://covers.openlibrary.org/b/id/7925780-L.jpg" },
    { title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson", href: "/books/subtle-art", coverUrl: "https://covers.openlibrary.org/b/id/7222246-L.jpg" },
  ],
  mindfulness: [
    { title: "Wherever You Go, There You Are", author: "Jon Kabat-Zinn", href: "/books/wherever-you-go", coverUrl: "https://covers.openlibrary.org/b/id/8228691-L.jpg" },
    { title: "The Miracle of Mindfulness", author: "Thich Nhat Hanh", href: "/books/miracle-of-mindfulness", coverUrl: "https://covers.openlibrary.org/b/id/6979861-L.jpg" },
    { title: "10% Happier", author: "Dan Harris", href: "/books/ten-percent-happier", coverUrl: "https://covers.openlibrary.org/b/id/8225261-L.jpg" },
    { title: "Radical Acceptance", author: "Tara Brach", href: "/books/radical-acceptance", coverUrl: "https://covers.openlibrary.org/b/id/7222246-L.jpg" },
    { title: "Aware", author: "Daniel J. Siegel", href: "/books/aware", coverUrl: "https://covers.openlibrary.org/b/id/7925780-L.jpg" },
    { title: "Peace Is Every Step", author: "Thich Nhat Hanh", href: "/books/peace-every-step", coverUrl: "https://covers.openlibrary.org/b/id/7222266-L.jpg" },
  ],
  productivity: [
    { title: "Deep Work", author: "Cal Newport", href: "/books/deep-work", coverUrl: "https://covers.openlibrary.org/b/id/7925780-L.jpg" },
    { title: "Getting Things Done", author: "David Allen", href: "/books/gtd", coverUrl: "https://covers.openlibrary.org/b/id/6981017-L.jpg" },
    { title: "Essentialism", author: "Greg McKeown", href: "/books/essentialism", coverUrl: "https://covers.openlibrary.org/b/id/8259592-L.jpg" },
    { title: "The One Thing", author: "Gary Keller", href: "/books/the-one-thing", coverUrl: "https://covers.openlibrary.org/b/id/8225261-L.jpg" },
    { title: "Make Time", author: "Jake Knapp", href: "/books/make-time", coverUrl: "https://covers.openlibrary.org/b/id/7222246-L.jpg" },
    { title: "Four Thousand Weeks", author: "Oliver Burkeman", href: "/books/four-thousand-weeks", coverUrl: "https://covers.openlibrary.org/b/id/7222266-L.jpg" },
  ],
  psychology: [
    { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", href: "/books/thinking-fast-and-slow", coverUrl: "https://covers.openlibrary.org/b/id/7222266-L.jpg" },
    { title: "The Body Keeps the Score", author: "Bessel van der Kolk", href: "/books/body-keeps-score", coverUrl: "https://covers.openlibrary.org/b/id/8225261-L.jpg" },
    { title: "Influence", author: "Robert B. Cialdini", href: "/books/influence", coverUrl: "https://covers.openlibrary.org/b/id/7925780-L.jpg" },
    { title: "Man's Search for Meaning", author: "Viktor E. Frankl", href: "/books/mans-search-for-meaning", coverUrl: "https://covers.openlibrary.org/b/id/6979861-L.jpg" },
    { title: "The Happiness Hypothesis", author: "Jonathan Haidt", href: "/books/happiness-hypothesis", coverUrl: "https://covers.openlibrary.org/b/id/7222246-L.jpg" },
    { title: "Quiet", author: "Susan Cain", href: "/books/quiet", coverUrl: "https://covers.openlibrary.org/b/id/8259592-L.jpg" },
  ],
  "health-fitness": [
    { title: "Why We Sleep", author: "Matthew Walker", href: "/books/why-we-sleep", coverUrl: "https://covers.openlibrary.org/b/id/8228691-L.jpg" },
    { title: "Born to Run", author: "Christopher McDougall", href: "/books/born-to-run", coverUrl: "https://covers.openlibrary.org/b/id/6981017-L.jpg" },
    { title: "The 4-Hour Body", author: "Tim Ferriss", href: "/books/four-hour-body", coverUrl: "https://covers.openlibrary.org/b/id/8225261-L.jpg" },
    { title: "Spark", author: "John J. Ratey", href: "/books/spark", coverUrl: "https://covers.openlibrary.org/b/id/7925780-L.jpg" },
    { title: "Breath", author: "James Nestor", href: "/books/breath", coverUrl: "https://covers.openlibrary.org/b/id/7222246-L.jpg" },
    { title: "Outlive", author: "Peter Attia", href: "/books/outlive", coverUrl: "https://covers.openlibrary.org/b/id/7222266-L.jpg" },
  ],
};

const fallbackBookItems = booksByCategorySlug["self-help"];

export function getBooksForCategory(slug: string): BookListing[] {
  const items = booksByCategorySlug[slug] ?? fallbackBookItems;
  return booksForCategory(slug, items);
}

export function getFeaturedCategoryShowcases(): CategoryBookShowcase[] {
  return categories.slice(0, FEATURED_CATEGORY_COUNT).map((category) => ({
    slug: category.slug,
    title: category.label,
    viewAllHref: `/discover/${category.slug}`,
    books: getBooksForCategory(category.slug),
  }));
}
