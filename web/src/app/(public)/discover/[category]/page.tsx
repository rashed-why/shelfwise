import { notFound, redirect } from "next/navigation";
import {
  getDiscoverCategorySlugs,
  isDiscoverCategory,
} from "@/lib/discover-books";

type DiscoverCategoryPageProps = PageProps<"/discover/[category]">;

export function generateStaticParams() {
  return getDiscoverCategorySlugs().map((category) => ({ category }));
}

export default async function DiscoverCategoryPage({
  params,
}: DiscoverCategoryPageProps) {
  const { category } = await params;
  if (!isDiscoverCategory(category)) notFound();

  redirect(`/discover?category=${encodeURIComponent(category)}`);
}
