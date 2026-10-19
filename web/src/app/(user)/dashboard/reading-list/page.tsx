export default function DashboardReadingListPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">Reading list</h1>
      <p className="mt-2 text-sm text-muted sm:text-base">
        Save books you want to read later. Your list syncs across devices when
        you are signed in.
      </p>

      <div className="mt-8 rounded-xl border border-dashed border-border bg-brand-navy/[0.03] px-6 py-12 text-center">
        <p className="text-sm font-medium text-navy">Your reading list is empty</p>
        <p className="mt-1 text-sm text-muted">
          Add titles from book pages to build your queue.
        </p>
      </div>
    </div>
  );
}
