"use client";

import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { AdminPagination } from "@/components/admin/admin-pagination";
import {
  AdminTable,
  adminTableCellClass,
} from "@/components/admin/admin-table";
import { getApiAssetUrl } from "@/lib/api-client";
import type { BookRecord } from "@/lib/books-api";
import {
  authFieldClass,
  authLabelClass,
  authSubmitClass,
} from "@/lib/auth-form-styles";
import { useAuthorsQuery } from "@/lib/queries/authors";
import {
  useBooksQuery,
  useCreateBookMutation,
  useDeleteBookMutation,
  useUpdateBookMutation,
} from "@/lib/queries/books";
import { useCategoriesQuery } from "@/lib/queries/categories";
import {
  createBookSchema,
  updateBookFormSchema,
  type CreateBookFormValues,
  type UpdateBookFormValues,
} from "@/lib/schemas/create-book.schema";
import { zodToFormikErrors } from "@/lib/zod-formik";
import { notifyErrorFromUnknown, notifySuccess } from "@/lib/toast";
import { useNotifyQueryError } from "@/lib/use-notify-query-error";

type AdminBookFormProps = {
  view: "create" | "list";
};

const BOOK_LIST_PAGE_SIZE = 10;

const createInitialValues: CreateBookFormValues = {
  title: "",
  categoryId: "",
  authorId: "",
  summary: "",
  image: null,
};

function BookRelationFields({
  categoryId,
  authorId,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
}: {
  categoryId: string;
  authorId: string;
  values: { categoryId: string; authorId: string };
  errors: { categoryId?: string; authorId?: string };
  touched: { categoryId?: boolean; authorId?: boolean };
  handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >;
  handleBlur: React.FocusEventHandler<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >;
}) {
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategoriesQuery();
  const {
    data: authors = [],
    isLoading: authorsLoading,
    isError: authorsError,
  } = useAuthorsQuery();

  const relationsLoadFailed = categoriesError || authorsError;
  useNotifyQueryError(
    relationsLoadFailed,
    null,
    "Could not load categories or authors for this form.",
  );

  if (categoriesLoading || authorsLoading) {
    return <p className="text-sm text-muted">Loading categories and authors…</p>;
  }

  if (relationsLoadFailed) {
    return (
      <p className="text-sm text-muted">
        Could not load categories or authors for this form.
      </p>
    );
  }

  return (
    <>
      <div className="space-y-2">
        <label htmlFor={authorId} className={authLabelClass}>
          Author
        </label>
        {authors.length === 0 ? (
          <p className="text-sm text-muted">
            No authors yet.{" "}
            <Link
              href="/admin/authors/create"
              className="font-medium text-secondary no-underline hover:text-brand-teal"
            >
              Add authors
            </Link>{" "}
            first.
          </p>
        ) : (
          <select
            id={authorId}
            name="authorId"
            value={values.authorId}
            onChange={handleChange}
            onBlur={handleBlur}
            className={authFieldClass}
            aria-invalid={Boolean(touched.authorId && errors.authorId)}
          >
            <option value="" disabled>
              Select an author
            </option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        )}
        {touched.authorId && errors.authorId ? (
          <p className="text-sm text-red-600">{errors.authorId}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor={categoryId} className={authLabelClass}>
          Category
        </label>
        {categories.length === 0 ? (
          <p className="text-sm text-muted">
            No categories yet.{" "}
            <Link
              href="/admin/categories/create"
              className="font-medium text-secondary no-underline hover:text-brand-teal"
            >
              Add categories
            </Link>{" "}
            first.
          </p>
        ) : (
          <select
            id={categoryId}
            name="categoryId"
            value={values.categoryId}
            onChange={handleChange}
            onBlur={handleBlur}
            className={authFieldClass}
            aria-invalid={Boolean(touched.categoryId && errors.categoryId)}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        )}
        {touched.categoryId && errors.categoryId ? (
          <p className="text-sm text-red-600">{errors.categoryId}</p>
        ) : null}
      </div>
    </>
  );
}

function AdminBookCreateForm() {
  const router = useRouter();
  const titleId = useId();
  const authorFieldId = useId();
  const categoryFieldId = useId();
  const summaryId = useId();
  const imageId = useId();
  const createBook = useCreateBookMutation();
  const { data: authors = [] } = useAuthorsQuery();
  const { data: categories = [] } = useCategoriesQuery();

  return (
    <Formik
      initialValues={createInitialValues}
      validate={(values) => zodToFormikErrors(createBookSchema, values)}
      onSubmit={(values, { resetForm }) => {
        createBook.mutate(values, {
          onSuccess: () => {
            notifySuccess("Book created successfully.");
            resetForm();
            router.push("/admin/books/list");
          },
          onError: (mutationError) => {
            notifyErrorFromUnknown(mutationError, "Could not create the book.");
          },
        });
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        isSubmitting,
      }) => (
        <form
          className="w-full space-y-4 rounded-xl border border-border bg-white p-5 sm:p-6"
          onSubmit={handleSubmit}
          noValidate
        >
          <div>
            <h2 className="text-lg font-semibold text-navy">New book</h2>
            <p className="mt-1 text-sm text-muted">
              Creates a book via{" "}
              <code className="text-xs">POST /books</code> (multipart). Cover
              image is saved on the API server.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor={titleId} className={authLabelClass}>
              Title
            </label>
            <input
              id={titleId}
              name="title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              className={authFieldClass}
              aria-invalid={Boolean(touched.title && errors.title)}
            />
            {touched.title && errors.title ? (
              <p className="text-sm text-red-600">{errors.title}</p>
            ) : null}
          </div>

          <BookRelationFields
            categoryId={categoryFieldId}
            authorId={authorFieldId}
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />

          <div className="space-y-2">
            <label htmlFor={imageId} className={authLabelClass}>
              Cover image
            </label>
            <input
              id={imageId}
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className={authFieldClass}
              onChange={(event) => {
                const file = event.currentTarget.files?.[0] ?? null;
                void setFieldValue("image", file);
              }}
              onBlur={handleBlur}
              aria-invalid={Boolean(touched.image && errors.image)}
            />
            {touched.image && errors.image ? (
              <p className="text-sm text-red-600">{errors.image}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor={summaryId} className={authLabelClass}>
              Summary (optional)
            </label>
            <textarea
              id={summaryId}
              name="summary"
              rows={3}
              value={values.summary}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${authFieldClass} min-h-[5rem] resize-y`}
              aria-invalid={Boolean(touched.summary && errors.summary)}
            />
            {touched.summary && errors.summary ? (
              <p className="text-sm text-red-600">{errors.summary}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={
              isSubmitting ||
              createBook.isPending ||
              authors.length === 0 ||
              categories.length === 0
            }
            className={`${authSubmitClass} max-w-xs`}
          >
            {isSubmitting || createBook.isPending ? "Saving…" : "Add book"}
          </button>
        </form>
      )}
    </Formik>
  );
}

type AdminBookEditPanelProps = {
  book: BookRecord;
  onCancel: () => void;
  onSaved: () => void;
};

function AdminBookEditPanel({ book, onCancel, onSaved }: AdminBookEditPanelProps) {
  const titleId = useId();
  const authorFieldId = useId();
  const categoryFieldId = useId();
  const summaryId = useId();
  const imageId = useId();
  const updateBook = useUpdateBookMutation();

  const initialValues: UpdateBookFormValues = {
    title: book.title,
    categoryId: book.categoryId,
    authorId: book.authorId,
    summary: book.summary ?? "",
    image: null,
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validate={(values) => zodToFormikErrors(updateBookFormSchema, values)}
      onSubmit={(values) => {
        updateBook.mutate(
          { id: book.id, values },
          {
            onSuccess: () => {
              notifySuccess("Book updated successfully.");
              onSaved();
            },
            onError: (mutationError) => {
              notifyErrorFromUnknown(mutationError, "Could not update book.");
            },
          },
        );
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        isSubmitting,
      }) => (
        <form
          className="space-y-4 rounded-xl border border-brand-teal/30 bg-brand-teal/5 p-5 sm:p-6"
          onSubmit={handleSubmit}
          noValidate
        >
          <div>
            <h2 className="text-lg font-semibold text-navy">Edit book</h2>
            <p className="mt-1 text-sm text-muted">
              Updates via{" "}
              <code className="text-xs">PATCH /books/{book.id}</code>.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor={titleId} className={authLabelClass}>
              Title
            </label>
            <input
              id={titleId}
              name="title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              className={authFieldClass}
            />
            {touched.title && errors.title ? (
              <p className="text-sm text-red-600">{errors.title}</p>
            ) : null}
          </div>

          <BookRelationFields
            categoryId={categoryFieldId}
            authorId={authorFieldId}
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />

          <div className="space-y-2">
            <label htmlFor={imageId} className={authLabelClass}>
              Replace cover (optional)
            </label>
            <div className="flex items-start gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getApiAssetUrl(book.image)}
                alt=""
                width={64}
                height={96}
                className="h-24 w-16 rounded border border-border object-cover"
              />
              <input
                id={imageId}
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className={`${authFieldClass} flex-1`}
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0] ?? null;
                  void setFieldValue("image", file);
                }}
                onBlur={handleBlur}
              />
            </div>
            {touched.image && errors.image ? (
              <p className="text-sm text-red-600">{errors.image}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor={summaryId} className={authLabelClass}>
              Summary
            </label>
            <textarea
              id={summaryId}
              name="summary"
              rows={3}
              value={values.summary}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${authFieldClass} min-h-[5rem] resize-y`}
            />
            {touched.summary && errors.summary ? (
              <p className="text-sm text-red-600">{errors.summary}</p>
            ) : null}
          </div>


          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSubmitting || updateBook.isPending}
              className={`${authSubmitClass} w-auto max-w-none px-6`}
            >
              {isSubmitting || updateBook.isPending ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="cursor-pointer rounded-full border border-border bg-white px-6 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-brand-teal/5"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
}

function AdminBookList() {
  const { data: items = [], isLoading, isError, error } = useBooksQuery();
  const deleteBook = useDeleteBookMutation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const editingBook =
    editingId === null ? null : items.find((item) => item.id === editingId) ?? null;

  const totalPages = Math.max(1, Math.ceil(items.length / BOOK_LIST_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageOffset = (currentPage - 1) * BOOK_LIST_PAGE_SIZE;
  const pageItems = items.slice(pageOffset, pageOffset + BOOK_LIST_PAGE_SIZE);

  function handleDelete(item: BookRecord) {
    const confirmed = window.confirm(
      `Delete “${item.title}”? This cannot be undone.`,
    );
    if (!confirmed) {
      return;
    }

    setDeletingId(item.id);
    deleteBook.mutate(item.id, {
      onSuccess: () => {
        notifySuccess("Book deleted.");
        if (editingId === item.id) {
          setEditingId(null);
        }
      },
      onError: (mutationError) => {
        notifyErrorFromUnknown(mutationError, "Could not delete book.");
      },
      onSettled: () => {
        setDeletingId(null);
      },
    });
  }

  useNotifyQueryError(isError, error, "Could not load books.");

  if (isLoading) {
    return <p className="text-sm text-muted">Loading books…</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-muted">Could not load books. Try refreshing the page.</p>
    );
  }

  return (
    <section className="space-y-4">
      {editingBook ? (
        <AdminBookEditPanel
          key={editingBook.id}
          book={editingBook}
          onCancel={() => setEditingId(null)}
          onSaved={() => setEditingId(null)}
        />
      ) : null}

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-navy">All books</h2>
        <AdminTable
          caption="Books from the API"
          columns={["Cover", "Title", "Author", "Category", "Actions"]}
          isEmpty={items.length === 0}
          emptyMessage="No books yet."
        >
          {pageItems.map((item) => (
            <tr key={item.id}>
              <td className={adminTableCellClass}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getApiAssetUrl(item.image)}
                  alt=""
                  width={40}
                  height={60}
                  className="h-14 w-10 rounded border border-border object-cover"
                />
              </td>
              <td className={`${adminTableCellClass} font-medium`}>{item.title}</td>
              <td className={adminTableCellClass}>{item.author.name}</td>
              <td className={`${adminTableCellClass} text-muted`}>
                {item.category.label}
              </td>
              <td className={adminTableCellClass}>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingId(item.id)}
                    className="cursor-pointer text-sm font-semibold text-brand-teal hover:underline"
                    aria-pressed={editingId === item.id}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    disabled={deleteBook.isPending && deletingId === item.id}
                    className="cursor-pointer text-sm font-semibold text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deleteBook.isPending && deletingId === item.id
                      ? "Deleting…"
                      : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>

        <AdminPagination
          page={currentPage}
          pageSize={BOOK_LIST_PAGE_SIZE}
          totalItems={items.length}
          onPageChange={setPage}
        />
      </div>
    </section>
  );
}

export function AdminBookForm({ view }: AdminBookFormProps) {
  if (view === "create") {
    return <AdminBookCreateForm />;
  }

  return <AdminBookList />;
}
