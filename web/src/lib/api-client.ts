const defaultApiOrigin = "http://localhost:4000";

const serverApiUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  process.env.API_URL?.replace(/\/$/, "") ??
  defaultApiOrigin;

/** Nest serves uploaded files from `public/` (e.g. `/books/...`), not via `/api`. */
export function getApiOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_API_ORIGIN?.replace(/\/$/, "") ??
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    defaultApiOrigin
  );
}

/** Same-origin `/backend` in the browser (Next rewrite → Nest). `/api` is reserved for NextAuth. */
export function getApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (configured) {
    return configured;
  }

  if (typeof window !== "undefined") {
    return "/backend";
  }

  return serverApiUrl;
}

export async function parseApiError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { message?: string | string[] };
    if (Array.isArray(data.message)) {
      return data.message.join(" ");
    }
    if (typeof data.message === "string") {
      return data.message;
    }
  } catch {
    // ignore JSON parse errors
  }

  return `Request failed (${response.status})`;
}

/** Legacy book covers were stored under `/books/` (conflicted with the REST API). */
export function resolveBookImagePath(assetPath: string): string {
  if (assetPath.startsWith("/books/")) {
    return `/media/books/${assetPath.slice("/books/".length)}`;
  }

  return assetPath;
}

/** Public asset paths from the API (e.g. `/media/books/cover.jpg`). */
export function getApiAssetUrl(assetPath: string): string {
  if (assetPath.startsWith("http://") || assetPath.startsWith("https://")) {
    return assetPath;
  }

  const normalized = resolveBookImagePath(
    assetPath.startsWith("/") ? assetPath : `/${assetPath}`,
  );
  return `${getApiOrigin()}${normalized}`;
}
