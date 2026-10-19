"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAdminStats } from "@/lib/admin-stats-api";

export const adminStatsQueryKeys = {
  all: ["admin-stats"] as const,
};

export function useAdminStatsQuery(accessToken: string | undefined) {
  return useQuery({
    queryKey: adminStatsQueryKeys.all,
    queryFn: () => fetchAdminStats(accessToken as string),
    enabled: Boolean(accessToken),
  });
}
