import { getApiBaseUrl, parseApiError } from "@/lib/api-client";

export type ReadingListStatus = "ACTIVE" | "RETURNED" | "OVERDUE";

export type ReadingListRecord = {
  id: string;
  userId: string;
  bookId: string;
  dueAt: string;
  status: ReadingListStatus;
  returnedAt: string | null;
  createdAt: string;
  book: {
    id: string;
    title: string;
    image: string;
    author: { id: string; name: string };
    category: { id: string; label: string };
  };
};

export async function fetchMyReadingList(
  accessToken: string,
): Promise<ReadingListRecord[]> {
  const response = await fetch(`${getApiBaseUrl()}/reading-list/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<ReadingListRecord[]>;
}
