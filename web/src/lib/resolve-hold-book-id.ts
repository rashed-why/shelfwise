import type { BookListing } from "@/lib/books";

/** Backend book id from a discover detail URL or listing id. */
export function resolveHoldBookId(
  book: Pick<BookListing, "id" | "href">,
): string {
  const fromDiscover = book.href.match(/\/discover\/[^/]+\/([^/?#]+)/)?.[1];
  if (fromDiscover) {
    return fromDiscover;
  }

  return book.id;
}
