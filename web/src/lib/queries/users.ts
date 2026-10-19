"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchUser, fetchUsers } from "@/lib/users-api";

export const userQueryKeys = {
  all: ["users"] as const,
  detail: (userId: string) => ["users", userId] as const,
};

export function useUsersQuery(accessToken: string | undefined) {
  return useQuery({
    queryKey: userQueryKeys.all,
    queryFn: () => fetchUsers(accessToken as string),
    enabled: Boolean(accessToken),
  });
}

export function useUserQuery(
  accessToken: string | undefined,
  userId: string,
) {
  return useQuery({
    queryKey: userQueryKeys.detail(userId),
    queryFn: () => fetchUser(accessToken as string, userId),
    enabled: Boolean(accessToken && userId),
  });
}
