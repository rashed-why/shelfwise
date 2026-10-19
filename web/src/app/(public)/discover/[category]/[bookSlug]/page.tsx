import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookDetailContent } from "@/components/books/book-detail-content";
import { getBookBySlug, getRelatedBooks } from "@/lib/book-details";
import {
  getAllDiscoverBookParams,
  isDiscoverBookInCategory,
} from "@/lib/discover-books";

type DiscoverBookPageProps = PageProps<"/discover/[category]/[bookSlug]">;

export function generateStaticParams() {
  return getAllDiscoverBookParams();
}

export async function generateMetadata({
  params,
}: DiscoverBookPageProps): Promise<Metadata> {
  const { category, bookSlug } = await params;
  if (!isDiscoverBookInCategory(category, bookSlug)) {
    return { title: "Book not found" };
  }

  const book = getBookBySlug(bookSlug);
  if (!book) return { title: "Book not found" };

  return {
    title: book.title,
    description: book.summary,
  };
}

export default async function DiscoverBookPage({ params }: DiscoverBookPageProps) {
  const { category, bookSlug } = await params;

  if (!isDiscoverBookInCategory(category, bookSlug)) notFound();

  const book = getBookBySlug(bookSlug);
  if (!book) notFound();

  const relatedBooks = getRelatedBooks(bookSlug);
  const backHref = `/discover?category=${encodeURIComponent(category)}`;

  return (
    <main className="w-full flex-1 py-8 sm:py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <BookDetailContent
          book={book}
          relatedBooks={relatedBooks}
          backHref={backHref}
        />
      </div>
    </main>
  );
}
