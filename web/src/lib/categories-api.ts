import { getApiBaseUrl, parseApiError } from "@/lib/api-client";

export type CategoryRecord = {
  id: string;
  label: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export async function fetchCategories(): Promise<CategoryRecord[]> {
  const response = await fetch(`${getApiBaseUrl()}/category`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<CategoryRecord[]>;
}

export async function createCategory(input: {
  label: string;
  slug?: string;
}): Promise<CategoryRecord> {
  const label = input.label.trim();
  const body: { label: string; slug?: string } = { label };
  const slug = input.slug?.trim();
  if (slug) {
    body.slug = slug;
  }

  const response = await fetch(`${getApiBaseUrl()}/category`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<CategoryRecord>;
}

export async function updateCategory(
  id: string,
  input: { label?: string; slug?: string },
): Promise<CategoryRecord> {
  const body: { label?: string; slug?: string } = {};

  if (input.label !== undefined) {
    body.label = input.label.trim();
  }
  if (input.slug !== undefined) {
    body.slug = input.slug.trim();
  }

  const response = await fetch(`${getApiBaseUrl()}/category/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<CategoryRecord>;
}
