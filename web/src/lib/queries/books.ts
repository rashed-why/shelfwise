"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBook,
  deleteBook,
  fetchBook,
  fetchBooks,
  updateBook,
  type BookRecord,
} from "@/lib/books-api";
import type {
  CreateBookFormValues,
  UpdateBookFormValues,
} from "@/lib/schemas/create-book.schema";

export const bookQueryKeys = {
  all: ["books"] as const,
  detail: (id: string) => ["books", id] as const,
};

export function useBooksQuery(enabled = true) {
  return useQuery({
    queryKey: bookQueryKeys.all,
    queryFn: fetchBooks,
    enabled,
  });
}

export function useBookQuery(id: string, enabled = true) {
  return useQuery({
    queryKey: bookQueryKeys.detail(id),
    queryFn: () => fetchBook(id),
    enabled: enabled && id.length > 0,
  });
}

export function useCreateBookMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CreateBookFormValues) => {
      if (!values.image) {
        throw new Error("Cover image is required.");
      }

      return createBook({
        title: values.title,
        categoryId: values.categoryId,
        authorId: values.authorId,
        summary: values.summary || undefined,
        image: values.image,
      });
    },
    onSuccess: (book: BookRecord) => {
      queryClient.setQueryData<BookRecord[]>(bookQueryKeys.all, (prev) =>
        prev ? [book, ...prev] : [book],
      );
    },
  });
}

export function useDeleteBookMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBook(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<BookRecord[]>(bookQueryKeys.all, (prev) =>
        prev ? prev.filter((item) => item.id !== id) : prev,
      );
      queryClient.removeQueries({ queryKey: bookQueryKeys.detail(id) });
    },
  });
}

export function useUpdateBookMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: UpdateBookFormValues;
    }) =>
      updateBook(id, {
        title: values.title,
        categoryId: values.categoryId,
        authorId: values.authorId,
        summary: values.summary,
        image: values.image ?? undefined,
      }),
    onSuccess: (book: BookRecord) => {
      queryClient.setQueryData<BookRecord[]>(bookQueryKeys.all, (prev) =>
        prev ? prev.map((item) => (item.id === book.id ? book : item)) : [book],
      );
      queryClient.setQueryData(bookQueryKeys.detail(book.id), book);
    },
  });
}
