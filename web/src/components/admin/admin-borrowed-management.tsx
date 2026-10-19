"use client";

import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useId, useState, type ReactNode } from "react";
import {
  BookMultiSelect,
  BorrowerSelect,
} from "@/components/admin/admin-borrow-pickers";
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
import type { BorrowedRecord } from "@/lib/borrowed-api";
import { formatAdminDate } from "@/lib/admin-format";
import { useBooksQuery } from "@/lib/queries/books";
import {
  useBorrowedQuery,
  useCreateBorrowedMutation,
  useReturnBorrowedMutation,
} from "@/lib/queries/borrowed";
import { useUsersQuery } from "@/lib/queries/users";
import {
  createBorrowedSchema,
  type CreateBorrowedFormValues,
} from "@/lib/schemas/create-borrowed.schema";
import { zodToFormikErrors } from "@/lib/zod-formik";
import {
  notifyError,
  notifyErrorFromUnknown,
  notifySuccess,
} from "@/lib/toast";
import { useNotifyQueryError } from "@/lib/use-notify-query-error";

type BorrowedStatus = "active" | "returned" | "overdue";

function borrowStatusFromApi(status: BorrowedRecord["status"]): BorrowedStatus {
  return status.toLowerCase() as BorrowedStatus;
}

function statusBadgeClass(status: BorrowedStatus): string {
  switch (status) {
    case "returned":
      return "rounded-full bg-navy/10 px-2 py-0.5 text-xs font-medium text-navy";
    case "overdue":
      return "rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700";
    default:
      return "rounded-full bg-brand-teal/15 px-2 py-0.5 text-xs font-medium text-brand-teal";
  }
}

function statusLabel(status: BorrowedStatus): string {
  switch (status) {
    case "returned":
      return "Returned";
    case "overdue":
      return "Overdue";
    default:
      return "Active";
  }
}

type BorrowedView = "create" | "list";

type BorrowedListFilter = "all" | "active" | "overdue";

const BORROWED_PAGE_SIZE = 20;

type AdminBorrowedManagementProps = {
  view: BorrowedView;
};

const createInitialValues: CreateBorrowedFormValues = {
  userId: "",
  bookIds: [],
  dueAt: "",
};

function AdminSessionGate({
  children,
}: {
  children: (accessToken: string) => ReactNode;
}) {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken;
  const isAdmin = session?.user.role === "ADMIN";

  useEffect(() => {
    if (session && !isAdmin) {
      notifyError("Admin access required to manage borrows.");
    }
  }, [session, isAdmin]);

  if (status === "loading") {
    return <p className="text-sm text-muted">Loading session…</p>;
  }

  if (!session || !accessToken) {
    return (
      <p className="text-sm text-muted">
        <Link href="/login" className="font-medium text-secondary no-underline">
          Sign in
        </Link>{" "}
        as an admin to manage borrows.
      </p>
    );
  }

  if (!isAdmin) {
    return (
      <p className="text-sm text-muted">
        Admin access required to manage borrows.
      </p>
    );
  }

  return children(accessToken);
}

function AdminBorrowedCreateForm({ accessToken }: { accessToken: string }) {
  const router = useRouter();
  const dueId = useId();
  const createBorrowed = useCreateBorrowedMutation(accessToken);
  const {
    data: books = [],
    isLoading: booksLoading,
    isError: booksError,
  } = useBooksQuery();
  const {
    data: users = [],
    isLoading: usersLoading,
    isError: usersError,
  } = useUsersQuery(accessToken);

  const bookOptions = books.map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author.name,
  }));
  const borrowerOptions = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
  }));

  const optionsLoadFailed = booksError || usersError;
  useNotifyQueryError(
    optionsLoadFailed,
    null,
    "Could not load books or users for this form.",
  );

  return (
    <Formik
      initialValues={createInitialValues}
      validate={(values) => zodToFormikErrors(createBorrowedSchema, values)}
      onSubmit={(values, { resetForm }) => {
        createBorrowed.mutate(values, {
          onSuccess: () => {
            notifySuccess("Borrow recorded successfully.");
            resetForm();
            router.push("/admin/borrowed/list");
          },
          onError: (mutationError) => {
            notifyErrorFromUnknown(mutationError, "Could not record the borrow.");
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
        setFieldTouched,
        isSubmitting,
      }) => (
        <form
          className="w-full space-y-4 rounded-xl border border-border bg-white p-5 sm:p-6"
          onSubmit={handleSubmit}
          noValidate
        >
          <div>
            <h2 className="text-lg font-semibold text-navy">Record a borrow</h2>
            <p className="mt-1 text-sm text-muted">
              Adds each selected book to the patron reading list via{" "}
              <code className="text-xs">POST /borrowed</code> and clears matching
              holds.
            </p>
          </div>

          {booksLoading || usersLoading ? (
            <p className="text-sm text-muted">Loading books and users…</p>
          ) : null}

          {optionsLoadFailed ? (
            <p className="text-sm text-muted">
              Could not load books or users for this form.
            </p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <BookMultiSelect
                books={bookOptions}
                selectedIds={values.bookIds}
                invalid={Boolean(touched.bookIds && errors.bookIds)}
                onBlur={() => {
                  void setFieldTouched("bookIds", true);
                }}
                onChange={(bookIds) => {
                  void setFieldValue("bookIds", bookIds);
                }}
              />
              {touched.bookIds && typeof errors.bookIds === "string" ? (
                <p className="text-sm text-red-600">{errors.bookIds}</p>
              ) : null}
            </div>

            <BorrowerSelect
              users={borrowerOptions}
              selectedUserId={values.userId}
              invalid={Boolean(touched.userId && errors.userId)}
              onBlur={() => {
                void setFieldTouched("userId", true);
              }}
              onChange={(userId) => {
                void setFieldValue("userId", userId);
                void setFieldTouched("userId", true);
              }}
            />
            {touched.userId && errors.userId ? (
              <p className="text-sm text-red-600 sm:col-span-2">{errors.userId}</p>
            ) : null}

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor={dueId} className={authLabelClass}>
                Due date
              </label>
              <input
                id={dueId}
                name="dueAt"
                type="date"
                value={values.dueAt}
                onChange={handleChange}
                onBlur={handleBlur}
                className={authFieldClass}
                aria-invalid={Boolean(touched.dueAt && errors.dueAt)}
              />
              {touched.dueAt && errors.dueAt ? (
                <p className="text-sm text-red-600">{errors.dueAt}</p>
              ) : null}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || createBorrowed.isPending}
            className={`${authSubmitClass} max-w-xs`}
          >
            {isSubmitting || createBorrowed.isPending ? "Saving…" : "Add borrow"}
          </button>
        </form>
      )}
    </Formik>
  );
}

function matchesBorrowedFilter(
  status: BorrowedStatus,
  filter: BorrowedListFilter,
): boolean {
  if (filter === "all") return true;
  return status === filter;
}

function AdminBorrowedList({ accessToken }: { accessToken: string }) {
  const { data: items = [], isLoading, isError, error } = useBorrowedQuery(accessToken);
  const returnBorrowed = useReturnBorrowedMutation(accessToken);
  const [listFilter, setListFilter] = useState<BorrowedListFilter>("all");
  const [listPage, setListPage] = useState(1);

  useNotifyQueryError(isError, error, "Could not load borrows.");

  if (isLoading) {
    return <p className="text-sm text-muted">Loading borrows…</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-muted">
        Could not load borrows. Try refreshing the page.
      </p>
    );
  }

  const rows = items.map((item) => ({
    ...item,
    status: borrowStatusFromApi(item.status),
  }));
  const filteredItems = rows.filter((item) =>
    matchesBorrowedFilter(item.status, listFilter),
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / BORROWED_PAGE_SIZE),
  );
  const currentPage = Math.min(listPage, totalPages);
  const pageOffset = (currentPage - 1) * BORROWED_PAGE_SIZE;
  const paginatedItems = filteredItems.slice(
    pageOffset,
    pageOffset + BORROWED_PAGE_SIZE,
  );

  function changeListFilter(next: BorrowedListFilter) {
    setListFilter(next);
    setListPage(1);
  }

  function handleReturn(id: string) {
    returnBorrowed.mutate(id, {
      onSuccess: () => {
        notifySuccess("Marked as returned.");
      },
      onError: (returnError) => {
        notifyErrorFromUnknown(
          returnError,
          "Could not mark the borrow as returned.",
        );
      },
    });
  }

  const filterEmptyMessage =
    listFilter === "active"
      ? "No active borrows."
      : listFilter === "overdue"
        ? "No overdue borrows."
        : "No borrows recorded yet.";

  const filterButtonClass = (active: boolean) =>
    `rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
      active
        ? "border-brand-teal/40 bg-brand-teal/15 text-navy"
        : "border-border bg-white text-muted hover:border-brand-teal/30 hover:text-navy"
    }`;

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-navy">Borrowed titles</h2>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter borrows by status"
        >
          <button
            type="button"
            className={filterButtonClass(listFilter === "all")}
            aria-pressed={listFilter === "all"}
            onClick={() => changeListFilter("all")}
          >
            All
          </button>
          <button
            type="button"
            className={filterButtonClass(listFilter === "active")}
            aria-pressed={listFilter === "active"}
            onClick={() => changeListFilter("active")}
          >
            Active
          </button>
          <button
            type="button"
            className={filterButtonClass(listFilter === "overdue")}
            aria-pressed={listFilter === "overdue"}
            onClick={() => changeListFilter("overdue")}
          >
            Overdue
          </button>
        </div>
      </div>

      <AdminTable
        caption="Borrowed books"
        columns={[
          "Book",
          "Borrower",
          "Borrowed",
          "Due",
          "Returned",
          "Status",
          "Actions",
        ]}
        isEmpty={paginatedItems.length === 0}
        emptyMessage={filterEmptyMessage}
      >
        {paginatedItems.map((item) => (
          <tr key={item.id}>
            <td className={`${adminTableCellClass} font-medium`}>
              {item.book.title}
            </td>
            <td className={adminTableCellClass}>
              <span className="block">{item.user.name}</span>
              <span className="text-xs text-muted">{item.user.email}</span>
            </td>
            <td className={`${adminTableCellClass} text-muted`}>
              {formatAdminDate(item.createdAt)}
            </td>
            <td className={`${adminTableCellClass} text-muted`}>
              {formatAdminDate(item.dueAt)}
            </td>
            <td className={`${adminTableCellClass} text-muted`}>
              {item.returnedAt ? formatAdminDate(item.returnedAt) : "—"}
            </td>
            <td className={adminTableCellClass}>
              <span className={statusBadgeClass(item.status)}>
                {statusLabel(item.status)}
              </span>
            </td>
            <td className={adminTableCellClass}>
              {item.status === "returned" ? (
                <span className="text-xs text-muted">—</span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleReturn(item.id)}
                  disabled={returnBorrowed.isPending}
                  className="text-xs font-medium text-secondary hover:text-brand-teal"
                >
                  Mark returned
                </button>
              )}
            </td>
          </tr>
        ))}
      </AdminTable>

      <AdminPagination
        page={currentPage}
        pageSize={BORROWED_PAGE_SIZE}
        totalItems={filteredItems.length}
        onPageChange={setListPage}
      />
    </section>
  );
}

export function AdminBorrowedManagement({ view }: AdminBorrowedManagementProps) {
  return (
    <AdminSessionGate>
      {(accessToken) =>
        view === "create" ? (
          <AdminBorrowedCreateForm accessToken={accessToken} />
        ) : (
          <AdminBorrowedList accessToken={accessToken} />
        )
      }
    </AdminSessionGate>
  );
}
