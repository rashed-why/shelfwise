"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  fetchCategories,
  updateCategory,
  type CategoryRecord,
} from "@/lib/categories-api";
import type {
  CreateCategoryFormValues,
  UpdateCategoryFormValues,
} from "@/lib/schemas/create-category.schema";

export const categoryQueryKeys = {
  all: ["categories"] as const,
};

export function useCategoriesQuery(enabled = true) {
  return useQuery({
    queryKey: categoryQueryKeys.all,
    queryFn: fetchCategories,
    enabled,
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CreateCategoryFormValues) =>
      createCategory({
        label: values.label,
        slug: values.slug || undefined,
      }),
    onSuccess: (category: CategoryRecord) => {
      queryClient.setQueryData<CategoryRecord[]>(categoryQueryKeys.all, (prev) =>
        prev ? [...prev, category].sort((a, b) => a.label.localeCompare(b.label)) : [category],
      );
    },
  });
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: UpdateCategoryFormValues;
    }) =>
      updateCategory(id, {
        label: values.label,
        slug: values.slug,
      }),
    onSuccess: (category: CategoryRecord) => {
      queryClient.setQueryData<CategoryRecord[]>(categoryQueryKeys.all, (prev) =>
        prev
          ? prev
              .map((item) => (item.id === category.id ? category : item))
              .sort((a, b) => a.label.localeCompare(b.label))
          : [category],
      );
    },
  });
}
