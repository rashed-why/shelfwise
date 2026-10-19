import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookDetailContent } from "@/components/books/book-detail-content";
import {
  getAllBookSlugs,
  getBookBySlug,
  getRelatedBooks,
} from "@/lib/book-details";

type BookPageProps = PageProps<"/books/[slug]">;

export function generateStaticParams() {
  return getAllBookSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) return { title: "Book not found" };

  return {
    title: book.title,
    description: book.summary,
  };
}

export default async function BookDetailPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) notFound();

  const relatedBooks = getRelatedBooks(slug);

  return (
    <main className="w-full flex-1 py-8 sm:py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <BookDetailContent
          book={book}
          relatedBooks={relatedBooks}
          backHref="/discover"
        />
      </div>
    </main>
  );
}
