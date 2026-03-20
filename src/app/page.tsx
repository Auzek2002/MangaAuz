import { getPopularManga, getLatestManga, getTopRatedManga } from "@/lib/mangadex";
import MangaGrid from "@/components/MangaGrid";
import SectionHeader from "@/components/SectionHeader";
import HeroCarousel from "@/components/HeroCarousel";
import { TrendingUp, Clock, Star } from "lucide-react";

export const revalidate = 300;

export default async function HomePage() {
  const [popular, latest, topRated] = await Promise.all([
    getPopularManga(10),
    getLatestManga(10),
    getTopRatedManga(10),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <HeroCarousel manga={popular.slice(0, 5)} />

      {/* Popular */}
      <section className="mt-12">
        <SectionHeader
          title="Most Popular"
          icon={<TrendingUp size={20} />}
          viewAllHref="/browse?sort=followedCount"
        />
        <MangaGrid manga={popular} columns={5} />
      </section>

      {/* Latest Updates */}
      <section className="mt-12">
        <SectionHeader
          title="Latest Updates"
          icon={<Clock size={20} />}
          viewAllHref="/browse?sort=latestUploadedChapter"
        />
        <MangaGrid manga={latest} columns={5} />
      </section>

      {/* Top Rated */}
      <section className="mt-12">
        <SectionHeader
          title="Top Rated"
          icon={<Star size={20} />}
          viewAllHref="/browse?sort=rating"
        />
        <MangaGrid manga={topRated} columns={5} />
      </section>
    </div>
  );
}
