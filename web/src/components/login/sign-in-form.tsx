"use client";

import { Formik } from "formik";
import { getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { notifyError, notifySuccess } from "@/lib/toast";
import {
  authFieldClass,
  authLabelClass,
  authSubmitClass,
} from "@/lib/auth-form-styles";
import { resolvePostLoginPath } from "@/lib/post-login-redirect";
import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/schemas/login.schema";
import { zodToFormikErrors } from "@/lib/zod-formik";

const initialValues: LoginFormValues = {
  email: "",
  password: "",
};

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrlParam = searchParams.get("callbackUrl");

  return (
    <Formik
      initialValues={initialValues}
      validate={(values) => zodToFormikErrors(loginSchema, values)}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);

        const result = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        setSubmitting(false);

        if (result?.error) {
          notifyError("Invalid email or password.");
          return;
        }

        const session = await getSession();
        const destination = resolvePostLoginPath(
          session?.user?.role,
          callbackUrlParam,
        );
        notifySuccess("Signed in successfully.");
        router.push(destination);
        router.refresh();
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <label htmlFor="sign-in-email" className={authLabelClass}>
              Email
            </label>
            <input
              id="sign-in-email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="you@example.com"
              className={authFieldClass}
              aria-invalid={Boolean(touched.email && errors.email)}
            />
            {touched.email && errors.email ? (
              <p className="text-sm text-red-600">{errors.email}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="sign-in-password" className={authLabelClass}>
              Password
            </label>
            <input
              id="sign-in-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="••••••••"
              className={authFieldClass}
              aria-invalid={Boolean(touched.password && errors.password)}
            />
            {touched.password && errors.password ? (
              <p className="text-sm text-red-600">{errors.password}</p>
            ) : null}
          </div>


          <button
            type="submit"
            disabled={isSubmitting}
            className={authSubmitClass}
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>

          <div className="relative py-2 text-center text-xs uppercase tracking-wide text-muted">
            <span className="bg-white px-2">or</span>
          </div>

          <a
            href="/backend/auth/google"
            className="flex w-full items-center justify-center rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-navy no-underline transition-colors hover:bg-brand-teal/5"
          >
            Continue with Google
          </a>
        </form>
      )}
    </Formik>
  );
}
