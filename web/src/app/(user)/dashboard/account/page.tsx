export default function DashboardAccountPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">Account</h1>
      <p className="mt-2 text-sm text-muted sm:text-base">
        Manage your profile, notification preferences, and library card details.
      </p>

      <section className="mt-8 space-y-6">
        <div className="rounded-xl border border-border bg-white p-4 sm:p-6">
          <h2 className="text-sm font-bold text-navy uppercase tracking-wide">
            Profile
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
              <dt className="w-32 shrink-0 font-medium text-muted">Name</dt>
              <dd className="text-foreground">Reader</dd>
            </div>
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
              <dt className="w-32 shrink-0 font-medium text-muted">Email</dt>
              <dd className="text-foreground">you@example.com</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 sm:p-6">
          <h2 className="text-sm font-bold text-navy uppercase tracking-wide">
            Preferences
          </h2>
          <p className="mt-2 text-sm text-muted">
            Notification and pickup settings will be available when your account
            is connected to the library API.
          </p>
        </div>
      </section>
    </div>
  );
}
