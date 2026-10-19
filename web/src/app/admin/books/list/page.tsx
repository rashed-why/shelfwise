import { AdminBookForm } from "@/components/admin/admin-book-form";

export default function AdminBooksListPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">Books</h1>
      <p className="mt-2 text-sm text-muted sm:text-base">
        Books added in this browser.
      </p>
      <div className="mt-8">
        <AdminBookForm view="list" />
      </div>
    </div>
  );
}
