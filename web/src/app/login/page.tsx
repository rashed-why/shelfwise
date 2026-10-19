import type { Metadata } from "next";
import Link from "next/link";
import { SignInForm } from "@/components/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Selfwise account.",
};

export default function LoginPage() {
  return (
    <main className="w-full flex-1 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-md px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-navy sm:text-3xl">Sign in</h1>
        <p className="mt-2 text-sm text-muted">
          Access your dashboard, holds, and reading list.
        </p>

        <SignInForm />

        <p className="mt-8 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-secondary no-underline hover:text-brand-teal"
          >
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}
