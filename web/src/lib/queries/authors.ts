"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAuthor,
  fetchAuthors,
  updateAuthor,
  type AuthorRecord,
} from "@/lib/authors-api";
import type {
  CreateAuthorFormValues,
  UpdateAuthorFormValues,
} from "@/lib/schemas/create-author.schema";

export const authorQueryKeys = {
  all: ["authors"] as const,
};

export function useAuthorsQuery(enabled = true) {
  return useQuery({
    queryKey: authorQueryKeys.all,
    queryFn: fetchAuthors,
    enabled,
  });
}

export function useCreateAuthorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CreateAuthorFormValues) =>
      createAuthor({
        name: values.name,
        slug: values.slug || undefined,
      }),
    onSuccess: (author: AuthorRecord) => {
      queryClient.setQueryData<AuthorRecord[]>(authorQueryKeys.all, (prev) =>
        prev
          ? [...prev, author].sort((a, b) => a.name.localeCompare(b.name))
          : [author],
      );
    },
  });
}

export function useUpdateAuthorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: UpdateAuthorFormValues;
    }) =>
      updateAuthor(id, {
        name: values.name,
        slug: values.slug,
      }),
    onSuccess: (author: AuthorRecord) => {
      queryClient.setQueryData<AuthorRecord[]>(authorQueryKeys.all, (prev) =>
        prev
          ? prev
              .map((item) => (item.id === author.id ? author : item))
              .sort((a, b) => a.name.localeCompare(b.name))
          : [author],
      );
    },
  });
}
