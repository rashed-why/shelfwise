export type BookListing = {
  id: string;
  title: string;
  author: string;
  href: string;
  coverUrl: string;
};

export const BOOK_SHOWCASE_MAX_ITEMS = 6;

export const mostViewedBooks: BookListing[] = [
  {
    id: "mv-1",
    title: "Atomic Habits",
    author: "James Clear",
    href: "/books/atomic-habits",
    coverUrl: "https://covers.openlibrary.org/b/id/8225261-L.jpg",
  },
  {
    id: "mv-2",
    title: "The Alchemist",
    author: "Paulo Coelho",
    href: "/books/the-alchemist",
    coverUrl: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
  },
  {
    id: "mv-3",
    title: "Deep Work",
    author: "Cal Newport",
    href: "/books/deep-work",
    coverUrl: "https://covers.openlibrary.org/b/id/7925780-L.jpg",
  },
  {
    id: "mv-4",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    href: "/books/thinking-fast-and-slow",
    coverUrl: "https://covers.openlibrary.org/b/id/7222266-L.jpg",
  },
  {
    id: "mv-5",
    title: "The Power of Now",
    author: "Eckhart Tolle",
    href: "/books/the-power-of-now",
    coverUrl: "https://covers.openlibrary.org/b/id/8259592-L.jpg",
  },
  {
    id: "mv-6",
    title: "Mindset",
    author: "Carol S. Dweck",
    href: "/books/mindset",
    coverUrl: "https://covers.openlibrary.org/b/id/6981017-L.jpg",
  },
];

export const mostViewedViewAllHref = "/most-viewed/all-time";
