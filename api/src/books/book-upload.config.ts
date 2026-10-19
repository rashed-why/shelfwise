import { existsSync, mkdirSync, writeFileSync } from "fs";
import { extname, join } from "path";

/** Under `public/` so Nest static serving does not clash with `/books` API routes. */
export const BOOK_UPLOAD_DIR = join(process.cwd(), "public", "media", "books");

export function ensureBookUploadDirectory() {
  if (!existsSync(BOOK_UPLOAD_DIR)) {
    mkdirSync(BOOK_UPLOAD_DIR, { recursive: true });
  }
}

export function getBookImagePath(filename: string) {
  return `/media/books/${filename}`;
}

/** Maps legacy DB paths saved before the `/media/books` prefix. */
export function resolveBookImageUrl(image: string): string {
  if (image.startsWith("/books/")) {
    return `/media/books/${image.slice("/books/".length)}`;
  }

  return image;
}

export function saveBookImageFile(file: Express.Multer.File): string {
  ensureBookUploadDirectory();

  const extension = extname(file.originalname);
  const filename = `${Date.now()}${extension}`;
  const imagePath = getBookImagePath(filename);
  const filePath = join(BOOK_UPLOAD_DIR, filename);

  writeFileSync(filePath, file.buffer);

  return imagePath;
}
