export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  joinedAt: string;
};

const STORED_USERS_KEY = "selfwise_admin_users";

/** Demo rows for the admin users table until the web app wires auth + GET /user. */
export const adminDemoUsers: AdminUserRow[] = [
  {
    id: "demo-1",
    name: "Jane Doe",
    email: "jane@example.com",
    role: "USER",
    joinedAt: "2026-01-12T10:00:00.000Z",
  },
  {
    id: "demo-2",
    name: "Alex Rivera",
    email: "alex@example.com",
    role: "USER",
    joinedAt: "2026-02-03T14:30:00.000Z",
  },
  {
    id: "demo-3",
    name: "Sam Admin",
    email: "admin@selfwise.local",
    role: "ADMIN",
    joinedAt: "2025-11-01T09:00:00.000Z",
  },
];

function readStoredUsers(): AdminUserRow[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORED_USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AdminUserRow[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredUsers(users: AdminUserRow[]) {
  localStorage.setItem(STORED_USERS_KEY, JSON.stringify(users));
}

export function loadAllAdminUsers(): AdminUserRow[] {
  const seen = new Set(adminDemoUsers.map((user) => user.email.toLowerCase()));
  const merged = [...adminDemoUsers];
  for (const user of readStoredUsers()) {
    const key = user.email.toLowerCase();
    if (!seen.has(key)) {
      merged.push(user);
      seen.add(key);
    }
  }
  return merged.sort((a, b) => a.name.localeCompare(b.name));
}

export function saveAdminUser(input: {
  name: string;
  email: string;
  role: AdminUserRow["role"];
}): { ok: true; user: AdminUserRow } | { ok: false; error: string } {
  const name = input.name.trim();
  const email = input.email.trim();
  const role = input.role;

  if (!name || !email) {
    return { ok: false, error: "Name and email are required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  const exists = loadAllAdminUsers().some(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );
  if (exists) {
    return { ok: false, error: "A user with this email already exists." };
  }

  const user: AdminUserRow = {
    id: crypto.randomUUID(),
    name,
    email,
    role,
    joinedAt: new Date().toISOString(),
  };

  writeStoredUsers([...readStoredUsers(), user]);
  return { ok: true, user };
}

export function findAdminDemoUser(id: string): AdminUserRow | undefined {
  return loadAllAdminUsers().find((user) => user.id === id);
}
