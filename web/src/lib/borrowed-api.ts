import { getApiBaseUrl, parseApiError } from "@/lib/api-client";
import type { CreateBorrowedFormValues } from "@/lib/schemas/create-borrowed.schema";

export type BorrowedStatus = "ACTIVE" | "RETURNED" | "OVERDUE";

export type BorrowedRecord = {
  id: string;
  userId: string;
  bookId: string;
  dueAt: string;
  status: BorrowedStatus;
  returnedAt: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  book: {
    id: string;
    title: string;
  };
};

function authHeaders(accessToken: string): HeadersInit {
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
}

export async function fetchBorrowed(accessToken: string): Promise<BorrowedRecord[]> {
  const response = await fetch(`${getApiBaseUrl()}/borrowed`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<BorrowedRecord[]>;
}

export async function createBorrowed(
  accessToken: string,
  input: CreateBorrowedFormValues,
): Promise<BorrowedRecord[]> {
  const response = await fetch(`${getApiBaseUrl()}/borrowed`, {
    method: "POST",
    headers: authHeaders(accessToken),
    body: JSON.stringify({
      userId: input.userId,
      bookIds: input.bookIds,
      dueAt: input.dueAt,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<BorrowedRecord[]>;
}

export async function updateBorrowedStatus(
  accessToken: string,
  id: string,
  status: BorrowedStatus,
): Promise<BorrowedRecord> {
  const response = await fetch(`${getApiBaseUrl()}/borrowed/${id}/status`, {
    method: "PATCH",
    headers: authHeaders(accessToken),
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<BorrowedRecord>;
}

/** @deprecated Prefer updateBorrowedStatus with RETURNED */
export async function markBorrowedReturned(
  accessToken: string,
  id: string,
): Promise<BorrowedRecord> {
  return updateBorrowedStatus(accessToken, id, "RETURNED");
}
