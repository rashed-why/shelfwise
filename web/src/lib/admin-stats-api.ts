import { getApiBaseUrl, parseApiError } from "@/lib/api-client";

export type AdminStats = {
  categories: number;
  authors: number;
  books: number;
  users: number;
  borrowed: number;
  overdue: number;
};

export async function fetchAdminStats(accessToken: string): Promise<AdminStats> {
  const response = await fetch(`${getApiBaseUrl()}/admin/stats`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<AdminStats>;
}
