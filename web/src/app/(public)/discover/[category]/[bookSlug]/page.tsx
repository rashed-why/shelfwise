import type { Metadata } from "next";
import { DiscoverBookDetail } from "@/components/discover/discover-book-detail";

type DiscoverBookPageProps = PageProps<"/discover/[category]/[bookSlug]">;

export const metadata: Metadata = {
  title: "Book details",
};

export default function DiscoverBookPage(_props: DiscoverBookPageProps) {
  return (
    <main className="w-full flex-1 py-8 sm:py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <DiscoverBookDetail />
      </div>
    </main>
  );
}
