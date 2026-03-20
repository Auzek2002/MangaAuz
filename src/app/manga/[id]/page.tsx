import {
  getMangaById,
  getAllMangaChapters,
  getCoverUrl,
  getCoverFileName,
  getMangaTitle,
  getMangaDescription,
  getAuthorName,
} from "@/lib/mangadex";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BookOpen, User, Calendar, Tag, Star } from "lucide-react";
import MangaActions from "@/components/MangaActions";
import ChapterList from "@/components/ChapterList";
import TagLink from "@/components/TagLink";
import Breadcrumb from "@/components/Breadcrumb";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ id: string }>;
}

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  ongoing:   { color: "#2dd4a0", bg: "#2dd4a022" },
  completed: { color: "#7aadff", bg: "#7aadff22" },
  hiatus:    { color: "#fbb040", bg: "#fbb04022" },
  cancelled: { color: "#ff7060", bg: "#ff706022" },
};

const DEMO_COLORS: Record<string, string> = {
  shounen: "#ff9060", shoujo: "#ff70b0", seinen: "#7aadff", josei: "#d090ff",
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  try {
    const manga = await getMangaById(id);
    return { title: `${getMangaTitle(manga)} - MangaAuz` };
  } catch {
    return { title: "Manga - MangaAuz" };
  }
}

export default async function MangaDetailPage({ params }: PageProps) {
  const { id } = await params;

  let manga;
  try {
    manga = await getMangaById(id);
  } catch {
    notFound();
  }

  const chaptersData = await getAllMangaChapters(id);
  const chapters = chaptersData.data;
  const availableChapters = chaptersData.total;
  const lastChapterNum = manga.attributes.lastChapter;

  const title = getMangaTitle(manga);
  const description = getMangaDescription(manga);
  const author = getAuthorName(manga);
  const coverFileName = getCoverFileName(manga);
  const coverUrl = coverFileName ? getCoverUrl(manga.id, coverFileName, 512) : null;
  const { status, tags, year, publicationDemographic, originalLanguage } = manga.attributes;

  const genreTags = tags.filter((t) => t.attributes.group === "genre");
  const themeTags = tags.filter((t) => t.attributes.group === "theme");
  const formatTags = tags.filter((t) => t.attributes.group === "format");
  const statusStyle = STATUS_STYLES[status] || { color: "#aaaacc", bg: "#aaaacc22" };

  const enChapters = chapters.filter((c) => c.attributes.translatedLanguage === "en");
  const readableChapters = enChapters.length > 0 ? enChapters : chapters;
  const firstChapter = readableChapters.length > 0 ? readableChapters[readableChapters.length - 1] : null;
  const latestChapter = readableChapters.length > 0 ? readableChapters[0] : null;

  return (
    <div style={{ backgroundColor: "#0d0d12", minHeight: "100vh" }}>

      {/* ── Full-width blurred banner ── */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: "380px" }}>

        {/* CSS div blur backdrop — more reliable than Next Image with filter */}
        {coverUrl && (
          <>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${coverUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
                filter: "blur(28px)",
                transform: "scale(1.12)",
                opacity: 0.35,
              }}
            />
            {/* Dark overlays for readability */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #0d0d1260 0%, #0d0d12 85%)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #0d0d12 20%, #0d0d1240 60%, transparent 100%)" }} />
          </>
        )}

        {/* Content on top of backdrop */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-10">
          <div className="mb-6">
            <Breadcrumb
              crumbs={[
                { label: "Home", href: "/" },
                { label: "Browse", href: "/browse" },
                { label: title },
              ]}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-6 md:gap-10 items-start">
            {/* ── Cover art ── */}
            <div className="shrink-0 flex justify-center sm:block">
              <div
                className="relative overflow-hidden"
                style={{
                  width: "clamp(130px, 38vw, 195px)",
                  aspectRatio: "2/3",
                  borderRadius: "14px",
                  boxShadow: "0 24px 64px #00000070, 0 0 0 1px #ffffff10",
                }}
              >
                {coverUrl ? (
                  <Image src={coverUrl} alt={title} fill className="object-cover" priority />
                ) : (
                  <div className="w-full h-full skeleton" />
                )}
              </div>
            </div>

            {/* ── Manga info ── */}
            <div className="flex-1 flex flex-col gap-3.5 min-w-0">
              {/* Status / demographic badges */}
              <div className="flex flex-wrap gap-2">
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide"
                  style={{ backgroundColor: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.color}55` }}
                >
                  {status}
                </span>
                {publicationDemographic && (
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide"
                    style={{
                      backgroundColor: (DEMO_COLORS[publicationDemographic] || "#8888a0") + "22",
                      color: DEMO_COLORS[publicationDemographic] || "#8888a0",
                      border: `1px solid ${DEMO_COLORS[publicationDemographic] || "#8888a0"}55`,
                    }}
                  >
                    {publicationDemographic}
                  </span>
                )}
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide"
                  style={{ backgroundColor: "#1e1e2a", color: "#8888a0", border: "1px solid #2a2a3a" }}
                >
                  {originalLanguage}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight" style={{ color: "#f4f4ff", textShadow: "0 2px 20px #00000080" }}>
                {title}
              </h1>

              {/* Alt titles */}
              {manga.attributes.altTitles.length > 0 && (
                <p className="text-xs clamp-1" style={{ color: "#44445a" }}>
                  {manga.attributes.altTitles.slice(0, 3).map((t) => Object.values(t)[0]).join(" · ")}
                </p>
              )}

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm">
                <span className="flex items-center gap-1.5">
                  <User size={13} style={{ color: "#e05248" }} />
                  <span style={{ color: "#c0c0d8" }}>{author}</span>
                </span>
                {year && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} style={{ color: "#e05248" }} />
                    <span style={{ color: "#c0c0d8" }}>{year}</span>
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <BookOpen size={13} style={{ color: "#e05248" }} />
                  <span style={{ color: "#c0c0d8" }}>
                    {lastChapterNum ? `${lastChapterNum} chapters` : `${availableChapters} chapters`}
                  </span>
                </span>
              </div>

              {/* Genre tags */}
              {genreTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {genreTags.map((tag) => (
                    <TagLink key={tag.id} href={`/genres/${tag.id}`} color="#e05248">
                      {tag.attributes.name.en}
                    </TagLink>
                  ))}
                </div>
              )}

              {/* CTA */}
              <div className="mt-1">
                <MangaActions
                  mangaId={id}
                  firstChapterId={firstChapter?.id}
                  latestChapterId={latestChapter?.id !== firstChapter?.id ? latestChapter?.id : undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body: synopsis + chapters ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 -mt-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — details */}
          <div className="lg:col-span-1 flex flex-col gap-4">

            {/* Synopsis */}
            <div className="rounded-2xl p-5" style={{ backgroundColor: "#13131a", border: "1px solid #1e1e2a" }}>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: "#e05248" }}>
                <Star size={13} /> Synopsis
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "#9494b0" }}>
                {description}
              </p>
            </div>

            {/* Themes */}
            {themeTags.length > 0 && (
              <div className="rounded-2xl p-5" style={{ backgroundColor: "#13131a", border: "1px solid #1e1e2a" }}>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: "#7aadff" }}>
                  <Tag size={13} /> Themes
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {themeTags.map((tag) => (
                    <TagLink key={tag.id} href={`/genres/${tag.id}`} color="#7aadff">
                      {tag.attributes.name.en}
                    </TagLink>
                  ))}
                </div>
              </div>
            )}

            {/* Format */}
            {formatTags.length > 0 && (
              <div className="rounded-2xl p-5" style={{ backgroundColor: "#13131a", border: "1px solid #1e1e2a" }}>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#8888a0" }}>
                  Format
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {formatTags.map((tag) => (
                    <span key={tag.id} className="text-xs px-2.5 py-1 rounded-lg" style={{ backgroundColor: "#1e1e2a", color: "#8888a0", border: "1px solid #2a2a3a" }}>
                      {tag.attributes.name.en}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — chapters */}
          <div className="lg:col-span-2">
            <ChapterList
              mangaId={id}
              chapters={chapters}
              totalChapters={availableChapters}
              lastChapterNum={lastChapterNum}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
