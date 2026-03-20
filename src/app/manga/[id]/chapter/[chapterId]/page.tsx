import {
  getChapterPages,
  getAllMangaChapters,
  getMangaById,
  getMangaTitle,
  getChapterTitle,
  getChapterById,
} from "@/lib/mangadex";
import ChapterReader from "@/components/ChapterReader";
import ExternalChapter from "@/components/ExternalChapter";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string; chapterId: string }>;
}

export const revalidate = 300;

export default async function ChapterPage({ params }: PageProps) {
  const { id, chapterId } = await params;

  let pages;
  let manga;
  let chaptersData;
  let chapter;

  try {
    [pages, manga, chaptersData, chapter] = await Promise.all([
      getChapterPages(chapterId),
      getMangaById(id),
      getAllMangaChapters(id),
      getChapterById(chapterId),
    ]);
  } catch {
    notFound();
  }

  const allChapters = chaptersData.data;

  // For prev/next navigation, prefer same language as current chapter
  const currentLang = chapter.attributes.translatedLanguage;
  const sameLangChapters = allChapters.filter(
    (c) => c.attributes.translatedLanguage === currentLang
  );

  // Find current position within same-language chapters (sorted desc = newest first)
  const currentIdx = sameLangChapters.findIndex((c) => c.id === chapterId);
  const prevChapter =
    currentIdx < sameLangChapters.length - 1
      ? sameLangChapters[currentIdx + 1]
      : null;
  const nextChapter = currentIdx > 0 ? sameLangChapters[currentIdx - 1] : null;

  const mangaTitle = getMangaTitle(manga);
  const chapterTitle = getChapterTitle(chapter);
  const externalUrl = chapter.attributes.externalUrl;

  // Chapter is hosted externally — can't display pages
  if (externalUrl || pages.chapter.data.length === 0) {
    return (
      <ExternalChapter
        mangaId={id}
        mangaTitle={mangaTitle}
        chapterTitle={chapterTitle}
        externalUrl={externalUrl}
        prevChapterId={prevChapter?.id || null}
        nextChapterId={nextChapter?.id || null}
      />
    );
  }

  const imageUrls = pages.chapter.data.map(
    (filename) => `${pages.baseUrl}/data/${pages.chapter.hash}/${filename}`
  );

  return (
    <ChapterReader
      mangaId={id}
      chapterId={chapterId}
      mangaTitle={mangaTitle}
      chapterTitle={chapterTitle}
      imageUrls={imageUrls}
      prevChapterId={prevChapter?.id || null}
      nextChapterId={nextChapter?.id || null}
      chapters={sameLangChapters}
    />
  );
}
