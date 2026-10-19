import { BrowseGenresSection } from "@/components/home/browse-genres-section";
import { HeroBanner } from "@/components/home/hero-banner";
import { HomeCategoryShowcases } from "@/components/home/home-category-showcases";

export default function Home() {
  return (
    <main className="flex-1">
      <HeroBanner />
      <BrowseGenresSection />
      <HomeCategoryShowcases />
    </main>
  );
}
