import Image from "next/image";
import Link from "next/link";
import type { BookListing } from "@/lib/books";
import { canonicalBookHref } from "@/lib/book-paths";

type BookCardProps = {
  book: BookListing;
};

export function BookCard({ book }: BookCardProps) {
  const holdHref = `${canonicalBookHref(book.href)}/hold`;

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
        <Link
          href={holdHref}
          className="inline-flex w-full items-center justify-center rounded-md border border-border bg-white px-2 py-1.5 text-xs font-semibold text-navy no-underline transition-colors hover:border-brand-teal hover:bg-brand-teal/5 hover:text-primary sm:text-[13px]"
        >
          Place hold
        </Link>
      </div>
    </article>
  );
}
