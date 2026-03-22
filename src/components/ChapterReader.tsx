"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Chapter } from "@/types/mangadex";
import { getChapterTitle } from "@/lib/mangadex";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  List,
  X,
  BookOpen,
  AlignJustify,
  Columns,
} from "lucide-react";

interface ChapterReaderProps {
  mangaId:        string;
  chapterId:      string;
  mangaTitle:     string;
  chapterTitle:   string;
  imageUrls:      string[];
  prevChapterId:  string | null;
  nextChapterId:  string | null;
  chapters:       Chapter[];
}

/* ── small style helpers ─────────────────────────────────────────────────── */

const iconBtn = (active = false): React.CSSProperties => ({
  display:        "flex",
  alignItems:     "center",
  justifyContent: "center",
  width:          "36px",
  height:         "36px",
  borderRadius:   "8px",
  border:         `1px solid ${active ? "rgba(232,64,64,0.4)" : "#252535"}`,
  background:     active ? "rgba(232,64,64,0.12)" : "rgba(255,255,255,0.04)",
  color:          active ? "#e84040" : "#8888aa",
  cursor:         "pointer",
  flexShrink:     0,
  transition:     "all 0.18s",
});

const pillBtn = (disabled = false): React.CSSProperties => ({
  display:        "flex",
  alignItems:     "center",
  justifyContent: "center",
  gap:            "6px",
  padding:        "8px 20px",
  borderRadius:   "10px",
  fontSize:       "13px",
  fontWeight:     700,
  cursor:         disabled ? "not-allowed" : "pointer",
  border:         "none",
  background:     disabled
    ? "rgba(255,255,255,0.05)"
    : "linear-gradient(135deg, #e84040 0%, #ff6b35 100%)",
  color:          disabled ? "#44445a" : "#fff",
  boxShadow:      disabled ? "none" : "0 4px 16px rgba(232,64,64,0.35)",
  transition:     "opacity 0.18s",
  flex:           1,
});

/* ────────────────────────────────────────────────────────────────────────── */

export default function ChapterReader({
  mangaId,
  chapterId,
  mangaTitle,
  chapterTitle,
  imageUrls,
  prevChapterId,
  nextChapterId,
  chapters,
}: ChapterReaderProps) {
  const [showBar,    setShowBar]    = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [mode,       setMode]       = useState<"vertical" | "paged">("vertical");
  const [page,       setPage]       = useState(0);
  const [imgErrors,  setImgErrors]  = useState<Set<number>>(new Set());
  const [imgRetries, setImgRetries] = useState<Record<number, number>>({});
  const lastY  = useRef(0);
  const headerRef = useRef<HTMLDivElement>(null);

  const MAX_RETRIES = 3;

  /* Hide / reveal header on scroll */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if      (y > lastY.current + 15) setShowBar(false);
      else if (y < lastY.current - 15) setShowBar(true);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goPage = useCallback(
    (delta: number) =>
      setPage((p) => Math.max(0, Math.min(imageUrls.length - 1, p + delta))),
    [imageUrls.length]
  );

  /* Keyboard navigation in paged mode */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (mode !== "paged") return;
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")    goPage(-1);
      if (e.key === "ArrowRight" || e.key === "ArrowDown")   goPage(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, goPage]);

  const visible   = showBar || showDrawer;
  const HEADER_H  = 90; /* px — must match paddingTop below */
  const DRAWER_W  = 280;

  /* Permanently mark as failed */
  const markError = (i: number) =>
    setImgErrors((s) => { const n = new Set(s); n.add(i); return n; });

  /* Retry an image (clear error + reset retry count) */
  const retryImage = (i: number) => {
    setImgErrors((s) => { const n = new Set(s); n.delete(i); return n; });
    setImgRetries((r) => ({ ...r, [i]: 0 }));
  };

  /* Called by onError — auto-retries up to MAX_RETRIES, then marks failed.
     Changing imgRetries[i] changes the img key, forcing a fresh browser fetch. */
  const handleImgError = useCallback((i: number) => {
    setImgRetries((r) => {
      const attempts = r[i] ?? 0;
      if (attempts < MAX_RETRIES) {
        // Schedule a key change after a growing delay (1s, 2s, 3s) → fresh request
        setTimeout(
          () => setImgRetries((prev) => ({ ...prev, [i]: (prev[i] ?? 0) + 1 })),
          1000 * (attempts + 1)
        );
      } else {
        setTimeout(() => markError(i), 0);
      }
      return r;
    });
  }, []);

  /* ── Shared "end of chapter" nav block ── */
  const EndNav = () => (
    <div
      style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        padding:        "24px 24px 40px",
        marginTop:      "8px",
        borderTop:      "1px solid #252535",
        gap:            "12px",
      }}
    >
      {prevChapterId ? (
        <Link
          href={`/manga/${mangaId}/chapter/${prevChapterId}`}
          style={{
            display:        "flex",
            alignItems:     "center",
            gap:            "8px",
            padding:        "10px 20px",
            borderRadius:   "10px",
            fontSize:       "13px",
            fontWeight:     700,
            color:          "#f0f0ff",
            background:     "rgba(255,255,255,0.06)",
            border:         "1px solid #252535",
            textDecoration: "none",
            transition:     "all 0.18s",
            flex:           1,
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e84040";
            (e.currentTarget as HTMLAnchorElement).style.color = "#e84040";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "#252535";
            (e.currentTarget as HTMLAnchorElement).style.color = "#f0f0ff";
          }}
        >
          <ChevronLeft size={15} /> Previous Chapter
        </Link>
      ) : (
        <Link
          href={`/manga/${mangaId}`}
          style={{
            display:        "flex",
            alignItems:     "center",
            gap:            "8px",
            padding:        "10px 20px",
            borderRadius:   "10px",
            fontSize:       "13px",
            fontWeight:     700,
            color:          "#8888aa",
            background:     "rgba(255,255,255,0.04)",
            border:         "1px solid #252535",
            textDecoration: "none",
            flex:           1,
            justifyContent: "center",
          }}
        >
          <BookOpen size={15} /> Manga Details
        </Link>
      )}

      {nextChapterId ? (
        <Link
          href={`/manga/${mangaId}/chapter/${nextChapterId}`}
          style={{
            display:        "flex",
            alignItems:     "center",
            gap:            "8px",
            padding:        "10px 20px",
            borderRadius:   "10px",
            fontSize:       "13px",
            fontWeight:     700,
            color:          "#fff",
            background:     "linear-gradient(135deg, #e84040 0%, #ff6b35 100%)",
            boxShadow:      "0 4px 16px rgba(232,64,64,0.4)",
            textDecoration: "none",
            flex:           1,
            justifyContent: "center",
            transition:     "opacity 0.18s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.88"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
        >
          Next Chapter <ChevronRight size={15} />
        </Link>
      ) : (
        <Link
          href={`/manga/${mangaId}`}
          style={{
            display:        "flex",
            alignItems:     "center",
            gap:            "8px",
            padding:        "10px 20px",
            borderRadius:   "10px",
            fontSize:       "13px",
            fontWeight:     700,
            color:          "#fff",
            background:     "linear-gradient(135deg, #e84040 0%, #ff6b35 100%)",
            textDecoration: "none",
            flex:           1,
            justifyContent: "center",
          }}
        >
          Back to Manga <BookOpen size={15} />
        </Link>
      )}
    </div>
  );

  return (
    <div style={{ backgroundColor: "#050508", minHeight: "100vh" }}>

      {/* ══════════════════════════════════════════════════════════════
          FIXED HEADER
      ══════════════════════════════════════════════════════════════ */}
      <div
        ref={headerRef}
        style={{
          position:       "fixed",
          top:            0,
          left:           0,
          right:          0,
          zIndex:         50,
          transform:      visible ? "translateY(0)" : "translateY(-100%)",
          transition:     "transform 0.3s ease",
          background:     "rgba(5,5,8,0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom:   "1px solid #252535",
        }}
      >
        {/* ── Top row ── */}
        <div
          style={{
            display:     "flex",
            alignItems:  "center",
            gap:         "10px",
            padding:     "10px 16px",
          }}
        >
          {/* Back to manga */}
          <Link
            href={`/manga/${mangaId}`}
            style={iconBtn()}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#e84040"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(232,64,64,0.4)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#8888aa"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "#252535"; }}
          >
            <ChevronLeft size={18} />
          </Link>

          {/* Title info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              className="clamp-1"
              style={{ fontSize: "14px", fontWeight: 700, color: "#f0f0ff", margin: 0, lineHeight: 1.3 }}
            >
              {mangaTitle}
            </p>
            <p
              className="clamp-1"
              style={{ fontSize: "11px", color: "#44445a", margin: 0, marginTop: "2px" }}
            >
              {chapterTitle} &bull; {imageUrls.length} pages
            </p>
          </div>

          {/* Right controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {/* Mode toggle */}
            <button
              onClick={() => setMode((m) => m === "vertical" ? "paged" : "vertical")}
              style={{
                ...iconBtn(),
                width:    "auto",
                padding:  "0 12px",
                gap:      "6px",
                fontSize: "12px",
                fontWeight: 600,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#f0f0ff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#3a3a50"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#8888aa"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#252535"; }}
            >
              {mode === "vertical"
                ? <><Columns size={13} /> <span className="hidden sm:inline">Paged</span></>
                : <><AlignJustify size={13} /> <span className="hidden sm:inline">Scroll</span></>
              }
            </button>

            {/* Chapter list toggle */}
            <button
              onClick={() => setShowDrawer((d) => !d)}
              style={iconBtn(showDrawer)}
              onMouseEnter={(e) => {
                if (!showDrawer) {
                  (e.currentTarget as HTMLButtonElement).style.color = "#f0f0ff";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#3a3a50";
                }
              }}
              onMouseLeave={(e) => {
                if (!showDrawer) {
                  (e.currentTarget as HTMLButtonElement).style.color = "#8888aa";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#252535";
                }
              }}
            >
              <List size={17} />
            </button>

            {/* Home */}
            <Link
              href="/"
              style={iconBtn()}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#e84040"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(232,64,64,0.4)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#8888aa"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "#252535"; }}
            >
              <Home size={17} />
            </Link>
          </div>
        </div>

        {/* ── Chapter nav row ── */}
        <div
          style={{
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "space-between",
            padding:         "6px 16px 10px",
            borderTop:       "1px solid rgba(37,37,53,0.6)",
          }}
        >
          {prevChapterId ? (
            <Link
              href={`/manga/${mangaId}/chapter/${prevChapterId}`}
              style={{
                display:        "flex",
                alignItems:     "center",
                gap:            "4px",
                padding:        "5px 12px",
                borderRadius:   "8px",
                fontSize:       "12px",
                fontWeight:     600,
                color:          "#8888aa",
                background:     "rgba(255,255,255,0.04)",
                border:         "1px solid #252535",
                textDecoration: "none",
                transition:     "all 0.18s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#e84040"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(232,64,64,0.4)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#8888aa"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "#252535"; }}
            >
              <ChevronLeft size={12} /> Prev
            </Link>
          ) : <span />}

          <span style={{ fontSize: "12px", fontFamily: "monospace", color: "#44445a" }}>
            {mode === "paged" ? `${page + 1} / ${imageUrls.length}` : chapterTitle}
          </span>

          {nextChapterId ? (
            <Link
              href={`/manga/${mangaId}/chapter/${nextChapterId}`}
              style={{
                display:        "flex",
                alignItems:     "center",
                gap:            "4px",
                padding:        "5px 12px",
                borderRadius:   "8px",
                fontSize:       "12px",
                fontWeight:     600,
                color:          "#8888aa",
                background:     "rgba(255,255,255,0.04)",
                border:         "1px solid #252535",
                textDecoration: "none",
                transition:     "all 0.18s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#e84040"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(232,64,64,0.4)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#8888aa"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "#252535"; }}
            >
              Next <ChevronRight size={12} />
            </Link>
          ) : <span />}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          CHAPTER LIST DRAWER  (fixed, right side)
      ══════════════════════════════════════════════════════════════ */}
      {showDrawer && (
        <div
          style={{
            position:        "fixed",
            top:             `${HEADER_H}px`,
            right:           0,
            bottom:          0,
            width:           `${DRAWER_W}px`,
            zIndex:          40,
            background:      "#0f0f18",
            borderLeft:      "1px solid #252535",
            overflowY:       "auto",
            boxShadow:       "-8px 0 32px rgba(0,0,0,0.5)",
          }}
        >
          {/* Sticky drawer header */}
          <div
            style={{
              position:    "sticky",
              top:         0,
              display:     "flex",
              alignItems:  "center",
              justifyContent: "space-between",
              padding:     "12px 16px",
              background:  "#0f0f18",
              borderBottom: "1px solid #252535",
              zIndex:      1,
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#f0f0ff" }}>
              Chapters
            </span>
            <button
              onClick={() => setShowDrawer(false)}
              style={{
                background: "transparent",
                border:     "none",
                color:      "#44445a",
                cursor:     "pointer",
                display:    "flex",
                padding:    "2px",
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Chapter list */}
          {chapters.map((ch) => {
            const active = ch.id === chapterId;
            return (
              <Link
                key={ch.id}
                href={`/manga/${mangaId}/chapter/${ch.id}`}
                onClick={() => setShowDrawer(false)}
                style={{
                  display:       "block",
                  padding:       "11px 16px",
                  fontSize:      "13px",
                  fontWeight:    active ? 700 : 500,
                  color:         active ? "#e84040" : "#8888aa",
                  background:    active ? "rgba(232,64,64,0.08)" : "transparent",
                  borderBottom:  "1px solid rgba(37,37,53,0.5)",
                  borderLeft:    `3px solid ${active ? "#e84040" : "transparent"}`,
                  textDecoration: "none",
                  transition:    "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)";
                }}
                onMouseLeave={(e) => {
                  if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                }}
              >
                {getChapterTitle(ch)}
              </Link>
            );
          })}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MAIN READING AREA
      ══════════════════════════════════════════════════════════════ */}
      <div style={{ paddingTop: `${HEADER_H}px` }}>

        {mode === "vertical" ? (
          /* ── VERTICAL SCROLL MODE ──
             CRITICAL: outer div is full-width flex-column centering
             Inner div caps the reading width and is centered with margin:auto
             NO marginRight hack — drawer floats on top via position:fixed     */
          <div
            style={{
              display:       "flex",
              flexDirection: "column",
              alignItems:    "center",
            }}
          >
            {/* Reading column */}
            <div
              style={{
                width:    "100%",
                maxWidth: "840px",
              }}
            >
              {imageUrls.map((url, i) =>
                imgErrors.has(i) ? (
                  <div
                    key={`err-${i}`}
                    style={{
                      width:           "100%",
                      height:          "220px",
                      display:         "flex",
                      flexDirection:   "column",
                      alignItems:      "center",
                      justifyContent:  "center",
                      gap:             "12px",
                      background:      "#14141f",
                      color:           "#44445a",
                      fontSize:        "13px",
                      borderBottom:    "1px solid #252535",
                    }}
                  >
                    <span>Page {i + 1} failed to load</span>
                    <button
                      onClick={() => retryImage(i)}
                      style={{
                        padding:      "6px 16px",
                        borderRadius: "8px",
                        border:       "1px solid #3a3a50",
                        background:   "rgba(255,255,255,0.06)",
                        color:        "#8888aa",
                        fontSize:     "12px",
                        cursor:       "pointer",
                      }}
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <img
                    key={`page-${i}-${imgRetries[i] ?? 0}`}
                    src={url}
                    alt={`Page ${i + 1}`}
                    style={{ width: "100%", display: "block", lineHeight: 0 }}
                    onError={() => handleImgError(i)}
                  />
                )
              )}
            </div>

            {/* End of chapter nav — also max-width centered */}
            <div style={{ width: "100%", maxWidth: "840px" }}>
              <EndNav />
            </div>
          </div>

        ) : (
          /* ── PAGED MODE ──
             Full-width flex column, image centered, no drawer offset needed */
          <div
            style={{
              display:       "flex",
              flexDirection: "column",
              alignItems:    "center",
              minHeight:     `calc(100vh - ${HEADER_H}px)`,
            }}
          >
            {/* Image area */}
            <div
              style={{
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                width:          "100%",
                flex:           1,
                padding:        "16px",
              }}
            >
              {imgErrors.has(page) ? (
                <div
                  style={{
                    width:          "100%",
                    maxWidth:       "840px",
                    height:         "60vh",
                    display:        "flex",
                    flexDirection:  "column",
                    alignItems:     "center",
                    justifyContent: "center",
                    gap:            "12px",
                    background:     "#14141f",
                    borderRadius:   "10px",
                    color:          "#44445a",
                    fontSize:       "13px",
                  }}
                >
                  <span>Page {page + 1} failed to load</span>
                  <button
                    onClick={() => retryImage(page)}
                    style={{
                      padding:      "6px 16px",
                      borderRadius: "8px",
                      border:       "1px solid #3a3a50",
                      background:   "rgba(255,255,255,0.06)",
                      color:        "#8888aa",
                      fontSize:     "12px",
                      cursor:       "pointer",
                    }}
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <img
                  key={`page-${page}-${imgRetries[page] ?? 0}`}
                  src={imageUrls[page]}
                  alt={`Page ${page + 1}`}
                  style={{
                    maxWidth:  "840px",
                    width:     "100%",
                    maxHeight: `calc(100vh - ${HEADER_H + 60}px)`,
                    objectFit: "contain",
                    display:   "block",
                  }}
                  onError={() => handleImgError(page)}
                />
              )}
            </div>

            {/* Page navigation */}
            <div
              style={{
                display:     "flex",
                alignItems:  "center",
                gap:         "12px",
                padding:     "16px 20px",
                width:       "100%",
                maxWidth:    "840px",
                borderTop:   "1px solid #252535",
              }}
            >
              <button
                onClick={() => goPage(-1)}
                disabled={page === 0}
                style={pillBtn(page === 0)}
              >
                <ChevronLeft size={15} /> Prev Page
              </button>

              <span style={{ fontSize: "13px", fontFamily: "monospace", color: "#44445a", flexShrink: 0 }}>
                {page + 1} / {imageUrls.length}
              </span>

              <button
                onClick={() => goPage(1)}
                disabled={page === imageUrls.length - 1}
                style={pillBtn(page === imageUrls.length - 1)}
              >
                Next Page <ChevronRight size={15} />
              </button>
            </div>

            {/* Chapter navigation */}
            <div style={{ width: "100%", maxWidth: "840px" }}>
              <EndNav />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
