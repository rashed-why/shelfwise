"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMyReadingList } from "@/lib/reading-list-api";

export const readingListQueryKeys = {
  mine: ["reading-list", "me"] as const,
};

export function useMyReadingListQuery(accessToken: string | undefined) {
  return useQuery({
    queryKey: readingListQueryKeys.mine,
    queryFn: () => fetchMyReadingList(accessToken as string),
    enabled: Boolean(accessToken),
  });
}
