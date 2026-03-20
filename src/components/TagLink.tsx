"use client";

import Link from "next/link";

interface TagLinkProps {
  href: string;
  children: React.ReactNode;
  color?: string;
}

export default function TagLink({ href, children, color = "#e05248" }: TagLinkProps) {
  return (
    <Link
      href={href}
      className="text-xs px-2.5 py-1 rounded-lg font-medium transition-all inline-block"
      style={{ backgroundColor: "#1e1e2a", color: "#8888a0", border: "1px solid #2a2a3a" }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.color = color;
        el.style.borderColor = color + "60";
        el.style.backgroundColor = color + "15";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.color = "#8888a0";
        el.style.borderColor = "#2a2a3a";
        el.style.backgroundColor = "#1e1e2a";
      }}
    >
      {children}
    </Link>
  );
}
