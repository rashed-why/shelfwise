"use client";

import { getSession, signIn } from "next-auth/react";
import { resolvePostLoginPath } from "@/lib/post-login-redirect";
import { notifyError, notifySuccess } from "@/lib/toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

function GoogleAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) {
      return;
    }

    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (!accessToken || !refreshToken) {
      handledRef.current = true;
      notifyError("Google sign-in did not return tokens.");
      return;
    }

    handledRef.current = true;

    void signIn("credentials", {
      accessToken,
      refreshToken,
      redirect: false,
    }).then(async (result) => {
      if (result?.error) {
        notifyError("Could not complete Google sign-in.");
        return;
      }

      notifySuccess("Signed in with Google.");
      const session = await getSession();
      router.replace(resolvePostLoginPath(session?.user?.role, null));
    });
  }, [router, searchParams]);

  return <p className="text-sm text-muted">Completing Google sign-in…</p>;
}

export default function GoogleAuthCallbackPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-16 text-center">
      <Suspense
        fallback={<p className="text-sm text-muted">Completing Google sign-in…</p>}
      >
        <GoogleAuthCallbackContent />
      </Suspense>
    </main>
  );
}
