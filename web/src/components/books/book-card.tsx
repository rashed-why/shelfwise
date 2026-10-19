import Image from "next/image";
import Link from "next/link";
import { PlaceHoldButton } from "@/components/books/place-hold-button";
import type { BookListing } from "@/lib/books";
import { resolveHoldBookId } from "@/lib/resolve-hold-book-id";

type BookCardProps = {
  book: BookListing;
};

export function BookCard({ book }: BookCardProps) {
  const holdBookId = resolveHoldBookId(book);

  return (
    <article className="flex h-full w-full min-w-0 flex-col">
      <Link href={book.href} className="group block w-full min-w-0 no-underline">
        <div className="relative aspect-[2/3] w-full max-w-full overflow-hidden bg-brand-navy/5 shadow-md shadow-brand-navy/10 transition-shadow group-hover:shadow-lg">
          <Image
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
            fill
            sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 16vw"
            className="object-cover object-center"
            unoptimized
          />
        </div>
        <p className="mt-3 line-clamp-2 text-sm font-bold leading-snug text-foreground group-hover:text-navy">
          {book.title}
        </p>
        <p className="mt-1 truncate text-sm text-muted">{book.author}</p>
      </Link>

      <div className="mt-auto pt-4">
        <PlaceHoldButton bookId={holdBookId} variant="card" />
      </div>
    </article>
  );
}
