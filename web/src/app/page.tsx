import { BookShowcaseSection } from "@/components/home/book-showcase-section";
import { BrowseGenresSection } from "@/components/home/browse-genres-section";
import { HeroBanner } from "@/components/home/hero-banner";
import { getFeaturedCategoryShowcases } from "@/lib/category-books";
import { mostViewedBooks, mostViewedViewAllHref } from "@/lib/books";

export default function Home() {
  const categoryShowcases = getFeaturedCategoryShowcases();

  return (
    <main className="flex-1">
      <HeroBanner />
      <BookShowcaseSection
        title="Most viewed"
        headingId="most-viewed-heading"
        viewAllHref={mostViewedViewAllHref}
        books={mostViewedBooks}
      />
      <BrowseGenresSection />
      {categoryShowcases.map((category) => (
        <BookShowcaseSection
          key={category.slug}
          title={category.title}
          headingId={`category-${category.slug}`}
          viewAllHref={category.viewAllHref}
          books={category.books}
        />
      ))}
    </main>
  );
}
