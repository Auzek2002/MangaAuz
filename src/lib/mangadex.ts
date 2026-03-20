import {
  MangaListResponse,
  MangaResponse,
  ChapterListResponse,
  AtHomeResponse,
  TagListResponse,
  Manga,
  Chapter,
} from "@/types/mangadex";

const BASE_URL = "https://api.mangadex.org";

const DEFAULT_INCLUDES = ["cover_art", "author", "artist"];

async function fetchMDX<T>(
  endpoint: string,
  params?: Record<string, string | string[] | number | boolean>
): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (Array.isArray(value)) {
        value.forEach((v) => url.searchParams.append(`${key}[]`, String(v)));
      } else if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    }
  }

  const res = await fetch(url.toString(), {
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`MangaDex API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getPopularManga(limit = 20): Promise<Manga[]> {
  const data = await fetchMDX<MangaListResponse>("/manga", {
    limit,
    includes: DEFAULT_INCLUDES,
    contentRating: ["safe", "suggestive"],
    "order[followedCount]": "desc",
    hasAvailableChapters: true,
  });
  return data.data;
}

export async function getLatestManga(limit = 20): Promise<Manga[]> {
  const data = await fetchMDX<MangaListResponse>("/manga", {
    limit,
    includes: DEFAULT_INCLUDES,
    contentRating: ["safe", "suggestive"],
    "order[latestUploadedChapter]": "desc",
    hasAvailableChapters: true,
  });
  return data.data;
}

export async function getTopRatedManga(limit = 20): Promise<Manga[]> {
  const data = await fetchMDX<MangaListResponse>("/manga", {
    limit,
    includes: DEFAULT_INCLUDES,
    contentRating: ["safe", "suggestive"],
    "order[rating]": "desc",
    hasAvailableChapters: true,
  });
  return data.data;
}

export async function searchManga(
  query: string,
  limit = 20,
  offset = 0,
  tags?: string[]
): Promise<MangaListResponse> {
  const params: Record<string, string | string[] | number | boolean> = {
    limit,
    offset,
    includes: DEFAULT_INCLUDES,
    contentRating: ["safe", "suggestive"],
  };
  if (query) params.title = query;
  if (tags && tags.length > 0) params.includedTags = tags;

  return fetchMDX<MangaListResponse>("/manga", params);
}

export async function getMangaById(id: string): Promise<Manga> {
  const data = await fetchMDX<MangaResponse>(`/manga/${id}`, {
    includes: DEFAULT_INCLUDES,
  });
  return data.data;
}

const CHAPTER_BATCH = 500; // MangaDex max per request

async function fetchChapterBatch(
  mangaId: string,
  offset: number,
  langParam?: Record<string, string>
): Promise<ChapterListResponse> {
  return fetchMDX<ChapterListResponse>(`/manga/${mangaId}/feed`, {
    limit: CHAPTER_BATCH,
    offset,
    "order[chapter]": "desc",
    includes: ["scanlation_group"],
    contentRating: ["safe", "suggestive", "erotica"],
    ...langParam,
  });
}

export async function getAllMangaChapters(
  mangaId: string
): Promise<{ data: Chapter[]; total: number }> {
  // Always fetch ALL languages — language filtering is done client-side
  const first = await fetchChapterBatch(mangaId, 0);

  const total = first.total;
  const chapters: Chapter[] = [...first.data];

  // Fetch remaining batches in parallel
  if (total > CHAPTER_BATCH) {
    const remaining = Math.ceil((total - CHAPTER_BATCH) / CHAPTER_BATCH);
    const batches = await Promise.all(
      Array.from({ length: remaining }, (_, i) =>
        fetchChapterBatch(mangaId, (i + 1) * CHAPTER_BATCH)
      )
    );
    for (const batch of batches) {
      chapters.push(...batch.data);
    }
  }

  return { data: chapters, total };
}

// Keep single-page version for lightweight uses (browse, search previews)
export async function getMangaChapters(
  mangaId: string,
  limit = 500,
  offset = 0,
  lang = "en"
): Promise<ChapterListResponse> {
  const result = await fetchChapterBatch(mangaId, offset, {
    "translatedLanguage[]": lang,
  });

  if (result.total === 0 && lang === "en") {
    return fetchChapterBatch(mangaId, offset);
  }

  return result;
}

export async function getChapterPages(chapterId: string): Promise<AtHomeResponse> {
  return fetchMDX<AtHomeResponse>(`/at-home/server/${chapterId}`);
}

export async function getChapterById(chapterId: string): Promise<Chapter> {
  const data = await fetchMDX<{ result: string; data: Chapter }>(
    `/chapter/${chapterId}`,
    { includes: ["scanlation_group", "manga"] }
  );
  return data.data;
}

export async function getTags(): Promise<TagListResponse> {
  return fetchMDX<TagListResponse>("/manga/tag");
}

export async function getMangaByTag(
  tagId: string,
  limit = 20,
  offset = 0
): Promise<MangaListResponse> {
  return fetchMDX<MangaListResponse>("/manga", {
    limit,
    offset,
    includes: DEFAULT_INCLUDES,
    contentRating: ["safe", "suggestive"],
    "includedTags[]": tagId,
    "order[followedCount]": "desc",
    hasAvailableChapters: true,
  });
}

export async function getRecommendations(mangaId: string): Promise<Manga[]> {
  try {
    const data = await fetchMDX<MangaListResponse>(
      `/manga/${mangaId}/relation`,
      {}
    );
    return data.data || [];
  } catch {
    return [];
  }
}

// Helper: get cover image URL
export function getCoverUrl(
  mangaId: string,
  coverFileName: string,
  size: 256 | 512 | "original" = 512
): string {
  const base = `https://uploads.mangadex.org/covers/${mangaId}/${coverFileName}`;
  if (size === "original") return base;
  return `${base}.${size}.jpg`;
}

// Helper: get manga title (prefer English)
export function getMangaTitle(manga: Manga): string {
  const { title } = manga.attributes;
  return (
    title.en ||
    title["ja-ro"] ||
    title.ja ||
    Object.values(title)[0] ||
    "Unknown Title"
  );
}

// Helper: get manga description
export function getMangaDescription(manga: Manga): string {
  const { description } = manga.attributes;
  return (
    description.en ||
    description["ja-ro"] ||
    Object.values(description)[0] ||
    "No description available."
  );
}

// Helper: get cover file name from relationships
export function getCoverFileName(manga: Manga): string | null {
  const coverRel = manga.relationships.find((r) => r.type === "cover_art");
  if (!coverRel?.attributes) return null;
  return (coverRel.attributes as { fileName: string }).fileName || null;
}

// Helper: get author name from relationships
export function getAuthorName(manga: Manga): string {
  const authorRel = manga.relationships.find((r) => r.type === "author");
  if (!authorRel?.attributes) return "Unknown";
  return (authorRel.attributes as { name: string }).name || "Unknown";
}

// Helper: get chapter display title
export function getChapterTitle(chapter: Chapter): string {
  const { volume, chapter: chapterNum, title } = chapter.attributes;
  const parts: string[] = [];
  if (volume) parts.push(`Vol. ${volume}`);
  if (chapterNum) parts.push(`Ch. ${chapterNum}`);
  if (title) parts.push(title);
  return parts.join(" ") || "Oneshot";
}
