"use client";

import { Formik } from "formik";
import { getSession, signIn } from "next-auth/react";
import { resolvePostLoginPath } from "@/lib/post-login-redirect";
import { useRouter } from "next/navigation";
import { notifyError, notifySuccess } from "@/lib/toast";
import { registerUser } from "@/lib/auth-api";
import {
  authFieldClass,
  authLabelClass,
  authSubmitClass,
} from "@/lib/auth-form-styles";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/lib/schemas/register.schema";
import { zodToFormikErrors } from "@/lib/zod-formik";

const initialValues: RegisterFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function RegisterForm() {
  const router = useRouter();

  return (
    <Formik
      initialValues={initialValues}
      validate={(values) => zodToFormikErrors(registerSchema, values)}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await registerUser({
            name: values.name,
            email: values.email,
            password: values.password,
          });

          const signInResult = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
          });

          if (signInResult?.error) {
            notifyError(
              "Account created, but sign-in failed. Please sign in manually.",
            );
            router.push("/login");
            return;
          }

          notifySuccess("Account created successfully.");
          const session = await getSession();
          router.push(resolvePostLoginPath(session?.user?.role, null));
          router.refresh();
        } catch (error) {
          notifyError(
            error instanceof Error
              ? error.message
              : "Could not create account.",
          );
        } finally {
          setSubmitting(false);
        }
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
            <label htmlFor="register-name" className={authLabelClass}>
              Full name
            </label>
            <input
              id="register-name"
              name="name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Your name"
              className={authFieldClass}
              aria-invalid={Boolean(touched.name && errors.name)}
            />
            {touched.name && errors.name ? (
              <p className="text-sm text-red-600">{errors.name}</p>
            ) : null}
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
            <label htmlFor="register-password" className={authLabelClass}>
              Password
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="At least 8 characters"
              className={authFieldClass}
              aria-invalid={Boolean(touched.password && errors.password)}
            />
            {touched.password && errors.password ? (
              <p className="text-sm text-red-600">{errors.password}</p>
            ) : null}
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
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Repeat your password"
              className={authFieldClass}
              aria-invalid={Boolean(
                touched.confirmPassword && errors.confirmPassword,
              )}
            />
            {touched.confirmPassword && errors.confirmPassword ? (
              <p className="text-sm text-red-600">{errors.confirmPassword}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={authSubmitClass}
          >
            {isSubmitting ? "Creating account…" : "Create account"}
          </button>
        </form>
      )}
    </Formik>
  );
}
