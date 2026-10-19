import { AdminAuthorForm } from "@/components/admin/admin-author-form";

export default function AdminAuthorsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">Authors</h1>
      <p className="mt-2 text-sm text-muted sm:text-base">
        Create authors to assign when adding books.
      </p>

      <div className="mt-8">
        <AdminAuthorForm />
      </div>
    </div>
  );
}
