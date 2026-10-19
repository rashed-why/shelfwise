const BORROWED_KEY = "selfwise_admin_borrowed";

export type BorrowedStatus = "active" | "returned" | "overdue";

export type AdminBorrowed = {
  id: string;
  bookTitle: string;
  userName: string;
  userEmail: string;
  borrowedAt: string;
  dueAt: string;
  returnedAt?: string;
  status: BorrowedStatus;
};

function readJson(): AdminBorrowed[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BORROWED_KEY);
    if (!raw) return seedBorrowed();
    const parsed = JSON.parse(raw) as AdminBorrowed[];
    return Array.isArray(parsed) ? parsed : seedBorrowed();
  } catch {
    return seedBorrowed();
  }
}

function writeJson(value: AdminBorrowed[]) {
  localStorage.setItem(BORROWED_KEY, JSON.stringify(value));
}

function seedBorrowed(): AdminBorrowed[] {
  const now = Date.now();
  const day = 86_400_000;
  return [
    {
      id: "seed-1",
      bookTitle: "Atomic Habits",
      userName: "Jane Doe",
      userEmail: "jane@example.com",
      borrowedAt: new Date(now - 5 * day).toISOString(),
      dueAt: new Date(now + 9 * day).toISOString(),
      status: "active",
    },
    {
      id: "seed-2",
      bookTitle: "Deep Work",
      userName: "Alex Rivera",
      userEmail: "alex@example.com",
      borrowedAt: new Date(now - 20 * day).toISOString(),
      dueAt: new Date(now - 2 * day).toISOString(),
      status: "overdue",
    },
    {
      id: "seed-3",
      bookTitle: "The Pragmatic Programmer",
      userName: "Jane Doe",
      userEmail: "jane@example.com",
      borrowedAt: new Date(now - 60 * day).toISOString(),
      dueAt: new Date(now - 45 * day).toISOString(),
      returnedAt: new Date(now - 44 * day).toISOString(),
      status: "returned",
    },
  ];
}

function deriveStatus(record: AdminBorrowed): BorrowedStatus {
  if (record.returnedAt) return "returned";
  if (new Date(record.dueAt) < new Date()) return "overdue";
  return "active";
}

function withDerivedStatus(record: AdminBorrowed): AdminBorrowed {
  return { ...record, status: deriveStatus(record) };
}

export function loadAdminBorrowed(): AdminBorrowed[] {
  return readJson()
    .map(withDerivedStatus)
    .sort(
      (a, b) =>
        new Date(b.borrowedAt).getTime() - new Date(a.borrowedAt).getTime(),
    );
}

export function loadAdminBorrowedByEmail(userEmail: string): AdminBorrowed[] {
  const normalized = userEmail.trim().toLowerCase();
  return loadAdminBorrowed().filter(
    (item) => item.userEmail.trim().toLowerCase() === normalized,
  );
}

export function saveAdminBorrowed(input: {
  bookTitle: string;
  userName: string;
  userEmail: string;
  dueAt: string;
}): { ok: true; record: AdminBorrowed } | { ok: false; error: string } {
  const bookTitle = input.bookTitle.trim();
  const userName = input.userName.trim();
  const userEmail = input.userEmail.trim();
  const dueAtRaw = input.dueAt.trim();

  if (!bookTitle || !userName || !userEmail || !dueAtRaw) {
    return { ok: false, error: "Book, user, email, and due date are required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  const dueAt = new Date(dueAtRaw);
  if (Number.isNaN(dueAt.getTime())) {
    return { ok: false, error: "Due date is invalid." };
  }

  const record: AdminBorrowed = {
    id: crypto.randomUUID(),
    bookTitle,
    userName,
    userEmail,
    borrowedAt: new Date().toISOString(),
    dueAt: dueAt.toISOString(),
    status: "active",
  };

  const next = [record, ...readJson()];
  writeJson(next);
  return { ok: true, record };
}

export function markBorrowedReturned(
  id: string,
): { ok: true; record: AdminBorrowed } | { ok: false; error: string } {
  const items = readJson();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) {
    return { ok: false, error: "Borrow record not found." };
  }

  const updated: AdminBorrowed = {
    ...items[index],
    returnedAt: new Date().toISOString(),
    status: "returned",
  };
  items[index] = updated;
  writeJson(items);
  return { ok: true, record: updated };
}

