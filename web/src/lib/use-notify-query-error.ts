"use client";

import { useEffect, useRef } from "react";
import { notifyErrorFromUnknown } from "@/lib/toast";

export function useNotifyQueryError(
  isError: boolean,
  error: unknown,
  fallbackMessage: string,
) {
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (!isError) {
      notifiedRef.current = false;
      return;
    }

    if (notifiedRef.current) {
      return;
    }

    notifiedRef.current = true;
    notifyErrorFromUnknown(error, fallbackMessage);
  }, [isError, error, fallbackMessage]);
}
