import { Suspense } from "react";
import { DiscoverCatalog } from "@/components/discover/discover-catalog";

function DiscoverCatalogFallback() {
  return (
    <div className="flex w-full flex-col gap-6 lg:flex-row lg:gap-x-8">
      <div className="h-11 w-full animate-pulse rounded-lg bg-brand-navy/5 lg:hidden" />
      <div className="hidden h-64 w-[240px] shrink-0 animate-pulse rounded-lg bg-brand-navy/5 lg:block" />
      <div className="min-h-96 min-w-0 flex-1 animate-pulse rounded-lg bg-brand-navy/5" />
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <main className="w-full flex-1 py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold text-navy">Discover</h1>
          <p className="mt-2 max-w-2xl text-muted">
            Choose a category to browse books on Selfwise.
          </p>
        </div>

        <div className="mt-8 w-full">
          <Suspense fallback={<DiscoverCatalogFallback />}>
            <DiscoverCatalog />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
