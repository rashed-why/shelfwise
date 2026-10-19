"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBorrowed,
  fetchBorrowed,
  updateBorrowedStatus,
  type BorrowedStatus,
} from "@/lib/borrowed-api";
import type { CreateBorrowedFormValues } from "@/lib/schemas/create-borrowed.schema";
import { holdsQueryKeys } from "@/lib/queries/holds";

export const borrowedQueryKeys = {
  all: ["borrowed"] as const,
};

export function useBorrowedQuery(accessToken: string | undefined) {
  return useQuery({
    queryKey: borrowedQueryKeys.all,
    queryFn: () => fetchBorrowed(accessToken as string),
    enabled: Boolean(accessToken),
  });
}

export function useCreateBorrowedMutation(accessToken: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CreateBorrowedFormValues) => {
      if (!accessToken) {
        throw new Error("Sign in as an admin to record a borrow.");
      }

      return createBorrowed(accessToken, values);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: borrowedQueryKeys.all });
      await queryClient.invalidateQueries({ queryKey: holdsQueryKeys.adminAll });
    },
  });
}

export function useUpdateBorrowedStatusMutation(
  accessToken: string | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BorrowedStatus }) => {
      if (!accessToken) {
        throw new Error("Sign in as an admin to update a borrow.");
      }

      return updateBorrowedStatus(accessToken, id, status);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: borrowedQueryKeys.all });
    },
  });
}

export function useReturnBorrowedMutation(accessToken: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      if (!accessToken) {
        throw new Error("Sign in as an admin to update a borrow.");
      }

      return updateBorrowedStatus(accessToken, id, "RETURNED");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: borrowedQueryKeys.all });
    },
  });
}
