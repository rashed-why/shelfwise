"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { authFieldClass, authLabelClass } from "@/lib/auth-form-styles";
import type { BorrowBookOption } from "@/lib/admin-borrow-options";

export type BorrowerOption = {
  id: string;
  name: string;
  email: string;
};

const pickerPanelClass =
  "absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-border bg-white py-1 shadow-lg";

function matchesQuery(text: string, query: string) {
  return text.toLowerCase().includes(query);
}

type BookMultiSelectProps = {
  books: BorrowBookOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  onBlur?: () => void;
  invalid?: boolean;
};

export function BookMultiSelect({
  books,
  selectedIds,
  onChange,
  onBlur,
  invalid,
}: BookMultiSelectProps) {
  const inputId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredBooks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return books;
    }

    return books.filter(
      (book) =>
        matchesQuery(book.title, normalized) ||
        matchesQuery(book.author, normalized),
    );
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

  function toggleId(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
      return;
    }
    onChange([...selectedIds, id]);
  }

  const selectedBooks = books.filter((book) => selectedIds.includes(book.id));

  return (
    <div ref={rootRef} className="relative space-y-2">
      <label htmlFor={inputId} className={authLabelClass}>
        Book title
      </label>
      <input
        id={inputId}
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={onBlur}
        placeholder="Search and select books…"
        className={authFieldClass}
        autoComplete="off"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={invalid}
      />

      {open ? (
        <div className={pickerPanelClass} role="listbox" aria-multiselectable>
          {filteredBooks.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted">
              {books.length === 0
                ? "No books in catalog."
                : "No books match your search."}
            </p>
          ) : (
            filteredBooks.map((book) => {
              const checked = selectedIds.includes(book.id);
              return (
                <label
                  key={book.id}
                  onMouseDown={(event) => event.preventDefault()}
                  className="flex cursor-pointer items-start gap-2 px-3 py-2 text-sm hover:bg-brand-teal/5"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleId(book.id)}
                    className="mt-0.5 size-4 rounded border-border"
                  />
                  <span>
                    <span className="font-medium text-navy">{book.title}</span>
                    <span className="block text-xs text-muted">{book.author}</span>
                  </span>
                </label>
              );
            })
          )}
        </div>
      ) : null}

      {selectedBooks.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {selectedBooks.map((book) => (
            <li
              key={book.id}
              className="rounded-full bg-brand-teal/10 px-2.5 py-0.5 text-xs font-medium text-navy"
            >
              {book.title}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

type BorrowerSelectProps = {
  users: BorrowerOption[];
  selectedUserId: string;
  onChange: (userId: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
};

export function BorrowerSelect({
  users,
  selectedUserId,
  onChange,
  onBlur,
  invalid,
}: BorrowerSelectProps) {
  const selectedUser = users.find((user) => user.id === selectedUserId) ?? null;
  const inputId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return users;
    }

    return users.filter(
      (user) =>
        matchesQuery(user.name, normalized) ||
        matchesQuery(user.email, normalized),
    );
  }, [users, query]);

  useEffect(() => {
    if (!open && selectedUser) {
      setQuery(selectedUser.name);
    }
  }, [open, selectedUser]);

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

  return (
    <div ref={rootRef} className="relative space-y-2 sm:col-span-2">
      <label htmlFor={inputId} className={authLabelClass}>
        Borrower name
      </label>
      <input
        id={inputId}
        type="search"
        value={query}
        onChange={(event) => {
          const next = event.target.value;
          setQuery(next);
          setOpen(true);
          if (selectedUser && next !== selectedUser.name) {
            onChange("");
          }
        }}
        onFocus={() => setOpen(true)}
        onBlur={onBlur}
        placeholder="Search users by name or email…"
        className={authFieldClass}
        autoComplete="off"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={invalid}
      />

      {open ? (
        <div className={pickerPanelClass} role="listbox">
          {filteredUsers.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted">
              {users.length === 0
                ? "No users available."
                : "No users match your search."}
            </p>
          ) : (
            filteredUsers.map((user) => (
              <button
                key={user.id}
                type="button"
                role="option"
                aria-selected={selectedUserId === user.id}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(user.id);
                  setQuery(user.name);
                  setOpen(false);
                }}
                className="flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-brand-teal/5"
              >
                <span className="font-medium text-navy">{user.name}</span>
                <span className="text-xs text-muted">{user.email}</span>
              </button>
            ))
          )}
        </div>
      ) : null}

      {selectedUser ? (
        <p className="text-xs text-muted">
          Email: <span className="text-navy">{selectedUser.email}</span>
        </p>
      ) : null}
    </div>
  );
}
