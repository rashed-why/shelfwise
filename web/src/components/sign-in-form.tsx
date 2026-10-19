"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  authFieldClass,
  authLabelClass,
  authSubmitClass,
} from "@/lib/auth-form-styles";

export function SignInForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    router.push("/dashboard");
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label htmlFor="sign-in-email" className={authLabelClass}>
          Email
        </label>
        <input
          id="sign-in-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className={authFieldClass}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="sign-in-password" className={authLabelClass}>
            Password
          </label>
          <Link
            href="/help"
            className="text-xs font-medium text-secondary no-underline hover:text-brand-teal"
          >
            Forgot password?
          </Link>
        </div>
        <input
          id="sign-in-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className={authFieldClass}
        />
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          name="remember"
          className="size-4 rounded border-border text-primary focus:ring-ring/30"
        />
        Remember me
      </label>

      <button type="submit" disabled={isSubmitting} className={authSubmitClass}>
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
