import { getTags } from "@/lib/mangadex";
import Link from "next/link";
import { ChevronRight, Tag } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import TagLink from "@/components/TagLink";

export const revalidate = 3600;

const GROUP_LABELS: Record<string, string> = {
  genre: "Genres",
  theme: "Themes",
  format: "Format",
  content: "Content",
};

const GROUP_COLORS: Record<string, string> = {
  genre: "#e85d4a",
  theme: "#5b9cf6",
  format: "#4caf8a",
  content: "#f0a030",
};

export default async function GenresPage() {
  const tagsData = await getTags();
  const tags = tagsData.data;

  const grouped: Record<string, typeof tags> = {};
  for (const tag of tags) {
    const group = tag.attributes.group;
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(tag);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: "#5a5a70" }}>
        <Link href="/" className="hover:text-red-400 transition-colors">Home</Link>
        <ChevronRight size={14} />
        <span style={{ color: "#9090a8" }}>Genres</span>
      </nav>

      <SectionHeader title="Genres & Tags" icon={<Tag size={20} />} />

      <div className="flex flex-col gap-10">
        {Object.entries(grouped).map(([group, groupTags]) => (
          <div key={group}>
            <h2
              className="text-lg font-bold mb-4 flex items-center gap-2"
              style={{ color: "#e8e8f0" }}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: GROUP_COLORS[group] || "#e85d4a" }}
              />
              {GROUP_LABELS[group] || group}
            </h2>
            <div className="flex flex-wrap gap-2">
              {groupTags
                .sort((a, b) =>
                  (a.attributes.name.en || "").localeCompare(b.attributes.name.en || "")
                )
                .map((tag) => (
                  <TagLink
                    key={tag.id}
                    href={`/genres/${tag.id}`}
                    color={GROUP_COLORS[group] || "#e85d4a"}
                  >
                    {tag.attributes.name.en}
                  </TagLink>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
