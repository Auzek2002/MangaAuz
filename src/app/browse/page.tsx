import { searchManga } from "@/lib/mangadex";
import MangaGrid from "@/components/MangaGrid";
import SectionHeader from "@/components/SectionHeader";
import Link from "next/link";
import { ChevronRight, Grid } from "lucide-react";

export const revalidate = 300;

const SORT_OPTIONS = [
  { value: "followedCount", label: "Most Popular" },
  { value: "latestUploadedChapter", label: "Latest Updated" },
  { value: "rating", label: "Top Rated" },
  { value: "createdAt", label: "Newest Added" },
  { value: "title", label: "A-Z" },
];

interface PageProps {
  searchParams: Promise<{ sort?: string; page?: string; status?: string }>;
}

export default async function BrowsePage({ searchParams }: PageProps) {
  const { sort = "followedCount", page = "1", status } = await searchParams;
  const currentPage = Math.max(1, parseInt(page));
  const limit = 24;
  const offset = (currentPage - 1) * limit;

  const params: Record<string, string | string[] | number | boolean> = {
    limit,
    offset,
    includes: ["cover_art", "author", "artist"],
    contentRating: ["safe", "suggestive"],
    hasAvailableChapters: true,
    [`order[${sort}]`]: "desc",
  };

  if (status) {
    params["status[]"] = status;
  }

  const results = await searchManga("", limit, offset);
  const totalPages = Math.ceil(results.total / limit);

  const currentSort = SORT_OPTIONS.find((s) => s.value === sort) || SORT_OPTIONS[0];

  const STATUS_OPTIONS = [
    { value: "", label: "All Status" },
    { value: "ongoing", label: "Ongoing" },
    { value: "completed", label: "Completed" },
    { value: "hiatus", label: "Hiatus" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: "#5a5a70" }}>
        <Link href="/" className="hover:text-red-400 transition-colors">Home</Link>
        <ChevronRight size={14} />
        <span style={{ color: "#9090a8" }}>Browse</span>
      </nav>

      <SectionHeader title="Browse Manga" icon={<Grid size={20} />} />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Sort */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm self-center" style={{ color: "#5a5a70" }}>Sort:</span>
          {SORT_OPTIONS.map((opt) => (
            <Link
              key={opt.value}
              href={`/browse?sort=${opt.value}${status ? `&status=${status}` : ""}&page=1`}
              className="text-xs px-3 py-1.5 rounded-full font-medium transition-colors"
              style={{
                backgroundColor: sort === opt.value ? "#e85d4a" : "#22222e",
                color: sort === opt.value ? "#fff" : "#9090a8",
                border: `1px solid ${sort === opt.value ? "#e85d4a" : "#3a3a4a"}`,
              }}
            >
              {opt.label}
            </Link>
          ))}
        </div>

        {/* Status */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm self-center" style={{ color: "#5a5a70" }}>Status:</span>
          {STATUS_OPTIONS.map((opt) => (
            <Link
              key={opt.value}
              href={`/browse?sort=${sort}${opt.value ? `&status=${opt.value}` : ""}&page=1`}
              className="text-xs px-3 py-1.5 rounded-full font-medium transition-colors"
              style={{
                backgroundColor: status === opt.value || (!status && opt.value === "") ? "#22222e" : "#22222e",
                color: (status === opt.value || (!status && opt.value === "")) ? "#e85d4a" : "#9090a8",
                border: `1px solid ${(status === opt.value || (!status && opt.value === "")) ? "#e85d4a" : "#3a3a4a"}`,
              }}
            >
              {opt.label}
            </Link>
          ))}
        </div>
      </div>

      <p className="text-sm mb-4" style={{ color: "#5a5a70" }}>
        {results.total.toLocaleString()} manga &bull; {currentSort.label}
      </p>

      <MangaGrid manga={results.data} columns={6} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {currentPage > 1 && (
            <Link
              href={`/browse?sort=${sort}${status ? `&status=${status}` : ""}&page=${currentPage - 1}`}
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

          {/* Page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pg = Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i;
            return (
              <Link
                key={pg}
                href={`/browse?sort=${sort}${status ? `&status=${status}` : ""}&page=${pg}`}
                className="px-3 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: pg === currentPage ? "#e85d4a" : "#22222e",
                  color: pg === currentPage ? "#fff" : "#9090a8",
                  border: `1px solid ${pg === currentPage ? "#e85d4a" : "#3a3a4a"}`,
                }}
              >
                {pg}
              </Link>
            );
          })}

          {currentPage < totalPages && (
            <Link
              href={`/browse?sort=${sort}${status ? `&status=${status}` : ""}&page=${currentPage + 1}`}
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
