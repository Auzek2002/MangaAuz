"use client";

import Link from "next/link";
import { ExternalLink, ChevronLeft, ChevronRight, Home, BookOpen } from "lucide-react";

interface ExternalChapterProps {
  mangaId: string;
  mangaTitle: string;
  chapterTitle: string;
  externalUrl: string | null;
  prevChapterId: string | null;
  nextChapterId: string | null;
}

export default function ExternalChapter({
  mangaId,
  mangaTitle,
  chapterTitle,
  externalUrl,
  prevChapterId,
  nextChapterId,
}: ExternalChapterProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#0a0a0e" }}
    >
      {/* Header */}
      <div
        className="border-b px-4 py-3 flex items-center gap-3"
        style={{ backgroundColor: "#16161d", borderColor: "#2a2a3a" }}
      >
        <Link
          href={`/manga/${mangaId}`}
          className="p-2 rounded-lg transition-colors"
          style={{ color: "#9090a8" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "#e85d4a";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "#9090a8";
          }}
        >
          <ChevronLeft size={20} />
        </Link>
        <div className="flex-1">
          <div className="text-sm font-medium" style={{ color: "#e8e8f0" }}>
            {mangaTitle}
          </div>
          <div className="text-xs" style={{ color: "#5a5a70" }}>
            {chapterTitle}
          </div>
        </div>
        <Link href="/" style={{ color: "#9090a8" }}>
          <Home size={20} />
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div
          className="max-w-md w-full text-center p-10 rounded-2xl"
          style={{ backgroundColor: "#1c1c26", border: "1px solid #2a2a3a" }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "#22222e", border: "1px solid #3a3a4a" }}
          >
            <ExternalLink size={28} style={{ color: "#e85d4a" }} />
          </div>

          <h2 className="text-xl font-bold mb-3" style={{ color: "#e8e8f0" }}>
            Hosted Externally
          </h2>
          <p className="text-sm mb-2" style={{ color: "#9090a8" }}>
            <span style={{ color: "#e8e8f0" }}>{chapterTitle}</span>
          </p>
          <p className="text-sm mb-8" style={{ color: "#5a5a70" }}>
            This chapter is not hosted on MangaDex. It can only be read on the
            publisher&apos;s or scanlator&apos;s website.
          </p>

          {externalUrl ? (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-colors mb-4"
              style={{ backgroundColor: "#e85d4a", color: "#fff" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  "#f07060";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  "#e85d4a";
              }}
            >
              <ExternalLink size={16} /> Read on External Site
            </a>
          ) : (
            <p className="text-sm" style={{ color: "#5a5a70" }}>
              No external link available for this chapter.
            </p>
          )}

          <div className="flex justify-center gap-3 mt-6">
            {prevChapterId && (
              <Link
                href={`/manga/${mangaId}/chapter/${prevChapterId}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-colors"
                style={{
                  backgroundColor: "#22222e",
                  color: "#9090a8",
                  border: "1px solid #3a3a4a",
                }}
              >
                <ChevronLeft size={14} /> Prev Chapter
              </Link>
            )}
            <Link
              href={`/manga/${mangaId}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-colors"
              style={{
                backgroundColor: "#22222e",
                color: "#9090a8",
                border: "1px solid #3a3a4a",
              }}
            >
              <BookOpen size={14} /> Chapter List
            </Link>
            {nextChapterId && (
              <Link
                href={`/manga/${mangaId}/chapter/${nextChapterId}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-colors"
                style={{
                  backgroundColor: "#22222e",
                  color: "#9090a8",
                  border: "1px solid #3a3a4a",
                }}
              >
                Next Chapter <ChevronRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
