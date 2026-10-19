"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  authFieldClass,
  authLabelClass,
  authSubmitClass,
} from "@/lib/auth-form-styles";

export function RegisterForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const password = form.password.value;
    const confirm = form.confirmPassword.value;

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    router.push("/dashboard");
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label htmlFor="register-name" className={authLabelClass}>
          Full name
        </label>
        <input
          id="register-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="Your name"
          className={authFieldClass}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="register-email" className={authLabelClass}>
          Email
        </label>
        <input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className={authFieldClass}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="register-password" className={authLabelClass}>
          Password
        </label>
        <input
          id="register-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="At least 8 characters"
          className={authFieldClass}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="register-confirm-password" className={authLabelClass}>
          Confirm password
        </label>
        <input
          id="register-confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Repeat your password"
          className={authFieldClass}
        />
      </div>

      {error ? (
        <p className="text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={isSubmitting} className={authSubmitClass}>
        {isSubmitting ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
