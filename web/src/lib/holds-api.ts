import { getApiBaseUrl, parseApiError } from "@/lib/api-client";

export type HoldStatus = "ACTIVE" | "RETURNED" | "OVERDUE";

export type HoldRecord = {
  id: string;
  userId: string;
  bookId: string;
  dueAt: string;
  status: HoldStatus;
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

export type AdminHoldRecord = {
  id: string;
  userId: string;
  bookId: string;
  dueAt: string;
  status: HoldStatus;
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

export async function fetchAdminHolds(
  accessToken: string,
): Promise<AdminHoldRecord[]> {
  const response = await fetch(`${getApiBaseUrl()}/holds`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<AdminHoldRecord[]>;
}

export async function fetchMyHolds(accessToken: string): Promise<HoldRecord[]> {
  const response = await fetch(`${getApiBaseUrl()}/holds/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<HoldRecord[]>;
}

export async function createHold(
  accessToken: string,
  bookId: string,
): Promise<HoldRecord> {
  const response = await fetch(`${getApiBaseUrl()}/holds`, {
    method: "POST",
    headers: authHeaders(accessToken),
    body: JSON.stringify({ bookId }),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<HoldRecord>;
}

export async function cancelHold(
  accessToken: string,
  holdId: string,
): Promise<{ id: string; removed: boolean }> {
  const response = await fetch(`${getApiBaseUrl()}/holds/${holdId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<{ id: string; removed: boolean }>;
}
