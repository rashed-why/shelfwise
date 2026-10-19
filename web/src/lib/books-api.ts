import { getApiBaseUrl, parseApiError } from "@/lib/api-client";

export type BookRelation = {
  id: string;
  slug: string;
};

export type BookCategoryRelation = BookRelation & {
  label: string;
};

export type BookAuthorRelation = BookRelation & {
  name: string;
};

export type BookRecord = {
  id: string;
  title: string;
  summary: string | null;
  image: string;
  categoryId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  category: BookCategoryRelation;
  author: BookAuthorRelation;
};

export async function fetchBooks(): Promise<BookRecord[]> {
  const response = await fetch(`${getApiBaseUrl()}/books`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<BookRecord[]>;
}

export async function fetchBook(id: string): Promise<BookRecord> {
  const response = await fetch(`${getApiBaseUrl()}/books/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<BookRecord>;
}

export async function createBook(input: {
  title: string;
  categoryId: string;
  authorId: string;
  summary?: string;
  image: File;
}): Promise<BookRecord> {
  const formData = new FormData();
  formData.append("title", input.title.trim());
  formData.append("categoryId", input.categoryId);
  formData.append("authorId", input.authorId);

  const summary = input.summary?.trim();
  if (summary) {
    formData.append("summary", summary);
  }

  formData.append("image", input.image);

  const response = await fetch(`${getApiBaseUrl()}/books`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<BookRecord>;
}

export async function updateBook(
  id: string,
  input: {
    title?: string;
    categoryId?: string;
    authorId?: string;
    summary?: string;
    image?: File;
  },
): Promise<BookRecord> {
  const formData = new FormData();

  if (input.title !== undefined) {
    formData.append("title", input.title.trim());
  }
  if (input.categoryId !== undefined) {
    formData.append("categoryId", input.categoryId);
  }
  if (input.authorId !== undefined) {
    formData.append("authorId", input.authorId);
  }
  if (input.summary !== undefined) {
    formData.append("summary", input.summary.trim());
  }
  if (input.image) {
    formData.append("image", input.image);
  }

  const response = await fetch(`${getApiBaseUrl()}/books/${id}`, {
    method: "PATCH",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<BookRecord>;
}
