import { getApiBaseUrl, parseApiError } from "@/lib/api-client";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  profileImage?: string | null;
  googleId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function fetchUsers(accessToken: string): Promise<UserRecord[]> {
  const response = await fetch(`${getApiBaseUrl()}/user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<UserRecord[]>;
}

export async function fetchUser(
  accessToken: string,
  userId: string,
): Promise<UserRecord> {
  const response = await fetch(`${getApiBaseUrl()}/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<UserRecord>;
}
