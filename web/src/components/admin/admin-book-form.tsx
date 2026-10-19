"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import Link from "next/link";
import type { Category } from "@/lib/categories";
import {
  authFieldClass,
  authLabelClass,
  authSubmitClass,
} from "@/lib/auth-form-styles";
import {
  AdminTable,
  adminTableCellClass,
} from "@/components/admin/admin-table";
import {
  getAllAuthorOptions,
  getAllCategoryOptions,
  loadAdminBooks,
  saveAdminBook,
  type AdminAuthor,
  type AdminBook,
} from "@/lib/admin-catalog-storage";

export function AdminBookForm() {
  const titleId = useId();
  const authorId = useId();
  const coverId = useId();
  const categoryId = useId();
  const summaryId = useId();
  const slugId = useId();

  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [authorOptions, setAuthorOptions] = useState<AdminAuthor[]>([]);
  const [items, setItems] = useState<AdminBook[]>([]);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setCategoryOptions(getAllCategoryOptions());
    setAuthorOptions(getAllAuthorOptions());
    setItems(loadAdminBooks());
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const result = saveAdminBook({
      title: String(formData.get("title") ?? ""),
      author: String(formData.get("author") ?? ""),
      coverUrl: String(formData.get("coverUrl") ?? ""),
      categorySlug: String(formData.get("categorySlug") ?? ""),
      summary: String(formData.get("summary") ?? "") || undefined,
      slug: String(formData.get("slug") ?? "") || undefined,
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setStatus({ type: "error", text: result.error });
      return;
    }

    setStatus({
      type: "success",
      text: `Added "${result.book.title}".`,
    });
    form.reset();
    setItems(loadAdminBooks());
  }

  return (
    <div className="space-y-8">
      <form
        className="w-full space-y-4 rounded-xl border border-border bg-white p-5 sm:p-6"
        onSubmit={handleSubmit}
      >
        <div>
          <h2 className="text-lg font-semibold text-navy">New book</h2>
          <p className="mt-1 text-sm text-muted">
            Saved in this browser only. Pick an author and category you have
            added (or built-in categories).
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor={titleId} className={authLabelClass}>
            Title
          </label>
          <input id={titleId} name="title" required className={authFieldClass} />
        </div>

        <div className="space-y-2">
          <label htmlFor={authorId} className={authLabelClass}>
            Author
          </label>
          {authorOptions.length === 0 ? (
            <p className="text-sm text-muted">
              No authors yet.{" "}
              <Link
                href="/admin/authors"
                className="font-medium text-secondary no-underline hover:text-brand-teal"
              >
                Add authors
              </Link>{" "}
              first.
            </p>
          ) : (
            <select
              id={authorId}
              name="author"
              required
              defaultValue=""
              className={authFieldClass}
            >
              <option value="" disabled>
                Select an author
              </option>
              {authorOptions.map((author) => (
                <option key={author.id} value={author.name}>
                  {author.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor={coverId} className={authLabelClass}>
            Cover URL
          </label>
          <input
            id={coverId}
            name="coverUrl"
            type="url"
            required
            placeholder="https://covers.openlibrary.org/b/id/8225261-L.jpg"
            className={authFieldClass}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor={categoryId} className={authLabelClass}>
            Category
          </label>
          <select
            id={categoryId}
            name="categorySlug"
            required
            defaultValue=""
            className={authFieldClass}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categoryOptions.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor={summaryId} className={authLabelClass}>
            Summary (optional)
          </label>
          <textarea
            id={summaryId}
            name="summary"
            rows={3}
            className={`${authFieldClass} min-h-[5rem] resize-y`}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor={slugId} className={authLabelClass}>
            Slug (optional)
          </label>
          <input
            id={slugId}
            name="slug"
            placeholder="my-book-title"
            pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
            className={authFieldClass}
          />
        </div>

        {status ? (
          <p
            role="status"
            className={`text-sm ${status.type === "success" ? "text-brand-teal" : "text-red-600"}`}
          >
            {status.text}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting || authorOptions.length === 0}
          className={`${authSubmitClass} max-w-xs`}
        >
          {isSubmitting ? "Saving…" : "Add book"}
        </button>
      </form>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-navy">Added in this browser</h3>
        <AdminTable
          caption="Books added in this browser"
          columns={["Title", "Author", "Category", "Slug"]}
          isEmpty={items.length === 0}
          emptyMessage="No books added yet."
        >
          {items.map((item) => (
            <tr key={item.id}>
              <td className={`${adminTableCellClass} font-medium`}>
                {item.title}
              </td>
              <td className={adminTableCellClass}>{item.author}</td>
              <td className={`${adminTableCellClass} text-muted`}>
                {item.categorySlug}
              </td>
              <td className={adminTableCellClass}>
                <code className="text-xs text-muted">{item.slug}</code>
              </td>
            </tr>
          ))}
        </AdminTable>
      </section>
    </div>
  );
}
