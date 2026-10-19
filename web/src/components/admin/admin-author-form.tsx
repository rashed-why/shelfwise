"use client";

import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { AdminPagination } from "@/components/admin/admin-pagination";
import {
  AdminTable,
  adminTableCellClass,
} from "@/components/admin/admin-table";
import {
  authFieldClass,
  authLabelClass,
  authSubmitClass,
} from "@/lib/auth-form-styles";
import type { AuthorRecord } from "@/lib/authors-api";
import {
  useAuthorsQuery,
  useCreateAuthorMutation,
  useUpdateAuthorMutation,
} from "@/lib/queries/authors";
import {
  createAuthorSchema,
  updateAuthorFormSchema,
  type CreateAuthorFormValues,
  type UpdateAuthorFormValues,
} from "@/lib/schemas/create-author.schema";
import { zodToFormikErrors } from "@/lib/zod-formik";
import { notifyErrorFromUnknown, notifySuccess } from "@/lib/toast";
import { useNotifyQueryError } from "@/lib/use-notify-query-error";

type AdminAuthorFormProps = {
  view: "create" | "list";
};

const AUTHOR_LIST_PAGE_SIZE = 10;

const createInitialValues: CreateAuthorFormValues = {
  name: "",
  slug: "",
};

function AdminAuthorCreateForm() {
  const router = useRouter();
  const nameId = useId();
  const slugId = useId();
  const createAuthor = useCreateAuthorMutation();

  return (
    <Formik
      initialValues={createInitialValues}
      validate={(values) => zodToFormikErrors(createAuthorSchema, values)}
      onSubmit={(values, { resetForm }) => {
        createAuthor.mutate(values, {
          onSuccess: () => {
            notifySuccess("Author created successfully.");
            resetForm();
            router.push("/admin/authors/list");
          },
          onError: (mutationError) => {
            notifyErrorFromUnknown(mutationError, "Could not create author.");
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
        isSubmitting,
      }) => (
        <form
          className="w-full space-y-4 rounded-xl border border-border bg-white p-5 sm:p-6"
          onSubmit={handleSubmit}
          noValidate
        >
          <div>
            <h2 className="text-lg font-semibold text-navy">New author</h2>
            <p className="mt-1 text-sm text-muted">
              Creates an author via{" "}
              <code className="text-xs">POST /authors</code>. Slug is
              optional—the API generates one from the name when omitted.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor={nameId} className={authLabelClass}>
              Name
            </label>
            <input
              id={nameId}
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="James Clear"
              className={authFieldClass}
              aria-invalid={Boolean(touched.name && errors.name)}
            />
            {touched.name && errors.name ? (
              <p className="text-sm text-red-600">{errors.name}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor={slugId} className={authLabelClass}>
              Slug (optional)
            </label>
            <input
              id={slugId}
              name="slug"
              value={values.slug}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="james-clear"
              className={authFieldClass}
              aria-invalid={Boolean(touched.slug && errors.slug)}
            />
            {touched.slug && errors.slug ? (
              <p className="text-sm text-red-600">{errors.slug}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || createAuthor.isPending}
            className={`${authSubmitClass} max-w-xs`}
          >
            {isSubmitting || createAuthor.isPending ? "Saving…" : "Add author"}
          </button>
        </form>
      )}
    </Formik>
  );
}

type AdminAuthorEditPanelProps = {
  author: AuthorRecord;
  onCancel: () => void;
  onSaved: () => void;
};

function AdminAuthorEditPanel({
  author,
  onCancel,
  onSaved,
}: AdminAuthorEditPanelProps) {
  const nameId = useId();
  const slugId = useId();
  const updateAuthor = useUpdateAuthorMutation();

  const initialValues: UpdateAuthorFormValues = {
    name: author.name,
    slug: author.slug,
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validate={(values) => zodToFormikErrors(updateAuthorFormSchema, values)}
      onSubmit={(values) => {
        updateAuthor.mutate(
          { id: author.id, values },
          {
            onSuccess: () => {
              notifySuccess("Author updated successfully.");
              onSaved();
            },
            onError: (mutationError) => {
              notifyErrorFromUnknown(mutationError, "Could not update author.");
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
        isSubmitting,
      }) => (
        <form
          className="space-y-4 rounded-xl border border-brand-teal/30 bg-brand-teal/5 p-5 sm:p-6"
          onSubmit={handleSubmit}
          noValidate
        >
          <div>
            <h2 className="text-lg font-semibold text-navy">Edit author</h2>
            <p className="mt-1 text-sm text-muted">
              Updates via{" "}
              <code className="text-xs">PATCH /authors/{author.id}</code>.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor={nameId} className={authLabelClass}>
                Name
              </label>
              <input
                id={nameId}
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={authFieldClass}
                aria-invalid={Boolean(touched.name && errors.name)}
              />
              {touched.name && errors.name ? (
                <p className="text-sm text-red-600">{errors.name}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label htmlFor={slugId} className={authLabelClass}>
                Slug
              </label>
              <input
                id={slugId}
                name="slug"
                value={values.slug}
                onChange={handleChange}
                onBlur={handleBlur}
                className={authFieldClass}
                aria-invalid={Boolean(touched.slug && errors.slug)}
              />
              {touched.slug && errors.slug ? (
                <p className="text-sm text-red-600">{errors.slug}</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSubmitting || updateAuthor.isPending}
              className={`${authSubmitClass} w-auto max-w-none px-6`}
            >
              {isSubmitting || updateAuthor.isPending ? "Saving…" : "Save changes"}
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

function AdminAuthorList() {
  const { data: items = [], isLoading, isError, error } = useAuthorsQuery();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const editingAuthor =
    editingId === null ? null : items.find((item) => item.id === editingId) ?? null;

  const totalPages = Math.max(1, Math.ceil(items.length / AUTHOR_LIST_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageOffset = (currentPage - 1) * AUTHOR_LIST_PAGE_SIZE;
  const pageItems = items.slice(pageOffset, pageOffset + AUTHOR_LIST_PAGE_SIZE);

  useNotifyQueryError(isError, error, "Could not load authors.");

  if (isLoading) {
    return <p className="text-sm text-muted">Loading authors…</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-muted">Could not load authors. Try refreshing the page.</p>
    );
  }

  return (
    <section className="space-y-4">
      {editingAuthor ? (
        <AdminAuthorEditPanel
          key={editingAuthor.id}
          author={editingAuthor}
          onCancel={() => setEditingId(null)}
          onSaved={() => setEditingId(null)}
        />
      ) : null}

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-navy">All authors</h2>
        <AdminTable
          caption="Authors from the API"
          columns={["Name", "Slug", "Actions"]}
          isEmpty={items.length === 0}
          emptyMessage="No authors yet."
        >
          {pageItems.map((item) => (
            <tr key={item.id}>
              <td className={`${adminTableCellClass} font-medium`}>{item.name}</td>
              <td className={adminTableCellClass}>
                <code className="text-xs text-muted">{item.slug}</code>
              </td>
              <td className={adminTableCellClass}>
                <button
                  type="button"
                  onClick={() => setEditingId(item.id)}
                  className="cursor-pointer text-sm font-semibold text-brand-teal hover:underline"
                  aria-pressed={editingId === item.id}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </AdminTable>

        <AdminPagination
          page={currentPage}
          pageSize={AUTHOR_LIST_PAGE_SIZE}
          totalItems={items.length}
          onPageChange={setPage}
        />
      </div>
    </section>
  );
}

export function AdminAuthorForm({ view }: AdminAuthorFormProps) {
  if (view === "create") {
    return <AdminAuthorCreateForm />;
  }

  return <AdminAuthorList />;
}
