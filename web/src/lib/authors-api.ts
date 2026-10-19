import { getApiBaseUrl, parseApiError } from "@/lib/api-client";

export type AuthorRecord = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export async function fetchAuthors(): Promise<AuthorRecord[]> {
  const response = await fetch(`${getApiBaseUrl()}/authors`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<AuthorRecord[]>;
}

export async function createAuthor(input: {
  name: string;
  slug?: string;
}): Promise<AuthorRecord> {
  const body: { name: string; slug?: string } = { name: input.name.trim() };
  const slug = input.slug?.trim();
  if (slug) {
    body.slug = slug;
  }

  const response = await fetch(`${getApiBaseUrl()}/authors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<AuthorRecord>;
}

export async function updateAuthor(
  id: string,
  input: { name?: string; slug?: string },
): Promise<AuthorRecord> {
  const body: { name?: string; slug?: string } = {};

  if (input.name !== undefined) {
    body.name = input.name.trim();
  }
  if (input.slug !== undefined) {
    body.slug = input.slug.trim();
  }

  const response = await fetch(`${getApiBaseUrl()}/authors/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<AuthorRecord>;
}
