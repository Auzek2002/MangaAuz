"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Manga } from "@/types/mangadex";
import {
  getCoverUrl,
  getCoverFileName,
  getMangaTitle,
  getMangaDescription,
  getAuthorName,
} from "@/lib/mangadex";
import { ChevronLeft, ChevronRight, Play, Info } from "lucide-react";

interface HeroCarouselProps {
  manga: Manga[];
}

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  ongoing:   { bg: "rgba(45,212,160,0.15)",  text: "#2dd4a0", border: "rgba(45,212,160,0.35)"  },
  completed: { bg: "rgba(122,173,255,0.15)", text: "#7aadff", border: "rgba(122,173,255,0.35)" },
  hiatus:    { bg: "rgba(251,176,64,0.15)",  text: "#fbb040", border: "rgba(251,176,64,0.35)"  },
  cancelled: { bg: "rgba(255,112,96,0.15)",  text: "#ff7060", border: "rgba(255,112,96,0.35)"  },
};

const DEMO_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  shounen: { bg: "rgba(255,144,96,0.15)",  text: "#ff9060", border: "rgba(255,144,96,0.35)"  },
  shoujo:  { bg: "rgba(255,112,176,0.15)", text: "#ff70b0", border: "rgba(255,112,176,0.35)" },
  seinen:  { bg: "rgba(122,173,255,0.15)", text: "#7aadff", border: "rgba(122,173,255,0.35)" },
  josei:   { bg: "rgba(208,144,255,0.15)", text: "#d090ff", border: "rgba(208,144,255,0.35)" },
};

export default function HeroCarousel({ manga }: HeroCarouselProps) {
  const [current,   setCurrent]   = useState(0);
  const [animating, setAnimating] = useState(false);

  const go = useCallback(
    (idx: number) => {
      if (animating) return;
      setAnimating(true);
      setCurrent(idx);
      setTimeout(() => setAnimating(false), 500);
    },
    [animating]
  );

  useEffect(() => {
    const t = setInterval(() => go((current + 1) % manga.length), 6500);
    return () => clearInterval(t);
  }, [current, manga.length, go]);

  if (!manga.length) return null;

  const m             = manga[current];
  const title         = getMangaTitle(m);
  const desc          = getMangaDescription(m);
  const author        = getAuthorName(m);
  const coverFileName = getCoverFileName(m);
  const coverUrl      = coverFileName ? getCoverUrl(m.id, coverFileName, 512) : null;
  const tags          = m.attributes.tags.filter((t) => t.attributes.group === "genre").slice(0, 4);
  const status        = m.attributes.status;
  const statusColor   = STATUS_COLORS[status] ?? { bg: "rgba(255,255,255,0.1)", text: "#f0f0ff", border: "rgba(255,255,255,0.2)" };
  const demo          = m.attributes.publicationDemographic;
  const demoColor     = demo ? (DEMO_COLORS[demo] ?? null) : null;

  const badgeStyle = (bg: string, color: string, border: string) => ({
    fontSize:      "11px",
    fontWeight:    700,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    padding:       "4px 10px",
    borderRadius:  "999px",
    background:    bg,
    color,
    border:        `1px solid ${border}`,
  });

  return (
    <div
      className="sm:h-[440px]"
      style={{
        position:     "relative",
        borderRadius: "20px",
        overflow:     "hidden",
        background:   "#14141f",
      }}
    >
      {/* ── Blurred background ── */}
      {coverUrl && (
        <>
          <div
            style={{
              position:           "absolute",
              inset:              0,
              backgroundImage:    `url(${coverUrl})`,
              backgroundSize:     "cover",
              backgroundPosition: "center",
              filter:             "blur(32px)",
              transform:          "scale(1.15)",
              opacity:            0.4,
              zIndex:             0,
              transition:         "opacity 0.5s",
            }}
          />
          <div
            style={{
              position:   "absolute",
              inset:      0,
              background: "linear-gradient(100deg, rgba(9,9,16,0.97) 28%, rgba(9,9,16,0.7) 55%, rgba(9,9,16,0.35) 100%)",
              zIndex:     1,
            }}
          />
          <div
            style={{
              position:   "absolute",
              inset:      0,
              background: "linear-gradient(to top, rgba(9,9,16,0.98) 0%, transparent 50%)",
              zIndex:     1,
            }}
          />
        </>
      )}

      {/* ════════════════════════════════════════
          MOBILE layout  (hidden on sm+)
          Cover left (small) | Badges+Title+Author right
          Description below | Buttons below
          ════════════════════════════════════════ */}
      <div
        className="sm:hidden px-[52px] pt-5 pb-10 flex flex-col gap-3"
        style={{ position: "relative", zIndex: 2 }}
      >
        {/* Top row: cover + header text */}
        <div className="flex flex-row gap-3 items-start">
          {coverUrl && (
            <div
              className="relative flex-shrink-0 rounded-xl overflow-hidden"
              style={{
                width:     "88px",
                height:    "132px",
                boxShadow: "0 16px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)",
              }}
            >
              <Image
                src={coverUrl}
                alt={title}
                fill
                className="object-cover"
                priority
                sizes="88px"
              />
            </div>
          )}

          {/* Badges + title + author */}
          <div className="flex-1 min-w-0 flex flex-col gap-[7px] pt-1">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              <span style={badgeStyle(statusColor.bg, statusColor.text, statusColor.border)}>
                {status}
              </span>
              {demoColor && (
                <span style={badgeStyle(demoColor.bg, demoColor.text, demoColor.border)}>
                  {demo}
                </span>
              )}
            </div>
            <h2
              style={{
                fontSize:        "clamp(0.85rem, 4vw, 1.2rem)",
                fontWeight:      900,
                color:           "#f0f0ff",
                lineHeight:      1.2,
                margin:          0,
                letterSpacing:   "-0.02em",
                textShadow:      "0 2px 12px rgba(0,0,0,0.7)",
                display:         "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical" as const,
                overflow:        "hidden",
              }}
            >
              {title}
            </h2>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#e84040", margin: 0 }}>
              {author}
            </p>
          </div>
        </div>

        {/* Description */}
        <p
          className="clamp-2"
          style={{ fontSize: "12.5px", lineHeight: 1.6, color: "#8888aa", margin: 0 }}
        >
          {desc}
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link
            href={`/manga/${m.id}`}
            style={{
              display:        "flex",
              alignItems:     "center",
              gap:            "7px",
              padding:        "9px 18px",
              borderRadius:   "10px",
              fontSize:       "13px",
              fontWeight:     700,
              color:          "#fff",
              background:     "linear-gradient(135deg, #e84040 0%, #ff6b35 100%)",
              boxShadow:      "0 6px 20px rgba(232,64,64,0.4)",
              textDecoration: "none",
            }}
          >
            <Play size={13} fill="white" strokeWidth={0} /> Read Now
          </Link>
          <Link
            href={`/manga/${m.id}`}
            style={{
              display:        "flex",
              alignItems:     "center",
              gap:            "7px",
              padding:        "9px 18px",
              borderRadius:   "10px",
              fontSize:       "13px",
              fontWeight:     700,
              color:          "#f0f0ff",
              background:     "rgba(255,255,255,0.08)",
              border:         "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              textDecoration: "none",
            }}
          >
            <Info size={13} /> Details
          </Link>
        </div>
      </div>

      {/* ════════════════════════════════════════
          DESKTOP layout  (hidden below sm)
          Original: big cover left | full text right
          ════════════════════════════════════════ */}
      <div
        className="hidden sm:flex px-12 py-10 items-center gap-10"
        style={{
          position: "relative",
          zIndex:   2,
          height:   "100%",
        }}
      >
        {/* Cover */}
        {coverUrl && (
          <div style={{ flexShrink: 0 }}>
            <div
              style={{
                position:     "relative",
                width:        "190px",
                height:       "285px",
                borderRadius: "12px",
                overflow:     "hidden",
                boxShadow:    "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)",
              }}
            >
              <Image
                src={coverUrl}
                alt={title}
                fill
                className="object-cover"
                priority
                sizes="190px"
              />
            </div>
          </div>
        )}

        {/* Text */}
        <div
          style={{
            flex:          1,
            display:       "flex",
            flexDirection: "column",
            gap:           "14px",
            maxWidth:      "560px",
          }}
        >
          {/* Badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <span style={badgeStyle(statusColor.bg, statusColor.text, statusColor.border)}>
              {status}
            </span>
            {demoColor && (
              <span style={badgeStyle(demoColor.bg, demoColor.text, demoColor.border)}>
                {demo}
              </span>
            )}
          </div>

          {/* Title */}
          <h2
            className="clamp-2"
            style={{
              fontSize:      "clamp(1.6rem, 3vw, 2.5rem)",
              fontWeight:    900,
              color:         "#f0f0ff",
              lineHeight:    1.15,
              letterSpacing: "-0.02em",
              textShadow:    "0 2px 16px rgba(0,0,0,0.6)",
              margin:        0,
            }}
          >
            {title}
          </h2>

          {/* Author */}
          <p style={{ fontSize: "13px", fontWeight: 600, color: "#e84040", margin: 0 }}>
            {author}
          </p>

          {/* Description */}
          <p
            className="clamp-3"
            style={{ fontSize: "13.5px", lineHeight: 1.65, color: "#8888aa", margin: 0 }}
          >
            {desc}
          </p>

          {/* Genre tags */}
          {tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/genres/${tag.id}`}
                  style={{
                    fontSize:       "12px",
                    fontWeight:     500,
                    padding:        "4px 12px",
                    borderRadius:   "999px",
                    background:     "rgba(255,255,255,0.06)",
                    color:          "#8888aa",
                    border:         "1px solid rgba(255,255,255,0.1)",
                    textDecoration: "none",
                    transition:     "all 0.18s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background  = "rgba(232,64,64,0.18)";
                    (e.currentTarget as HTMLAnchorElement).style.color       = "#e84040";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(232,64,64,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background  = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLAnchorElement).style.color       = "#8888aa";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  {tag.attributes.name.en}
                </Link>
              ))}
            </div>
          )}

          {/* CTA buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "4px" }}>
            <Link
              href={`/manga/${m.id}`}
              style={{
                display:        "flex",
                alignItems:     "center",
                gap:            "8px",
                padding:        "11px 24px",
                borderRadius:   "12px",
                fontSize:       "14px",
                fontWeight:     700,
                color:          "#fff",
                background:     "linear-gradient(135deg, #e84040 0%, #ff6b35 100%)",
                boxShadow:      "0 6px 24px rgba(232,64,64,0.45)",
                textDecoration: "none",
                transition:     "opacity 0.18s, transform 0.18s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.opacity   = "0.88";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.opacity   = "1";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              }}
            >
              <Play size={14} fill="white" strokeWidth={0} /> Read Now
            </Link>

            <Link
              href={`/manga/${m.id}`}
              style={{
                display:        "flex",
                alignItems:     "center",
                gap:            "8px",
                padding:        "11px 24px",
                borderRadius:   "12px",
                fontSize:       "14px",
                fontWeight:     700,
                color:          "#f0f0ff",
                background:     "rgba(255,255,255,0.08)",
                border:         "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                textDecoration: "none",
                transition:     "background 0.18s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.14)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.08)";
              }}
            >
              <Info size={14} /> Details
            </Link>
          </div>
        </div>
      </div>

      {/* ── Left / Right arrows ── */}
      <button
        onClick={() => go((current - 1 + manga.length) % manga.length)}
        aria-label="Previous"
        style={{
          position:       "absolute",
          left:           "10px",
          top:            "50%",
          transform:      "translateY(-50%)",
          zIndex:         3,
          width:          "36px",
          height:         "36px",
          borderRadius:   "50%",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          background:     "rgba(9,9,16,0.6)",
          border:         "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          color:          "#f0f0ff",
          cursor:         "pointer",
          transition:     "all 0.18s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background  = "#e84040";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#e84040";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background  = "rgba(9,9,16,0.6)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
        }}
      >
        <ChevronLeft size={16} />
      </button>

      <button
        onClick={() => go((current + 1) % manga.length)}
        aria-label="Next"
        style={{
          position:       "absolute",
          right:          "10px",
          top:            "50%",
          transform:      "translateY(-50%)",
          zIndex:         3,
          width:          "36px",
          height:         "36px",
          borderRadius:   "50%",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          background:     "rgba(9,9,16,0.6)",
          border:         "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          color:          "#f0f0ff",
          cursor:         "pointer",
          transition:     "all 0.18s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background  = "#e84040";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#e84040";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background  = "rgba(9,9,16,0.6)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
        }}
      >
        <ChevronRight size={16} />
      </button>

      {/* ── Dot indicators ── */}
      <div
        style={{
          position:       "absolute",
          bottom:         "14px",
          left:           "50%",
          transform:      "translateX(-50%)",
          zIndex:         3,
          display:        "flex",
          alignItems:     "center",
          gap:            "6px",
        }}
      >
        {manga.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width:        i === current ? "28px" : "7px",
              height:       "7px",
              borderRadius: "999px",
              border:       "none",
              background:   i === current ? "#e84040" : "rgba(255,255,255,0.25)",
              cursor:       "pointer",
              padding:      0,
              transition:   "all 0.3s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
