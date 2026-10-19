import { existsSync } from "node:fs";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { Client } from "pg";

if (existsSync(".env")) {
  process.loadEnvFile(".env");
}

const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASSWORD = "12345678";
const ADMIN_NAME = "Admin";

const BOOK_IMAGE = "/media/books/book.png";

type SeedBook = {
  name: string;
  author: string;
  description: string;
  category: string;
};

const SEED_BOOKS: SeedBook[] = [
  {
    name: "The Alchemist",
    author: "Paulo Coelho",
    description:
      "A young shepherd travels in search of treasure and discovers the importance of following his dreams.",
    category: "Fiction",
  },
  {
    name: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description:
      "A story of wealth, love, ambition, and the American Dream in the 1920s.",
    category: "Fiction",
  },
  {
    name: "To Kill a Mockingbird",
    author: "Harper Lee",
    description:
      "A novel about justice, racial prejudice, and morality in the American South.",
    category: "Fiction",
  },
  {
    name: "1984",
    author: "George Orwell",
    description:
      "A dystopian novel about totalitarianism, surveillance, and the control of truth.",
    category: "Fiction",
  },
  {
    name: "The Kite Runner",
    author: "Khaled Hosseini",
    description:
      "A moving story of friendship, betrayal, guilt, and redemption set against Afghanistan's history.",
    category: "Fiction",
  },
  {
    name: "Atomic Habits",
    author: "James Clear",
    description:
      "A practical guide to building good habits and breaking bad ones through small, consistent changes.",
    category: "Self-Help",
  },
  {
    name: "Think and Grow Rich",
    author: "Napoleon Hill",
    description:
      "A classic personal development book about goal-setting, mindset, and success.",
    category: "Self-Help",
  },
  {
    name: "Deep Work",
    author: "Cal Newport",
    description:
      "Explains how focused, distraction-free work can improve productivity.",
    category: "Self-Help",
  },
  {
    name: "The Psychology of Money",
    author: "Morgan Housel",
    description:
      "Explores how human behavior influences financial decisions.",
    category: "Self-Help",
  },
  {
    name: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    description:
      "Explores financial education, money management, and wealth building.",
    category: "Self-Help",
  },
  {
    name: "Sapiens",
    author: "Yuval Noah Harari",
    description:
      "Explores the history of humankind, from early humans to modern civilization.",
    category: "History",
  },
  {
    name: "The Diary of a Young Girl",
    author: "Anne Frank",
    description:
      "The diary of a Jewish girl hiding during World War II, documenting her thoughts and experiences.",
    category: "History",
  },
  {
    name: "Guns, Germs, and Steel",
    author: "Jared Diamond",
    description:
      "Examines how geography and environmental factors shaped human societies and civilizations.",
    category: "History",
  },
  {
    name: "The Art of War",
    author: "Sun Tzu",
    description:
      "An ancient Chinese military text about strategy, planning, and understanding opponents.",
    category: "History",
  },
  {
    name: "Long Walk to Freedom",
    author: "Nelson Mandela",
    description:
      "An autobiography chronicling Mandela's life, struggle against apartheid, and journey to freedom.",
    category: "History",
  },
  {
    name: "Clean Code",
    author: "Robert C. Martin",
    description:
      "Principles and practices for writing readable, maintainable software.",
    category: "Technology",
  },
  {
    name: "The Pragmatic Programmer",
    author: "David Thomas and Andrew Hunt",
    description:
      "Practical advice for improving software development skills and problem-solving.",
    category: "Technology",
  },
  {
    name: "Introduction to Algorithms",
    author:
      "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, and Clifford Stein",
    description:
      "A comprehensive textbook covering algorithms, data structures, and computational problem-solving.",
    category: "Technology",
  },
  {
    name: "Design Patterns",
    author: "Erich Gamma, Richard Helm, Ralph Johnson, and John Vlissides",
    description:
      "Explains reusable object-oriented software design solutions through established design patterns.",
    category: "Technology",
  },
  {
    name: "The Lean Startup",
    author: "Eric Ries",
    description:
      "A guide to building businesses and products through experimentation, customer feedback, and iteration.",
    category: "Technology",
  },
];

function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "item";
}

async function upsertAdminUser(client: Client) {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const existing = await client.query(
    'SELECT id FROM "User" WHERE email = $1',
    [ADMIN_EMAIL],
  );

  if (existing.rowCount) {
    await client.query(
      'UPDATE "User" SET name = $1, password = $2, role = $3, "updatedAt" = NOW() WHERE email = $4',
      [ADMIN_NAME, passwordHash, "ADMIN", ADMIN_EMAIL],
    );
    console.log(`Updated admin user: ${ADMIN_EMAIL}`);
    return;
  }

  await client.query(
    'INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, NOW(), NOW())',
    [randomUUID(), ADMIN_NAME, ADMIN_EMAIL, passwordHash, "ADMIN"],
  );
  console.log(`Created admin user: ${ADMIN_EMAIL}`);
}

async function upsertCategoryId(
  client: Client,
  label: string,
): Promise<string> {
  const slug = slugify(label);
  const existing = await client.query(
    'SELECT id FROM "Category" WHERE slug = $1',
    [slug],
  );

  if (existing.rows[0]) {
    await client.query(
      'UPDATE "Category" SET label = $1, "updatedAt" = NOW() WHERE id = $2',
      [label, existing.rows[0].id],
    );
    return existing.rows[0].id as string;
  }

  const id = randomUUID();
  await client.query(
    'INSERT INTO "Category" (id, label, slug, "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW())',
    [id, label, slug],
  );
  return id;
}

async function upsertAuthorId(
  client: Client,
  name: string,
): Promise<string> {
  const slug = slugify(name);
  const existing = await client.query(
    'SELECT id FROM "Author" WHERE slug = $1',
    [slug],
  );

  if (existing.rows[0]) {
    await client.query(
      'UPDATE "Author" SET name = $1, "updatedAt" = NOW() WHERE id = $2',
      [name, existing.rows[0].id],
    );
    return existing.rows[0].id as string;
  }

  const id = randomUUID();
  await client.query(
    'INSERT INTO "Author" (id, name, slug, "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW())',
    [id, name, slug],
  );
  return id;
}

async function upsertBook(
  client: Client,
  book: SeedBook,
  categoryId: string,
  authorId: string,
) {
  const existing = await client.query(
    'SELECT id FROM "Book" WHERE title = $1 AND "categoryId" = $2',
    [book.name, categoryId],
  );

  if (existing.rows[0]) {
    await client.query(
      `UPDATE "Book"
       SET summary = $1, image = $2, "authorId" = $3, "updatedAt" = NOW()
       WHERE id = $4`,
      [book.description, BOOK_IMAGE, authorId, existing.rows[0].id],
    );
    return;
  }

  await client.query(
    `INSERT INTO "Book" (id, title, summary, image, "categoryId", "authorId", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
    [
      randomUUID(),
      book.name,
      book.description,
      BOOK_IMAGE,
      categoryId,
      authorId,
    ],
  );
}

async function seedCatalog(client: Client) {
  const categoryIds = new Map<string, string>();

  for (const book of SEED_BOOKS) {
    if (!categoryIds.has(book.category)) {
      categoryIds.set(
        book.category,
        await upsertCategoryId(client, book.category),
      );
    }
  }

  for (const book of SEED_BOOKS) {
    const categoryId = categoryIds.get(book.category);
    if (!categoryId) {
      throw new Error(`Missing category id for ${book.category}`);
    }

    const authorId = await upsertAuthorId(client, book.author);
    await upsertBook(client, book, categoryId, authorId);
  }

  console.log(`Seeded ${SEED_BOOKS.length} books (cover: ${BOOK_IMAGE}).`);
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const client = new Client({ connectionString });
  await client.connect();

  try {
    await upsertAdminUser(client);
    await seedCatalog(client);
  } finally {
    await client.end();
  }
}

void main();
