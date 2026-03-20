"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

interface SearchFormProps {
  initialQuery?: string;
}

export default function SearchForm({ initialQuery = "" }: SearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="relative flex-1 max-w-xl">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{ color: "#5a5a70" }}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search manga title..."
          className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-colors"
          style={{
            backgroundColor: "#1c1c26",
            color: "#e8e8f0",
            border: "1px solid #2a2a3a",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#e85d4a";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#2a2a3a";
          }}
        />
      </div>
      <button
        type="submit"
        className="px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
        style={{ backgroundColor: "#e85d4a", color: "#fff" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f07060";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#e85d4a";
        }}
      >
        Search
      </button>
    </form>
  );
}
