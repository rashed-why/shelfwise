export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  joinedAt: string;
};

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

export function findAdminDemoUser(id: string): AdminUserRow | undefined {
  return adminDemoUsers.find((user) => user.id === id);
}
