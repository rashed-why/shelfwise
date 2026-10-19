"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { bookRecordToListing } from "@/lib/home-book-showcases";
import { useBooksQuery } from "@/lib/queries/books";

const SUGGESTION_LIMIT = 8;
const MIN_QUERY_LENGTH = 1;

const panelClass =
  "absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-xl border border-border bg-white py-1 shadow-lg";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function matchesBookQuery(title: string, author: string, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return false;
  return (
    title.toLowerCase().includes(normalized) ||
    author.toLowerCase().includes(normalized)
  );
}

export function SiteHeaderSearch() {
  const router = useRouter();
  const listboxId = useId();
  const rootRef = useRef<HTMLFormElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const { data: books = [], isLoading } = useBooksQuery();

  const suggestions = useMemo(() => {
    if (query.trim().length < MIN_QUERY_LENGTH) {
      return [];
    }

    return books
      .filter((book) =>
        matchesBookQuery(book.title, book.author.name, query),
      )
      .slice(0, SUGGESTION_LIMIT)
      .map(bookRecordToListing);
  }, [books, query]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  function goToBook(href: string) {
    setQuery("");
    setOpen(false);
    router.push(href);
  }

  function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    const first = suggestions[0];
    if (first) {
      goToBook(first.href);
    }
  }

  const hasQuery = query.trim().length >= MIN_QUERY_LENGTH;
  const showPanel = open && hasQuery;

  return (
    <form
      ref={rootRef}
      onSubmit={handleSubmit}
      role="search"
      className="relative min-w-0 w-full sm:min-w-0 sm:flex-1"
    >
      <label htmlFor="site-search" className="sr-only">
        Search books
      </label>
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted" />
      <input
        id="site-search"
        name="q"
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search books, authors, topics…"
        className="w-full rounded-full border border-border bg-white py-2 pr-4 pl-10 text-sm text-foreground outline-none placeholder:text-muted focus:border-secondary focus:ring-2 focus:ring-ring/30 sm:py-2.5"
        autoComplete="off"
        aria-expanded={showPanel}
        aria-controls={showPanel ? listboxId : undefined}
        aria-autocomplete="list"
      />

      {showPanel ? (
        <div id={listboxId} className={panelClass} role="listbox">
          {isLoading ? (
            <p className="px-4 py-3 text-sm text-muted">Loading books…</p>
          ) : suggestions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted">No books match your search.</p>
          ) : (
            suggestions.map((book) => (
              <button
                key={book.id}
                type="button"
                role="option"
                className="flex w-full cursor-pointer flex-col gap-0.5 px-4 py-2.5 text-left text-sm transition-colors hover:bg-brand-teal/5"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => goToBook(book.href)}
              >
                <span className="font-medium text-navy">{book.title}</span>
                <span className="text-xs text-muted">{book.author}</span>
              </button>
            ))
          )}
        </div>
      ) : null}
    </form>
  );
}
