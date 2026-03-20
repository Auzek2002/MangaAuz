import { searchManga, getTags } from "@/lib/mangadex";
import MangaGrid from "@/components/MangaGrid";
import SearchForm from "@/components/SearchForm";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{ q?: string; tag?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = "", tag, page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page));
  const limit = 20;
  const offset = (currentPage - 1) * limit;

  const tags = tag ? [tag] : undefined;

  const [results, allTags] = await Promise.all([
    searchManga(q, limit, offset, tags),
    getTags(),
  ]);

  const totalPages = Math.ceil(results.total / limit);
  const genreTags = allTags.data.filter((t) => t.attributes.group === "genre");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: "#5a5a70" }}>
        <Link href="/" className="hover:text-red-400 transition-colors">Home</Link>
        <ChevronRight size={14} />
        <span style={{ color: "#9090a8" }}>Search</span>
      </nav>

      <h1 className="text-2xl font-bold mb-6" style={{ color: "#e8e8f0" }}>
        {q ? `Results for "${q}"` : "Search Manga"}
      </h1>

      <SearchForm initialQuery={q} />

      {/* Genre filter */}
      <div className="flex flex-wrap gap-2 mt-4 mb-8">
        <Link
          href={q ? `/search?q=${encodeURIComponent(q)}` : "/search"}
          className="text-xs px-3 py-1.5 rounded-full font-medium transition-colors"
          style={{
            backgroundColor: !tag ? "#e85d4a" : "#22222e",
            color: !tag ? "#fff" : "#9090a8",
            border: `1px solid ${!tag ? "#e85d4a" : "#3a3a4a"}`,
          }}
        >
          All
        </Link>
        {genreTags.map((t) => (
          <Link
            key={t.id}
            href={`/search?${q ? `q=${encodeURIComponent(q)}&` : ""}tag=${t.id}`}
            className="text-xs px-3 py-1.5 rounded-full font-medium transition-colors"
            style={{
              backgroundColor: tag === t.id ? "#e85d4a" : "#22222e",
              color: tag === t.id ? "#fff" : "#9090a8",
              border: `1px solid ${tag === t.id ? "#e85d4a" : "#3a3a4a"}`,
            }}
          >
            {t.attributes.name.en}
          </Link>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm mb-4" style={{ color: "#5a5a70" }}>
        {results.total} results found
      </p>

      <MangaGrid manga={results.data} columns={5} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {currentPage > 1 && (
            <Link
              href={`/search?${q ? `q=${encodeURIComponent(q)}&` : ""}${tag ? `tag=${tag}&` : ""}page=${currentPage - 1}`}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: "#22222e",
                color: "#9090a8",
                border: "1px solid #3a3a4a",
              }}
            >
              Previous
            </Link>
          )}
          <span className="text-sm px-4" style={{ color: "#5a5a70" }}>
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={`/search?${q ? `q=${encodeURIComponent(q)}&` : ""}${tag ? `tag=${tag}&` : ""}page=${currentPage + 1}`}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: "#e85d4a", color: "#fff" }}
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
