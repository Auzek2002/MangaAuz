"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  viewAllHref?: string;
  icon?: React.ReactNode;
}

export default function SectionHeader({ title, viewAllHref, icon }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div
          className="w-1 h-6 rounded-full"
          style={{ background: "linear-gradient(to bottom, #e05248, #c03a32)" }}
        />
        {icon && (
          <span style={{ color: "#e05248" }}>{icon}</span>
        )}
        <h2 className="text-xl font-bold" style={{ color: "#f0f0fc" }}>
          {title}
        </h2>
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
          style={{ backgroundColor: "#1e1e2a", color: "#8888a0", border: "1px solid #2a2a3a" }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.color = "#e05248";
            el.style.borderColor = "#e05248";
            el.style.backgroundColor = "#e0524812";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.color = "#8888a0";
            el.style.borderColor = "#2a2a3a";
            el.style.backgroundColor = "#1e1e2a";
          }}
        >
          View All <ChevronRight size={13} />
        </Link>
      )}
    </div>
  );
}
