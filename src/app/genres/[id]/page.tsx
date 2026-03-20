import { getMangaByTag, getTags } from "@/lib/mangadex";
import MangaGrid from "@/components/MangaGrid";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { notFound } from "next/navigation";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  try {
    const tags = await getTags();
    const tag = tags.data.find((t) => t.id === id);
    return { title: `${tag?.attributes.name.en || "Genre"} Manga - MangaAuz` };
  } catch {
    return { title: "Genre - MangaAuz" };
  }
}

export default async function GenreDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page));
  const limit = 24;
  const offset = (currentPage - 1) * limit;

  const [results, tagsData] = await Promise.all([
    getMangaByTag(id, limit, offset),
    getTags(),
  ]);

  const tag = tagsData.data.find((t) => t.id === id);
  if (!tag) notFound();

  const totalPages = Math.ceil(results.total / limit);
  const tagName = tag.attributes.name.en || "Unknown Genre";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: "#5a5a70" }}>
        <Link href="/" className="hover:text-red-400 transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/genres" className="hover:text-red-400 transition-colors">Genres</Link>
        <ChevronRight size={14} />
        <span style={{ color: "#9090a8" }}>{tagName}</span>
      </nav>

      <SectionHeader title={tagName} />

      {tag.attributes.description.en && (
        <p className="text-sm mb-6" style={{ color: "#9090a8" }}>
          {tag.attributes.description.en}
        </p>
      )}

      <p className="text-sm mb-4" style={{ color: "#5a5a70" }}>
        {results.total.toLocaleString()} manga found
      </p>

      <MangaGrid manga={results.data} columns={6} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {currentPage > 1 && (
            <Link
              href={`/genres/${id}?page=${currentPage - 1}`}
              className="px-4 py-2 rounded-lg text-sm font-medium"
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
              href={`/genres/${id}?page=${currentPage + 1}`}
              className="px-4 py-2 rounded-lg text-sm font-medium"
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
