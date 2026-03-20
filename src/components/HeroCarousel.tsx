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

  const m            = manga[current];
  const title        = getMangaTitle(m);
  const desc         = getMangaDescription(m);
  const author       = getAuthorName(m);
  const coverFileName = getCoverFileName(m);
  const coverUrl     = coverFileName ? getCoverUrl(m.id, coverFileName, 512) : null;
  const tags         = m.attributes.tags.filter((t) => t.attributes.group === "genre").slice(0, 4);
  const status       = m.attributes.status;
  const statusColor  = STATUS_COLORS[status] ?? { bg: "rgba(255,255,255,0.1)", text: "#f0f0ff", border: "rgba(255,255,255,0.2)" };
  const demo         = m.attributes.publicationDemographic;
  const demoColor    = demo ? (DEMO_COLORS[demo] ?? null) : null;

  return (
    <div
      style={{
        position:     "relative",
        borderRadius: "20px",
        overflow:     "hidden",
        height:       "440px",
        background:   "#14141f",
      }}
    >
      {/* ── Blurred background ── */}
      {coverUrl && (
        <>
          {/* The actual blurred image — must scale+blur to cover every pixel */}
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
          {/* Dark side gradient (left heavy) */}
          <div
            style={{
              position:   "absolute",
              inset:      0,
              background: "linear-gradient(100deg, rgba(9,9,16,0.97) 28%, rgba(9,9,16,0.7) 55%, rgba(9,9,16,0.35) 100%)",
              zIndex:     1,
            }}
          />
          {/* Bottom vignette */}
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

      {/* ── Content ── */}
      <div
        className="px-5 py-8 sm:px-12 sm:py-10"
        style={{
          position:   "relative",
          zIndex:     2,
          display:    "flex",
          alignItems: "center",
          gap:        "40px",
          height:     "100%",
        }}
      >
        {/* Cover */}
        {coverUrl && (
          <div
            className="hidden sm:block"
            style={{ flexShrink: 0 }}
          >
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
          className="mx-auto sm:mx-0 items-center sm:items-start"
          style={{
            flex:          1,
            display:       "flex",
            flexDirection: "column",
            gap:           "14px",
            maxWidth:      "560px",
          }}
        >
          {/* Badges row */}
          <div className="justify-center sm:justify-start" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <span
              style={{
                fontSize:        "11px",
                fontWeight:      700,
                letterSpacing:   "0.06em",
                textTransform:   "uppercase",
                padding:         "4px 10px",
                borderRadius:    "999px",
                background:      statusColor.bg,
                color:           statusColor.text,
                border:          `1px solid ${statusColor.border}`,
              }}
            >
              {status}
            </span>
            {demoColor && (
              <span
                style={{
                  fontSize:      "11px",
                  fontWeight:    700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding:       "4px 10px",
                  borderRadius:  "999px",
                  background:    demoColor.bg,
                  color:         demoColor.text,
                  border:        `1px solid ${demoColor.border}`,
                }}
              >
                {demo}
              </span>
            )}
          </div>

          {/* Title */}
          <h2
            className="clamp-2 text-center sm:text-left"
            style={{
              fontSize:    "clamp(1.6rem, 3vw, 2.5rem)",
              fontWeight:  900,
              color:       "#f0f0ff",
              lineHeight:  1.15,
              letterSpacing: "-0.02em",
              textShadow:  "0 2px 16px rgba(0,0,0,0.6)",
              margin:      0,
            }}
          >
            {title}
          </h2>

          {/* Author */}
          <p
            className="text-center sm:text-left"
            style={{
              fontSize:   "13px",
              fontWeight: 600,
              color:      "#e84040",
              margin:     0,
            }}
          >
            {author}
          </p>

          {/* Description */}
          <p
            className="clamp-3 text-center sm:text-left"
            style={{
              fontSize:   "13.5px",
              lineHeight: 1.65,
              color:      "#8888aa",
              margin:     0,
            }}
          >
            {desc}
          </p>

          {/* Genre tags */}
          {tags.length > 0 && (
            <div className="justify-center sm:justify-start" style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/genres/${tag.id}`}
                  style={{
                    fontSize:      "12px",
                    fontWeight:    500,
                    padding:       "4px 12px",
                    borderRadius:  "999px",
                    background:    "rgba(255,255,255,0.06)",
                    color:         "#8888aa",
                    border:        "1px solid rgba(255,255,255,0.1)",
                    textDecoration: "none",
                    transition:    "all 0.18s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(232,64,64,0.18)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#e84040";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(232,64,64,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#8888aa";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  {tag.attributes.name.en}
                </Link>
              ))}
            </div>
          )}

          {/* CTA buttons */}
          <div className="justify-center sm:justify-start" style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "4px" }}>
            <Link
              href={`/manga/${m.id}`}
              style={{
                display:       "flex",
                alignItems:    "center",
                gap:           "8px",
                padding:       "11px 24px",
                borderRadius:  "12px",
                fontSize:      "14px",
                fontWeight:    700,
                color:         "#fff",
                background:    "linear-gradient(135deg, #e84040 0%, #ff6b35 100%)",
                boxShadow:     "0 6px 24px rgba(232,64,64,0.45)",
                textDecoration: "none",
                transition:    "opacity 0.18s, transform 0.18s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.opacity = "0.88";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
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
          left:           "14px",
          top:            "50%",
          transform:      "translateY(-50%)",
          zIndex:         3,
          width:          "40px",
          height:         "40px",
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
          (e.currentTarget as HTMLButtonElement).style.background = "#e84040";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#e84040";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(9,9,16,0.6)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
        }}
      >
        <ChevronLeft size={18} />
      </button>

      <button
        onClick={() => go((current + 1) % manga.length)}
        aria-label="Next"
        style={{
          position:       "absolute",
          right:          "14px",
          top:            "50%",
          transform:      "translateY(-50%)",
          zIndex:         3,
          width:          "40px",
          height:         "40px",
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
          (e.currentTarget as HTMLButtonElement).style.background = "#e84040";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#e84040";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(9,9,16,0.6)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
        }}
      >
        <ChevronRight size={18} />
      </button>

      {/* ── Dot indicators ── */}
      <div
        style={{
          position:       "absolute",
          bottom:         "18px",
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
