"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import {
  authFieldClass,
  authLabelClass,
  authSubmitClass,
} from "@/lib/auth-form-styles";
import { saveAdminUser, type AdminUserRow } from "@/lib/admin-users-demo";

export function AdminUserCreateForm() {
  const router = useRouter();
  const nameId = useId();
  const emailId = useId();
  const roleId = useId();
  const [status, setStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const result = saveAdminUser({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      role: String(formData.get("role") ?? "USER") as AdminUserRow["role"],
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setStatus({ type: "error", text: result.error });
      return;
    }

    form.reset();
    router.push("/admin/users/list");
  }

  return (
    <form
      className="w-full space-y-4 rounded-xl border border-border bg-white p-5 sm:p-6"
      onSubmit={handleSubmit}
    >
      <div>
        <h2 className="text-lg font-semibold text-navy">New user</h2>
        <p className="mt-1 text-sm text-muted">
          Demo-only: saved in this browser until{" "}
          <code className="text-xs">POST /user</code> is wired up.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor={nameId} className={authLabelClass}>
          Name
        </label>
        <input id={nameId} name="name" required className={authFieldClass} />
      </div>

      <div className="space-y-2">
        <label htmlFor={emailId} className={authLabelClass}>
          Email
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          required
          className={authFieldClass}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor={roleId} className={authLabelClass}>
          Role
        </label>
        <select
          id={roleId}
          name="role"
          defaultValue="USER"
          className={authFieldClass}
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>

      {status ? (
        <p
          role="status"
          className={`text-sm ${status.type === "success" ? "text-brand-teal" : "text-red-600"}`}
        >
          {status.text}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`${authSubmitClass} max-w-xs`}
      >
        {isSubmitting ? "Saving…" : "Add user"}
      </button>
    </form>
  );
}
