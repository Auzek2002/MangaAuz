"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Chapter } from "@/types/mangadex";
import { getChapterTitle } from "@/lib/mangadex";
import { Clock, ChevronRight, ExternalLink, Globe, Search, ChevronUp, ChevronDown, AlertTriangle } from "lucide-react";

interface ChapterListProps {
  mangaId: string;
  chapters: Chapter[];
  totalChapters: number;
  lastChapterNum?: string | null;
}

const LANG_LABELS: Record<string, string> = {
  en: "EN", ja: "JA", ko: "KO", zh: "ZH", "zh-hk": "ZH-HK",
  fr: "FR", es: "ES", "es-la": "ES-LA", pt: "PT", "pt-br": "PT-BR",
  de: "DE", it: "IT", ru: "RU", ar: "AR", pl: "PL", tr: "TR",
  id: "ID", vi: "VI", th: "TH", uk: "UK",
};

export default function ChapterList({
  mangaId,
  chapters,
  totalChapters,
  lastChapterNum,
}: ChapterListProps) {
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(false);
  const [langFilter, setLangFilter] = useState("all");

  const languages = useMemo(
    () => [...new Set(chapters.map((c) => c.attributes.translatedLanguage))].sort(),
    [chapters]
  );
  const isMultiLang = languages.length > 1;

  const filtered = useMemo(() => {
    let list = [...chapters];

    if (langFilter !== "all") {
      list = list.filter((c) => c.attributes.translatedLanguage === langFilter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((c) => {
        const t = getChapterTitle(c).toLowerCase();
        return t.includes(q);
      });
    }

    if (sortAsc) list.reverse();

    return list;
  }, [chapters, search, sortAsc, langFilter]);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: "#1c1c26", border: "1px solid #2a2a3a" }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 border-b"
        style={{ borderColor: "#2a2a3a" }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold" style={{ color: "#e8e8f0" }}>
            Chapters{" "}
            <span className="text-sm font-normal" style={{ color: "#5a5a70" }}>
              ({totalChapters} on MangaDex
              {lastChapterNum && parseInt(lastChapterNum) > totalChapters
                ? ` of ${lastChapterNum}`
                : ""}
              {filtered.length !== chapters.length ? `, ${filtered.length} shown` : ""})
            </span>
          </h2>
          <button
            onClick={() => setSortAsc((v) => !v)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
            style={{
              backgroundColor: "#22222e",
              color: "#9090a8",
              border: "1px solid #3a3a4a",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#e85d4a";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#e85d4a";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#9090a8";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#3a3a4a";
            }}
          >
            {sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {sortAsc ? "Oldest first" : "Newest first"}
          </button>
        </div>

        {/* Filters row */}
        <div className="flex gap-2 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[140px]">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "#5a5a70" }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chapters..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none"
              style={{
                backgroundColor: "#0f0f13",
                color: "#e8e8f0",
                border: "1px solid #2a2a3a",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#e85d4a"; }}
              onBlur={(e) => { e.target.style.borderColor = "#2a2a3a"; }}
            />
          </div>

          {/* Language filter */}
          {isMultiLang && (
            <div className="flex items-center gap-1.5">
              <Globe size={13} style={{ color: "#5a5a70" }} />
              <select
                value={langFilter}
                onChange={(e) => setLangFilter(e.target.value)}
                className="text-xs px-2 py-1.5 rounded-lg outline-none"
                style={{
                  backgroundColor: "#0f0f13",
                  color: "#e8e8f0",
                  border: "1px solid #2a2a3a",
                }}
              >
                <option value="all">All Languages</option>
                {languages.map((l) => (
                  <option key={l} value={l}>
                    {LANG_LABELS[l] || l.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Licensing notice */}
      {lastChapterNum && parseInt(lastChapterNum) > totalChapters && (
        <div
          className="px-5 py-3 flex items-start gap-2.5 text-xs"
          style={{
            backgroundColor: "#1a1600",
            borderBottom: "1px solid #3a3000",
            color: "#c0a030",
          }}
        >
          <AlertTriangle size={14} className="shrink-0 mt-0.5" style={{ color: "#f0a030" }} />
          <span>
            This manga has <strong>{lastChapterNum} chapters</strong> in total, but only{" "}
            <strong>{totalChapters}</strong> are hosted on MangaDex. The remaining chapters
            were likely removed due to official licensing (e.g. VIZ, Manga Plus, etc.).
            Read the full series on the official platform.
          </span>
        </div>
      )}

      {/* Chapter rows */}
      <div className="divide-y overflow-y-auto" style={{ borderColor: "#2a2a3a", maxHeight: "600px" }}>
        {filtered.length === 0 ? (
          <div
            className="px-5 py-8 text-center text-sm"
            style={{ color: "#5a5a70" }}
          >
            {chapters.length === 0 ? "No chapters available yet." : "No chapters match your search."}
          </div>
        ) : (
          filtered.map((chapter) => {
            const chTitle = getChapterTitle(chapter);
            const date = new Date(chapter.attributes.publishAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const group = chapter.relationships.find((r) => r.type === "scanlation_group");
            const groupName = group?.attributes ? (group.attributes as { name: string }).name : "";
            const isExternal = !!chapter.attributes.externalUrl;
            const lang = chapter.attributes.translatedLanguage;
            const langLabel = LANG_LABELS[lang] || lang?.toUpperCase();

            return (
              <Link
                key={chapter.id}
                href={`/manga/${mangaId}/chapter/${chapter.id}`}
                className="flex items-center justify-between px-5 py-3 transition-colors"
                style={{ borderColor: "#2a2a3a" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#22222e";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                }}
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate" style={{ color: "#e8e8f0" }}>
                      {chTitle}
                    </span>
                    {isExternal && (
                      <span title="Hosted externally" style={{ flexShrink: 0 }}>
                        <ExternalLink size={12} style={{ color: "#f0a030" }} />
                      </span>
                    )}
                  </div>
                  {groupName && (
                    <span className="text-xs" style={{ color: "#5a5a70" }}>
                      {groupName}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {isMultiLang && langLabel && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded font-mono"
                      style={{
                        backgroundColor: "#22222e",
                        color: "#9090a8",
                        border: "1px solid #3a3a4a",
                      }}
                    >
                      {langLabel}
                    </span>
                  )}
                  <span className="text-xs" style={{ color: "#5a5a70" }}>
                    <Clock size={11} className="inline mr-1" />
                    {date}
                  </span>
                  <ChevronRight size={14} style={{ color: "#3a3a4a" }} />
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
