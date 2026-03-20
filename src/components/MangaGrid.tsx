import { Manga } from "@/types/mangadex";
import MangaCard from "./MangaCard";

interface MangaGridProps {
  manga: Manga[];
  columns?: 2 | 3 | 4 | 5 | 6;
}

const GRID_COLS: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
  6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
};

export default function MangaGrid({ manga, columns = 5 }: MangaGridProps) {
  if (!manga.length) {
    return (
      <div
        style={{
          textAlign: "center",
          padding:   "64px 0",
          fontSize:  "14px",
          color:     "#44445a",
        }}
      >
        No manga found.
      </div>
    );
  }

  return (
    <div className={`grid ${GRID_COLS[columns]} gap-5`}>
      {manga.map((m) => (
        <MangaCard key={m.id} manga={m} />
      ))}
    </div>
  );
}
