import { AdminAuthorForm } from "@/components/admin/admin-author-form";

export default function AdminAuthorsListPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">Authors</h1>
      <p className="mt-2 text-sm text-muted sm:text-base">
        Authors added in this browser.
      </p>
      <div className="mt-8">
        <AdminAuthorForm view="list" />
      </div>
    </div>
  );
}
