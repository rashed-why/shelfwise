import { categories, type Category } from "@/lib/categories";
import { slugify } from "@/lib/slugify";

const CATEGORIES_KEY = "selfwise_admin_categories";
const AUTHORS_KEY = "selfwise_admin_authors";
const BOOKS_KEY = "selfwise_admin_books";

export type AdminCategory = Category & {
  id: string;
  createdAt: string;
};

export type AdminAuthor = {
  id: string;
  slug: string;
  name: string;
  createdAt: string;
};

export type AdminBook = {
  id: string;
  slug: string;
  title: string;
  author: string;
  coverUrl: string;
  categorySlug: string;
  summary?: string;
  createdAt: string;
};

function readJson<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeJson<T>(key: string, value: T[]) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadAdminCategories(): AdminCategory[] {
  return readJson<AdminCategory>(CATEGORIES_KEY);
}

export function loadAdminBooks(): AdminBook[] {
  return readJson<AdminBook>(BOOKS_KEY);
}

export function loadAdminAuthors(): AdminAuthor[] {
  return readJson<AdminAuthor>(AUTHORS_KEY);
}

export function saveAdminCategory(input: {
  label: string;
  slug?: string;
}): { ok: true; category: AdminCategory } | { ok: false; error: string } {
  const label = input.label.trim();
  if (!label) return { ok: false, error: "Label is required." };

  const slug = input.slug?.trim() || slugify(label);
  if (!slug) return { ok: false, error: "Could not generate a slug." };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { ok: false, error: "Slug must use lowercase letters, numbers, and hyphens." };
  }

  const existingSlugs = new Set([
    ...categories.map((c) => c.slug),
    ...loadAdminCategories().map((c) => c.slug),
  ]);
  if (existingSlugs.has(slug)) {
    return { ok: false, error: `Category slug "${slug}" already exists.` };
  }

  const category: AdminCategory = {
    id: crypto.randomUUID(),
    slug,
    label,
    createdAt: new Date().toISOString(),
  };

  const next = [...loadAdminCategories(), category];
  writeJson(CATEGORIES_KEY, next);
  return { ok: true, category };
}

export function saveAdminAuthor(input: {
  name: string;
  slug?: string;
}): { ok: true; author: AdminAuthor } | { ok: false; error: string } {
  const name = input.name.trim();
  if (!name) return { ok: false, error: "Name is required." };

  const slug = input.slug?.trim() || slugify(name);
  if (!slug) return { ok: false, error: "Could not generate a slug." };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { ok: false, error: "Slug must use lowercase letters, numbers, and hyphens." };
  }

  const existingSlugs = new Set(loadAdminAuthors().map((a) => a.slug));
  const existingNames = new Set(
    loadAdminAuthors().map((a) => a.name.toLowerCase()),
  );
  if (existingSlugs.has(slug)) {
    return { ok: false, error: `Author slug "${slug}" already exists.` };
  }
  if (existingNames.has(name.toLowerCase())) {
    return { ok: false, error: `Author "${name}" already exists.` };
  }

  const author: AdminAuthor = {
    id: crypto.randomUUID(),
    slug,
    name,
    createdAt: new Date().toISOString(),
  };

  const next = [...loadAdminAuthors(), author];
  writeJson(AUTHORS_KEY, next);
  return { ok: true, author };
}

export function saveAdminBook(input: {
  title: string;
  author: string;
  coverUrl: string;
  categorySlug: string;
  summary?: string;
  slug?: string;
}): { ok: true; book: AdminBook } | { ok: false; error: string } {
  const title = input.title.trim();
  const author = input.author.trim();
  const coverUrl = input.coverUrl.trim();
  const categorySlug = input.categorySlug.trim();

  if (!title || !author || !coverUrl || !categorySlug) {
    return { ok: false, error: "Title, author, cover URL, and category are required." };
  }

  try {
    const parsed = new URL(coverUrl);
    if (!parsed.protocol.startsWith("http")) {
      return { ok: false, error: "Cover URL must be http or https." };
    }
  } catch {
    return { ok: false, error: "Cover URL must be a valid link." };
  }

  const slug =
    input.slug?.trim() ||
    slugify(`${title}-${author}`) ||
    slugify(title);
  if (!slug) return { ok: false, error: "Could not generate a slug." };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { ok: false, error: "Slug must use lowercase letters, numbers, and hyphens." };
  }

  const existingSlugs = new Set(loadAdminBooks().map((b) => b.slug));
  if (existingSlugs.has(slug)) {
    return { ok: false, error: `Book slug "${slug}" already exists.` };
  }

  const book: AdminBook = {
    id: crypto.randomUUID(),
    slug,
    title,
    author,
    coverUrl,
    categorySlug,
    summary: input.summary?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  const next = [...loadAdminBooks(), book];
  writeJson(BOOKS_KEY, next);
  return { ok: true, book };
}

export function getAllCategoryOptions(): Category[] {
  const merged = [...categories];
  const seen = new Set(categories.map((c) => c.slug));
  for (const item of loadAdminCategories()) {
    if (!seen.has(item.slug)) {
      merged.push({ slug: item.slug, label: item.label });
      seen.add(item.slug);
    }
  }
  return merged.sort((a, b) => a.label.localeCompare(b.label));
}

export function getAllAuthorOptions(): AdminAuthor[] {
  return [...loadAdminAuthors()].sort((a, b) => a.name.localeCompare(b.name));
}
