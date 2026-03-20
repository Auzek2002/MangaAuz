"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Manga } from "@/types/mangadex";
import { getCoverUrl, getCoverFileName, getMangaTitle } from "@/lib/mangadex";

interface MangaCardProps {
  manga: Manga;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  ongoing:   { bg: "rgba(45,212,160,0.2)",  text: "#2dd4a0" },
  completed: { bg: "rgba(122,173,255,0.2)", text: "#7aadff" },
  hiatus:    { bg: "rgba(251,176,64,0.2)",  text: "#fbb040" },
  cancelled: { bg: "rgba(255,112,96,0.2)",  text: "#ff7060" },
};

export default function MangaCard({ manga }: MangaCardProps) {
  const [hovered, setHovered] = useState(false);

  const title        = getMangaTitle(manga);
  const coverFileName = getCoverFileName(manga);
  const coverUrl     = coverFileName ? getCoverUrl(manga.id, coverFileName, 256) : null;
  const status       = manga.attributes.status;
  const colors       = STATUS_COLORS[status] ?? { bg: "rgba(255,255,255,0.1)", text: "#aaaacc" };
  const tags         = manga.attributes.tags
    .filter((t) => t.attributes.group === "genre")
    .slice(0, 2);

  return (
    <Link
      href={`/manga/${manga.id}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          borderRadius: "12px",
          overflow:     "hidden",
          background:   "#14141f",
          border:       `1px solid ${hovered ? "#e84040" : "#252535"}`,
          transform:    hovered ? "translateY(-6px)" : "translateY(0)",
          boxShadow:    hovered ? "0 16px 48px rgba(232,64,64,0.2)" : "none",
          transition:   "all 0.25s ease",
        }}
      >
        {/* ── Cover image ── */}
        <div
          style={{
            position:      "relative",
            width:         "100%",
            paddingBottom: "142%",  /* manga portrait ratio ~1:1.42 */
            overflow:      "hidden",
          }}
        >
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={title}
              fill
              className="object-cover"
              style={{
                transform:  hovered ? "scale(1.06)" : "scale(1)",
                transition: "transform 0.5s ease",
              }}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            />
          ) : (
            <div
              className="skeleton"
              style={{
                position:       "absolute",
                inset:          0,
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "11px", color: "#44445a" }}>No Cover</span>
            </div>
          )}

          {/* Status badge — top left */}
          <div
            style={{
              position: "absolute",
              top:      "8px",
              left:     "8px",
              zIndex:   2,
            }}
          >
            <span
              style={{
                fontSize:       "10px",
                fontWeight:     700,
                letterSpacing:  "0.04em",
                textTransform:  "uppercase",
                padding:        "3px 8px",
                borderRadius:   "999px",
                background:     colors.bg,
                color:          colors.text,
                backdropFilter: "blur(8px)",
              }}
            >
              {status}
            </span>
          </div>

          {/* Content rating badge — top right */}
          {manga.attributes.contentRating === "suggestive" && (
            <div
              style={{
                position: "absolute",
                top:      "8px",
                right:    "8px",
                zIndex:   2,
              }}
            >
              <span
                style={{
                  fontSize:       "10px",
                  fontWeight:     700,
                  padding:        "3px 7px",
                  borderRadius:   "999px",
                  background:     "rgba(251,176,64,0.2)",
                  color:          "#fbb040",
                  backdropFilter: "blur(8px)",
                }}
              >
                16+
              </span>
            </div>
          )}

          {/* Always-visible bottom gradient + title overlay */}
          <div
            style={{
              position:   "absolute",
              inset:      0,
              background: "linear-gradient(to top, rgba(20,20,31,0.97) 0%, rgba(20,20,31,0.5) 35%, transparent 60%)",
              zIndex:     1,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom:   0,
              left:     0,
              right:    0,
              padding:  "12px 10px 10px",
              zIndex:   2,
            }}
          >
            <h3
              className="clamp-2"
              title={title}
              style={{
                fontSize:    "12.5px",
                fontWeight:  700,
                lineHeight:  1.35,
                color:       "#f0f0ff",
                margin:      0,
              }}
            >
              {title}
            </h3>
          </div>
        </div>

        {/* ── Tags below cover ── */}
        <div
          style={{
            padding:  "8px 10px 10px",
            display:  "flex",
            flexWrap: "wrap",
            gap:      "5px",
          }}
        >
          {tags.length > 0 ? (
            tags.map((tag) => (
              <span
                key={tag.id}
                style={{
                  fontSize:     "10px",
                  fontWeight:   500,
                  padding:      "3px 8px",
                  borderRadius: "999px",
                  background:   "#1a1a28",
                  color:        "#44445a",
                  border:       "1px solid #252535",
                }}
              >
                {tag.attributes.name.en}
              </span>
            ))
          ) : (
            <span style={{ fontSize: "10px", color: "#44445a" }}>&nbsp;</span>
          )}
        </div>
      </div>
    </Link>
  );
}
