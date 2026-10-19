import { getApiBaseUrl, getApiOrigin, parseApiError } from "@/lib/api-client";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type RegisterResponse = {
  message: string;
  user: AuthUser & {
    profileImage?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };
};

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<RegisterResponse> {
  const response = await fetch(`${getApiBaseUrl()}/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: input.name.trim(),
      email: input.email.trim(),
      password: input.password,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<RegisterResponse>;
}

export async function loginWithCredentials(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(`${getApiOrigin()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<LoginResponse>;
}

export async function fetchAuthenticatedUser(
  accessToken: string,
): Promise<AuthUser> {
  const response = await fetch(`${getApiOrigin()}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<AuthUser>;
}
