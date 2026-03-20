"use client";

import Link from "next/link";
import { Play, BookOpen } from "lucide-react";

interface MangaActionsProps {
  mangaId: string;
  firstChapterId?: string;
  latestChapterId?: string;
}

export default function MangaActions({ mangaId, firstChapterId, latestChapterId }: MangaActionsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {firstChapterId && (
        <Link
          href={`/manga/${mangaId}/chapter/${firstChapterId}`}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{ background: "linear-gradient(135deg, #e05248, #c03a32)", color: "#fff", boxShadow: "0 4px 16px #e0524840" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.9"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
        >
          <Play size={14} fill="white" /> Start Reading
        </Link>
      )}
      {latestChapterId && (
        <Link
          href={`/manga/${mangaId}/chapter/${latestChapterId}`}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{ backgroundColor: "#1e1e2a", color: "#e2e2ee", border: "1px solid #2a2a3a" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e05248"; (e.currentTarget as HTMLAnchorElement).style.color = "#e05248"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#2a2a3a"; (e.currentTarget as HTMLAnchorElement).style.color = "#e2e2ee"; }}
        >
          <BookOpen size={14} /> Latest Chapter
        </Link>
      )}
    </div>
  );
}
