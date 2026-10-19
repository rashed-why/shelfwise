import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/register/register-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your Selfwise library account.",
};

export default function RegisterPage() {
  return (
    <main className="w-full flex-1 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-md px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-navy sm:text-3xl">
          Create account
        </h1>
        <p className="mt-2 text-sm text-muted">
          Join Selfwise to save lists, place holds, and track your reading. A
          profile photo is required to create your account.
        </p>

        <RegisterForm />

        <p className="mt-8 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-secondary no-underline hover:text-brand-teal"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
