"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelHold,
  createHold,
  fetchAdminHolds,
  fetchMyHolds,
} from "@/lib/holds-api";

export const holdsQueryKeys = {
  mine: ["holds", "me"] as const,
  adminAll: ["holds", "admin"] as const,
};

export function useAdminHoldsQuery(accessToken: string | undefined) {
  return useQuery({
    queryKey: holdsQueryKeys.adminAll,
    queryFn: () => fetchAdminHolds(accessToken as string),
    enabled: Boolean(accessToken),
  });
}

export function useMyHoldsQuery(accessToken: string | undefined) {
  return useQuery({
    queryKey: holdsQueryKeys.mine,
    queryFn: () => fetchMyHolds(accessToken as string),
    enabled: Boolean(accessToken),
  });
}

export function useCreateHoldMutation(accessToken: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookId: string) => {
      if (!accessToken) {
        throw new Error("Sign in to place a hold.");
      }

      return createHold(accessToken, bookId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: holdsQueryKeys.mine });
    },
  });
}

export function useCancelHoldMutation(accessToken: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (holdId: string) => {
      if (!accessToken) {
        throw new Error("Sign in to manage your holds.");
      }

      return cancelHold(accessToken, holdId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: holdsQueryKeys.mine });
    },
  });
}
