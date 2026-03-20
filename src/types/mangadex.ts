export interface LocalizedString {
  [lang: string]: string;
}

export interface Tag {
  id: string;
  type: "tag";
  attributes: {
    name: LocalizedString;
    description: LocalizedString;
    group: "content" | "format" | "genre" | "theme";
    version: number;
  };
}

export interface Relationship {
  id: string;
  type: string;
  related?: string;
  attributes?: Record<string, unknown>;
}

export interface CoverArtAttributes {
  description: string;
  volume: string | null;
  fileName: string;
  locale: string | null;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface AuthorAttributes {
  name: string;
  imageUrl: string | null;
  biography: LocalizedString;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface MangaAttributes {
  title: LocalizedString;
  altTitles: LocalizedString[];
  description: LocalizedString;
  isLocked: boolean;
  links: Record<string, string> | null;
  originalLanguage: string;
  lastVolume: string | null;
  lastChapter: string | null;
  publicationDemographic: "shounen" | "shoujo" | "josei" | "seinen" | null;
  status: "ongoing" | "completed" | "hiatus" | "cancelled";
  year: number | null;
  contentRating: "safe" | "suggestive" | "erotica" | "pornographic";
  tags: Tag[];
  state: string;
  chapterNumbersResetOnNewVolume: boolean;
  createdAt: string;
  updatedAt: string;
  availableTranslatedLanguages: string[];
  latestUploadedChapter: string | null;
  version: number;
}

export interface Manga {
  id: string;
  type: "manga";
  attributes: MangaAttributes;
  relationships: Relationship[];
}

export interface ChapterAttributes {
  title: string | null;
  volume: string | null;
  chapter: string | null;
  pages: number;
  translatedLanguage: string;
  uploader: string;
  externalUrl: string | null;
  publishAt: string;
  readableAt: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Chapter {
  id: string;
  type: "chapter";
  attributes: ChapterAttributes;
  relationships: Relationship[];
}

export interface AtHomeResponse {
  result: string;
  baseUrl: string;
  chapter: {
    hash: string;
    data: string[];
    dataSaver: string[];
  };
}

export interface MangaListResponse {
  result: string;
  response: string;
  data: Manga[];
  limit: number;
  offset: number;
  total: number;
}

export interface MangaResponse {
  result: string;
  response: string;
  data: Manga;
}

export interface ChapterListResponse {
  result: string;
  response: string;
  data: Chapter[];
  limit: number;
  offset: number;
  total: number;
}

export interface TagListResponse {
  result: string;
  response: string;
  data: Tag[];
}
