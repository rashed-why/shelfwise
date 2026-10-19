import type { Metadata } from "next";
import { Suspense } from "react";
import {
  DiscoverBookDetail,
  DiscoverBookDetailSkeleton,
} from "@/components/discover/discover-book-detail";

type DiscoverBookPageProps = PageProps<"/discover/[category]/[bookSlug]">;

export const metadata: Metadata = {
  title: "Book details",
};

async function DiscoverBookDetailFromParams({
  params,
}: Pick<DiscoverBookPageProps, "params">) {
  const { category, bookSlug } = await params;

  return (
    <DiscoverBookDetail categorySlug={category} bookId={bookSlug} />
  );
}

export default function DiscoverBookPage({ params }: DiscoverBookPageProps) {
  return (
    <main className="w-full flex-1 py-8 sm:py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<DiscoverBookDetailSkeleton />}>
          <DiscoverBookDetailFromParams params={params} />
        </Suspense>
      </div>
    </main>
  );
}
