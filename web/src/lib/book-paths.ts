/** Last path segment for /books/slug or /discover/category/slug links. */
export function bookSlugFromHref(href: string): string {
  const fromBooksPath = href.match(/\/books\/([^/?#]+)/);
  if (fromBooksPath) return fromBooksPath[1];

  const segments = href.split("/").filter(Boolean);
  return segments.at(-1) ?? "";
}

export function canonicalBookHref(href: string): string {
  const slug = bookSlugFromHref(href);
  return slug ? `/books/${slug}` : href;
}
