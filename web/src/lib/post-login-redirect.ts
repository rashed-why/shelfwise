export function homePathForRole(role: string | undefined): string {
  if (role === "ADMIN") {
    return "/admin";
  }
  return "/user/dashboard";
}

export function resolvePostLoginPath(
  role: string | undefined,
  callbackUrl: string | null | undefined,
): string {
  if (callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")) {
    return callbackUrl;
  }
  return homePathForRole(role);
}
