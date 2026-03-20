"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs flex-wrap" style={{ color: "#44445a" }}>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={11} />}
          {crumb.href ? (
            <Link
              href={crumb.href}
              style={{ color: "#8888a0" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#e05248"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#8888a0"; }}
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="clamp-1 max-w-xs" style={{ color: "#c0c0d8" }}>{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
