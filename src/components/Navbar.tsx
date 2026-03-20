"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Search, BookOpen, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/",       label: "Home"   },
  { href: "/browse", label: "Browse" },
  { href: "/genres", label: "Genres" },
];

export default function Navbar() {
  const router   = useRouter();
  const pathname = usePathname();
  const [query,    setQuery]    = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [focused,  setFocused]  = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setQuery("");
    inputRef.current?.blur();
  };

  return (
    <nav
      style={{
        position:       "sticky",
        top:            0,
        zIndex:         50,
        height:         "60px",
        background:     "rgba(9,9,16,0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom:   "1px solid #252535",
      }}
    >
      {/* ── Inner container ── */}
      <div
        style={{
          maxWidth:      "1280px",
          margin:        "0 auto",
          padding:       "0 24px",
          height:        "100%",
          display:       "flex",
          alignItems:    "center",
          gap:           "16px",
        }}
      >
        {/* ── Logo (left) ── */}
        <Link
          href="/"
          style={{
            display:    "flex",
            alignItems: "center",
            gap:        "10px",
            flexShrink: 0,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width:          "34px",
              height:         "34px",
              borderRadius:   "8px",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              background:     "linear-gradient(135deg, #e84040 0%, #ff6b35 100%)",
              boxShadow:      "0 4px 14px rgba(232,64,64,0.45)",
              flexShrink:     0,
            }}
          >
            <BookOpen size={17} color="#fff" strokeWidth={2.2} />
          </div>
          <span
            style={{
              fontWeight:  800,
              fontSize:    "18px",
              color:       "#f0f0ff",
              letterSpacing: "-0.3px",
            }}
          >
            Manga<span style={{ color: "#e84040" }}>Auz</span>
          </span>
        </Link>

        {/* ── Nav links (center, flex:1) ── */}
        <div
          className="hidden md:flex"
          style={{
            flex:           1,
            alignItems:     "center",
            justifyContent: "center",
            gap:            "4px",
          }}
        >
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  position:      "relative",
                  padding:       "6px 16px",
                  borderRadius:  "8px",
                  fontSize:      "14px",
                  fontWeight:    600,
                  color:         active ? "#f0f0ff" : "#8888aa",
                  background:    active ? "rgba(232,64,64,0.1)" : "transparent",
                  textDecoration: "none",
                  transition:    "all 0.18s",
                  whiteSpace:    "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.color = "#f0f0ff";
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.color = "#8888aa";
                    (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                  }
                }}
              >
                {label}
                {active && (
                  <span
                    style={{
                      position:     "absolute",
                      bottom:       "0px",
                      left:         "50%",
                      transform:    "translateX(-50%)",
                      width:        "20px",
                      height:       "2px",
                      borderRadius: "2px",
                      background:   "#e84040",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* ── Search (right, desktop only) ── */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center"
          style={{
            gap:        "8px",
            flexShrink: 0,
          }}
        >
          {/* Pill input */}
          <div style={{ position: "relative" }}>
            <Search
              size={14}
              style={{
                position:       "absolute",
                left:           "14px",
                top:            "50%",
                transform:      "translateY(-50%)",
                color:          focused ? "#e84040" : "#44445a",
                pointerEvents:  "none",
                transition:     "color 0.18s",
              }}
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search manga..."
              style={{
                background:   "#14141f",
                border:       `1px solid ${focused ? "#e84040" : "#252535"}`,
                borderRadius: "999px",
                padding:      "8px 16px 8px 36px",
                fontSize:     "13px",
                color:        "#f0f0ff",
                outline:      "none",
                width:        focused ? "240px" : "200px",
                transition:   "border-color 0.18s, width 0.25s",
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </div>

          {/* Search button */}
          <button
            type="submit"
            style={{
              background:   "linear-gradient(135deg, #e84040 0%, #ff6b35 100%)",
              color:        "#fff",
              border:       "none",
              borderRadius: "999px",
              padding:      "8px 18px",
              fontSize:     "13px",
              fontWeight:   700,
              cursor:       "pointer",
              boxShadow:    "0 2px 10px rgba(232,64,64,0.4)",
              transition:   "opacity 0.18s, transform 0.18s",
              whiteSpace:   "nowrap",
              flexShrink:   0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "0.88";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "1";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            Search
          </button>
        </form>

        {/* ── Mobile hamburger ── */}
        <button
          className="md:hidden ml-auto"
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            padding:         "8px",
            borderRadius:    "8px",
            background:      "rgba(255,255,255,0.05)",
            border:          "1px solid #252535",
            color:           "#8888aa",
            cursor:          "pointer",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            flexShrink:      0,
          }}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* ── Mobile dropdown ── */}
      {menuOpen && (
        <div
          className="md:hidden slide-down"
          style={{
            background:     "rgba(9,9,16,0.97)",
            backdropFilter: "blur(20px)",
            borderBottom:   "1px solid #252535",
            padding:        "12px 24px 16px",
            display:        "flex",
            flexDirection:  "column",
            gap:            "2px",
          }}
        >
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display:       "block",
                  padding:       "10px 14px",
                  borderRadius:  "10px",
                  fontSize:      "14px",
                  fontWeight:    600,
                  color:         active ? "#e84040" : "#8888aa",
                  background:    active ? "rgba(232,64,64,0.1)" : "transparent",
                  textDecoration: "none",
                  borderLeft:    `3px solid ${active ? "#e84040" : "transparent"}`,
                }}
              >
                {label}
              </Link>
            );
          })}

          {/* Mobile search */}
          <form
            onSubmit={handleSearch}
            style={{
              display:    "flex",
              gap:        "8px",
              marginTop:  "8px",
              paddingTop: "10px",
              borderTop:  "1px solid #252535",
            }}
          >
            <div style={{ position: "relative", flex: 1 }}>
              <Search
                size={14}
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#44445a", pointerEvents: "none" }}
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search manga..."
                style={{
                  background:   "#14141f",
                  border:       "1px solid #252535",
                  borderRadius: "999px",
                  padding:      "8px 14px 8px 34px",
                  fontSize:     "13px",
                  color:        "#f0f0ff",
                  outline:      "none",
                  width:        "100%",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                background:   "linear-gradient(135deg, #e84040, #ff6b35)",
                color:        "#fff",
                border:       "none",
                borderRadius: "999px",
                padding:      "8px 16px",
                fontSize:     "13px",
                fontWeight:   700,
                cursor:       "pointer",
              }}
            >
              Go
            </button>
          </form>
        </div>
      )}
    </nav>
  );
}
